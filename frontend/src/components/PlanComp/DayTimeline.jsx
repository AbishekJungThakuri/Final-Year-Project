import {
  MapPin,
  Car,
  Compass,
  Plus,
  Trash,
  Hotel
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const DayTimeline = ({
  dayNumber,
  dayData,
  steps = [],
  addStepData,
  onSetActiveComponent,
  onStepRemove,
  onTitleEdit,
  isEditable = true,
  onViewMap = null,
  prevCityId = null
  }) => {
        
    const getStepIcon = (type) => {
      switch (type?.toLowerCase()) {
        case "transport":
          return <Car className="h-4 w-4" />;
        case "activity":
          return <Compass className="h-4 w-4" />;
        case "visit":
          return <MapPin className="h-4 w-4" />;
        default:
          return <MapPin className="h-4 w-4" />;
      }
    };

  const formatTime = (step) => `${step.duration} hours`;
  const formatCost = (cost) =>
    cost ? `NPR ${cost.toLocaleString()}` : "NPR 0";
  const getStepImage = (step) => step.image?.url || null;

  const handleStepClick = (step) => {
    if (step.category === "visit") {
      onSetActiveComponent('details', {category: 'place', id: step.place.id});
    }
    else if (step.category === "activity") {
      onSetActiveComponent('details', {category: 'place', id: step.place_activity.place_id});
    }
    else if (step.category === "transport") {
      onSetActiveComponent('recommand', {category: 'transport', planDayStepId: step.id});
    }
  };

  const handleAccomodationClick = (dayId) => {
    onSetActiveComponent('recommand', {category: 'accommodation', planDayId: dayId});
  };

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
          {dayNumber}
        </div>
        <div
          contentEditable={isEditable}
          suppressContentEditableWarning
          spellCheck={false}
          onBlur={(e) => {
            const newTitle = e.target.textContent.trim();
            if (newTitle && newTitle !== dayData?.title) {
              onTitleEdit?.(dayData.id, newTitle);
            }
          }}
          className={`text-lg font-semibold outline-none border-b border-transparent ${
            isEditable ? "cursor-text" : "cursor-default"
          }`}
        >
          {dayData?.title || `Day ${dayNumber}`}
        </div>

        <div className="ml-auto text-sm text-muted-foreground">
          {(steps.length > 0)?
            <div>
              <Button size="sm" onClick={() => handleAccomodationClick(dayData.id)}>
                Accomodations
                <Hotel className="w-3 h-3 ml-1" />
              </Button>
            </div> :
            "No steps yet"
          }
        </div>
      </div>

      <div className="ml-4 space-y-4 mt-4 relative">
        {steps.map((step, i) => (
          <div key={step.id}>
          <div className="flex justify-center my-0 relative" >
            {isEditable && (
            <Button
              variant="outline"
              size="sm"
              className={`absolute opacity-0 z-10 -top-6 w-50 border-2 cursor-pointer text-muted-foreground shadow-md hover:opacity-100 ${
                addStepData?.index === step.index ? "border-foreground/50 text-foreground opacity-100" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onSetActiveComponent("add", { index: step.index, dayId: dayData.id, cityId: (i>=1 ? steps[i-1].city.id : prevCityId) });
              }}
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Step
            </Button>
            )}
          </div>
          <div
            className="relative cursor-pointer group flex bg-white rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            onClick={() => handleStepClick(step)}
          >
            {/* Image - Full left side with 16:9 aspect ratio */}
            {getStepImage(step) && (
              <div className="w-32 flex-shrink-0">
                <img
                  src={getStepImage(step)}
                  alt={step.title}
                  className="w-full h-full object-cover"
                  style={{ aspectRatio: '16/9' }}
                />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 p-4 space-y-2">
              {/* Title */}
              <div className="text-base flex items-center gap-2 font-semibold mb-0">
                {getStepIcon(step.category)}
                {step.title}
              </div>

              {/* Category + Time + Cost */}
              <div className="text-sm flex items-center flex-wrap">
                <span>{formatTime(step)}</span>
                <div className="w-1 h-1 rounded-full bg-muted-foreground mx-2" />
                <span>{formatCost(step.cost)}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-3 text-xs border-0 bg-black text-white cursor-pointer hover:bg-black/80 hover:text-white/100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewMap?.();
                  }}
                >
                  <MapPin className="h-1 w-1 scale-75" />
                  View Map
                </Button>
                
                {(isEditable && step.can_delete)&& (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-3 text-xs text-muted-foreground hover:text-red-600 border-muted-foreground/30 hover:border-red-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStepRemove?.(step.id);
                      }}
                    >
                      <Trash className="w-3 h-3 mr-1" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayTimeline;