import React from 'react';

interface TranslationConfigProps {
  translate: boolean;
  setTranslate: (translate: boolean) => void;
  language: string;
  setLanguage: (language: string) => void;
}

export const TranslationConfig: React.FC<TranslationConfigProps> = ({
  translate,
  setTranslate,
  language,
  setLanguage,
}) => {
  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4">Translation</h2>
      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          id="translate"
          checked={translate}
          onChange={e => setTranslate(e.target.checked)}
        />
        <label htmlFor="translate" className="text-sm font-medium text-gray-700">Translate song lyrics</label>
      </div>
      {translate && (
        <input 
          type="text" 
          value={language}
          onChange={e => setLanguage(e.target.value)}
          placeholder="Target Language"
          className="w-full mt-2 p-2 border rounded-md" 
        />
      )}
    </section>
  );
};
