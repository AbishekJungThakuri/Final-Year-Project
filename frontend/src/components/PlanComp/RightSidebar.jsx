import { Plus, Info, MessageCircle, HotelIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddStepComponent from "./AddStepComponent";
import DetailsComponent from "./DetailsComponent";
import ChatComponent from "./ChatComponent";
import RecommandComponent from "./RecommandComponent"
import { useState, useEffect } from "react";

const RightSidebar = ({ 
  plan_id, 
  activeComponent, 
  setActiveComponent, 
  addStepData, 
  detailsData, 
  chatData,
  recommandData
}) => {
  const navigationItems = [
    { id: 'chat', icon: MessageCircle, clickable: true, label: 'Chat', data: chatData },
    { id: 'add', icon: Plus, clickable: true, label: 'Add Step', data: addStepData },
    { id: 'details', icon: Info, clickable: false, label: 'Details', data: detailsData },
    {id: 'recommand', icon: HotelIcon, clickable: false, label: 'Recommand', data: recommandData},
  ];

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
      case 'chat':
        return <ChatComponent 
          planId={plan_id}
        />;
      case 'recommand':
        return <RecommandComponent 
          planId={plan_id}
          setActiveComponent={handleSetActiveComponent}
          recommandData={recommandData}
        />
        
      default:
        return (
          <ChatComponent 
            planId={plan_id} 
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
