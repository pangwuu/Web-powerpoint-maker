import React, { useState, useEffect } from 'react';
import { api, type Song, type BibleReading } from './api';
import { format, nextSunday, isSunday } from 'date-fns';
import { Header } from './components/Header';
import { ServiceInfo } from './components/ServiceInfo';
import { TranslationConfig } from './components/TranslationConfig';
import { SongSelector } from './components/SongSelector';
import { ServiceOrder } from './components/ServiceOrder';
import { SongEditor } from './components/SongEditor';
import { ServiceContent } from './components/ServiceContent';
import { BiblePassage } from './components/BiblePassage';
import { ScrollPrompt } from './components/ScrollPrompt';
import { type AnnouncementItem, type OfferingInfo } from './api';

const App: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('ppt_darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Initialize state directly from localStorage
  const [selectedSongs, setSelectedSongs] = useState<Song[]>(() => {
    const saved = localStorage.getItem('ppt_selectedSongs');
    return saved ? JSON.parse(saved) : [];
  });
  const [responseSongs, setResponseSongs] = useState<Song[]>(() => {
    const saved = localStorage.getItem('ppt_responseSongs');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [date, setDate] = useState(() => {
    const saved = localStorage.getItem('ppt_date');
    if (saved) return saved;
    const today = new Date();
    const defaultDate = isSunday(today) ? today : nextSunday(today);
    return format(defaultDate, 'yyyy-MM-dd');
  });
  const [speaker, setSpeaker] = useState(() => localStorage.getItem('ppt_speaker') || '');
  const [topic, setTopic] = useState(() => localStorage.getItem('ppt_topic') || '');
  const [churchName, setChurchName] = useState(() => localStorage.getItem('ppt_churchName') || 'Blacktown Chinese Christian Church');
  const [serviceName, setServiceName] = useState(() => localStorage.getItem('ppt_serviceName') || 'English Service');

  const [bibleReadings, setBibleReadings] = useState<BibleReading[]>(() => {
    const saved = localStorage.getItem('ppt_bibleReadings');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() => {
    const saved = localStorage.getItem('ppt_announcements');
    return saved ? JSON.parse(saved) : [];
  });
  const [offering, setOffering] = useState<OfferingInfo>(() => {
    const saved = localStorage.getItem('ppt_offering');
    return saved ? JSON.parse(saved) : {
      account_name: 'Blacktown Chinese Christian Church',
      account_number: '4216 50263',
      bsb: '112 – 879',
      reference: 'offering',
      details: 'The offering box is available at the back of the hall'
    };
  });
  const [prayerPoints, setPrayerPoints] = useState<string[]>(() => {
    const saved = localStorage.getItem('ppt_prayerPoints');
    return saved ? JSON.parse(saved) : [];
  });
  const [mingleText, setMingleText] = useState(() => localStorage.getItem('ppt_mingleText') || 'Mingle time!');

  const [isGenerating, setIsGenerating] = useState(false);
  const [translate, setTranslate] = useState(() => localStorage.getItem('ppt_translate') === 'true');
  const [language, setLanguage] = useState(() => localStorage.getItem('ppt_language') || 'Chinese (Simplified)');

  // Theme Sync
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('ppt_darkMode', String(darkMode));
  }, [darkMode]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ppt_date', date);
    localStorage.setItem('ppt_speaker', speaker);
    localStorage.setItem('ppt_topic', topic);
    localStorage.setItem('ppt_churchName', churchName);
    localStorage.setItem('ppt_serviceName', serviceName);
    localStorage.setItem('ppt_selectedSongs', JSON.stringify(selectedSongs));
    localStorage.setItem('ppt_responseSongs', JSON.stringify(responseSongs));
    localStorage.setItem('ppt_bibleReadings', JSON.stringify(bibleReadings));
    localStorage.setItem('ppt_announcements', JSON.stringify(announcements));
    localStorage.setItem('ppt_offering', JSON.stringify(offering));
    localStorage.setItem('ppt_prayerPoints', JSON.stringify(prayerPoints));
    localStorage.setItem('ppt_mingleText', mingleText);
    localStorage.setItem('ppt_translate', String(translate));
    localStorage.setItem('ppt_language', language);
  }, [date, speaker, topic, churchName, serviceName, selectedSongs, responseSongs, bibleReadings, announcements, offering, prayerPoints, mingleText, translate, language]);

  const handleClearService = () => {
    if (confirm('Are you sure you want to clear the entire service plan?')) {
      setSelectedSongs([]);
      setResponseSongs([]);
      setSpeaker('');
      setTopic('');
      setBibleReadings([]);
      setAnnouncements([]);
      setPrayerPoints([]);
      setMingleText('Mingle time!');
    }
  };

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
    .filter(s => 
      s.title.toLowerCase().includes(search.toLowerCase()) || 
      (s.artist && s.artist.toLowerCase().includes(search.toLowerCase()))
    )
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
        church_name: churchName,
        service_name: serviceName,
        bible_readings: bibleReadings,
        songs: selectedSongs,
        response_songs: responseSongs,
        announcements,
        offering,
        prayer_points: prayerPoints,
        mingle_text: mingleText,
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8 font-sans pb-24 md:pb-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <Header 
          onGenerate={handleGenerate} 
          onCancel={handleCancel} 
          isGenerating={isGenerating} 
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
        />

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
              churchName={churchName}
              setChurchName={setChurchName}
              serviceName={serviceName}
              setServiceName={setServiceName}
            />
            <BiblePassage 
              readings={bibleReadings} 
              setReadings={setBibleReadings} 
            />
            <TranslationConfig 
              translate={translate} 
              setTranslate={setTranslate} 
              language={language} 
              setLanguage={setLanguage} 
            />
          </div>

          {/* Middle Column: Song Selector & Service Content */}
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
            
            <ServiceContent 
              announcements={announcements}
              setAnnouncements={setAnnouncements}
              offering={offering}
              setOffering={setOffering}
              prayerPoints={prayerPoints}
              setPrayerPoints={setPrayerPoints}
              mingleText={mingleText}
              setMingleText={setMingleText}
            />
          </div>

          {/* Right Column: Order / Preview */}
          <div className="space-y-6">
            <ServiceOrder 
              worshipSongs={selectedSongs} 
              setWorshipSongs={setSelectedSongs} 
              responseSongs={responseSongs} 
              setResponseSongs={setResponseSongs} 
              readings={bibleReadings} 
              announcements={announcements}
              prayerPoints={prayerPoints}
              mingleText={mingleText}
              date={date}
              onClear={handleClearService}
            />
          </div>
        </div>

        <SongEditor 
          isOpen={isEditorOpen}
          song={editingSong}
          onSave={handleSaveSong}
          onCancel={() => setIsEditorOpen(false)}
        />
        <ScrollPrompt />
      </div>
    </div>
  );
};

export default App;