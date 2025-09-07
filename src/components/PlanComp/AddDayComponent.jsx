import { Button } from "@/components/ui/button";
import { Plus, Trash, Sparkles, Bot } from "lucide-react";
import { useState } from "react";
import { addDayThunk, deleteDayThunk } from "../../features/plan/PlanSlice";
import { useDispatch, useSelector } from "react-redux";

const AddDayComponent = ({
  planData,
  dayIndex,
  addStepData,
  onSetActiveComponent,
}) => {
  // Handle adding a new day
  const dispatch = useDispatch();
  const [showAddDayInput, setShowAddDayInput] = useState(null); 
  const [newDayTitle, setNewDayTitle] = useState("");

  const day = planData?.days[dayIndex];

  const getNextStepId = (planData, dayIndex) => {
    for (let i = dayIndex; i < planData.days.length; i++) {
      const steps = planData.days[i].steps;
      if (steps.length > 0) {
        return steps[0].id; // first step of that day
      }
    }
    return null; 
  };

  
  const getPrevCityId = (planData, dayIndex) => {
    for (let i = dayIndex; i >= 0; i--) {
      const steps = planData.days[i].steps;
      if (steps.length > 0) {
        console.log("Index: ", dayIndex, "City: ", steps[steps.length - 1].city.id);
        return steps[steps.length - 1].city.id; 
      }
    }
    return planData.start_city?.id;
  };
  const nextStepId = getNextStepId(planData, dayIndex + 1); 
  const prevCityId = getPrevCityId(planData, dayIndex);

  const handleAddDay = async (afterDayIndex) => {
    if (!newDayTitle.trim()) return;

    const dayData = {
      plan_id: planData.id,
      index: afterDayIndex + 1,
      title: newDayTitle.trim(),
    };

    try {
      let nextDayId = null;
      if (afterDayIndex !== null && afterDayIndex <= planData.days.length - 1) {
        nextDayId = planData.days[afterDayIndex + 1]?.id;
        dayData.next_plan_day_id = nextDayId;
      }
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

  return (
    <>
      {dayIndex!=-1 ? (
        <div className="group relative mb-20">
          {showAddDayInput === dayIndex ? (
            <div className="bg-gray-50 rounded-lg p-4 border-2  border-gray-300">
              <input
                type="text"
                value={newDayTitle}
                onChange={(e) => setNewDayTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newDayTitle.trim()) {
                    handleAddDay(dayIndex !== -1 ? dayIndex : -1);
                  }
                }}
                placeholder={`Enter title for Day ${dayIndex + 2}`}
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
                    dayIndex === planData.days.length - 1 ||
                    (addStepData &&
                      addStepData.dayId === day.id &&
                      addStepData.index === null)
                      ? "border-foreground/50 text-primary opacity-100"
                      : ""
                  }`}
                  onClick={(e) => {
                    console.log("day: ", day);
                    e.stopPropagation();
                    onSetActiveComponent("add", {
                      dayId: day.id,
                      index: null,
                      nextStepId: nextStepId,
                      cityId: prevCityId,
                    });
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
      ) : (
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
      )}
    </>
  );
};

export default AddDayComponent;
