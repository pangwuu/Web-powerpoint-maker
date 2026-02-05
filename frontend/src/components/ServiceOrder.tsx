import React, { useState } from 'react';
import { Music, BookOpen, Trash2, GripVertical } from 'lucide-react';
import { type Song, type BibleReading } from '../api';

interface ServiceOrderProps {
  worshipSongs: Song[];
  setWorshipSongs: (songs: Song[]) => void;
  responseSongs: Song[];
  setResponseSongs: (songs: Song[]) => void;
  readings: BibleReading[];
}

export const ServiceOrder: React.FC<ServiceOrderProps> = ({
  worshipSongs,
  setWorshipSongs,
  responseSongs,
  setResponseSongs,
  readings,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<{ index: number; type: 'worship' | 'response' } | null>(null);

  const handleDragStart = (index: number, type: 'worship' | 'response') => {
    setDraggedIndex({ index, type });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (dropIndex: number, type: 'worship' | 'response') => {
    if (!draggedIndex || draggedIndex.type !== type) return;

    const list = type === 'worship' ? [...worshipSongs] : [...responseSongs];
    const setList = type === 'worship' ? setWorshipSongs : setResponseSongs;

    const [draggedItem] = list.splice(draggedIndex.index, 1);
    list.splice(dropIndex, 0, draggedItem);

    setList(list);
    setDraggedIndex(null);
  };

  const renderList = (songs: Song[], type: 'worship' | 'response', removeSong: (idx: number) => void) => (
    <div className="space-y-2">
      {songs.length === 0 && <p className="text-sm text-gray-400 italic">No songs added</p>}
      {songs.map((song, i) => (
        <div
          key={`${song.title}-${i}`}
          draggable
          onDragStart={() => handleDragStart(i, type)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(i, type)}
          className={`flex items-center justify-between p-2 rounded-md border cursor-move transition-colors ${
            type === 'worship' 
              ? 'bg-blue-50 text-blue-800 border-blue-100 hover:bg-blue-100' 
              : 'bg-purple-50 text-purple-800 border-purple-100 hover:bg-purple-100'
          } ${draggedIndex?.index === i && draggedIndex.type === type ? 'opacity-50' : ''}`}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <GripVertical size={14} className="text-gray-400 shrink-0" />
            <span className="truncate">{song.title}</span>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); removeSong(i); }}
            className="p-1 hover:bg-white rounded-full transition-colors"
          >
            <Trash2 size={16} className="text-red-400 hover:text-red-600" />
          </button>
        </div>
      ))}
    </div>
  );

  const formatReadings = () => {
    if (readings.length === 0) return 'TBA';
    return readings.map(r => r.reference ? `${r.reference} (${r.version})` : '').filter(Boolean).join('; ');
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Music size={20} className="text-pink-600" />
        Service Order
      </h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Worship Set</h3>
          {renderList(worshipSongs, 'worship', (idx) => setWorshipSongs(worshipSongs.filter((_, i) => i !== idx)))}
        </div>

        <div className="py-2 border-y border-dashed border-gray-200">
          <p className="text-sm font-semibold text-gray-600 flex items-center gap-2">
            <BookOpen size={14} /> Bible Reading: {formatReadings() || 'TBA'}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Response</h3>
          {renderList(responseSongs, 'response', (idx) => setResponseSongs(responseSongs.filter((_, i) => i !== idx)))}
        </div>
      </div>
    </section>
  );
};
