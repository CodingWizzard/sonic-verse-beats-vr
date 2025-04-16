
import { useState, useEffect, useRef } from 'react';
import { useMusicContext } from '../context/MusicContext';
import { Song } from '../types';
import { Button } from '@/components/ui/button';
import { Play, Pause, Plus, Trash } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface MusicPlayerProps {
  song: Song;
  inCollection?: boolean;
  collectionId?: string;
}

const MusicPlayer = ({ song, inCollection = false, collectionId }: MusicPlayerProps) => {
  const { collections, addToCollection, removeFromCollection, isPlaying, setIsPlaying } = useMusicContext();
  const [selectedCollectionId, setSelectedCollectionId] = useState(collections[0]?.id);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load YouTube API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player(containerRef.current, {
        height: '0',
        width: '0',
        videoId: song.youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
        },
        events: {
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
            }
          }
        }
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [song.youtubeId]);

  const handlePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
      if (!isPlaying) {
        toast.success(`Playing: ${song.title} by ${song.artist}`);
      }
    }
  };

  const handleAddToCollection = () => {
    if (selectedCollectionId) {
      addToCollection(selectedCollectionId, song);
      const collection = collections.find(c => c.id === selectedCollectionId);
      toast.success(`Added "${song.title}" to ${collection?.name}`);
    }
  };

  const handleRemoveFromCollection = () => {
    if (collectionId) {
      removeFromCollection(collectionId, song.id);
      toast.info(`Removed from collection`);
    }
  };

  return (
    <div className="flex flex-col items-center bg-sonic-blue-dark/80 p-4 rounded-lg border border-sonic-accent/30">
      <div ref={containerRef} style={{ display: 'none' }} />
      <div className="relative">
        <img
          src={song.albumCover}
          alt={`${song.title} by ${song.artist}`}
          className="w-64 h-64 object-cover rounded-lg shadow-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
      </div>

      <div className="w-full text-center mt-4">
        <h3 className="text-xl font-bold text-white">{song.title}</h3>
        <p className="text-gray-300">by {song.artist}</p>
      </div>

      <div className="flex justify-center space-x-3 mt-4">
        <Button
          onClick={handlePlayPause}
          className="bg-sonic-accent hover:bg-sonic-blue-light"
        >
          {isPlaying ? <Pause /> : <Play />}
          {isPlaying ? ' Pause' : ' Play'}
        </Button>

        {!inCollection ? (
          <div className="flex items-center">
            <select
              value={selectedCollectionId}
              onChange={(e) => setSelectedCollectionId(e.target.value)}
              className="bg-sonic-blue p-2 rounded border border-sonic-accent/50 text-white mr-2"
            >
              {collections.map(collection => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
            <Button
              onClick={handleAddToCollection}
              className="bg-sonic-accent hover:bg-sonic-blue-light"
            >
              <Plus className="mr-1" />
              Collect
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleRemoveFromCollection}
            variant="destructive"
          >
            <Trash className="mr-1" />
            Trash
          </Button>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;
