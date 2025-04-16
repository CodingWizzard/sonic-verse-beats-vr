
import { createContext, useState, useContext, ReactNode } from 'react';
import { Song, Collection } from '../types';
import { toast } from '@/components/ui/sonner';

interface MusicContextType {
  currentSong: Song | null;
  collections: Collection[];
  isPlaying: boolean;
  searchResults: Song[];
  setCurrentSong: (song: Song | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  addToCollection: (collectionId: string, song: Song) => void;
  removeFromCollection: (collectionId: string, songId: string) => void;
  createCollection: (name: string) => void;
  deleteCollection: (id: string) => void;
  searchMusic: (query: string) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusicContext = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusicContext must be used within a MusicProvider');
  }
  return context;
};

// Mock data for initial state
const initialCollections: Collection[] = [
  {
    id: '1',
    name: 'Blues Classics',
    songs: [
      {
        id: '101',
        title: 'Blues with a Feelin\'',
        artist: 'Little Walter',
        albumCover: 'https://upload.wikimedia.org/wikipedia/en/1/1f/Little_Walter_Blues_with_a_Feeling.jpg',
        youtubeId: '9j8C9jTCps4'
      }
    ]
  },
  {
    id: '2',
    name: 'Rock Favorites',
    songs: []
  }
];

// Mock search results data
const mockSearchResults: Song[] = [
  {
    id: '201',
    title: 'The Thrill Is Gone',
    artist: 'BB King',
    albumCover: 'https://i.scdn.co/image/ab67616d0000b273e9f2180a9bc6b9a620e8b3c8',
    youtubeId: 'oica5jG7FpU'
  },
  {
    id: '202',
    title: 'Sweet Home Chicago',
    artist: 'Robert Johnson',
    albumCover: 'https://i.scdn.co/image/ab67616d0000b273b15b8f3352f249d1c12a933f',
    youtubeId: 'dkftesK2dck'
  }
];

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [searchResults, setSearchResults] = useState<Song[]>([]);

  const addToCollection = (collectionId: string, song: Song) => {
    setCollections(prev =>
      prev.map(collection =>
        collection.id === collectionId
          ? { ...collection, songs: [...collection.songs.filter(s => s.id !== song.id), song] }
          : collection
      )
    );
  };

  const removeFromCollection = (collectionId: string, songId: string) => {
    setCollections(prev =>
      prev.map(collection =>
        collection.id === collectionId
          ? { ...collection, songs: collection.songs.filter(song => song.id !== songId) }
          : collection
      )
    );
  };

  const createCollection = (name: string) => {
    const newCollection: Collection = {
      id: Date.now().toString(),
      name,
      songs: []
    };
    setCollections(prev => [...prev, newCollection]);
  };

  const deleteCollection = (id: string) => {
    setCollections(prev => prev.filter(collection => collection.id !== id));
  };

  const searchMusic = async (query: string) => {
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    try {
      // const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY'; // Replace with your actual API key
      const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${query}+music&type=video&key=${YOUTUBE_API_KEY}`
      );
      const data = await response.json();

      // Check if the API request was successful
      if (data.error) {
        console.error('YouTube API Error:', data.error);
        toast.error('YouTube API Error: ' + data.error.message);
        return;
      }

      // Check if items exists before mapping
      if (!data.items || !Array.isArray(data.items)) {
        console.error('No results found');
        toast.error('No results found');
        setSearchResults([]);
        return;
      }

      const results: Song[] = data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        artist: item.snippet.channelTitle, // Using channel title as artist
        albumCover: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
        youtubeId: item.id.videoId
      }));

      setSearchResults(results);

      if (results.length === 0) {
        toast.info('No songs found for: ' + query);
      }

    } catch (error) {
      console.error('Error searching YouTube:', error);
      toast.error('Failed to search for music. Please try again.');
      setSearchResults([]);
    }
  };

  const value = {
    currentSong,
    collections,
    isPlaying,
    searchResults,
    setCurrentSong,
    setIsPlaying,
    addToCollection,
    removeFromCollection,
    createCollection,
    deleteCollection,
    searchMusic
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};
