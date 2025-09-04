import { Plus, Info, Map, HotelIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddStepComponent from "./AddStepComponent";
import MapComponent from "./MapComponent";
import DetailsComponent from "./DetailsComponent";
import RecommandComponent from "./RecommandComponent"
import { useState, useEffect } from "react";

const RightSidebar = ({ 
  plan_id, 
  activeComponent, 
  setActiveComponent, 
  addStepData, 
  detailsData, 
  mapData,
  recommandData,
  isEditable,
}) => {
  const navigationItems = [
    {id: 'map', icon: Map, clickable: true, label: 'Map', data: null},
    { id: 'add', icon: Plus, clickable: true, label: 'Add Step', data: addStepData },
    { id: 'details', icon: Info, clickable: false, label: 'Details', data: detailsData },
    {id: 'recommand', icon: HotelIcon, clickable: false, label: 'Recommand', data: recommandData},
  ];
  if (!isEditable) {
    navigationItems.splice(1, 1);
  }

  // Enhanced setActiveComponent to handle place selection
  const handleSetActiveComponent = (componentId, data) => {
    setActiveComponent(componentId, data);
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'add':
        return (
          <AddStepComponent 
            planId={plan_id} 
            addStepData={addStepData}
            setActiveComponent={handleSetActiveComponent}
          />
        );
      case 'details':
        return (
          <DetailsComponent 
            planId={plan_id}
            detailsData={detailsData}
            setActiveComponent={handleSetActiveComponent}
          />
        );
      case 'recommand':
        return (
          <RecommandComponent 
            planId={plan_id}
            recommandData={recommandData}
            setActiveComponent={handleSetActiveComponent}
          />
        );
      
      case 'map':
        return (
          <MapComponent 
            planId={plan_id}
            mapData={mapData}
            setActiveComponent={handleSetActiveComponent}
          />
        );
      
      default:
        return (
          <MapComponent 
            planId={plan_id}
            mapData={mapData}
            setActiveComponent={handleSetActiveComponent}
          />
        );
    }
  };

  return (
    <div className="h-full flex">
      {/* Main content area */}
      <div className="flex-1 bg-white">
        {renderActiveComponent()}
      </div>

      {/* Vertical icon nav */}
      <div className="w-20 bg-white border-r border-border flex flex-col items-center py-6 space-y-4">
        {navigationItems.map((item) => {
          const isActive = activeComponent === item.id;
          const isClickable = item.clickable;

          return (
            <Button
              key={item.id}
              variant="ghost"
              size="icon"
              disabled={!isClickable}
              className={`w-12 h-12 rounded-lg transition-colors
                ${isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-90"}
                ${
                  isActive
                    ? "bg-primary text-white" 
                    : isClickable
                      ? "text-muted-foreground hover:text-primary hover:bg-primary/10"
                      : "text-muted-foreground bg-muted"
                }
              `}
              
              onClick={
                isClickable
                  ? () => handleSetActiveComponent(item.id, item.data)
                  : undefined
              }
              title={item.label}
            >
              <item.icon className="h-6 w-6" />
            </Button>
    );
  })}
</div>

    </div>
  );
};

export default RightSidebar;
