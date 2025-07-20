import { Clock, DollarSign, Star, ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlaceByIdThunk } from "../../features/plan/LocationSlice";

const DetailsComponent = ({ placeId }) => {

   const dispatch = useDispatch();

 useEffect(() => {
    if (placeId) { // Only dispatch if placeId exists
      dispatch(fetchPlaceByIdThunk(placeId))
        .then((result) => {
          console.log('API call result:', result);
        })
        .catch((error) => {
          console.error('API call failed:', error);
        });
    }
  }, [placeId, dispatch]);


     const place = useSelector((state) => state.location.placeDetails);
     
     if (!placeId) return <div className="h-[90%] p-6 text-muted-foreground flex justify-center items-center">No place selected. Please Select the place to see the details.</div>;
     
     // Check if place exists before rendering
     if (!place) return <div className="p-6 text-muted-foreground">Loading place details...</div>;
     console.log(place)


  return (
    <div className="h-full overflow-y-auto">
      <div className="relative h-48 overflow-hidden">
        <img src={place.images?.[0]?.url} alt={place.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <h3 className="text-2xl font-bold text-white mb-1">{place.name}</h3>
          <Badge variant="secondary" className="bg-white/20 text-white">{place.category}</Badge>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-travel-gray/30 rounded-lg">
            <Clock className="h-5 w-5 text-travel-blue mx-auto mb-1" />
            <div className="text-sm font-medium">{place.average_visit_duration || '-'} hr</div>
            <div className="text-xs text-muted-foreground">Duration</div>
          </div>
          <div className="text-center p-3 bg-travel-gray/30 rounded-lg">
            <h1 className="h-5 w-5 text-travel-green mx-auto mb-1 font-bold">Rs</h1>
            <div className="text-sm font-medium"> {place.average_visit_cost || 0}</div>
            <div className="text-xs text-muted-foreground">Cost</div>
          </div>
        </div>
      </div>
          <div className="p-3 text-lg "> 
             <p>{place.description}</p>
          </div>
    </div>
  );
};

export default DetailsComponent;
