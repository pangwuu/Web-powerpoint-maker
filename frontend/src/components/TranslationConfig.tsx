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
        <div>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="w-full mt-2 p-2 border rounded-md bg-white"
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          <p className="text-sm text-gray-600 pt-1">Song translation is performed by AI and takes up to a few minutes depending on the number of songs that are sung. It may also not be completely reliable. Use this at your own risk and ensure you proofread all lyrics before presenting.</p>
        </div>
      )}
    </section>
  );
};
