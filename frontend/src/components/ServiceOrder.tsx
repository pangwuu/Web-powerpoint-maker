import React from 'react';
import { Music, BookOpen, Trash2 } from 'lucide-react';
import { type Song } from '../api';

interface ServiceOrderProps {
  worshipSongs: Song[];
  setWorshipSongs: (songs: Song[]) => void;
  responseSongs: Song[];
  setResponseSongs: (songs: Song[]) => void;
  bibleRef: string;
}

export const ServiceOrder: React.FC<ServiceOrderProps> = ({
  worshipSongs,
  setWorshipSongs,
  responseSongs,
  setResponseSongs,
  bibleRef,
}) => {
  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Music size={20} className="text-pink-600" />
        Service Order
      </h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Worship Set</h3>
          <div className="space-y-2">
            {worshipSongs.length === 0 && <p className="text-sm text-gray-400 italic">No songs added</p>}
            {worshipSongs.map((song, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-blue-50 text-blue-800 rounded-md border border-blue-100">
                <span className="truncate">{song.title}</span>
                <button onClick={() => setWorshipSongs(worshipSongs.filter((_, idx) => idx !== i))}>
                  <Trash2 size={16} className="text-red-400 hover:text-red-600" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="py-2 border-y border-dashed border-gray-200">
          <p className="text-sm font-semibold text-gray-600 flex items-center gap-2">
            <BookOpen size={14} /> Bible Reading: {bibleRef || 'TBA'}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Response</h3>
          <div className="space-y-2">
            {responseSongs.length === 0 && <p className="text-sm text-gray-400 italic">No songs added</p>}
            {responseSongs.map((song, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-purple-50 text-purple-800 rounded-md border border-purple-100">
                <span className="truncate">{song.title}</span>
                <button onClick={() => setResponseSongs(responseSongs.filter((_, idx) => idx !== i))}>
                  <Trash2 size={16} className="text-red-400 hover:text-red-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
