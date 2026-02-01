import React, { useState, useEffect } from 'react';
import { api, type Song } from './api';
import { format } from 'date-fns';
import { Header } from './components/Header';
import { ServiceInfo } from './components/ServiceInfo';
import { BiblePassage } from './components/BiblePassage';
import { TranslationConfig } from './components/TranslationConfig';
import { SongSelector } from './components/SongSelector';
import { ServiceOrder } from './components/ServiceOrder';
import { SongEditor } from './components/SongEditor';

const App: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [responseSongs, setResponseSongs] = useState<Song[]>([]);
  
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [speaker, setSpeaker] = useState('');
  const [topic, setTopic] = useState('');
  const [bibleRef, setBibleRef] = useState('');
  const [bibleVersion, setBibleVersion] = useState('NIV');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [translate, setTranslate] = useState(false);
  const [language, setLanguage] = useState('Chinese (Simplified)');

  // Abort Controller for cancelling requests
  const abortControllerRef = React.useRef<AbortController | null>(null);

  // Song Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [isLoadingSongs, setIsLoadingSongs] = useState(false);

  useEffect(() => {
    refreshSongs();
  }, []);

  const refreshSongs = () => {
    setIsLoadingSongs(true);
    api.getSongs()
      .then(setSongs)
      .catch(console.error)
      .finally(() => setIsLoadingSongs(false));
  };

  const filteredSongs = songs
    .filter(s => s.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      if (sortOrder === 'asc') {
        return titleA.localeCompare(titleB);
      } else {
        return titleB.localeCompare(titleA);
      }
    });

  const handleToggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    try {
      await api.generatePPT({
        date,
        speaker,
        topic,
        bible_reference: bibleRef,
        bible_version: bibleVersion,
        songs: selectedSongs,
        response_songs: responseSongs,
        template_name: 'medium',
        translate,
        language
      }, abortControllerRef.current.signal);
    } catch (error: any) {
      if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
        console.log('Generation cancelled');
      } else {
        console.error('Generation failed', error);
        alert('Failed to generate PowerPoint. Make sure the backend is running.');
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  // Song Management Handlers
  const handleAddSongClick = () => {
    setEditingSong(null);
    setIsEditorOpen(true);
  };

  const handleEditSongClick = (song: Song) => {
    setEditingSong(song);
    setIsEditorOpen(true);
  };

  const handleDeleteSongClick = async (song: Song) => {
    if (!song.id) {
       alert('Cannot delete this song (missing ID). Try refreshing the page.');
       return;
    }
    if (confirm(`Are you sure you want to delete "${song.title}"?`)) {
      try {
        await api.deleteSong(song.id);
        refreshSongs();
      } catch (error) {
        console.error('Failed to delete song', error);
        alert('Failed to delete song.');
      }
    }
  };

  const handleSaveSong = async (song: Song) => {
    try {
      if (song.id) {
        await api.updateSong(song);
      } else {
        await api.createSong(song);
      }
      refreshSongs();
      setIsEditorOpen(false);
    } catch (error) {
      console.error('Failed to save song', error);
      alert('Failed to save song.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <Header onGenerate={handleGenerate} onCancel={handleCancel} isGenerating={isGenerating} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Service Details */}
          <div className="space-y-6">
            <ServiceInfo 
              date={date} 
              setDate={setDate} 
              speaker={speaker} 
              setSpeaker={setSpeaker} 
              topic={topic} 
              setTopic={setTopic} 
            />
            <BiblePassage 
              bibleRef={bibleRef} 
              setBibleRef={setBibleRef} 
              bibleVersion={bibleVersion} 
              setBibleVersion={setBibleVersion} 
            />
            <TranslationConfig 
              translate={translate} 
              setTranslate={setTranslate} 
              language={language} 
              setLanguage={setLanguage} 
            />
          </div>

          {/* Middle Column: Song Selector */}
          <div className="space-y-6">
            <SongSelector 
              filteredSongs={filteredSongs} 
              search={search} 
              setSearch={setSearch} 
              onAddWorship={(song) => setSelectedSongs([...selectedSongs, song])} 
              onAddResponse={(song) => setResponseSongs([...responseSongs, song])} 
              onAddSong={handleAddSongClick}
              onEditSong={handleEditSongClick}
              onDeleteSong={handleDeleteSongClick}
              sortOrder={sortOrder}
              onToggleSort={handleToggleSort}
              isLoadingSongs={isLoadingSongs}
              worshipSongIds={selectedSongs.map(s => s.id).filter(Boolean) as string[]}
              responseSongIds={responseSongs.map(s => s.id).filter(Boolean) as string[]}
            />
          </div>

          {/* Right Column: Order / Preview */}
          <div className="space-y-6">
            <ServiceOrder 
              worshipSongs={selectedSongs} 
              setWorshipSongs={setSelectedSongs} 
              responseSongs={responseSongs} 
              setResponseSongs={setResponseSongs} 
              bibleRef={bibleRef} 
            />
          </div>
        </div>

        <SongEditor 
          isOpen={isEditorOpen}
          song={editingSong}
          onSave={handleSaveSong}
          onCancel={() => setIsEditorOpen(false)}
        />
      </div>
    </div>
  );
};

export default App;