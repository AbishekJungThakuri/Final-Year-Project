import { Plus, Info, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddStepComponent from "./AddStepComponent";
import DetailsComponent from "./DetailsComponent";
import ChatComponent from "./ChatComponent";
import { useState, useEffect } from "react";

const RightSidebar = ({ plan, activeComponent, setActiveComponent, selectedPlace }) => {
  // Local state to handle selected place for details view
  const [localSelectedPlace, setLocalSelectedPlace] = useState(selectedPlace);

  // Sync localSelectedPlace with selectedPlace from parent
  useEffect(() => {
    if (selectedPlace !== null) {
      setLocalSelectedPlace(selectedPlace);
    }
  }, [selectedPlace]);

  const navigationItems = [
    { id: 'add', icon: Plus, label: 'Add Step' },
    { id: 'details', icon: Info, label: 'Details' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
  ];

  // Enhanced setActiveComponent to handle place selection
  const handleSetActiveComponent = (componentId, placeId = null) => {
    if (placeId !== null) {
      setLocalSelectedPlace(placeId);
    }
    // Call the parent's setActiveComponent which now handles place selection
    setActiveComponent(componentId, placeId);
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'add':
        return (
          <AddStepComponent 
            planId={plan.id} 
            setActiveComponent={handleSetActiveComponent}
          />
        );
      case 'details':
        return (
          <DetailsComponent 
            placeId={localSelectedPlace || selectedPlace} 
          />
        );
      case 'chat':
        return <ChatComponent />;
      default:
        return (
          <AddStepComponent 
            planId={plan.id} 
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
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="icon"
            className={`w-12 h-12 rounded-lg transition-colors ${
              activeComponent === item.id
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
            }`}
            onClick={() => handleSetActiveComponent(item.id)}
            title={item.label}
          >
            <item.icon className="h-6 w-6" />
          </Button>
        ))}
      </div>
    </div>
  );
};

export default RightSidebar;
