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
  Camera,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { deletePlanThunk, duplicatePlanThunk, fetchPlanByIdThunk } from "../../features/plan/PlanSlice";
import { useSelector } from "react-redux";

// Import the uploadImage action from your Redux slice
import { uploadImage } from "../../features/image/imageSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Add this import

const formatCurrency = (amount) => `NPR. ${amount.toLocaleString("en-IN")}`;

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, confirmButtonClass }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-1000 bg-black/50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg pointer-events-auto">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className={confirmButtonClass}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};


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
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const imageUploadLoading = false;
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Add this hook
  
  useEffect(() => setSaved(savedProp), [savedProp]);
  useEffect(() => {
    setEditTitle(title);
  }, [id]);
  
  useEffect(() => {
    setEditDescription(description);
  }, [id]);
  
  useEffect(() => {
    setEditPeople(people);
  }, [id]);



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
    setShowDuplicateModal(true);
  };

  const confirmDuplicate = async () => {
    setIsLoading(true);
    setShowOptions(false);
    try {
      const result = await dispatch(duplicatePlanThunk(id)).unwrap();
      dispatch(fetchPlanByIdThunk(result.id));
      window.location.href = `/plan/${result.id}`;
    } catch (error) {
      console.error("Failed to duplicate plan:", error);
    } finally {
      setIsLoading(false);
      setShowDuplicateModal(false);
    }
  };

  const handleDeletePlan = async () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    setShowOptions(false);
    try {
      await dispatch(deletePlanThunk(id)).unwrap();
      // Navigate to home page
      navigate('/');
    } catch (error) {
      console.error("Failed to delete plan:", error);
      // Optionally show an error message to user
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleImageUpload = async (file) => {    
    try {
      // Import uploadImage action (you'll need to import this at the top of your component)
      const uploadResult = await dispatch(uploadImage({ 
        file, 
        category: 'place' // or whatever category you want
      })).unwrap();
      
      // For now, using a placeholder - uncomment above when you import uploadImage
      console.log("File selected:", file.name);
      
      // Uncomment this when you have uploadImage imported:
      await onUpdatePlan({ image_id: uploadResult.id });
      
      setShowImageUpload(false);
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showOptions && !event.target.closest('.options-menu')) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showOptions]);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden mb-6 border">
        {/* Cover Image */}
        <div className="relative h-48 group">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Image Upload Overlay - Only show on hover and if editable */}
          {editable && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={imageUploadLoading}
                className="bg-white/20 cursor-pointer hover:bg-white/30 text-white rounded-full p-3 transition-all duration-200 flex items-center gap-2"
              >
                {imageUploadLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <Camera className="h-5 w-5" />
                )}
                <span className="text-sm font-medium">Change Cover</span>
              </button>
            </div>
          )}
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

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
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <MoreVertical className="h-4 w-4" />
              )}
            </Button>
          </div>

          {showOptions && (
            <div className="options-menu z-50 absolute right-4 top-14 bg-white border border-gray-200 rounded-md shadow-lg w-44 p-2 space-y-2">
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
                onClick={handleDuplicatePlan}
                disabled={isLoading}
              >
                <Repeat className="h-4 w-4" /> Duplicate plan
              </Button>
              {isMyPlan && (  
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-left text-red-600 hover:text-red-700"
                  onClick={handleDeletePlan}
                  disabled={isLoading}
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
          {!isPrivatePlan && (
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
          )}
          

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

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Plan"
        message="Are you sure you want to delete this plan? This action cannot be undone."
        confirmText="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
      />

      {/* Duplicate Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDuplicateModal}
        onClose={() => setShowDuplicateModal(false)}
        onConfirm={confirmDuplicate}
        title="Duplicate Plan"
        message="This will create a copy of this plan."
        confirmText="Duplicate"
        confirmButtonClass="bg-black hover:bg-gray-800 text-white"
      />
    </>
  );
};

export default ItineraryCard;