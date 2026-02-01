import React from 'react';
import { BookOpen } from 'lucide-react';

interface BiblePassageProps {
  bibleRef: string;
  setBibleRef: (ref: string) => void;
  bibleVersion: string;
  setBibleVersion: (version: string) => void;
}

export const BiblePassage: React.FC<BiblePassageProps> = ({
  bibleRef,
  setBibleRef,
  bibleVersion,
  setBibleVersion,
}) => {
  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <BookOpen size={20} className="text-green-600" />
        Bible Passage
      </h2>
      <div className="space-y-4">
        <p>If there are multiple readings, comma seperate them</p>
        <input 
          type="text" 
          value={bibleRef}
          onChange={e => setBibleRef(e.target.value)}
          placeholder="e.g. John 3:16-18, Luke 10"
          className="w-full p-2 border rounded-md" 
        />
        <select 
          value={bibleVersion}
          onChange={e => setBibleVersion(e.target.value)}
          className="w-full p-2 border rounded-md bg-white"
        >
          <option value="NIV">NIV</option>
          <option value="ESV">ESV</option>
          <option value="KJV">KJV</option>
          <option value="NASB">NASB</option>
          <option value="NLT">NLT</option>
        </select>
      </div>
    </section>
  );
};
