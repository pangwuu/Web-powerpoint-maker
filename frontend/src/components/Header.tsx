import React from 'react';
import { Download } from 'lucide-react';

interface HeaderProps {
  onGenerate: () => void;
  isGenerating: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onGenerate, isGenerating }) => {
  return (
    <header className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Web PowerPoint Maker</h1>
        <p className="text-gray-600">Create church service slides in seconds</p>
      </div>
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold shadow-lg transition-all ${
          isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        <Download size={20} />
        {isGenerating ? 'Generating...' : 'Generate PPTX'}
      </button>
    </header>
  );
};
