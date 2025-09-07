import React from 'react';
import { Calendar, Users } from "lucide-react";

const formatCurrency = (amount = 0) => `NPR. ${amount.toLocaleString("en-IN")}`;

export const PlanCard = ({ plan, onClick }) => {
  const rating = plan.rating || 0;
  const voteCount = plan.vote_count || 0;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        {plan.image?.url ? (
          <img
            src={plan.image.url}
            alt={plan.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        {/* Bottom-left overlay badges */}
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-2">
          {/* Days */}
          <div className="flex items-center bg-primary text-white text-xs font-medium px-2 py-1 rounded-md">
            <Calendar className="h-3 w-3 mr-1" />
            {plan.no_of_days || 0} days
          </div>
          {/* Cost */}
          <div className="flex items-center bg-primary text-white text-xs font-medium px-2 py-1 rounded-md">
            {formatCurrency(plan.estimated_cost || 0)}
          </div>
          {/* People */}
          <div className="flex items-center bg-primary text-white text-xs font-medium px-2 py-1 rounded-md">
            <Users className="h-3 w-3 mr-1" />
            {plan.no_of_people || 0} people
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {plan.title}
        </h3>

        {/* Rating and User Info */}
        <div className="flex items-center justify-between">
          {/* User Info */}
          <div className="flex items-center gap-2">
            {plan.user?.image?.url ? (
              <img
                src={plan.user.image.url}
                alt={plan.user.username}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">
                {plan.user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <span className="text-sm text-gray-600">{plan.user?.username || 'Unknown'}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm text-gray-700">{rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-gray-500">({voteCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
