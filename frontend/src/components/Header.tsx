import React from 'react';
import { Download, Loader2, XCircle } from 'lucide-react';

interface HeaderProps {
  onGenerate: () => void;
  onCancel: () => void;
  isGenerating: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onGenerate, onCancel, isGenerating }) => {
  return (
    <header className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Web PowerPoint Maker</h1>
        <p className="text-gray-600">Create church service slides in seconds</p>
        <p>This is designed for use in BCCC. If you're another church, feel free to use it too but be aware some slides are currently hardcoded</p>
      </div>
      <div className="flex gap-2">
        {isGenerating && (
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-3 rounded-lg font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
          >
            <XCircle size={20} />
            Cancel
          </button>
        )}
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold shadow-lg transition-all ${
            isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
          {isGenerating ? 'Generating...' : 'Generate PPTX'}
        </button>
      </div>
    </header>
  );
};
