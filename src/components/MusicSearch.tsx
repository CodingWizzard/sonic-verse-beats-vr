
import { useState } from 'react';
import { useMusicContext } from '../context/MusicContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const MusicSearch = () => {
  const { searchMusic, searchResults, setCurrentSong } = useMusicContext();
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    searchMusic(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="music-search-container w-full max-w-lg p-6 text-white">
      <h2 className="text-3xl font-bold mb-8 text-center text-white">Search for a Musical Artist:</h2>
      
      <div className="flex space-x-2 mb-8">
        <Input
          className="bg-sonic-blue-dark border-sonic-accent text-white"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter artist or song"
        />
        <Button 
          onClick={handleSearch}
          className="bg-sonic-accent hover:bg-sonic-blue-light text-white"
        >
          <Search className="mr-2 h-4 w-4" />
          Go
        </Button>
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-4">
          {searchResults.map((song) => (
            <div 
              key={song.id}
              className="flex items-center p-3 bg-sonic-blue-dark/40 border border-sonic-accent/30 rounded-lg cursor-pointer hover:bg-sonic-blue/50 transition-all"
              onClick={() => setCurrentSong(song)}
            >
              <img 
                src={song.albumCover} 
                alt={`${song.title} by ${song.artist}`} 
                className="w-16 h-16 object-cover rounded mr-4"
              />
              <div>
                <div className="font-medium">{song.title}</div>
                <div className="text-sm text-gray-300">{song.artist}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MusicSearch;
