import React, { useState, useEffect } from 'react';
import { Download, Loader2, XCircle, HelpCircle, Info, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onGenerate: () => void;
  onCancel: () => void;
  isGenerating: boolean;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onGenerate, onCancel, isGenerating, darkMode, toggleDarkMode }) => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isGenerating) {
      setElapsedTime(0);
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
            Web PowerPoint Maker
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">
            Create church service slides in seconds.
          </p>
          
          {/* Text-based troubleshooting trigger */}
          <button 
            onClick={() => setShowHelp(!showHelp)}
            className="mt-2 flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-all"
          >
            Seeing empty slides or "Master title style"?
            <HelpCircle size={14} />
          </button>
        </div>

        <div className="flex items-center gap-3 max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:bg-white/80 dark:max-md:bg-gray-900/80 max-md:backdrop-blur-md max-md:p-4 max-md:border-t dark:max-md:border-gray-800 max-md:z-50 max-md:justify-center max-md:shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.08)]">
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {isGenerating && (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium animate-pulse">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                {formatTime(elapsedTime)}
              </div>
              
              <button
                onClick={onCancel}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <XCircle size={18} />
                <span className="md:inline">Cancel</span>
              </button>
            </>
          )}
          
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className={`flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl font-bold shadow-sm transition-all active:scale-95 max-md:w-full max-md:max-w-xs ${
              isGenerating 
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-200 dark:border-gray-700' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 dark:shadow-none shadow-lg'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Download size={18} />
                Generate PPTX
              </>
            )}
          </button>
        </div>
      </div>

      {/* Troubleshooting Alert Section */}
      {showHelp && (
        <div className="mt-6 p-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-xl flex gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="bg-amber-100 dark:bg-amber-900/40 p-2 h-fit rounded-full">
            <Info className="text-amber-700 dark:text-amber-400 shrink-0" size={20} />
          </div>
          <div className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
            <p className="font-bold text-base mb-1">How to fix "Empty Slides"</p>
            <p className="mb-2">
              If your slides appear blank, PowerPoint has likely opened the file in <strong>Slide Master</strong> view.
            </p>
            <ol className="list-decimal ml-4 space-y-1">
              <li>Navigate to the <span className="font-semibold underline">View</span> tab in the top ribbon.</li>
              <li>Select <span className="font-semibold underline">Normal</span> (the leftmost option).</li>
              <li>Your content will now be visible in the sidebar and main editor.</li>
            </ol>
          </div>
          <button 
            onClick={() => setShowHelp(false)}
            className="ml-auto text-amber-400 hover:text-amber-600 self-start"
          >
            <XCircle size={20} />
          </button>
        </div>
      )}
    </div>
  );
};