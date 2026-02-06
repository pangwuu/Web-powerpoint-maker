import React, { useState, useEffect } from 'react';
import { api, type Song, type SongSection } from '../api';
import { Plus, Trash2, X, Search, Loader2 } from 'lucide-react';

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
  const [isSearching, setIsSearching] = useState(false);

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

  const handleSearch = async () => {
    if (!title) return;
    setIsSearching(true);
    try {
      const result = await api.searchSongLyrics(title, artist);
      setTitle(result.title || '');
      setArtist(result.artist || '');
      setSections(result.sections || []);
    } catch (error) {
      console.error('Failed to search lyrics:', error);
      alert('Failed to find lyrics. Please try again or enter manually.');
    } finally {
      setIsSearching(false);
    }
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {song ? 'Edit Song' : 'Add New Song'}
          </h2>
          <button onClick={onCancel} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <div className="flex justify-between items-end mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Song Title</label>
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={isSearching || !title}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSearching ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search size={14} />
                      Search & Auto-fill
                    </>
                  )}
                </button>
              </div>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Amazing Grace"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Artist (Optional)</label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full p-2 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Chris Tomlin"
              />
            </div>

          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lyrics Sections</label>
              <button
                type="button"
                onClick={handleAddSection}
                className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                <Plus size={16} /> Add Section
              </button>
            </div>
            
            <div className="space-y-4">
              {sections.map((section, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 relative group">
                  <div className="flex gap-4 mb-2">
                    <div className="w-1/3">
                      <input
                        type="text"
                        value={section.label}
                        onChange={(e) => handleSectionChange(index, 'label', e.target.value)}
                        className="w-full p-2 border dark:border-gray-700 rounded-md text-sm font-medium bg-white dark:bg-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Label (e.g. Verse 1)"
                      />
                    </div>
                    <div className="flex-1 text-right">
                       <button
                        type="button"
                        onClick={() => handleRemoveSection(index)}
                        className="text-red-400 dark:text-red-600 hover:text-red-600 dark:hover:text-red-400 p-1 transition-colors"
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
                    className="w-full p-2 border dark:border-gray-700 rounded-md h-24 font-mono text-sm bg-white dark:bg-gray-800 dark:text-gray-100 outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Lyrics..."
                  />
                </div>
              ))}
            </div>
          </div>
        </form>

        <div className="p-6 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl flex justify-end gap-3 transition-colors duration-300">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors border border-transparent dark:border-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 rounded-lg font-bold shadow-sm transition-all active:scale-95"
          >
            Save Song
          </button>
        </div>
      </div>
    </div>
  );
};
