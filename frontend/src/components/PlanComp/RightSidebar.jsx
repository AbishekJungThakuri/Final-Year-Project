import { useState } from "react";
import { Plus, Map, Info, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddStepComponent from "./AddStepComponent";
import DetailsComponent from "./DetailsComponent";
import ChatComponent from "./ChatComponent";

const RightSidebar = ({plan}) => {
  const [activeComponent, setActiveComponent] = useState('add');

  const navigationItems = [
    { id: 'add', icon: Plus, label: 'Add Step' },
    { id: 'details', icon: Info, label: 'Details' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
  ];

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'add': return <AddStepComponent planId={plan.id} />;
      case 'details': return <DetailsComponent />;
      case 'chat': return <ChatComponent />;
      default: return <AddStepComponent />;
    }
  };

  return (
    <div className="h-full flex">
           {/* Content Area */}
      <div className="flex-1 bg-white">
        {renderActiveComponent()}
      </div>
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
            onClick={() => setActiveComponent(item.id)}
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