import React from 'react';

interface TranslationConfigProps {
  translate: boolean;
  setTranslate: (translate: boolean) => void;
  language: string;
  setLanguage: (language: string) => void;
}

const SUPPORTED_LANGUAGES = [
  "Afrikaans", "Albanian", "Amharic", "Arabic", "Armenian", "Azerbaijani", "Basque", "Belarusian", "Bengali", 
  "Bosnian", "Bulgarian", "Catalan", "Cebuano", "Chichewa", "Chinese (Simplified)", "Chinese (Traditional)", 
  "Corsican", "Croatian", "Czech", "Danish", "Dutch", "English", "Esperanto", "Estonian", "Filipino", "Finnish", 
  "French", "Frisian", "Galician", "Georgian", "German", "Greek", "Gujarati", "Haitian Creole", "Hausa", 
  "Hawaiian", "Hebrew", "Hindi", "Hmong", "Hungarian", "Icelandic", "Igbo", "Indonesian", "Irish", "Italian", 
  "Japanese", "Javanese", "Kannada", "Kazakh", "Khmer", "Korean", "Kurdish (Kurmanji)", "Kyrgyz", "Lao", 
  "Latin", "Latvian", "Lithuanian", "Luxembourgish", "Macedonian", "Malagasy", "Malay", "Malayalam", "Maltese", 
  "Maori", "Marathi", "Mongolian", "Myanmar (Burmese)", "Nepali", "Norwegian", "Odia", "Pashto", "Persian", 
  "Polish", "Portuguese", "Punjabi", "Romanian", "Russian", "Samoan", "Scots Gaelic", "Serbian", "Sesotho", 
  "Shona", "Sindhi", "Sinhala", "Slovak", "Slovenian", "Somali", "Spanish", "Sundanese", "Swahili", "Swedish", 
  "Tajik", "Tamil", "Telugu", "Thai", "Turkish", "Ukrainian", "Urdu", "Uyghur", "Uzbek", "Vietnamese", "Welsh", 
  "Xhosa", "Yiddish", "Yoruba", "Zulu"
];

export const TranslationConfig: React.FC<TranslationConfigProps> = ({
  translate,
  setTranslate,
  language,
  setLanguage,
}) => {
  return (
    <section className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
      <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">Translation</h2>
      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          id="translate"
          checked={translate}
          onChange={e => setTranslate(e.target.checked)}
          className="w-4 h-4 text-blue-600 dark:text-blue-500 rounded border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 focus:ring-blue-500"
        />
        <label htmlFor="translate" className="text-sm font-medium text-gray-700 dark:text-gray-300">Translate song lyrics</label>
      </div>
      {translate && (
        <div>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="w-full mt-2 p-2 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          <p className="text-sm text-gray-600 dark:text-gray-400 pt-2 leading-relaxed">
            Song translation is performed by AI and takes up to a few minutes. 
            It may not be completely reliable. Use with caution and proofread all lyrics.
          </p>
        </div>
      )}
    </section>
  );
};
