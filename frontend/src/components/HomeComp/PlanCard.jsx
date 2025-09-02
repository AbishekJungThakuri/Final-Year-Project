import React from 'react';

export const PlanCard = ({ plan, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden border border-gray-50 relative"
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
      
      {/* Image */}
      <div className="relative overflow-hidden">
        {plan.image?.url ? (
          <>
            <img
              src={plan.image.url}
              alt={plan.title}
              className="w-full h-56 sm:h-60 md:h-64 lg:h-56 xl:h-60 object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
            />
            {/* Image overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-56 sm:h-60 md:h-64 lg:h-56 xl:h-60 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 flex items-center justify-center text-white relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-1000" />
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12 group-hover:scale-150 transition-transform duration-1000" />
            </div>
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-3 mx-auto backdrop-blur-sm">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="font-semibold text-lg">Travel Plan</p>
            </div>
          </div>
        )}
        
        {/* Duration badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-white/20">
          <span className="text-sm font-semibold text-gray-700">
            {plan.days?.length || 0} days
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative">
        <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300 leading-tight line-clamp-2">
          {plan.title}
        </h3>
        
        <div className="flex items-center justify-between">
          {/* Location with icon */}
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-4 h-4">
              <svg fill="currentColor" viewBox="0 0 20 20" className="text-gray-400">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm font-medium">Nepal</span>
          </div>
          
          {/* Arrow indicator */}
          <div className="w-8 h-8 bg-indigo-50 group-hover:bg-indigo-100 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
            <svg className="w-4 h-4 text-indigo-500 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </div>
  );
};