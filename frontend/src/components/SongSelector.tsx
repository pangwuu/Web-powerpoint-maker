import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, ArrowDownAZ, ArrowUpZA, Loader2 } from 'lucide-react';
import { type Song } from '../api';

interface SongSelectorProps {
  filteredSongs: Song[];
  search: string;
  setSearch: (search: string) => void;
  onAddWorship: (song: Song) => void;
  onAddResponse: (song: Song) => void;
  onAddSong: () => void;
  onEditSong: (song: Song) => void;
  onDeleteSong: (song: Song) => void;
  sortOrder: 'asc' | 'desc';
  onToggleSort: () => void;
  isLoadingSongs: boolean;
  worshipSongIds: string[];
  responseSongIds: string[];
}

export const SongSelector: React.FC<SongSelectorProps> = ({
  filteredSongs,
  search,
  setSearch,
  onAddWorship,
  onAddResponse,
  onAddSong,
  onEditSong,
  onDeleteSong,
  sortOrder,
  onToggleSort,
  isLoadingSongs,
  worshipSongIds,
  responseSongIds,
}) => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [toast, setToast] = useState<{ message: string; type: 'worship' | 'response' } | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isLoadingSongs) {
      setElapsedTime(0);
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoadingSongs]);

  const showToast = (title: string, type: 'worship' | 'response') => {
    setToast({ message: `"${title}" added as a ${type} song`, type });
    setTimeout(() => setToast(null), 2000);
  };

  const handleAddWorship = (song: Song) => {
    onAddWorship(song);
    showToast(song.title, 'worship');
  };

  const handleAddResponse = (song: Song) => {
    onAddResponse(song);
    showToast(song.title, 'response');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

    return (

      <section className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col h-full max-h-[600px] relative transition-colors duration-300">

        {/* Feedback Toast */}

        {toast && (

          <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-full shadow-lg border text-sm font-medium animate-in fade-in slide-in-from-bottom-4 transition-all ${

            toast.type === 'worship' 

              ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300' 

              : 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300'

          }`}>

            {toast.message}

          </div>

        )}

  

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-xl font-semibold flex items-center gap-2 dark:text-gray-100">

            <Search size={20} className="text-purple-600 dark:text-purple-400" />

            Find Songs

          </h2>

          <div className="flex gap-2">

            <button

              onClick={onToggleSort}

              className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-transparent dark:border-gray-700"

              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}

            >

              {sortOrder === 'asc' ? <ArrowDownAZ size={18} /> : <ArrowUpZA size={18} />}

            </button>

            <button

              onClick={onAddSong}

              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 dark:bg-green-700 text-white rounded-md text-sm hover:bg-green-700 dark:hover:bg-green-600 transition-colors shadow-sm"

            >

              <Plus size={16} /> New Song

            </button>

          </div>

        </div>

  

        <div className="relative mb-4">

          <Search className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={18} />

          <input 

            type="text" 

            value={search}

            onChange={e => setSearch(e.target.value)}

            placeholder="Search database..."

            className="w-full pl-10 p-2 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-purple-500" 

          />

        </div>

  

        <div className="overflow-y-auto flex-1 space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">

          {isLoadingSongs ? (

            <div className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400">

              <Loader2 size={32} className="animate-spin mb-2" />

              <p>Loading songs... {formatTime(elapsedTime)}</p>

              <p className="text-xs mt-1 italic text-gray-400 dark:text-gray-500">This could take up to a minute or two.</p>

            </div>

          ) : (

            filteredSongs.map((song, i) => {

              const isWorship = song.id && worshipSongIds.includes(song.id);

              const isResponse = song.id && responseSongIds.includes(song.id);

              

              let containerClass = "bg-gray-50 dark:bg-gray-800/50 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800";

              let textClass = "text-gray-900 dark:text-gray-100";

  

              if (isResponse) {

                  containerClass = "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 shadow-sm";

                  textClass = "text-purple-800 dark:text-purple-300";

              } else if (isWorship) {

                  containerClass = "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-sm";

                  textClass = "text-blue-800 dark:text-blue-300";

              }

  

              return (

                <div 

                  key={`${song.title}-${i}`} 

                  className={`flex items-center justify-between p-3 rounded-lg transition-colors group border ${containerClass}`}

                >

                  <div className="flex-1 min-w-0 mr-2">

                    <div className={`font-medium ${textClass}`}>{song.title}</div>

                    {song.artist && (

                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{song.artist}</div>

                    )}

                    <div className="flex gap-2 text-xs text-gray-400 dark:text-gray-500 opacity-80 group-hover:opacity-100 transition-opacity mt-1">

                       <button onClick={() => onEditSong(song)} className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors">

                          <Pencil size={12} /> Edit

                       </button>

                       <button onClick={() => onDeleteSong(song)} className="hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 transition-colors">

                          <Trash2 size={12} /> Delete

                       </button>

                    </div>

                  </div>

                  

                  <div className="flex opacity-80 group-hover:opacity-100 transition-opacity shrink-0 flex-col space-y-2">

                    <button 

                      onClick={() => handleAddWorship(song)}

                      className="p-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/60 text-xs px-2 transition-colors border border-transparent dark:border-blue-800/50"

                    >

                      Worship

                    </button>

                    <button 

                      onClick={() => handleAddResponse(song)}

                      className="p-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-900/60 text-xs px-2 transition-colors border border-transparent dark:border-purple-800/50"

                    >

                      Response

                    </button>

                  </div>

                </div>

              );

            })

          )}

        </div>

      </section>

    );

  };

  