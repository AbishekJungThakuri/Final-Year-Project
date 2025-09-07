import React from 'react';

const EmptyState = ({ 
  title, 
  searchQuery = '' 
}) => {
  const DefaultIcon = () => (
    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const SearchIcon = () => (
    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
    </svg>
  );

  const isSearch = searchQuery.trim().length > 0;

  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-6 bg-gray-50 rounded-2xl flex items-center justify-center">
          {isSearch ? <SearchIcon /> : <DefaultIcon />}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {isSearch 
            ? `No results found for "${searchQuery}"` 
            : title}
        </h3>
      </div>
    </div>
  );
};

export default EmptyState;
