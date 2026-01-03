
import React, { useState } from 'react';
import SparkleEffect from './components/SparkleEffect';
import LoveLetter from './components/LoveLetter';
import { IMAGE_URLS, COUPLE_NAME, ANNIVERSARY_DATE, HEART_SVG } from './constants';
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('welcome');
  const [showSparkles, setShowSparkles] = useState(false);
  
  // State for user-editable images
  const [photo1, setPhoto1] = useState(IMAGE_URLS.couplePhoto1);
  const [photo2, setPhoto2] = useState(IMAGE_URLS.couplePhoto2);
  const [photo3, setPhoto3] = useState(IMAGE_URLS.couplePhoto3);
  const [isEditing, setIsEditing] = useState(false);

  const triggerSparkles = () => {
    setShowSparkles(true);
    // Keep sparkles falling for a good duration
    setTimeout(() => setShowSparkles(false), 8000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-pink-50">
      {/* Background with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 z-0"
        style={{ 
          backgroundImage: `url(${IMAGE_URLS.background})`,
          filter: 'brightness(0.8) contrast(1.1) blur(2px)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-pink-500/30 via-transparent to-red-900/60 z-0" />

      {/* Falling Sparkle Effect */}
      <SparkleEffect isActive={showSparkles} />

      {/* Content Container */}
      <main className="relative z-10 w-full max-w-6xl px-4 py-12 flex flex-col items-center">
        
        {currentPage === 'welcome' && (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="bg-white/10 backdrop-blur-lg p-10 rounded-3xl border border-white/30 inline-block animate-float shadow-2xl">
              <h1 className="text-6xl md:text-9xl font-romantic text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
                Happy Anniversary
              </h1>
            </div>
            
            <div className="space-y-4">
              {COUPLE_NAME && (
                <p className="text-3xl md:text-4xl text-white font-serif-elegant tracking-wide drop-shadow-md">
                  {COUPLE_NAME}
                </p>
              )}
              <p className="text-pink-200 font-bold tracking-[0.4em] uppercase text-sm md:text-base">
                Our Journey Since {ANNIVERSARY_DATE}
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-12">
              <button
                onClick={triggerSparkles}
                className="group relative px-10 py-5 bg-pink-600 text-white rounded-full font-bold text-xl shadow-[0_10px_20px_rgba(219,39,119,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 overflow-hidden"
              >
                <span className="relative z-10">Shower with Love</span>
                <span className="group-hover:rotate-12 transition-transform duration-300">💖</span>
              </button>

              <button
                onClick={() => {
                  setCurrentPage('memories');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-10 py-5 border-2 border-white/50 text-white rounded-full font-bold text-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-md shadow-lg"
              >
                Enter Our World
              </button>
            </div>
          </div>
        )}

        {currentPage === 'memories' && (
          <div className="w-full flex flex-col items-center space-y-12 animate-fade-in">
            <div className="w-full flex justify-between items-center">
              <button 
                onClick={() => setCurrentPage('welcome')}
                className="text-white/90 hover:text-white flex items-center gap-2 transition-colors bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm"
              >
                ← Back
              </button>
              
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-full backdrop-blur-sm transition-all flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${isEditing ? 'bg-pink-600 text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'}`}
              >
                {isEditing ? '✓ Done Editing' : '✎ Edit Photos'}
              </button>
            </div>

            <div className="text-center">
               <h2 className="text-5xl md:text-6xl font-romantic text-white mb-2 drop-shadow-lg animate-fade-zoom">
                 Our Beautiful Story
               </h2>
               <p className="text-pink-100 font-light tracking-widest uppercase text-sm">Capturing the magic of us</p>
            </div>

            {/* Layout for Three Images */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full pt-8">
              {/* Image Card 1 */}
              <div className="flex flex-col space-y-4">
                <div className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl border-4 md:border-8 border-white transform transition-all duration-700 hover:-rotate-1 hover:scale-[1.03]">
                  <img 
                    src={photo1} 
                    alt="Memory 1" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <span className="text-white text-xl font-romantic">A Beautiful Start</span>
                  </div>
                </div>
                {isEditing && (
                  <div className="animate-fade-in px-2">
                    <label className="text-white text-[10px] uppercase font-bold mb-1 block opacity-80">Photo 1 URL</label>
                    <input 
                      type="text" 
                      value={photo1}
                      onChange={(e) => setPhoto1(e.target.value)}
                      placeholder="Paste image URL here..."
                      className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 backdrop-blur-md"
                    />
                  </div>
                )}
              </div>

              {/* Image Card 2 */}
              <div className="flex flex-col space-y-4 md:translate-y-8">
                <div className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl border-4 md:border-8 border-white transform transition-all duration-700 hover:scale-[1.05]">
                  <img 
                    src={photo2} 
                    alt="Memory 2" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <span className="text-white text-xl font-romantic">Pure Happiness</span>
                  </div>
                </div>
                {isEditing && (
                  <div className="animate-fade-in px-2">
                    <label className="text-white text-[10px] uppercase font-bold mb-1 block opacity-80">Photo 2 URL</label>
                    <input 
                      type="text" 
                      value={photo2}
                      onChange={(e) => setPhoto2(e.target.value)}
                      placeholder="Paste image URL here..."
                      className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 backdrop-blur-md"
                    />
                  </div>
                )}
              </div>

              {/* Image Card 3 */}
              <div className="flex flex-col space-y-4 md:translate-y-16">
                <div className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl border-4 md:border-8 border-white transform transition-all duration-700 hover:rotate-1 hover:scale-[1.03]">
                  <img 
                    src={photo3} 
                    alt="Memory 3" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <span className="text-white text-xl font-romantic">Together Forever</span>
                  </div>
                </div>
                {isEditing && (
                  <div className="animate-fade-in px-2">
                    <label className="text-white text-[10px] uppercase font-bold mb-1 block opacity-80">Photo 3 URL</label>
                    <input 
                      type="text" 
                      value={photo3}
                      onChange={(e) => setPhoto3(e.target.value)}
                      placeholder="Paste image URL here..."
                      className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 backdrop-blur-md"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Feelings Box Section */}
            <div className="w-full flex flex-col items-center pt-32 md:pt-48">
              <h2 className="text-5xl font-romantic text-white mb-4 text-center drop-shadow-xl">
                My Deepest Feelings
              </h2>
              <LoveLetter />
            </div>

            <footer className="pt-24 pb-12 text-white/80 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-xl font-romantic">
                Forever & Always {HEART_SVG} {COUPLE_NAME || "Us"}
              </div>
              <p className="text-xs uppercase tracking-[0.3em] opacity-60">Handcrafted with Love</p>
            </footer>
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeZoom {
          0%, 100% { opacity: 0.3; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        .animate-fade-in {
          animation: fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-zoom {
          animation: fadeZoom 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
