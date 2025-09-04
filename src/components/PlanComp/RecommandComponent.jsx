import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, MapPin, Clock, Plus, Car, Camera, Loader2, ChevronDown, Route, X, Filter, EllipsisIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchRecommandedTransport, fetchRecommandedAccommodation } from '../../features/plan/RecommandSlice';

const RecommandComponent = ({ planId, setActiveComponent, recommandData }) => {
  const dispatch = useDispatch();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (recommandData) {
      fetchRecommendations();
    }
  }, [recommandData]);

  const fetchRecommendations = async () => {
    if (!recommandData) return;

    setLoading(true);
    setError(null);

    try {
      let result;
      if (recommandData.category === 'transport') {
        result = await dispatch(fetchRecommandedTransport(recommandData.planDayStepId)).unwrap();
      } else if (recommandData.category === 'accommodation') {
        result = await dispatch(fetchRecommandedAccommodation(recommandData.planDayId)).unwrap();
      }
      setRecommendations(result || []);
    } catch (err) {
        setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (item) => {
    setActiveComponent('details', {category: recommandData.category, id: item.id});
  };

  const renderAccommodationCard = (accommodation) => (
    <div
      key={accommodation.id}
      className="bg-white m-1 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      {console.log(accommodation)}
      <div className="p-1 flex items-center space-x-4">
        <div
          onClick={() => handleCardClick(accommodation)}
          className="cursor-pointer"
        >
          {accommodation.images && accommodation.images.length > 0 ? (
            <img
              src={accommodation.images[0].url}
              alt={accommodation.name}
              className="w-32 h-24 rounded-lg object-cover shadow-sm hover:opacity-80 transition-opacity"
            />
          ) : (
            <div className="w-32 h-24 rounded-lg bg-gray-200 flex items-center justify-center">
              <Camera className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>
        
        <div
          className="flex-1 space-y-2 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => handleCardClick(accommodation)}
        >
          {/* Title */}
          <h4 className="text-md mb-0 font-semibold text-gray-900 leading-snug break-words">
            {accommodation.name}
          </h4>
          
          {/* Meta: Category, Address, Cost */}
          <div className=" items-center space-x-4 text-sm text-gray-500">
              <span className="capitalize">{accommodation.full_address}</span>
              {accommodation.cost_per_night && (
                <>
                  <div className="font-medium text-green-600">NPR {accommodation.cost_per_night}/night</div>
                </>
              )}
          </div>
          
          {/* Right: Buttons */}
          <Button
            disabled={loading}
            className="h-6 mr-2 px-3 text-xs border-0 bg-black text-white cursor-pointer hover:bg-black/80 hover:text-white/100"
          >
            <MapPin className="h-1 w-1 scale-75" />
            View Details
          </Button>
        </div>
      </div>
    </div>
  );

  const renderTransportCard = (transport) => (
    <div
      key={transport.id}
      className="bg-white m-1 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="p-1 flex items-center space-x-4">
        <div
          onClick={() => handleCardClick(transport)}
          className="cursor-pointer"
        >
          {transport.images && transport.images.length > 0 ? (
            <img
              src={transport.images[0].url}
              alt={`${transport.transport_category} transport`}
              className="w-32 h-24 rounded-lg object-cover shadow-sm hover:opacity-80 transition-opacity"
            />
          ) : (
            <div className="w-32 h-24 rounded-lg bg-gray-200 flex items-center justify-center">
              <Car className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>
        
        <div
          className="flex-1 space-y-2 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => handleCardClick(transport)}
        >
          {/* Title */}
          <h4 className="text-md mb-0 font-semibold text-gray-900 leading-snug break-words">
            {transport.start_city?.name} - {transport.end_city?.name}
            <span className="capitalize"> {transport.transport_category}</span> service
          </h4>
          
          {/* Meta: Distance, Duration, Cost */}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="text-sm flex items-center flex-wrap">
              <span>{transport.total_distance} km</span>
              <div className="w-1 h-1 rounded-full bg-muted-foreground mx-2" />
              <span>{transport.average_duration} hours</span>
              {transport.cost && (
                <>
                  <div className="w-1 h-1 rounded-full bg-muted-foreground mx-2" />
                  <span className="font-medium text-green-600">NPR {transport.cost}</span>
                </>
              )}
            </div>
          </div>
          
          {/* Right: Buttons */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick(transport);
            }}
            className="h-6 px-3 text-xs border-0 bg-black text-white cursor-pointer hover:bg-black/80 hover:text-white/100"
          >
            <MapPin className="h-1 w-1 scale-75" />
            View details
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 h-full overflow-y-auto bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900">
            Recommended {recommandData?.category || 'Services'}
          </h3>
          {error && (
            <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading recommendations...</span>
          </div>
        )}

        {/* Recommendations List */}
        {!loading && recommendations.length > 0 && (
          <div className="space-y-4">
            {recommendations.map((item) =>
              recommandData?.category === 'accommodation'
                ? renderAccommodationCard(item)
                : renderTransportCard(item)
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && recommendations.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              {recommandData?.category === 'accommodation' ? (
                <MapPin className="h-12 w-12 mx-auto" />
              ) : (
                <Car className="h-12 w-12 mx-auto" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {recommandData?.category?.toLowerCase()} recommendations found
            </h3>
            <p className="text-gray-600">
                Check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommandComponent;