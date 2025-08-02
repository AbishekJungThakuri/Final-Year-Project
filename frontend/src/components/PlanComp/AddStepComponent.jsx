import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, MapPin, Clock, Plus, Car, Camera, Loader2, ChevronDown, Route, X, Filter } from "lucide-react";
import {Button} from "@/components/ui/button";
import { fetchPlacesThunk, fetchNearestCitiesThunk, fetchCitiesThunk } from '../../features/plan/LocationSlice';
import { addStepThunk } from '../../features/plan/AiplanSlice';

const AddStepComponent = ({ planId, setActiveComponent, addStepData }) => {
  
  const dispatch = useDispatch();
  
  // Redux state
  const places = useSelector((state) => state.location.places);
  const cities = useSelector((state) => state.location.cities);
  const placesLoading = useSelector((state) => state.location.placesLoading);
  const citiesLoading = useSelector((state) => state.location.citiesLoading);
  
  // Local state
  const [category, setCategory] = useState('visit');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const [addCityId, setAddCityId] = useState(null);
  const [addPlaceId, setAddPlaceId] = useState(null);
  const [addPlaceActivityId, setAddPlaceActivityId] = useState(null);
  
  // Pagination state
  const [placesDisplayCount, setPlacesDisplayCount] = useState(10);
  const [citiesDisplayCount, setCitiesDisplayCount] = useState(10);
  const ITEMS_PER_PAGE = 10;

  // Initialize city filter from addStepData
  useEffect(() => {
    if (addStepData?.cityId) {
      setSelectedCity(addStepData.cityId);
      setSearchTerm('');
    }
  }, [addStepData]);
  
  const formatTime = (duration) => `${duration} hours`;
  const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);
  const formatCost = (cost) => `NPR ${cost}`;

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
      if (!selectedCity) {
        dispatch(fetchCitiesThunk({
          search: searchTerm,
          page: 1,
          size: citiesDisplayCount
        }));
      }
      else{
        dispatch(fetchNearestCitiesThunk({
          search: searchTerm,
          page: 1,
          size: citiesDisplayCount,
          city_id: selectedCity ? parseInt(selectedCity) : null
        }));
      }
    }
  }, [category, searchTerm, selectedCity, placesDisplayCount, citiesDisplayCount]);

  
  // Reset display count when category or search changes
  useEffect(() => {
    setPlacesDisplayCount(10);
    setCitiesDisplayCount(10);
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

  // Handle removing city filter
  const handleRemoveCityFilter = () => {
    setSelectedCity(null);
    setSearchTerm('');
  };
  
  // Handle place click to show details
  const handlePlaceClick = (placeId) => {
    // Set the selected place in the parent component
    if (setActiveComponent) {
      setActiveComponent('details', {category: 'place', id: placeId});
    }
  };



  const handleAddStep = async (itemId, itemType, placeActivityId = null) => {
    setError(null);
    setLoading(true);

    try {
      await dispatch(
        addStepThunk({
          planId: planId,
          dayId: addStepData.dayId,
          index: addStepData.index,
          category: itemType,
          placeId: itemType === "visit" ? itemId : null,
          cityId: itemType === "transport" ? itemId: null,
          placeActivityId: itemType === "activity" ? placeActivityId : null
        })
      ).unwrap();
      
      // If transport was added, set it as the next city filter
      if (itemType === 'transport') {
        setSelectedCity(itemId);
        setSearchTerm('');
        setCategory('visit'); // Switch to visit category after transport
      }

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

  // Get city name for filter display
  const getSelectedCityName = () => {
    if (!selectedCity) return null;
    const city = cities.find(c => c.id === parseInt(selectedCity));
    return city?.name || `City ${selectedCity}`;
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
              onClick={() => {
                setCategory('visit');
                setSearchTerm('');
              }}
              className={`flex cursor-pointer items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                category === 'visit'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MapPin className="h-4 w-4" />
              <span>Visit Places</span>
            </button>
            <button
              onClick={() => {
                setCategory('transport')
                setSearchTerm('');
              }}
              className={`flex cursor-pointer items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                category === 'transport'
                  ? 'bg-primary text-white'
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
              onChange={(e) =>{
                setSearchTerm(e.target.value);
                if(e.target.value?.length > 0){
                  setSelectedCity(null);
                }else{
                  setSelectedCity(addStepData.cityId || addStepData.cityId);
                }
              }}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring"
            />
          </div>
        </div>

        {/* Loading State */}
        {(placesLoading || citiesLoading) && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-gray-600">Loading {category === 'visit' ? 'places' : 'cities'}...</p>
          </div>
        )}

        {(category === 'visit' || category === 'activity') && !placesLoading && (
          <div className="space-y-6">
            {displayedPlaces.length > 0 ? (
              <>
                {displayedPlaces.map((place) => (
                  <div key={place.id} className="space-y-2">
                    {/* Place Card */}
                    <div className="bg-white m-1 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-1 flex items-center space-x-4">
                        <div 
                          onClick={() => handlePlaceClick(place.id)}
                          className="cursor-pointer"
                        >
                          <img
                            src={place.images?.[0]?.url}
                            alt={place.name}
                            className="w-32 h-24 rounded-lg object-cover shadow-sm hover:opacity-80 transition-opacity"
                          />
                        </div>
                    
                        <div 
                          className="flex-1 space-y-2 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => handlePlaceClick(place.id)}
                        >
                          {/* Title */}
                          <h4 className="text-md mb-0 font-semibold text-gray-900 leading-snug break-words">
                            {place.name}
                          </h4>
                    
                          {/* Meta: Category, City, Duration */}
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="text-sm flex items-center flex-wrap">
                              <span>{capitalize(place.category)}</span>
                              <div className="w-1 h-1 rounded-full bg-muted-foreground mx-2" />
                              <span>{place.city.name}</span>
                              <div className="w-1 h-1 rounded-full bg-muted-foreground mx-2" />
                              <span>{formatTime(place.average_visit_duration)}</span>
                            </div>
                          </div>
                    
                        {/* Right: Buttons */}
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddStep(place.id, 'visit');
                            }}
                            disabled={loading}
                            className="h-6 mr-2 px-3 text-xs border-0 bg-black text-white cursor-pointer hover:bg-black/80 hover:text-white/100"
                          >
                            {loading ? (
                              <Loader2 className="h-2 w-2 animate-spin" />
                            ) : (
                              <Plus className="h-1 w-1 scale-75" />
                            )}
                            Add to plan
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlaceClick(place.id);
                            }}
                            className="h-6 px-3 text-xs border-0 bg-black text-white cursor-pointer hover:bg-black/80 hover:text-white/100"
                          >
                            <MapPin className="h-1 w-1 scale-75" />
                            View map
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Activities Section */}
                    {place.place_activities && place.place_activities.length > 0 && (
                      <div className="ml-8 space-y-2">
                        <div className="text-sm font-medium text-gray-600 mb-2">Activities:</div>
                        {place.place_activities.map((placeActivity) => (
                          <div key={placeActivity.id} className="bg-white m-1 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-1 flex items-center space-x-4">
                              <div className="shrink-0">
                                <img
                                  src={placeActivity.activity.image?.url}
                                  alt={placeActivity.activity.name}
                                  className="w-32 h-24 rounded-lg object-cover shadow-sm"
                                />
                              </div>
                              
                              <div className="flex-1 space-y-2">
                                {/* Activity Title */}
                                <h5 className="text-md mb-0 font-semibold text-gray-900 leading-snug break-words">
                                  {placeActivity.title}
                                </h5>
                                
                                {/* Activity Meta */}
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <div className="text-sm flex items-center flex-wrap">
                                    <span>{placeActivity.activity.name}</span>
                                    <div className="w-1 h-1 rounded-full bg-muted-foreground mx-2" />
                                    <span>{formatCost(placeActivity.average_cost)}</span>
                                    <div className="w-1 h-1 rounded-full bg-muted-foreground mx-2" />
                                    <span>{formatTime(placeActivity.average_duration)}</span>
                                  </div>
                                </div>
                              
                                {/* Add Activity Button */}
                                <Button
                                  onClick={() => handleAddStep(place.id, 'activity', placeActivity.id)}
                                  disabled={loading}
                                  className="h-6 px-3 text-xs border-0 bg-black text-white cursor-pointer hover:bg-black/80 hover:text-white/100"
                                >
                                  {loading ? (
                                    <Loader2 className="h-2 w-2 animate-spin" />
                                  ) : (
                                    <Plus className="h-1 w-1 scale-75" />
                                  )}
                                  Add Activity
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>                
                ))}
                
                {/* View All / Load More Button for Places */}
                <div className="text-center py-4">
                  {selectedCity ? (
                    <button
                      onClick={handleRemoveCityFilter}
                      className="flex items-center space-x-2 px-6 py-3 mx-auto bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors font-medium shadow-sm"
                    >
                      <MapPin className="h-4 w-4" />
                      <span>View All Places</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleLoadMorePlaces}
                      className="flex items-center space-x-2 px-6 py-3 mx-auto bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
                    >
                      <ChevronDown className="h-4 w-4" />
                      <span>Load More</span>
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p>No places found matching your search.</p>
                {selectedCity && (
                  <button
                    onClick={handleRemoveCityFilter}
                    className="mt-4 text-primary hover:text-primary/80 cursor-pointer underline  font-medium"
                  >
                    Try viewing all places
                  </button>
                )}
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
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/60 to-primary rounded-lg flex items-center justify-center">
                          <Car className="h-6 w-6 text-white" />
                        </div>
                        <div>
                        <div className="text-base text-gray-800">
                          <p>
                            Travel to <br/> <span className="font-semibold">{city.name}</span>
                          </p>
                        </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddStep(city.id, 'transport')}
                        disabled={loading}
                        className="flex cursor-pointer items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors font-medium disabled:opacity-50"
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