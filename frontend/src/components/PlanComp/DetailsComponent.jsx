import { Clock, DollarSign, Star, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const DetailsComponent = () => {
  const [expandedSections, setExpandedSections] = useState(['description']);

  const toggleSection = (section) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const place = {
    name: "Central Park",
    category: "Public Park",
    description: "Central Park is an urban park in New York City located between the Upper West and Upper East Sides of Manhattan. It is the fifth-largest park in the city by area, covering 843 acres. The park is the most visited urban park in the United States, with an estimated 37 to 38 million visitors annually.",
    duration: "2-3 hours",
    cost: 0,
    rating: 4.5,
    images: [
      "/placeholder.svg",
      "/placeholder.svg", 
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ]
  };

  const sections = [
    {
      id: 'description',
      title: 'Description',
      content: (
        <p className="text-muted-foreground leading-relaxed">{place.description}</p>
      )
    },
    {
      id: 'hours',
      title: 'Hours & Access',
      content: (
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Open:</span> 6:00 AM - 1:00 AM daily</p>
          <p><span className="font-medium">Best time to visit:</span> Early morning or late afternoon</p>
          <p><span className="font-medium">Entry:</span> Free admission</p>
        </div>
      )
    },
    {
      id: 'amenities',
      title: 'Amenities',
      content: (
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>• Restrooms</div>
          <div>• Food vendors</div>
          <div>• Bike rentals</div>
          <div>• Playgrounds</div>
          <div>• Walking paths</div>
          <div>• Boat house</div>
        </div>
      )
    }
  ];

  return (
    <div className="h-full overflow-y-auto">
      {/* Header Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={place.images[0]}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <h3 className="text-2xl font-bold text-white mb-1">{place.name}</h3>
          <Badge variant="secondary" className="bg-white/20 text-white">
            {place.category}
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-travel-gray/30 rounded-lg">
            <Clock className="h-5 w-5 text-travel-blue mx-auto mb-1" />
            <div className="text-sm font-medium">{place.duration}</div>
            <div className="text-xs text-muted-foreground">Duration</div>
          </div>
          <div className="text-center p-3 bg-travel-gray/30 rounded-lg">
            <DollarSign className="h-5 w-5 text-travel-green mx-auto mb-1" />
            <div className="text-sm font-medium">${place.cost}</div>
            <div className="text-xs text-muted-foreground">Cost</div>
          </div>
          <div className="text-center p-3 bg-travel-gray/30 rounded-lg">
            <Star className="h-5 w-5 text-travel-yellow mx-auto mb-1" />
            <div className="text-sm font-medium">{place.rating}/5</div>
            <div className="text-xs text-muted-foreground">Rating</div>
          </div>
        </div>

        {/* Image Gallery */}
        <div>
          <h4 className="font-semibold mb-3">Gallery</h4>
          <div className="grid grid-cols-3 gap-2">
            {place.images.slice(0, 6).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${place.name} ${index + 1}`}
                className="w-full h-20 object-cover rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="border border-border rounded-lg">
              <Button
                variant="ghost"
                className="w-full justify-between p-4 h-auto"
                onClick={() => toggleSection(section.id)}
              >
                <span className="font-medium">{section.title}</span>
                {expandedSections.includes(section.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              {expandedSections.includes(section.id) && (
                <div className="px-4 pb-4">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailsComponent;