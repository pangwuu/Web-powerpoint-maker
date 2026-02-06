import React from 'react';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import { type BibleReading } from '../api';

interface BiblePassageProps {
  readings: BibleReading[];
  setReadings: (readings: BibleReading[]) => void;
}

export const BiblePassage: React.FC<BiblePassageProps> = ({
  readings,
  setReadings,
}) => {
  const addReading = () => setReadings([...readings, { reference: '', version: 'NIV' }]);
  
  const updateReading = (i: number, field: keyof BibleReading, val: string) => {
    const next = [...readings];
    next[i] = { ...next[i], [field]: val };
    setReadings(next);
  };

  const removeReading = (i: number) => setReadings(readings.filter((_, idx) => idx !== i));

  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BookOpen size={20} className="text-green-600" />
          Bible Readings
        </h2>
      </div>
      <div className="space-y-4">
        {readings.map((r, i) => (
          <div key={i} className="flex gap-2 items-start group">
            <div className="flex-1 space-y-2">
              <input 
                type="text" 
                value={r.reference}
                onChange={e => updateReading(i, 'reference', e.target.value)}
                placeholder="e.g. John 3:16-18"
                className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-green-500 outline-none" 
              />
              <select 
                value={r.version}
                onChange={e => updateReading(i, 'version', e.target.value)}
                className="w-full p-2 border rounded-md bg-white text-sm"
              >
                <option value="NIV">NIV</option>
                <option value="ESV">ESV</option>
                <option value="KJV">KJV</option>
                <option value="NASB">NASB</option>
                <option value="NLT">NLT</option>
              </select>
            </div>
            <button 
              onClick={() => removeReading(i)} 
              className="p-2 text-gray-300 hover:text-red-500 transition-colors mt-1"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        
        <button
          onClick={addReading}
          className="w-full py-2 border-2 border-dashed border-gray-100 rounded-lg text-gray-400 hover:border-green-300 hover:text-green-500 hover:bg-green-50 transition-all flex items-center justify-center gap-2 mt-2"
        >
          <Plus size={16} /> Add Reading
        </button>
      </div>
    </section>
  );
};
