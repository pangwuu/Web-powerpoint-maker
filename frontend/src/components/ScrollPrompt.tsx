import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export const ScrollPrompt: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Hide prompt if user has scrolled more than 300px
      if (window.scrollY > 300) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="hidden md:flex fixed bottom-8 right-8 flex-col items-center gap-2 ">
      <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 flex items-center gap-2 transition-colors duration-300">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Scroll for more</span>
        <ChevronDown size={18} className="text-blue-600 dark:text-blue-400" />
      </div>
    </div>
  );
};
