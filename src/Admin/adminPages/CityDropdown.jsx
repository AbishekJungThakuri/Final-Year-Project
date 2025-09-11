import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { searchCities } from '../api/transportApi';

const CityDropdown = ({ 
  selectedCity, 
  onCitySelect, 
  placeholder 
}) => {
  // Local state for the input field to prevent re-renders on every keystroke
  const [inputValue, setInputValue] = useState(selectedCity?.name || '');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const dropdownRef = useRef(null);
  const searchDebounceRef = useRef(null);

  // Sync inputValue with selectedCity prop
  useEffect(() => {
    setInputValue(selectedCity?.name || '');
  }, [selectedCity]);

  // Handle API search with debounce
  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    
    if (inputValue.length > 0) {
      searchDebounceRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          const results = await searchCities(inputValue);
          setCities(results.data || []);
          setShowDropdown(true); // Show dropdown after search
        } catch (err) {
          console.error('Error searching cities:', err);
          setCities([]);
        } finally {
          setLoading(false);
        }
      }, 300);
    } else {
      setCities([]);
      setShowDropdown(false);
    }

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [inputValue]);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCitySelect = (city) => {
    onCitySelect(city);
    setInputValue(city.name);
    setShowDropdown(false);
  };
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 pr-10"
        />
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
      </div>
      
      {showDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
          {loading ? (
            <div className="px-4 py-3 text-center text-slate-500">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Searching...
              </div>
            </div>
          ) : cities.length > 0 ? (
            cities.map((city) => (
              <button
                key={city.id}
                type="button"
                onClick={() => handleCitySelect(city)}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none border-b border-slate-100 last:border-b-0"
              >
                <div className="font-medium text-slate-900">{city.name}</div>
                {city.state && (
                  <div className="text-sm text-slate-500">{city.state}</div>
                )}
              </button>
            ))
          ) : inputValue.length > 0 ? (
            <div className="px-4 py-3 text-center text-slate-500">
              No cities found
            </div>
          ) : (
            <div className="px-4 py-3 text-center text-slate-500">
              Start typing to search cities
            </div>
          )}
        </div>
      )}
      
      {selectedCity && (
        <div className="mt-2 px-3 py-2 bg-blue-50 rounded-lg text-sm">
          <span className="text-blue-700">Selected: {selectedCity.name}</span>
          {selectedCity.state && (
            <span className="text-blue-500 ml-2">({selectedCity.state})</span>
          )}
        </div>
      )}
    </div>
  );
};

export default CityDropdown;