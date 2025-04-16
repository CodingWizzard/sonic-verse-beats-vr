
import { useState } from 'react';
import { MusicProvider } from '@/context/MusicContext';
import BabylonScene from '@/components/BabylonScene';
import MusicSearch from '@/components/MusicSearch';
import MusicPlayer from '@/components/MusicPlayer';
import CollectionView from '@/components/CollectionView';
import { useMusicContext } from '@/context/MusicContext';
import { Button } from '@/components/ui/button';
import { Search, Library, Home } from 'lucide-react';

// Main content that uses the music context
const MainContent = () => {
  const { currentSong } = useMusicContext();
  const [activeTab, setActiveTab] = useState<'search' | 'collection'>('search');

  return (
    <div className="flex flex-col h-screen">
      {/* 3D Background */}
      <BabylonScene />
      
      {/* UI Overlay */}
      <div className="overlay-ui flex flex-col items-center justify-between p-8">
        {/* Header */}
        <div className="w-full flex justify-between items-center mb-8">
          <Button 
            onClick={() => setActiveTab('search')}
            variant={activeTab === 'search' ? "default" : "outline"}
            className="bg-sonic-blue-dark/70 hover:bg-sonic-blue/70"
          >
            <Search className="mr-2 h-4 w-4" />
            Search Music
          </Button>
          
          <Button 
            onClick={() => setActiveTab('collection')}
            variant={activeTab === 'collection' ? "default" : "outline"}
            className="bg-sonic-blue-dark/70 hover:bg-sonic-blue/70"
          >
            <Library className="mr-2 h-4 w-4" />
            My Collections
          </Button>
        </div>
        
        {/* Main Content Area - Centered */}
        <div className="flex-1 flex items-center justify-center w-full">
          {activeTab === 'search' ? (
            currentSong ? (
              <MusicPlayer song={currentSong} />
            ) : (
              <MusicSearch />
            )
          ) : (
            <CollectionView />
          )}
        </div>
        
        {/* Footer */}
        <div className="w-full text-center text-sm text-white/70 mt-8">
          SonicVerse Beats VR - Experience music in a new dimension
        </div>
      </div>
    </div>
  );
};

// Wrapper component with Provider
const Index = () => {
  return (
    <MusicProvider>
      <MainContent />
    </MusicProvider>
  );
};

export default Index;
