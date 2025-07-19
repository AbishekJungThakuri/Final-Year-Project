import { useState } from "react";
import { ChevronDown, ChevronRight, MapPin, Car, Camera, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DayTimeline = ({ dayNumber, dayData, steps = [], isExpanded = false }) => {
  const [expanded, setExpanded] = useState(isExpanded);

  const getStepIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'transport': return <Car className="h-4 w-4 text-travel-blue" />;
      case 'activity': return <Camera className="h-4 w-4 text-travel-green" />;
      case 'visit': return <MapPin className="h-4 w-4 text-travel-purple" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getStepColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'transport': return 'bg-travel-blue';
      case 'activity': return 'bg-travel-green';
      case 'visit': return 'bg-travel-purple';
      default: return 'bg-gray-400';
    }
  };

  // Format time if available
  const formatTime = (step) => {
    // You can customize this based on your time format
    return step.time || `Step ${step.index + 1}`;
  };

  // Format cost
  const formatCost = (cost) => {
    return cost ? `$${cost}` : '$0';
  };

  // Get step image
  const getStepImage = (step) => {
    if (step.image?.url) {
      return step.image.url;
    }
    return null;
  };

  return (
    <div className="mb-6">
      {/* Day Header */}
      <div 
        className="flex items-center space-x-3 cursor-pointer mb-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
          {dayNumber}
        </div>
        <h4 className="text-lg font-semibold">
          {dayData?.title || `Day ${dayNumber}`}
        </h4>
        {expanded ? (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        )}
        {/* Day summary info */}
        {dayData && (
          <div className="ml-auto text-sm text-muted-foreground">
            {steps.length} activities
          </div>
        )}
      </div>

      {/* Timeline Steps */}
      {expanded && (
        <div className="ml-4 space-y-4">
          {steps && steps.length > 0 ? (
            steps.map((step, index) => (
              <div key={step.id || index} className="relative">
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-2 top-10 w-0.5 h-16 bg-border" />
                )}
                
                {/* Step Card */}
                <div className="flex items-center space-x-4 bg-white rounded-lg shadow-sm border border-border p-4 hover:shadow-md transition-shadow">
                  {/* Timeline Dot */}
                  <div className={`w-4 h-4 rounded-full ${getStepColor(step.category)} flex-shrink-0`} />
                  
                  {/* Step Image */}
                  {getStepImage(step) && (
                    <img 
                      src={getStepImage(step)}
                      alt={step.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  
                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {getStepIcon(step.category)}
                      <h5 className="font-medium">{step.title}</h5>
                    </div>
                    
                    {/* Location info */}
                    {step.city_end?.name && (
                      <p className="text-sm text-muted-foreground mb-1">
                        📍 {step.city_start?.name} → {step.city_end?.name}
                      </p>
                    )}
                    
                    {/* Time */}
                    <p className="text-sm text-muted-foreground">
                      {formatTime(step)}
                    </p>
                    
                    {/* Route hops for transport */}
                    {step.route_hops && step.route_hops.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {step.route_hops.length} stops
                      </p>
                    )}
                  </div>
                  
                  {/* Cost */}
                  <Badge variant="outline" className="text-travel-blue border-travel-blue">
                    {formatCost(step.cost)}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p>No activities planned for this day</p>
            </div>
          )}
          
          {/* Add Step Button */}
         
        </div>
      )}
    </div>
  );
};

export default DayTimeline;