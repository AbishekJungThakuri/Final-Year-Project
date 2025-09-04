import React, { useState, useEffect, useRef } from "react";
import {
  Star,
  Users,
  Calendar,
  User,
  Bookmark,
  MoreVertical,
  Copy,
  Trash2,
  Repeat,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const formatCurrency = (amount) => `NPR. ${amount.toLocaleString("en-IN")}`;

const ItineraryCard = ({
  id,
  title,
  description,
  cost,
  days,
  people,
  rating,
  votes: votesProp,
  username,
  isPrivate = false,
  imageUrl,
  self_rate,
  saved: savedProp,
  editable = true,
  changeIsEditable,
  onUpdatePlan,
  onToggleSave,
  onRatePlan,
  isMyPlan = false,
}) => {
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const [editPeople, setEditPeople] = useState(people);
  const [userRating, setUserRating] = useState(self_rate || 0);
  const [showRatingInput, setShowRatingInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(savedProp);
  const [votes, setVotes] = useState(votesProp);
  const [isVoated, setIsVoated] = useState(self_rate > 0);
  const [isPrivatePlan, setIsPrivatePlan] = useState(isPrivate);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => setSaved(savedProp), [savedProp]);
  const spanRef = useRef(null);

  const hasChanges =
    editTitle !== title ||
    editDescription !== description ||
    Number(editPeople) !== Number(people);

  const handleSaveEdit = async () => {
    if (!onUpdatePlan) return;
    setIsLoading(true);
    try {
      await onUpdatePlan({
        title: editTitle,
        description: editDescription,
        no_of_people: editPeople,
      });
    } catch (error) {
      console.error("Failed to update plan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const focusAtEnd = (el) => {
    el.focus();
    if (
      typeof window.getSelection !== "undefined" &&
      typeof document.createRange !== "undefined"
    ) {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const handleBadgeClick = () => {
    if (spanRef.current && editable) {
      focusAtEnd(spanRef.current);
    }
  };

  const handleInput = (e) => {
    let numericValue = e.target.textContent.replace(/\D/g, "");
    if (numericValue === "" || numericValue === "0") {
      e.target.textContent = "";
      return focusAtEnd(e.target);
    }
    e.target.textContent = numericValue;
    focusAtEnd(e.target);
  };

  const handleBlur = (e) => {
    let num = Number(e.target.textContent);
    if (isNaN(num) || num < 1) {
      num = 1;
    }
    setEditPeople(num);
    if (spanRef.current) {
      spanRef.current.textContent = String(num);
    }
  };

  const handleToggleSave = async () => {
    if (!onToggleSave) return;
    setIsLoading(true);
    try {
      await onToggleSave(id);
      setSaved((prev) => !prev);
    } catch (error) {
      console.error("Failed to toggle save:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRating = async (rating, remove = false) => {
    if (!onRatePlan) return;
    setIsLoading(true);
    try {
      await onRatePlan(rating, remove);
      if (remove) {
        setUserRating(0);
        if (isVoated) {
          setVotes(votes - 1);
          setIsVoated(false);
        }
      } else {
        if (!isVoated) {
          setVotes(votes + 1);
          setIsVoated(true);
        }
        setUserRating(rating);
      }
      setShowRatingInput(false);
    } catch (error) {
      console.error("Failed to rate plan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivateToggle = async (val) => {
    setIsPrivatePlan(val);
    if (!onUpdatePlan) return;
    try {
      await onUpdatePlan({ is_private: val });
    } catch (err) {
      console.error("Failed to update private status");
    }
  };

  const handleDuplicatePlan = async () => {
    try {
      await onUpdatePlan({ duplicate: true });
    } catch (err) {
      console.error("Failed to duplicate plan");
    }
  };

  const renderStars = (rating, interactive = false) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-6 w-6 ${
              interactive ? "hover:text-yellow-400 cursor-pointer" : ""
            } ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
            onClick={() => interactive && setUserRating(i + 1)}
          />
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (hasChanges && !isLoading) {
      handleSaveEdit();
    }
  }, [hasChanges]);

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden mb-6 border">
      {/* Cover Image */}
      <div className="relative h-48">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Top-left: Save icon */}
        <div className="absolute top-4 left-4">
          <button
            onClick={handleToggleSave}
            disabled={isLoading}
            className="bg-black/30 cursor-pointer rounded-full p-2 hover:bg-black/50"
          >
            <Bookmark
              className={`h-4 w-4 ${
                saved ? "text-yellow-400 fill-current" : "text-white"
              }`}
            />
          </button>
        </div>

        {/* Top-right: Options */}
        <div className="absolute top-4 right-4">
          <Button
            size="icon"
            variant="ghost"
            className="bg-black/30 hover:bg-black/50 p-2 rounded-full text-white hover:text-white"
            onClick={() => setShowOptions(!showOptions)}
          >
            <MoreVertical ertical className="h-4 w-4" />
          </Button>
        </div>
        {showOptions && (
          <div className="z-50 absolute right-4 top-15 bg-white border border-gray-200 rounded-md shadow-md top-10 w-40  p-2 space-y-2">
            {isMyPlan && (
              <>
                <div className="flex pl-4 items-center justify-between">
                  <span className="text-sm">Readonly</span>
                  <Switch
                    checked={!editable}
                    onCheckedChange={() => changeIsEditable?.(!editable)}
                  />
                </div>
                <div className="flex pl-4 items-center justify-between">
                  <span className="text-sm">Private</span>
                  <Switch
                    checked={isPrivatePlan}
                    onCheckedChange={handlePrivateToggle}
                  />
                </div>
              </>
            )}
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-left"
              onClick={() => onDuplicate?.(id)}
            >
              <Repeat className="h-4 w-4" /> Duplicate plan
            </Button>
            {isMyPlan && (  
                <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-left text-red-600 hover:text-red-700"
                onClick={() => onDelete?.(id)}
                >
                <Trash2 className="h-4 w-4" /> Delete Plan
              </Button>
            )}
          </div>
        )}

        <div className="absolute bottom-4 left-4">
          <div
            contentEditable={editable}
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => setEditTitle(e.target.textContent)}
            className="text-xl font-semibold text-white outline-none border-b border-transparent"
          >
            {editTitle}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div
          contentEditable={editable}
          suppressContentEditableWarning
          spellCheck={false}
          onBlur={(e) => setEditDescription(e.target.textContent)}
          className="text-sm text-gray-600 outline-none border-b border-transparent"
        >
          {editDescription}
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-primary text-white">
            {formatCurrency(cost)}
          </Badge>
          <Badge variant="secondary" className="bg-primary text-white">
            <Calendar className="h-3 w-3 mr-1" />
            {days} days
          </Badge>
          <Badge
            variant="secondary"
            className="bg-primary text-white hover:bg-primary/90 cursor-pointer"
            onClick={handleBadgeClick}
          >
            <Users className="h-3 w-3 mr-1" />
            <span
              ref={spanRef}
              contentEditable={editable}
              suppressContentEditableWarning
              onInput={handleInput}
              onBlur={handleBlur}
              className="outline-none cursor-pointer"
              tabIndex={0}
            >
              {editPeople}
            </span>{" "}
            people
          </Badge>
        </div>

        {/* Rating */}
        <div className="space-y-1 border-t pt-2">
          {!showRatingInput && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {renderStars(rating)}
                <span className="text-sm text-gray-600">
                  {rating.toFixed(1)} ({votes} votes)
                </span>
                <button
                  className="text-xs text-blue-500 hover:underline cursor-pointer"
                  onClick={() => setShowRatingInput(true)}
                >
                  {isVoated ? "My rating" : "Vote now"}
                </button>
              </div>
            </div>
          )}

          {showRatingInput && (
            <div className="flex items-center gap-2">
              {renderStars(userRating, true)}
              <span className="text-sm text-gray-600">
                {rating.toFixed(1)} ({votes} votes)
              </span>
              <button
                className="text-xs text-blue-500 hover:underline cursor-pointer"
                onClick={() => handleRating(userRating)}
              >
                Submit
              </button>
              {isVoated && (
                <button
                  className="text-xs text-red-500 hover:underline cursor-pointer"
                  onClick={() => handleRating(userRating, true)}
                >
                  Remove
                </button>
              )}
              <button
                className="text-xs text-gray-500 hover:underline cursor-pointer"
                onClick={() => setShowRatingInput(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Avatar className="h-6 w-6">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>
              <User className="h-3 w-3" />
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">{username}</span>
        </div>
      </div>
    </div>
  );
};

export default ItineraryCard;
