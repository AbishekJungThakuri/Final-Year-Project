import { Hotel } from "lucide-react";
import { Button } from "@/components/ui/button";
import PlanStepCard from "./PlanStepCard";
import AddDayComponent from "./AddDayComponent"; 
import { useDispatch } from "react-redux";
import { reorderStepThunk } from "../../features/plan/PlanSlice";


const DayTimeline = ({
  planData,
  addStepData,
  onSetActiveComponent,
  onStepRemove,
  onTitleEdit,
  isEditable = true,
  onViewMap = null,
}) => {
  const allSteps = planData.days.flatMap((d) => d.steps);
  const dispatch = useDispatch();

  const handleAccomodationClick = (dayId) => {
    onSetActiveComponent("recommand", {
      category: "accommodation",
      planDayId: dayId,
    });
  };

  const handleReorderStep = (stepId, nextStepId) => {
    dispatch(reorderStepThunk({ stepId, nextStepId }));
  };


  return (
    <div>
      {planData.days.map((dayData, dayIndex) => (
        <div key={dayData.id || dayIndex} className="mb-6">
          {/* Day header */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
              {dayIndex + 1}
            </div>
            <div
              contentEditable={isEditable}
              suppressContentEditableWarning
              spellCheck={false}
              onBlur={(e) => {
                const newTitle = e.target.textContent.trim();
                if (newTitle && newTitle !== dayData?.title) {
                  onTitleEdit?.(dayData.id, newTitle);
                }
              }}
              className={`text-lg font-semibold outline-none border-b border-transparent ${
                isEditable ? "cursor-text" : "cursor-default"
              }`}
            >
              {dayData?.title || `Day ${dayIndex + 1}`}
            </div>

            <div className="ml-auto text-sm text-muted-foreground">
              {dayData.steps.length > 0 ? (
                <Button
                  size="sm"
                  onClick={() => handleAccomodationClick(dayData.id)}
                >
                  Accomodations
                  <Hotel className="w-3 h-3 ml-1" />
                </Button>
              ) : (
                "No steps yet"
              )}
            </div>
          </div>

          {/* Steps */}
          <div className="ml-4 space-y-4 mt-4 relative">
            {dayData.steps.map((step, i) =>
              PlanStepCard({
                step,
                dayData,
                planData,
                i,
                allSteps,
                onSetActiveComponent,
                onStepRemove,
                addStepData,
                isEditable,
                onViewMap,
              })
            )}
          </div>

          {/* Add Day Button - after each day */}
          {isEditable && (
            <div className="mt-6">
            <AddDayComponent
              planData={planData}
              dayIndex={dayIndex}
              addStepData={addStepData}
              onSetActiveComponent={onSetActiveComponent}
            />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DayTimeline;