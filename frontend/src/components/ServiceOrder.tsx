import React, { useState } from 'react';
import { Music, BookOpen, Trash2, GripVertical, Megaphone, CreditCard, Heart, Coffee, Star, Pin, Wine } from 'lucide-react';
import { type Song, type BibleReading, type AnnouncementItem } from '../api';
import { getDate } from 'date-fns';

interface ServiceOrderProps {
  worshipSongs: Song[];
  setWorshipSongs: (songs: Song[]) => void;
  responseSongs: Song[];
  setResponseSongs: (songs: Song[]) => void;
  readings: BibleReading[];
  announcements: AnnouncementItem[];
  prayerPoints: string[];
  mingleText: string;
  date: string;
  onClear: () => void;
}

export const ServiceOrder: React.FC<ServiceOrderProps> = ({
  worshipSongs,
  setWorshipSongs,
  responseSongs,
  setResponseSongs,
  readings,
  announcements,
  prayerPoints,
  mingleText,
  date,
  onClear,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<{ index: number; type: 'worship' | 'response' } | null>(null);

  const isCommunionSunday = () => {
    try {
      const d = new Date(date);
      const dayOfMonth = getDate(d);
      return dayOfMonth >= 1 && dayOfMonth <= 7;
    } catch {
      return false;
    }
  };

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
            <span className="truncate text-sm font-medium">{song.title}</span>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); removeSong(i); }}
            className="p-1 hover:bg-white rounded-full transition-colors"
          >
            <Trash2 size={14} className="text-red-400 hover:text-red-600" />
          </button>
        </div>
      ))}
    </div>
  );

  const formatReadings = () => {
    if (readings.length === 0) return 'TBA';
    const text = readings.map(r => r.reference ? `${r.reference} (${r.version})` : '').filter(Boolean).join('; ');
    return text || 'TBA';
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
          <Star size={20} className="text-yellow-500" />
          Service Preview
        </h2>
        <button 
          onClick={onClear}
          className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50"
        >
          <Trash2 size={12} />
          Clear All
        </button>
      </div>
      
      <div className="space-y-5">
        {/* Bulletin slide */}
        <div className="p-2 rounded-md bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Pin size={14} />
              <span className="font-medium">Bulletin slide</span>
            </div>
        </div>
        
        {/* Worship Section */}
        <div className="p-2 rounded-md bg-slate-50 border border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
            <Music size={12} /> Worship Set
          </h3>
          {renderList(worshipSongs, 'worship', (idx) => setWorshipSongs(worshipSongs.filter((_, i) => i !== idx)))}
        </div>

        {/* Communion Section */}
        {isCommunionSunday() && (
          <div className="p-2 rounded-md bg-red-50 border border-red-100">
            <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">Special</p>
            <p className="text-sm font-medium text-red-800 flex items-center gap-2">
              <Wine size={14} /> Holy Communion slide
            </p>
          </div>
        )}

        {/* Bible Reading Section */}
        <div className="p-3 bg-green-50 rounded-md border border-green-100">
          <h3 className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1 flex items-center gap-1">
            <BookOpen size={12} /> Bible Readings
          </h3>
          <p className="text-sm font-medium text-green-800">
            {formatReadings()}
          </p>
        </div>

        {/* Response Section */}
        <div className="p-3 bg-zinc-50 rounded-md border border-zinc-100">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
            <Music size={12} /> Response Songs
          </h3>
          {renderList(responseSongs, 'response', (idx) => setResponseSongs(responseSongs.filter((_, i) => i !== idx)))}
        </div>

        {/* Additional Items Section */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          {/* Announcements */}
          <div className="p-3 bg-orange-50 rounded-md border border-orange-100">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
              <Megaphone size={12} /> Announcements
            </h3>
            {announcements.length === 0 ? (
              <p className="text-xs text-gray-400 italic">None added</p>
            ) : (
              <ul className="space-y-1">
                {announcements.map((ann, i) => (
                  <li key={i} className="text-sm text-gray-600 truncate pl-2 border-l-2 border-orange-200">
                    {ann.title || 'Untitled Announcement'}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Offering */}
          <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
              <CreditCard size={11} />
              Offering Slide
            </h3>

          </div>

          {/* Prayer Points */}
          <div className="p-3 bg-red-50 rounded-md border border-red-100">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
              <Heart size={12} /> Prayer Points
            </h3>
            {prayerPoints.length === 0 ? (
              <p className="text-xs text-gray-400 italic">None added</p>
            ) : (
              <ul className="space-y-1">
                {prayerPoints.map((point, i) => (
                  <li key={i} className="text-sm text-gray-600 truncate pl-2 border-l-2 border-red-200">
                    {point || 'Empty point'}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Mingle */}
          <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Coffee size={14} className="text-amber-700" />
              <span className="font-medium">{mingleText || 'Mingle Time'}</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
