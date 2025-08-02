import ItineraryCard from "@/components/PlanComp/ItineraryCard";
import DayTimeline from "@/components/PlanComp/DayTimeline";
import RightSidebar from "@/components/PlanComp/RightSidebar";
import { Delete, Plus, Trash, Sparkles, Map, Bot } from "lucide-react";
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
} from "../../features/plan/AiplanSlice";
import { fetchCitiesThunk } from "../../features/plan/LocationSlice";
import {
  connectToPlanWebSocket,
  disconnectPlanWebSocket,
} from "../../features/plan/PlanWebsocket";

const Plan = () => {
  const { id: planId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    data: plan,
    generateStatus,
    editStatus,
    loading,
    error,
  } = useSelector((state) => state.plan);
  const [activeSidebarComponent, setActiveSidebarComponent] = useState("chat");
  const [showAddDayInput, setShowAddDayInput] = useState(null); // Track which day's add input is showing
  const [isEditable, setIsEditable] = useState(false);
  const [isMyPlan, setIsMyPlan] = useState(false);
  const [newDayTitle, setNewDayTitle] = useState("");
  const [detailsData, setDetailsData] = useState({});
  const [chatData, setChatData] = useState({});
  const [recommandData, setRecommandData] = useState({})
  const [addStepData, setAddStepData] = useState({});
  const [citySearch, setCitySearch] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showCitySearch, setShowCitySearch] = useState(false);

  const cleanupRef = useRef(null);

  useEffect(() => {
    if (planId) {
      dispatch(fetchPlanByIdThunk(planId));
    } else {
      const prompt = searchParams.get("prompt");
      if (!prompt) {
        navigate("/");
        return;
      }
      const token = localStorage.getItem("token");
      dispatch(setGenerationInProgress());
      const cleanup = connectToPlanWebSocket(dispatch, prompt, token);
      cleanupRef.current = cleanup;
    }

    // Cleanup function
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [dispatch, planId, searchParams, navigate]);

  useEffect(() => {
    if (generateStatus === "succeeded" && plan && plan.id && !planId) {
      navigate(`/plan/${plan.id}`, { replace: true });
    }
  }, [generateStatus, plan, planId, navigate]);

  useEffect(() => {
    if (plan?.user?.id) {
      const localUserId = localStorage.getItem("user_id");
      if(plan.user.id.toString() === localUserId){
        setIsMyPlan(true);
        setIsEditable(true);
      }
    }
  }, [plan]);

  const { cities = [] } = useSelector((state) => state.location || {});
  useEffect(() => {
    setCityOptions(cities);
  }, [cities]);

  // Enhanced setActiveComponent to handle place selection from RightSidebar
  const handleSetActiveComponent = (componentId, data) => {
    console.log("componentId: ", componentId, "data: ", data);
    switch(componentId) {
      case 'details':
        setDetailsData(data);
        break;
      case 'chat':
        setChatData(data);
        break;
      case 'add':
        setAddStepData(data);
        break;
      case 'recommand':
        setRecommandData(data);
        break;
      }
    setActiveSidebarComponent(componentId);
  };

  const getPrevCityId = (plan, dayIndex) => {
    if (dayIndex === 0) return plan.start_city.id;
  
    for (let i = dayIndex - 1; i >= 0; i--) {
      const steps = plan.days[i]?.steps;
      if (steps && steps.length > 0) {
        return steps[steps.length - 1].city.id;
      }
    }
  
    return plan.start_city.id;
  };

  // Handle adding a new day
  const handleAddDay = async (afterDayIndex) => {
    if (!newDayTitle.trim()) return;

    const dayData = {
      plan_id: plan.id,
      index: afterDayIndex + 1,
      title: newDayTitle.trim(),
    };

    try {
      await dispatch(addDayThunk({ data: dayData })).unwrap();
      setShowAddDayInput(null);
      setNewDayTitle("");
    } catch (error) {
      console.error("Failed to add day:", error);
    }
  };

  // Handle Delete day
  const handleDeleteDay = async (dayId) => {
    console.log("Deleting day with ID:", dayId);
    try {
      await dispatch(deleteDayThunk({ dayId })).unwrap();
    } catch (error) {
      console.error("Failed to delete day:", error);
    }
  };

  // Handle canceling add day
  const handleCancelAddDay = () => {
    setShowAddDayInput(null);
    setNewDayTitle("");
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
            <Button
              onClick={() =>
                planId ? dispatch(fetchPlanByIdThunk(planId)) : navigate("/")
              }
            >
              {planId ? "Try Again" : "Go Home"}
            </Button>
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Plan not found</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

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
                      Start:{" "}
                      {selectedCity?.name || plan.start_city?.name || "Select"}
                    </span>
                  </button>
                  {showCitySearch && isEditable && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                      <input
                        type="text"
                        value={citySearch}
                        onChange={(e) => {
                          setCitySearch(e.target.value);
                          dispatch(
                            fetchCitiesThunk({ search: e.target.value })
                          );
                        }}
                        placeholder="Search city..."
                        autoFocus
                        className="w-full z-100 border-b border-gray-200 px-3 py-2 text-sm focus:outline-none"
                      />
                      {cityOptions.length > 0 ? (
                        <ul className="max-h-48 overflow-y-auto">
                          {cityOptions.map((city) => (
                            <li
                              key={city.id}
                              onClick={() => {
                                setSelectedCity(city);
                                setCitySearch("");
                                setCityOptions([]);
                                setShowCitySearch(false);
                                handleUpdatePlan({ start_city_id: city.id });
                              }}
                              className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                            >
                              {city.name}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-2 text-xs text-gray-400">
                          No results
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {plan.days && plan.days.length > 0 ? (
                plan.days.map((day, dayIndex) => (
                  <div key={day.id || dayIndex}>
                    <DayTimeline
                      dayNumber={dayIndex + 1}
                      dayData={day}
                      steps={day.steps || []}
                      onSetActiveComponent={handleSetActiveComponent}
                      addStepData={addStepData}
                      onTitleEdit={handleDayTitleChange}
                      onStepRemove={handleStepRemove}
                      isEditable={isEditable}
                      prevCityId={getPrevCityId(plan, dayIndex)}
                      />

                    {/* Add Day Button - Show after each day */}
                    {isEditable && (
                      <div className="group relative mb-20">
                        {showAddDayInput === dayIndex ? (
                          <div className="bg-gray-50 rounded-lg p-4 border-2  border-gray-300">
                            <input
                              type="text"
                              value={newDayTitle}
                              onChange={(e) => setNewDayTitle(e.target.value)}
                              placeholder={`Enter title for Day ${
                                dayIndex + 2
                              }`}
                              className="w-full p-2 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-primary"
                              autoFocus
                            />
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleAddDay(dayIndex)}
                                disabled={!newDayTitle.trim()}
                              >
                                Add Day
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelAddDay}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-center my-0 relative">
                              <Button
                                variant="outline"
                                size="sm"
                                className={`absolute opacity-0 z-10 -top-9 w-50 border-2 cursor-pointer text-muted-foreground shadow-md hover:opacity-100 ${
                                  day.steps.length === 0 ||
                                  dayIndex === plan.days.length - 1 ||
                                  (addStepData &&
                                    addStepData.dayId === day.id &&
                                    addStepData.index === null)
                                    ? "border-foreground/50 text-primary opacity-100"
                                    : ""
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSetActiveComponent(
                                    "add",
                                    {
                                    dayId: day.id,
                                    index: null,
                                    cityId: getPrevCityId(plan, dayIndex),
                                  }
                                  );
                                }}
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add Step
                              </Button>
                            </div>
                            <div
                              className={`absolute gap-2 flex left-1/2 -translate-x-1/2 z-10 transition-opacity duration-200 opacity-100`}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowAddDayInput(dayIndex)}
                                className="w-50 border-2 cursor-pointer text-muted-foreground hover:text-primary hover:border-primary shadow-md"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Day
                              </Button>
                              {day.can_delete && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteDay(day.id)}
                                  className="w-20  border-2 cursor-pointer text-muted-foreground hover:text-primary hover:border-red-400 hover:text-red-600 shadow-md"
                                >
                                  <Trash className="h-4 w-4 mr-2" />
                                </Button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {generateStatus === "generating" ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Building your itinerary...
                    </div>
                  ) : (
                    isEditable && (
                      <div className="text-center py-8 text-muted-foreground">
                        <div className="group relative mb-20">
                          {showAddDayInput === 0 ? (
                            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-300">
                              <input
                                type="text"
                                value={newDayTitle}
                                onChange={(e) => setNewDayTitle(e.target.value)}
                                placeholder={`Enter title for Day ${1}`}
                                className="w-full p-2 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                autoFocus
                              />
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleAddDay(-1)}
                                  disabled={!newDayTitle.trim()}
                                >
                                  Add Day
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleCancelAddDay}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="absolute gap-2 flex left-1/2 -translate-x-1/2 z-10 transition-opacity duration-200 opacity-100">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowAddDayInput(0)}
                                className="w-50 border-2 cursor-pointer text-muted-foreground hover:text-primary hover:border-primary shadow-md"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Day
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
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
            chatData={chatData}
            recommandData={recommandData}
          />
        </div>
      </div>
    </div>
  );
};

export default Plan;
