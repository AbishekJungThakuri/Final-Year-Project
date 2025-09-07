import React from 'react';
import { Search } from 'lucide-react';

const SectionHeader = ({ 
  title, 
  count, 
  showFilter = false, 
  showSearch = false,
  searchQuery = '',
  onSearchChange,
  selectedCategory = 'recent',
  onCategoryChange,
  isLoading = false
}) => {
  const categories = [
    { key: 'recent', label: 'Recent', description: 'Recently created' },
    { key: 'popular', label: 'Popular', description: 'Most liked' },
    { key: 'rating', label: 'Top Rated', description: 'Highest rated' }
  ];

  const handleSearchChange = (e) => {
    onSearchChange?.(e.target.value);
  };

  return (
    <div className="mb-8">
      {/* Title and Subtitle Row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-4 mb-2">
            {isLoading ? (
              <div className="h-8 w-32 bg-gray-200 rounded-md animate-pulse"></div>
            ) : (
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {title}
              </h2>
            )}
            {!isLoading && count !== undefined && (
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm font-medium">
                {count}
              </span>
            )}
            {isLoading && (
              <div className="h-6 w-8 bg-gray-100 rounded-md animate-pulse"></div>
            )}
          </div>
          {isLoading && (
            <div className="h-4 w-48 bg-gray-100 rounded-md animate-pulse"></div>
          )}
        </div>
      </div>

      {/* Search and Filter Row */}
      {(showSearch || showFilter) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Search Bar */}
          {showSearch && !isLoading && (
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search plans..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
              />
            </div>
          )}
          
          {showSearch && isLoading && (
            <div className="h-10 w-full max-w-md bg-gray-100 rounded-lg animate-pulse"></div>
          )}

          {/* Filter Buttons */}
          {showFilter && !isLoading && (
            <div className="flex gap-2 flex-shrink-0">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => onCategoryChange?.(category.key)}
                  className={`px-4 py-2 rounded-lg text-sm cursor-pointer font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedCategory === category.key
                      ? 'bg-black text-white shadow-sm '
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                  title={category.description}
                >
                  {category.label}
                </button>
              ))}
            </div>
          )}
          
          {showFilter && isLoading && (
            <div className="flex gap-2 flex-shrink-0">
              {categories.map((_, index) => (
                <div 
                  key={index}
                  className="h-9 w-20 bg-gray-100 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SectionHeader;