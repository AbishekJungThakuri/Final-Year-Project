import React from 'react';

const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
      <div className="h-48 bg-gray-50 relative">
        <div className="absolute top-4 right-4 w-16 h-7 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded-md mb-3"></div>
        <div className="h-4 bg-gray-100 rounded-md w-3/4 mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
);

export default SkeletonCard;