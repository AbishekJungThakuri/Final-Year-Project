import ItineraryCard from "@/components/PlanComp/ItineraryCard";
import DayTimeline from "@/components/PlanComp/DayTimeline";
import RightSidebar from "@/components/PlanComp/RightSidebar";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchPlanByIdThunk } from "../../features/plan/AiplanSlice";

const Plan = () => {
  const { id: planId } = useParams();
  const dispatch = useDispatch();
  const { data: plan, generateStatus, editStatus, loading, error } = useSelector((state) => state.plan);

  useEffect(() => {
    if (planId) {
      dispatch(fetchPlanByIdThunk(planId));
    }
  }, [dispatch, planId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading your travel plan...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">Error loading plan: {error}</p>
          <Button onClick={() => dispatch(fetchPlanByIdThunk(planId))} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // No plan found
  if (!plan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Plan not found</p>
        </div>
      </div>
    );
  }

  // Create itinerary card data from plan
  const itineraryData = {
    title: plan.title || "Trip Plan",
    description: plan.description || "Your amazing travel itinerary",
    cost: plan.estimated_cost || 0,
    days: plan.no_of_days || 0,
    people: plan.no_of_people || 1,
    rating: plan.rating || 0,
    votes: plan.vote_count || 0,
    username: plan.user?.username || "Anonymous",
    isPrivate: plan.is_private || false,
    imageUrl: plan.image?.url
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex" style={{ height: 'calc(100vh - 60px)' }}>
        {/* Left Section - 60% */}
        <div className="w-[60%] bg-travel-gray/30 overflow-y-auto">
          <div className="p-6">
            {/* Itinerary Card */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Your Itinerary</h2>
              <ItineraryCard {...itineraryData} />
            </div>

            {/* Day Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">Day by Day Timeline</h2>
              
              {/* Render each day */}
              {plan.days && plan.days.length > 0 ? (
                plan.days.map((day, dayIndex) => (
                  <DayTimeline 
                    key={day.id || dayIndex}
                    dayNumber={dayIndex + 1}
                    dayData={day}
                    steps={day.steps || []}
                    isExpanded={dayIndex === 0} // First day expanded by default
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No timeline data available</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4 mt-8">
                <Button className="flex-1" size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Next Day
                </Button>
                <Button variant="outline" className="flex-1" size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Next Step
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - 40% */}
        <div className="w-[40%] border-l border-border">
          <RightSidebar plan={plan} />
        </div>
      </div>
    </div>
  );
};

export default Plan;