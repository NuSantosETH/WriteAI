import React, { useState, useEffect } from 'react';
import OpenAI from 'openai';
import {
  Wand2,
  BookOpen,
  Sparkles,
  Rocket,
  PenTool,
  Moon,
  Sun,
  Copy,
  CheckCheck,
  ExternalLink,
} from 'lucide-react';
import { LoadingSpinner } from './components/LoadingSpinner';
import { LoadingPage } from './components/LoadingPage';
import { ThemeCard } from './components/ThemeCard';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const predefinedThemes = [
  {
    id: 'fantasy',
    title: 'Fantasy Adventure',
    description: 'Create magical stories with dragons, wizards, and epic quests',
    icon: <Wand2 size={24} />,
  },
  {
    id: 'scifi',
    title: 'Science Fiction',
    description: 'Explore futuristic worlds with advanced technology',
    icon: <Rocket size={24} />,
  },
  {
    id: 'mystery',
    title: 'Mystery',
    description: 'Craft intriguing detective stories and suspenseful plots',
    icon: <Sparkles size={24} />,
  },
  {
    id: 'custom',
    title: 'Custom Theme',
    description: 'Create your own unique story theme',
    icon: <PenTool size={24} />,
  },
];

const textPresets = {
  text1: {
    text: "A brave hero embarks on a quest to save their village from an ancient curse",
    link: "https://medium.com/topics/creative-writing"
  },
  text2: {
    text: "In a distant galaxy, a lone explorer discovers a mysterious signal",
    link: "https://www.reddit.com/r/WritingPrompts/"
  },
  text3: {
    text: "A detective investigates a series of mysterious disappearances in a small town",
    link: "https://www.masterclass.com/articles/creative-writing-101"
  },
  text4: {
    text: "On a stormy night, a group of friends stumbles upon an old mansion with a dark secret",
    isButton: true
  }
};

interface TopNavProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  handleCopyText: (text: string, buttonId: string) => void;
  copiedText: string | null;
}

const TopNav: React.FC<TopNavProps> = ({ darkMode, setDarkMode, handleCopyText, copiedText }) => (
  <div className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 z-50">
    <div className="container mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="relative">
            <img 
              src="/logo/logo.png" 
              alt="WriteAI Logo" 
              className="w-10 h-10 group-hover:opacity-80 transition-opacity"
            />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 group-hover:from-blue-300 group-hover:to-purple-300 text-transparent bg-clip-text transition-all">
            WriteAI
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {Object.entries(textPresets).map(([key, preset], index) => (
            'isButton' in preset ? (
              <button
                key={key}
                onClick={() => handleCopyText(preset.text, key)}
                className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 
                  border border-gray-700 hover:border-blue-500/50 transition-all duration-300 text-sm font-medium 
                  text-gray-300 hover:text-white flex items-center gap-1.5 group relative"
              >
                <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 rounded-lg transition-all" />
                {copiedText === key ? (
                  <CheckCheck className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 group-hover:text-blue-400 transition-colors" />
                )}
                Text {index + 1}
              </button>
            ) : (
              <a
                key={key}
                href={preset.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 
                  border border-gray-700 hover:border-purple-500/50 transition-all duration-300 text-sm font-medium 
                  text-gray-300 hover:text-white flex items-center gap-1.5 group relative"
              >
                <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/5 rounded-lg transition-all" />
                <ExternalLink className="w-3.5 h-3.5 group-hover:text-purple-400 transition-colors" />
                Text {index + 1}
              </a>
            )
          ))}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 
              border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 ml-2 group relative"
          >
            <div className="absolute inset-0 bg-yellow-500/0 group-hover:bg-yellow-500/5 rounded-lg transition-all" />
            {darkMode ? (
              <Sun className="w-4 h-4 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
            ) : (
              <Moon className="w-4 h-4 text-gray-300 group-hover:text-yellow-300 transition-colors" />
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default function App() {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [customTheme, setCustomTheme] = useState('');
  const [storyPrompt, setStoryPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [story, setStory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyText = async (text: string, buttonId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(buttonId);
      setTimeout(() => setCopiedText(null), 2000);
      setStoryPrompt(text);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    
    try {
      let prompt = selectedTheme === 'custom' 
        ? `Write a creative story based on the following theme: ${customTheme}`
        : `Write a creative ${selectedTheme} story`;

      if (storyPrompt) {
        prompt += `. Include the following elements: ${storyPrompt}`;
      }

      const completion = await openai.chat.completions.create({
        messages: [
          { 
            role: "system", 
            content: "You are a creative storyteller. Write engaging, family-friendly stories with rich details and interesting characters." 
          },
          { 
            role: "user", 
            content: prompt 
          }
        ],
        model: "gpt-3.5-turbo",
      });

      setStory(completion.choices[0].message.content || "");
    } catch (err) {
      setError("Failed to generate story. Please check your API key and try again.");
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  const mainContent = !story ? (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-12">
          <img 
            src="/logo/logo.png" 
            alt="WriteAI Logo" 
            className="w-32 h-32 mb-6"
          />
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-center mb-4">
            Welcome to WriteAI
          </h2>
          <p className="text-xl text-gray-300 text-center max-w-2xl">
            Create captivating stories with the power of AI. Choose your theme and let your imagination soar.
          </p>
        </div>
        
        <h3 className="text-2xl font-semibold text-gray-200 mb-6">
          Choose your story theme
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {predefinedThemes.map((theme) => (
            <ThemeCard
              key={theme.id}
              title={theme.title}
              description={theme.description}
              icon={theme.icon}
              selected={selectedTheme === theme.id}
              onClick={() => setSelectedTheme(theme.id)}
            />
          ))}
        </div>

        {selectedTheme === 'custom' && (
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Describe your theme
            </label>
            <textarea
              className="w-full p-3 border border-gray-700 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                bg-gray-800/50 text-white"
              rows={4}
              value={customTheme}
              onChange={(e) => setCustomTheme(e.target.value)}
              placeholder="Describe your custom theme here..."
            />
          </div>
        )}

        {selectedTheme && (
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Story Elements (optional)
            </label>
            <textarea
              className="w-full p-3 border border-gray-700 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                bg-gray-800/50 text-white"
              rows={3}
              value={storyPrompt}
              onChange={(e) => setStoryPrompt(e.target.value)}
              placeholder="Add specific elements you want in your story (e.g., 'a brave knight, a magical sword, and a dragon's cave')"
            />
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-500/50 text-red-200 rounded-lg">
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={!selectedTheme || generating}
          className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-lg
            flex items-center justify-center gap-3 relative group
            ${
              !selectedTheme || generating
                ? 'bg-gray-800 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 transition-all duration-300'
            }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/10 group-hover:to-purple-400/10 rounded-lg transition-all duration-300" />
          {generating ? (
            <>
              <LoadingSpinner className="w-6 h-6" />
              Crafting your story...
            </>
          ) : (
            <>
              <Wand2 className="w-6 h-6" />
              Generate Story
            </>
          )}
        </button>
      </div>
    </div>
  ) : (
    <div className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-8 mt-20 border border-gray-700">
      <h2 className="text-2xl font-semibold text-white mb-6">Your Story</h2>
      <p className="text-gray-300 leading-relaxed whitespace-pre-line">{story}</p>
      <button
        onClick={() => {
          setStory(null);
          setStoryPrompt('');
        }}
        className="mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all duration-300 relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/10 group-hover:to-purple-400/10 rounded-lg transition-all duration-300" />
        <span className="relative">Create Another Story</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <TopNav 
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        handleCopyText={handleCopyText}
        copiedText={copiedText}
      />
      {mainContent}
    </div>
  );
}