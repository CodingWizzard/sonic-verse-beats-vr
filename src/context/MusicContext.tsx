
import { createContext, useState, useContext, ReactNode } from 'react';
import { Song, Collection } from '../types';

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
    albumCover: 'https://upload.wikimedia.org/wikipedia/en/e/ec/B.B._King_-_Live_in_Cook_County_Jail.jpg',
    youtubeId: 'oica5jG7FpU'
  },
  {
    id: '202',
    title: 'Sweet Home Chicago',
    artist: 'Robert Johnson',
    albumCover: 'https://upload.wikimedia.org/wikipedia/en/a/a6/Cross_Road_Blues.jpg',
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

  const searchMusic = (query: string) => {
    // In a real app, this would be an API call
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    // Simple mock search functionality
    const results = mockSearchResults.filter(song => 
      song.title.toLowerCase().includes(query.toLowerCase()) || 
      song.artist.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(results);
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
