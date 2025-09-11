import React, { useState, useEffect, useRef } from 'react';
import { getAllActivities } from '../api/activities';
import { ChevronDown, Loader2, X, Search } from 'lucide-react';

const ActivityDropdown = ({ selectedActivity, onActivitySelect, placeholder = 'Search for an activity...' }) => {
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const data = await getAllActivities({ search: searchTerm });
        setActivities(data.data);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceFetch = setTimeout(() => {
      fetchActivities();
    }, 300); // Debounce search to reduce API calls

    return () => clearTimeout(debounceFetch);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (activity) => {
    onActivitySelect(activity);
    setSearchTerm(activity.name);
    setIsOpen(false);
  };

  const handleClear = () => {
    onActivitySelect(null);
    setSearchTerm('');
  };

  const selectedActivityObj = activities.find(act => act.id === selectedActivity);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <div 
          className="flex items-center w-full px-4 py-3 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedActivityObj ? (
            <span className="flex-1 text-gray-900 font-medium truncate">{selectedActivityObj.name}</span>
          ) : (
            <input
              type="text"
              className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-400"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsOpen(true)}
            />
          )}
          {loading ? (
            <Loader2 size={18} className="animate-spin text-gray-400 ml-2" />
          ) : selectedActivityObj ? (
            <button type="button" onClick={(e) => { e.stopPropagation(); handleClear(); }} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 ml-2">
              <X size={16} />
            </button>
          ) : (
            <Search size={18} className="text-gray-400 ml-2" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <div className="py-4 px-4 flex items-center justify-center">
              <Loader2 size={20} className="animate-spin text-blue-500 mr-2" />
              <span className="text-gray-500">Loading...</span>
            </div>
          ) : activities.length > 0 ? (
            activities.map(activity => (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSelect(activity)}
              >
                {activity.image?.url && (
                  <img src={activity.image.url} alt={activity.name} className="w-8 h-8 rounded-full object-cover" />
                )}
                <span className="font-medium text-gray-800">{activity.name}</span>
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-gray-500">No activities found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityDropdown;