import React, { useEffect, useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { Sparkles, BookOpen, Wand2, Zap } from 'lucide-react';

export const LoadingPage: React.FC = () => {
  const [loadingText, setLoadingText] = useState('Initializing');
  const [progress, setProgress] = useState(0);
  
  const texts = [
    'Gathering magical elements',
    'Brewing creative potions',
    'Channeling storytelling energy',
    'Awakening imagination',
    'Preparing your creative journey',
    'Summoning inspiration',
    'Crafting story elements',
    'Almost ready for magic'
  ];

  useEffect(() => {
    let currentIndex = 0;
    const textInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % texts.length;
      setLoadingText(texts[currentIndex]);
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 40);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-2xl mx-auto p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl" />
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700" />
        
        <div className="relative text-center space-y-12 backdrop-blur-sm p-8 rounded-xl border border-white/10">
          <div className="space-y-6">
            <div className="relative inline-block">
              <Zap className="w-32 h-32 text-blue-500 animate-pulse mx-auto" />
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-blue-500/20 blur-xl rounded-full" />
            </div>
            
            <div className="flex items-center justify-center gap-3">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                WriteAI
              </h1>
              <Sparkles className="w-8 h-8 text-blue-400 animate-pulse" />
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-center gap-4">
              <LoadingSpinner className="w-8 h-8 text-blue-400" />
              <p className="text-xl text-gray-300">
                {loadingText}<span className="animate-pulse">...</span>
              </p>
            </div>

            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="absolute inset-0 pointer-events-none">
            <BookOpen className="absolute top-10 left-10 w-6 h-6 text-blue-400/30 animate-float" />
            <Wand2 className="absolute bottom-10 right-10 w-6 h-6 text-purple-400/30 animate-float-delayed" />
            <Sparkles className="absolute top-1/2 right-10 w-4 h-4 text-blue-400/30 animate-float" />
          </div>
        </div>
      </div>
    </div>
  );
};