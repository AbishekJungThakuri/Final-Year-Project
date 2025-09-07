import React, { useState, useEffect } from 'react';

const SearchBar = ({ searchQuery, onSearchChange }) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Debounce search to avoid excessive API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchChange(localQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localQuery, onSearchChange]);

  const handleClear = () => {
    setLocalQuery('');
    onSearchChange('');
  };

  return (
    <div className="relative max-w-lg mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <svg 
            className="w-5 h-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Search travel plans..."
          className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent shadow-sm transition-all duration-200"
        />
        
        {localQuery && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {localQuery && (
        <div className="absolute top-full left-0 right-0 mt-1 text-sm text-gray-500 text-center">
          Searching for "{localQuery}"...
        </div>
      )}
    </div>
  );
};

export default SearchBar;