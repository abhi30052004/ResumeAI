import React, { useEffect, useState } from 'react';
import { FileText, Trophy, Wand2, Sparkles, Star } from 'lucide-react';

const funnyPhrases = [
  "Reading your resume...",
  "Sprinkling AI magic dust... ✨",
  "Fabricating leadership skills... (kidding) 😉",
  "Boom! You're hired! 🏆"
];

export function Preloader() {
  const [show, setShow] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [showTrophy, setShowTrophy] = useState(false);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setPhraseIndex((prev) => {
        if (prev < funnyPhrases.length - 1) return prev + 1;
        return prev;
      });
    }, 800); // Change text every 800ms

    // Transform document to trophy at 2.4s
    const trophyTimer = setTimeout(() => {
      setShowTrophy(true);
    }, 2400);

    // Minimum display time 3.5 seconds to see the whole story
    const timer1 = setTimeout(() => {
      setAnimateOut(true);
    }, 3500);

    // Completely remove from DOM
    const timer2 = setTimeout(() => {
      setShow(false);
    }, 4200);

    return () => {
      clearInterval(textInterval);
      clearTimeout(trophyTimer);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!show) return null;

  return (
    <div 
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-white transition-all duration-[700ms] ease-[cubic-bezier(0.87,0,0.13,1)] overflow-hidden ${
        animateOut ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* ── AMBIENT BACKGROUND ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid opacity-50"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-300 rounded-full blur-[150px] opacity-20 animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-300 rounded-full blur-[150px] opacity-20 animate-blob" style={{ animationDelay: '2s' }} />
      </div>

      {/* ── THE STORY ANIMATION ── */}
      <div className={`relative flex items-center justify-center mb-12 h-32 w-32 transition-transform duration-700 ${animateOut ? 'scale-0 rotate-90' : 'scale-100'}`}>
        
        {/* The center item (Document transforms to Trophy) */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          {!showTrophy ? (
            <div className="bg-white p-6 rounded-3xl shadow-2xl shadow-indigo-500/20 animate-[blob_2s_infinite]">
              <FileText className="w-16 h-16 text-slate-400 animate-pulse" />
            </div>
          ) : (
            <div className="bg-gradient-to-br from-amber-300 to-yellow-500 p-6 rounded-3xl shadow-[0_0_60px_rgba(251,191,36,0.6)] animate-[scaleIn_0.5s_ease-out_forwards]">
              <Trophy className="w-16 h-16 text-white animate-bounce" />
            </div>
          )}
        </div>

        {/* Orbiting Magic Wand */}
        {!showTrophy && (
          <div className="absolute inset-[-40px] animate-[spin_1.5s_linear_infinite]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="bg-indigo-600 p-3 rounded-full shadow-lg shadow-indigo-500/50 rotate-45 animate-pulse">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        )}

        {/* Flying Sparkles (only while wand is active) */}
        {!showTrophy && (
          <>
            <Sparkles className="absolute -top-10 -right-10 w-8 h-8 text-pink-400 animate-[ping_1s_infinite_100ms]" />
            <Star className="absolute bottom-0 -left-12 w-6 h-6 text-amber-400 fill-amber-400 animate-[ping_1.5s_infinite_300ms]" />
            <Sparkles className="absolute -bottom-10 right-0 w-6 h-6 text-indigo-400 animate-[ping_1.2s_infinite_500ms]" />
          </>
        )}
      </div>

      {/* ── FUNNY TEXT CHANGER ── */}
      <div className={`h-12 flex items-center justify-center transition-all duration-500 relative z-10 ${animateOut ? 'opacity-0 translate-y-10' : 'opacity-100'}`}>
        <p key={phraseIndex} className={`text-2xl md:text-3xl font-black text-center px-4 ${showTrophy ? 'text-amber-500 animate-bounce' : 'text-slate-800 animate-fade-in-up'}`}>
          {funnyPhrases[phraseIndex]}
        </p>
      </div>

      {/* Loading Bar */}
      <div className={`absolute bottom-0 left-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-[3500ms] ease-linear ${animateOut ? 'w-full opacity-0' : 'w-full origin-left scale-x-0 animate-[scaleIn_3.5s_linear_forwards]'}`}></div>
    </div>
  );
}
