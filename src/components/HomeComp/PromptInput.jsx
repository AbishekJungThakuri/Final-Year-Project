import React, { useState, useEffect } from 'react';

const PromptInput = ({ onSubmit }) => {
  const [input, setInput] = useState('');
  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  
  // Nepal-specific travel prompts with keys and specific prompts
  const nepalPrompts = {
    "Pokhara 5 Days": "Generate 5 days trip to Pokhara",
    "Kathmandu 3 Days": "Generate 3 days cultural trip to Kathmandu",
    "Annapurna Trek": "Generate 12 days Annapurna Base Camp trek",
    "Chitwan Safari": "Generate 4 days wildlife safari in Chitwan",
    "Everest Trek": "Generate 14 days Everest Base Camp trek",
    "Lumbini Spiritual": "Generate 3 days spiritual journey to Lumbini",
    "Bandipur Heritage": "Generate 2 days heritage trip to Bandipur",
    "Nagarkot Sunrise": "Generate weekend trip to Nagarkot for sunrise",
    "Gorkha Historical": "Generate 3 days historical tour of Gorkha",
    "Mustang Adventure": "Generate 10 days Upper Mustang adventure",
    "Langtang Valley": "Generate 8 days Langtang Valley trek",
    "Patan Art Tour": "Generate day trip to Patan for art and culture",
    "Bhaktapur Walking": "Generate walking tour of Bhaktapur Durbar Square",
    "Rara Lake Trek": "Generate 9 days trek to Rara Lake",
    "Manaslu Circuit": "Generate 15 days Manaslu Circuit trek"
  };

  const [randomSuggestions, setRandomSuggestions] = useState([]);

  useEffect(() => {
    const entries = Object.entries(nepalPrompts);
    // shuffle and pick 4
    const shuffled = entries.sort(() => 0.5 - Math.random());
    setRandomSuggestions(shuffled.slice(0, 4));
  }, []);


  // Get array of prompt values for rotation
  const promptValues = Object.values(nepalPrompts);

  // Randomly select and rotate placeholder
  useEffect(() => {
    const getRandomPrompt = () => {
      const randomIndex = Math.floor(Math.random() * promptValues.length);
      return promptValues[randomIndex];
    };

    setCurrentPlaceholder(getRandomPrompt());

    const interval = setInterval(() => {
      setCurrentPlaceholder(getRandomPrompt());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setInput(''); 
  };

  const handleEmptyPlan = () => {
    onSubmit('new'); // Special keyword for empty plan
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSuggestionClick = (prompt) => {
    setInput(prompt);
  };

  return (
    <div className="text-center max-w-4xl mx-auto mt-20">
      {/* Premium Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          Plan your Perfect Trip to Nepal
        </h1> 
      </div>

      {/* Premium Input Section */}
      <div className="relative max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              placeholder={currentPlaceholder}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-6 py-4 text-gray-900 placeholder-gray-400 bg-transparent border-0 outline-none text-base transition-all duration-200 placeholder:transition-all placeholder:duration-500"
            />
            
            {/* Subtle input focus indicator */}
            <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gray-900 scale-x-0 transition-transform duration-200 origin-left focus-within:scale-x-100"></div>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="px-8 py-4 cursor-pointer bg-black text-white font-medium rounded-xl hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 min-w-[140px]"
          >
            <span>Plan Trip</span>
            <svg 
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
        {randomSuggestions.map(([key, prompt]) => (
          <button
            key={key}
            onClick={() => handleSuggestionClick(prompt)}
            className="px-3 py-1.5 text-sm text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors duration-200 border border-primary cursor-pointer"          >
            {key}
          </button>
        ))}
      </div>



      {/* Create Empty Plan Button */}
      <div className="mt-8">
        <div className="flex items-center justify-center gap-4">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-sm text-gray-400 px-4">or</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>
        
        <button
          onClick={handleEmptyPlan}
          className="mt-4 cursor-pointer mx-auto px-6 py-2.5 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Create Empty Plan</span>
        </button>
      </div>
    </div>
  );
};

export default PromptInput;