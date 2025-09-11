import ItineraryCard from "@/components/PlanComp/ItineraryCard";
import DayTimeline from "@/components/PlanComp/DayTimeline";
import RightSidebar from "@/components/PlanComp/RightSidebar";
import StartCitySelector from "@/components/PlanComp/StartCitySelector";
import AddDayComponent from "@/components/PlanComp/AddDayComponent";
import { Plus, Trash, Sparkles, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import {
  fetchPlanByIdThunk,
  setGenerationInProgress,
  updatePlanPartialThunk,
  toggleSaveThunk,
  ratePlanThunk,
  removeRatingThunk,
  addDayThunk,
  deleteDayThunk,
  updateDayThunk,
  deleteStepThunk,
} from "../../features/plan/PlanSlice";
import { connectToPlanWebSocket } from "../../features/plan/PlanWebsocket";
import { transformMapData } from "../../features/plan/transformMapData";

const Plan = () => {
  const { id: planId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    data: plan,
    generateStatus,
    loading,
    error,
  } = useSelector((state) => state.plan);
  const [activeSidebarComponent, setActiveSidebarComponent] = useState("map");
  const [isEditable, setIsEditable] = useState();
  const [isMyPlan, setIsMyPlan] = useState(false);
  const [detailsData, setDetailsData] = useState({});
  const [recommandData, setRecommandData] = useState({});
  const [addStepData, setAddStepData] = useState({});
  const [showCitySearch, setShowCitySearch] = useState(false);

  const cleanupRef = useRef(null);

  useEffect(() => {
    if (planId) {
      dispatch(fetchPlanByIdThunk(planId));
      return;
    }

    const prompt = searchParams.get("prompt");
    if (!prompt) {
      navigate("/");
      return;
    }

    dispatch(setGenerationInProgress());

    cleanupRef.current?.();
    cleanupRef.current = null;

    (async () => {
      const cleanup = await connectToPlanWebSocket(dispatch, prompt);
      cleanupRef.current = cleanup;
    })();

    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [dispatch, planId, searchParams, navigate]);

  useEffect(() => {
    if (generateStatus === "succeeded" && plan && plan.id && !planId) {
      navigate(`/plan/${plan.id}`, { replace: true });
    }
  }, [generateStatus, plan, planId, navigate]);

  useEffect(() => {
    if (planId) {
      dispatch(fetchPlanByIdThunk(planId));
    }
  }, [dispatch, planId]);

  const itineraryStatusRef = useRef(null);
  useEffect(() => {
    if (generateStatus === "generating" && itineraryStatusRef.current) {
      itineraryStatusRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [generateStatus, plan]);

  useEffect(() => {
    if (plan?.user?.id) {
      const localUserId = localStorage.getItem("userId");
      if (plan.user.id.toString() === localUserId) {
        setIsMyPlan(true);
        if (isEditable === undefined) {
          setIsEditable(true);
        }
      } else {
        setIsMyPlan(false);
        setIsEditable(false);
      }
    }
  }, [plan]);

  // Enhanced setActiveComponent to handle place selection from RightSidebar
  const handleSetActiveComponent = (componentId, data) => {
    console.log("componentId: ", componentId, "data: ", data);
    switch (componentId) {
      case "details":
        setDetailsData(data);
        break;
      case "add":
        setAddStepData(data);
        break;
      case "recommand":
        setRecommandData(data);
        break;
      default:
        break;
    }
    setActiveSidebarComponent(componentId);
  };

  // Loading states
  if (loading || generateStatus === "loading") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
        <div className="relative flex justify-center items-center mb-6">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <Bot className="absolute text-primary w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-xl font-semibold text-primary mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 animate-bounce" />
          Cooking your perfect travel plan...
        </h2>
        <p className="text-muted-foreground max-w-md text-sm">
          Our AI is mixing ideas, maps, hotels, and dreams to craft a trip
          you’ll love.
        </p>
      </div>
    );
  }

  const handleUpdatePlan = (updatedFields) => {
    dispatch(updatePlanPartialThunk({ planId: plan.id, data: updatedFields }));
  };

  const handleToggleSave = () => {
    dispatch(toggleSaveThunk(plan.id));
  };

  const handleRatePlan = (rating, remove = false) => {
    if (remove) {
      dispatch(removeRatingThunk(plan.id));
    } else {
      dispatch(ratePlanThunk({ planId: plan.id, rating }));
    }
  };

  const handleDayTitleChange = (dayId, newTitle) => {
    dispatch(updateDayThunk({ dayId: dayId, newTitle: newTitle }));
  };

  const handleStepRemove = (stepId) => {
    dispatch(deleteStepThunk({ stepId: stepId }));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">
            Error loading plan: {error}
          </p>
          <div className="space-x-4">
            {planId && (
              
              <Button
              onClick={() =>
                planId ? dispatch(fetchPlanByIdThunk(planId)) : navigate("/")
              }
              >
              Try Again
            </Button>
            )}
            {!planId && (
              <Button variant="outline" onClick={() => navigate("/")}>
                Go Home
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
        <div className="relative flex justify-center items-center mb-6">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <Bot className="absolute text-primary w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-xl font-semibold text-primary mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 animate-bounce" />
          Loading ..
        </h2>
      </div>
    );
  }

  const itineraryData = {
    id: plan.id,
    title: plan.title || "Trip Plan",
    description: plan.description || "Your amazing travel itinerary",
    cost: plan.estimated_cost || 0,
    days: plan.no_of_days || 0,
    people: plan.no_of_people || 1,
    rating: plan.rating || 0,
    votes: plan.vote_count || 0,
    username: plan.user?.username || "Anonymous",
    isPrivate: plan.is_private || false,
    imageUrl: plan.image?.url,
    self_rate: plan.self_rating,
    saved: plan.is_saved,
    editable: isEditable,
    isMyPlan: isMyPlan,
    changeIsEditable: setIsEditable,
    onUpdatePlan: handleUpdatePlan,
    onToggleSave: handleToggleSave,
    onRatePlan: handleRatePlan,
  };

  return (
    <div className="h-screen bg-background pt-[72px] overflow-hidden">
      <div className="flex h-full">
        <div className="w-[55%] bg-travel-gray/30 overflow-y-auto">
          <div className="p-6">
            <div className="mb-8">
              <ItineraryCard {...itineraryData} />
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 relative">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Day by Day Timeline</h2>
                <div className="relative text-sm">
                  <button
                    onClick={() => setShowCitySearch((prev) => !prev)}
                    className="flex cursor-pointer items-center gap-1 hover:text-primary"
                  >
                    <span className="underline underline-offset-2">
                      Start: {plan.start_city?.name || "Select"}
                    </span>
                  </button>
                  {showCitySearch && isEditable && (
                    <StartCitySelector
                      handleUpdatePlan={handleUpdatePlan}
                      setShowCitySearch={setShowCitySearch}
                    />
                  )}
                </div>
              </div>

              {plan.days && plan.days.length > 0 ? (
              <>
                <DayTimeline
                  planData={plan}
                  addStepData={addStepData}
                  isEditable={isEditable}
                  onSetActiveComponent={handleSetActiveComponent}
                  onTitleEdit={handleDayTitleChange}
                  onStepRemove={handleStepRemove}
                />
                {generateStatus === "generating" && (
                  <div
                    ref={itineraryStatusRef}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Generating your itinerary...
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {generateStatus === "generating" ? (
                  <div
                    ref={itineraryStatusRef}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Building your itinerary...
                  </div>
                ) : (
                  isEditable && (
                    <AddDayComponent
                      planData={plan}
                      dayIndex={-1}
                      addStepData={addStepData}
                      onSetActiveComponent={handleSetActiveComponent}
                    />
                  )
                )}
              </div>
            )}

            </div>
          </div>
        </div>

        <div className="w-[45%] border-l border-border">
          <RightSidebar
            plan_id={plan.id}
            activeComponent={activeSidebarComponent}
            setActiveComponent={handleSetActiveComponent}
            addStepData={addStepData}
            detailsData={detailsData}
            recommandData={recommandData}
            mapData={transformMapData(plan.days)}
            isEditable={isEditable}
          />
        </div>
      </div>
    </div>
  );
};

export default Plan;
