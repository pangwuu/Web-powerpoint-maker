import React from 'react';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import type { BibleReading } from '../api';

interface BiblePassageProps {
  readings: BibleReading[];
  setReadings: (readings: BibleReading[]) => void;
}

export const BiblePassage: React.FC<BiblePassageProps> = ({
  readings,
  setReadings,
}) => {
  const handleAddReading = () => {
    setReadings([...readings, { reference: '', version: 'NIV' }]);
  };

  const handleRemoveReading = (index: number) => {
    setReadings(readings.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof BibleReading, value: string) => {
    const newReadings = [...readings];
    newReadings[index] = { ...newReadings[index], [field]: value };
    setReadings(newReadings);
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <BookOpen size={20} className="text-green-600" />
        Bible Passage
      </h2>
      <div className="space-y-4">
        {readings.map((reading, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1 space-y-2">
              <input 
                type="text" 
                value={reading.reference}
                onChange={e => handleChange(index, 'reference', e.target.value)}
                placeholder="e.g. John 3:16-18"
                className="w-full p-2 border rounded-md" 
              />
              <select 
                value={reading.version}
                onChange={e => handleChange(index, 'version', e.target.value)}
                className="w-full p-2 border rounded-md bg-white"
              >
                <option value="NIV">NIV</option>
                <option value="ESV">ESV</option>
                <option value="KJV">KJV</option>
                <option value="NASB">NASB</option>
                <option value="NLT">NLT</option>
                <option value="CUV">CUV (Chinese)</option>
              </select>
            </div>
            <button
              onClick={() => handleRemoveReading(index)}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md mt-1"
              title="Remove reading"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        
        <button
          onClick={handleAddReading}
          className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium px-2 py-1 rounded hover:bg-green-50"
        >
          <Plus size={16} /> Add Reading
        </button>
      </div>
    </section>
  );
};
