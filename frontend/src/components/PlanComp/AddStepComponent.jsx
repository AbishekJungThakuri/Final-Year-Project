import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, MapPin, Clock, Plus, Car, Camera, Loader2, ChevronDown, Route } from "lucide-react";

import { fetchPlacesThunk, fetchCitiesThunk } from '../../features/plan/LocationSlice';
import { addStepThunk } from '../../features/plan/AiplanSlice';

const AddStepComponent = ({ planId, onClose, setActiveComponent }) => {
  
  const dispatch = useDispatch();
  
  // Redux state
  const places = useSelector((state) => state.location.places);
  const cities = useSelector((state) => state.location.cities);
  const placesLoading = useSelector((state) => state.location.placesLoading);
  const citiesLoading = useSelector((state) => state.location.citiesLoading);
  
  // Local state
  const [category, setCategory] = useState('visit');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [placesDisplayCount, setPlacesDisplayCount] = useState(5);
  const [citiesDisplayCount, setCitiesDisplayCount] = useState(5);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    if (category === 'visit') {
      dispatch(fetchPlacesThunk({
        search: searchTerm,
        cityId: selectedCity ? parseInt(selectedCity) : null,
        page: 1,
        size: placesDisplayCount,
        sortBy: 'id',
        order: 'asc'
      }));
    } else if (category === 'transport') {
      dispatch(fetchCitiesThunk({
        search: searchTerm,
        page: 1,
        size: citiesDisplayCount
      }));
    }
  }, [category, searchTerm, selectedCity, placesDisplayCount, citiesDisplayCount]);

  
  // Reset display count when category or search changes
  useEffect(() => {
    setPlacesDisplayCount(5);
    setCitiesDisplayCount(5);
  }, [category, searchTerm, selectedCity]);

  // Get displayed items based on current display count
  const displayedPlaces = places;
  const displayedCities = cities;
  
  const handleLoadMorePlaces = () => {
    setPlacesDisplayCount(prev => prev + ITEMS_PER_PAGE);
  };
  
  const handleLoadMoreCities = () => {
    setCitiesDisplayCount(prev => prev + ITEMS_PER_PAGE);
  };
  
  // Handle place click to show details
  const handlePlaceClick = (placeId) => {
    // Set the selected place in the parent component
    if (setActiveComponent) {
      // Pass the place ID to the parent and switch to details view
      setActiveComponent('details', placeId);
    }
  };

  const handleAddStep = async (itemId, itemType) => {
    setError(null);
    setLoading(true);

    try {
      await dispatch(
        addStepThunk({
          planId,
          category: itemType,
          placeId: itemType === 'visit' ? itemId : null,
          endCityId: itemType === 'transport' ? itemId : null,
        })
      ).unwrap();
      
      // Show success message or close modal
      if (onClose) onClose();
    } catch (err) {
      setError(err.message || 'Failed to add step');
    }
    setLoading(false);
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'transport': return <Car className="h-5 w-5" />;
      case 'visit': return <MapPin className="h-5 w-5" />;
      default: return <Camera className="h-5 w-5" />;
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900">Add Next Step</h3>
          {error && (
            <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          {/* Category Selection */}
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setCategory('visit')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                category === 'visit'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MapPin className="h-4 w-4" />
              <span>Visit Places</span>
            </button>
            <button
              onClick={() => setCategory('transport')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                category === 'transport'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Car className="h-4 w-4" />
              <span>Travel to</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={category === 'visit' ? "Search places..." : "Search cities..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Loading State */}
        {(placesLoading || citiesLoading) && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
            <p className="mt-2 text-gray-600">Loading {category === 'visit' ? 'places' : 'cities'}...</p>
          </div>
        )}

        {/* Places Grid - for Visit category */}
        {category === 'visit' && !placesLoading && (
          <div className="space-y-6">
            {displayedPlaces.length > 0 ? (
              <>
                {displayedPlaces.map((place) => (
                  <div key={place.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4 flex items-center space-x-4">
                      {/* Left: Image - Make clickable */}
                      <div 
                        onClick={() => handlePlaceClick(place.id)}
                        className="cursor-pointer"
                      >
                        <img
                          src={place.images?.[0]?.url}
                          alt={place.name}
                          className="w-28 h-20 rounded-lg object-cover shadow-sm hover:opacity-80 transition-opacity"
                        />
                      </div>
                  
                      {/* Middle: Title + Meta - Make clickable */}
                      <div 
                        className="flex-1 space-y-2 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => handlePlaceClick(place.id)}
                      >
                        {/* Title */}
                        <h4 className="text-lg font-semibold text-gray-900 leading-snug break-words">
                          {place.name}
                        </h4>
                  
                        {/* Meta: Category, City, Duration */}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{place.city?.name || "City"}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {place.average_visit_duration
                                ? `${place.average_visit_duration} hour${place.average_visit_duration > 1 ? "s" : ""}`
                                : "2-3 hours"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                              {place.category || "Place"}
                            </span>
                          </div>
                        </div>
                      </div>
                  
                      {/* Right: Add Step button */}
                      <div className="flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering place click
                            handleAddStep(place.id, 'visit');
                          }}
                          disabled={loading}
                          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                        >
                          {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                          <span>Add Step</span>
                        </button>
                      </div>
                    </div>
                  </div>                
                ))}
                
                {/* Load More Button for Places */}
                <div className="text-center py-4">
                  <button
                    onClick={handleLoadMorePlaces}
                    className="flex items-center space-x-2 px-6 py-3 mx-auto bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
                  >
                    <ChevronDown className="h-4 w-4" />
                    <span>Load More</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p>No places found matching your search.</p>
              </div>
            )}
          </div>
        )}

        {/* Cities Grid - for Transport category */}
        {category === 'transport' && !citiesLoading && (
          <div className="space-y-4">
            {displayedCities.length > 0 ? (
              <>
                {displayedCities.map((city) => (
                  <div key={city.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                          <Car className="h-6 w-6 text-white" />
                        </div>
                        <div>
                        <div className="text-base text-gray-800">
                          <p>
                            Travel to <span className="font-semibold">{city.name}</span>
                          </p>
                          <p className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center space-x-1">
                              <Route className="h-4 w-4" />
                              <span>{city.distance || "40"} km</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{city.duration || "2-3"} hours</span>
                            </span>
                          </p>
                        </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddStep(city.id, 'transport')}
                        disabled={loading}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                        <span>Add Transport</span>
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Load More Button for Cities */}
                <div className="text-center py-4">
                  <button
                    onClick={handleLoadMoreCities}
                    className="flex items-center space-x-2 px-6 py-3 mx-auto bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
                  >
                    <ChevronDown className="h-4 w-4" />
                    <span>Load More</span>
                  </button>
                </div>
                
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Car className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p>No cities found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddStepComponent;