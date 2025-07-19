import { Star, Users, Calendar, DollarSign, Lock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ItineraryCard = ({
  title,
  description,
  cost,
  days,
  people,
  rating,
  votes,
  username,
  isPrivate = false,
  imageUrl
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden mb-6">
      {/* Cover Image */}
      <div className="relative h-50 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
          {title}
        </h3>
        {isPrivate && (
          <Lock className="absolute top-4 right-4 h-5 w-5 text-white" />
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <p className="text-muted-foreground">{description}</p>
        
        {/* Stats Row */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-travel-blue text-white">
            <DollarSign className="h-3 w-3 mr-1" />
            ${cost}
          </Badge>
          <Badge variant="secondary" className="bg-travel-teal text-white">
            <Calendar className="h-3 w-3 mr-1" />
            {days} days
          </Badge>
          <Badge variant="secondary" className="bg-travel-green text-white">
            <Users className="h-3 w-3 mr-1" />
            {people} people
          </Badge>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < rating ? "text-travel-yellow fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">({votes} votes)</span>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-2 pt-2 border-t border-border">
          <Avatar className="h-6 w-6">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>
              <User className="h-3 w-3" />
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{username}</span>
        </div>
      </div>
    </div>
  );
};

export default ItineraryCard;