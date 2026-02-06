import React, { useState, useEffect } from 'react';
import { type Song, type SongSection } from '../api';
import { Plus, Trash2, X } from 'lucide-react';

interface SongEditorProps {
  song: Song | null;
  onSave: (song: Song) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const SongEditor: React.FC<SongEditorProps> = ({ song, onSave, onCancel, isOpen }) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [ccliNumber, setCcliNumber] = useState('');
  const [sections, setSections] = useState<SongSection[]>([]);

  useEffect(() => {
    if (song) {
      setTitle(song.title);
      setArtist(song.artist || '');
      setCcliNumber(song.ccli_number || '');
      setSections(song.sections);
    } else {
      setTitle('');
      setArtist('');
      setCcliNumber('');
      setSections([{ label: 'Verse 1', content: '' }]);
    }
  }, [song, isOpen]);

  if (!isOpen) return null;

  const handleAddSection = () => {
    setSections([...sections, { label: 'Verse', content: '' }]);
  };

  const handleRemoveSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSectionChange = (index: number, field: keyof SongSection, value: string) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setSections(newSections);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: song?.id,
      title,
      artist,
      ccli_number: ccliNumber,
      sections,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {song ? 'Edit Song' : 'Add New Song'}
          </h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Song Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="e.g. Amazing Grace"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Artist (Optional)</label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="e.g. Chris Tomlin"
              />
            </div>

          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Lyrics Sections</label>
              <button
                type="button"
                onClick={handleAddSection}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus size={16} /> Add Section
              </button>
            </div>
            
            <div className="space-y-4">
              {sections.map((section, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative group">
                  <div className="flex gap-4 mb-2">
                    <div className="w-1/3">
                      <input
                        type="text"
                        value={section.label}
                        onChange={(e) => handleSectionChange(index, 'label', e.target.value)}
                        className="w-full p-2 border rounded-md text-sm font-medium"
                        placeholder="Label (e.g. Verse 1)"
                      />
                    </div>
                    <div className="flex-1 text-right">
                       <button
                        type="button"
                        onClick={() => handleRemoveSection(index)}
                        className="text-red-400 hover:text-red-600 p-1"
                        title="Remove Section"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <textarea
                    required
                    value={section.content}
                    onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                    className="w-full p-2 border rounded-md h-24 font-mono text-sm"
                    placeholder="Lyrics..."
                  />
                </div>
              ))}
            </div>
          </div>
        </form>

        <div className="p-6 border-t bg-gray-50 rounded-b-xl flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium"
          >
            Save Song
          </button>
        </div>
      </div>
    </div>
  );
};
