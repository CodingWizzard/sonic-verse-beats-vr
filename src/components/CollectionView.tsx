
import { useMusicContext } from '../context/MusicContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import MusicPlayer from './MusicPlayer';

const CollectionView = () => {
  const { collections, createCollection, currentSong } = useMusicContext();
  const [newCollectionName, setNewCollectionName] = useState('');
  const [selectedCollection, setSelectedCollection] = useState(collections[0]?.id);

  const handleCreateCollection = () => {
    if (newCollectionName.trim() !== '') {
      createCollection(newCollectionName);
      setNewCollectionName('');
    }
  };

  const currentCollection = collections.find(c => c.id === selectedCollection);

  return (
    <div className="music-search-container w-full max-w-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">Your Collections</h2>
      
      <div className="flex space-x-2 mb-6">
        <Input
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          placeholder="New collection name"
          className="bg-sonic-blue-dark border-sonic-accent text-white"
        />
        <Button 
          onClick={handleCreateCollection}
          className="bg-sonic-accent hover:bg-sonic-blue-light text-white"
        >
          Create
        </Button>
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-white">Select Collection:</label>
        <select
          className="w-full p-2 bg-sonic-blue-dark border border-sonic-accent rounded text-white"
          value={selectedCollection}
          onChange={(e) => setSelectedCollection(e.target.value)}
        >
          {collections.map(collection => (
            <option key={collection.id} value={collection.id}>
              {collection.name} ({collection.songs.length})
            </option>
          ))}
        </select>
      </div>

      {currentCollection && currentCollection.songs.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {currentCollection.songs.map(song => (
            <MusicPlayer 
              key={song.id} 
              song={song} 
              inCollection={true} 
              collectionId={currentCollection.id} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-300 p-8 bg-sonic-blue-dark/40 rounded-lg">
          No songs in this collection yet.
          {currentSong && (
            <div className="mt-4">
              <Button 
                onClick={() => currentCollection && currentSong && 
                  useMusicContext().addToCollection(currentCollection.id, currentSong)}
                className="bg-sonic-accent hover:bg-sonic-blue-light"
              >
                Add current song to this collection
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CollectionView;
