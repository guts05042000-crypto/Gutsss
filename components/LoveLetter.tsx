
import React, { useState, useEffect } from 'react';
import { generateRomanticMessage } from '../services/geminiService';
import { LoveNote } from '../types';
import { COUPLE_NAME } from '../constants';

const LoveLetter: React.FC = () => {
  const [note, setNote] = useState<LoveNote | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchNote = async () => {
    setLoading(true);
    const result = await generateRomanticMessage(COUPLE_NAME);
    setNote(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchNote();
  }, []);

  return (
    <div className="relative max-w-lg w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border-2 border-pink-200 mt-12 transform hover:scale-[1.02] transition-transform duration-500">
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-pink-500 text-white p-3 rounded-full shadow-lg">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
          <p className="text-pink-600 font-medium animate-pulse">Writing from my heart...</p>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <h3 className="text-3xl font-romantic text-pink-700">{note?.header}</h3>
          <p className="text-lg text-gray-700 italic leading-relaxed font-light">
            "{note?.message}"
          </p>
          <div className="pt-4">
            <p className="text-pink-600 font-serif-elegant font-bold text-xl">{note?.signature}</p>
          </div>
          <button 
            onClick={fetchNote}
            className="text-xs uppercase tracking-widest text-pink-400 hover:text-pink-600 transition-colors"
          >
            Reflect Again
          </button>
        </div>
      )}
    </div>
  );
};

export default LoveLetter;
