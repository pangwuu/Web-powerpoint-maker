import React from 'react';
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
  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full max-h-[600px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Search size={20} className="text-purple-600" />
          Find Songs
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onToggleSort}
            className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            {sortOrder === 'asc' ? <ArrowDownAZ size={18} /> : <ArrowUpZA size={18} />}
          </button>
          <button
            onClick={onAddSong}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
          >
            <Plus size={16} /> New Song
          </button>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input 
          type="text" 
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search database..."
          className="w-full pl-10 p-2 border rounded-md" 
        />
      </div>
      <div className="overflow-y-auto flex-1 space-y-3 pr-2">
        {isLoadingSongs ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <Loader2 size={32} className="animate-spin mb-2" />
            <p>Loading songs...</p>
          </div>
        ) : (
          filteredSongs.map((song, i) => {
            const isWorship = song.id && worshipSongIds.includes(song.id);
            const isResponse = song.id && responseSongIds.includes(song.id);
            
            let containerClass = "bg-gray-50 border-transparent hover:bg-gray-100";
            let textClass = "text-gray-900";

            if (isResponse) {
                containerClass = "bg-purple-50 border-purple-200 shadow-sm";
                textClass = "text-purple-800";
            } else if (isWorship) {
                containerClass = "bg-blue-50 border-blue-200 shadow-sm";
                textClass = "text-blue-800";
            }

            return (
              <div 
                key={`${song.title}-${i}`} 
                className={`flex items-center justify-between p-3 rounded-lg transition-colors group border ${containerClass}`}
              >
                <div className="flex-1 min-w-0 mr-2">
                  <div className={`font-medium ${textClass}`}>{song.title}</div>
                  <div className="flex gap-2 text-xs text-gray-400 opacity-80 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => onEditSong(song)} className="hover:text-blue-600 flex items-center gap-1">
                        <Pencil size={12} /> Edit
                     </button>
                     <button onClick={() => onDeleteSong(song)} className="hover:text-red-600 flex items-center gap-1">
                        <Trash2 size={12} /> Delete
                     </button>
                  </div>
                </div>
                
                <div className="flex opacity-80 group-hover:opacity-100 transition-opacity shrink-0 flex flex-col space-y-2">
                  <button 
                    onClick={() => onAddWorship(song)}
                    className="p-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs px-2"
                  >
                    Worship
                  </button>
                  <button 
                    onClick={() => onAddResponse(song)}
                    className="p-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-xs px-2"
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
