import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPlansThunk } from "../../features/plan/PlanSlice";
import { useNavigate } from "react-router-dom";
import PromptInput from "../../components/HomeComp/PromptInput";
import { fetchMyPlansThunk } from "../../features/plan/MyPlanSlice";
import { LoginModal } from "../../components/AuthComp/LoginModal";
import PlansSection from "../../components/HomeComp/PlanSection";

export const Home = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Separate search and filter states for each section
  const [myPlansSearch, setMyPlansSearch] = useState("");
  const [myPlansCategory, setMyPlansCategory] = useState("recent");
  const [communityPlansSearch, setCommunityPlansSearch] = useState("");
  const [communityPlansCategory, setCommunityPlansCategory] =
    useState("recent");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    list: plans,
    page,
    size,
    total,
    fetchStatus: communityFetchStatus,
  } = useSelector((state) => state.plan);
  const {
    list: myPlans,
    page: myPage,
    size: mySize,
    total: myTotal,
    fetchStatus,
  } = useSelector((state) => state.myPlan);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Helper function to get sort parameters from category
  const getSortParams = (category) => {
    switch (category) {
      case "recent":
        return { sort_by: "created_at", order: "desc" };
      case "popular":
        return { sort_by: "vote_count", order: "asc" };
      case "rating":
        return { sort_by: "rating", order: "asc" };
      default:
        return { sort_by: "created_at", order: "desc" };
    }
  };

  // Debounce search for community plans
  useEffect(() => {
    const handler = setTimeout(() => {
      const sortParams = getSortParams(communityPlansCategory);
      dispatch(
        fetchAllPlansThunk({
          page: 1,
          size: 9,
          search: communityPlansSearch,
          ...sortParams,
        })
      );
    }, 500); // 500ms delay

    return () => clearTimeout(handler); // cancel previous timeout if search changes
  }, [communityPlansSearch, communityPlansCategory, dispatch]);

  // Debounce search for my plans
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const handler = setTimeout(() => {
      const sortParams = getSortParams(myPlansCategory);
      dispatch(
        fetchMyPlansThunk({
          page: 1,
          size: 6,
          search: myPlansSearch,
          ...sortParams,
        })
      );
    }, 500); // 500ms delay

    return () => clearTimeout(handler);
  }, [myPlansSearch, myPlansCategory, isAuthenticated, user, dispatch]);

  // Handle Plan Click
  const handlePlanClick = (planId) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      navigate(`/plan/${planId}`);
    }
  };

  // Handle prompt submit
  const handlePromptSubmit = (prompt) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      const encodedPrompt = encodeURIComponent(prompt);
      navigate(`/plan?prompt=${encodedPrompt}`);
    }
  };

  // Handle pagination for my plans
  const handleMyPlansPageChange = (newPage) => {
    if (isAuthenticated && user?.id) {
      const sortParams = getSortParams(myPlansCategory);
      dispatch(
        fetchMyPlansThunk({
          page: newPage,
          size: mySize,
          search: myPlansSearch,
          ...sortParams,
        })
      );
    }
  };

  // Handle pagination for community plans
  const handleCommunityPlansPageChange = (newPage) => {
    const sortParams = getSortParams(communityPlansCategory);
    dispatch(
      fetchAllPlansThunk({
        page: newPage,
        size: size,
        search: communityPlansSearch,
        ...sortParams,
      })
    );
  };

  const closeModal = () => setShowLoginModal(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header Section */}
      <div className="relative bg-white">
        {/* Subtle background element */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/30 to-white"></div>

        <div className="relative mx-auto px-6 py-16">
          <PromptInput onSubmit={handlePromptSubmit} />
        </div>
      </div>

      {/* Plans Sections */}
      <div className="max-w-6xl mx-auto px-6 pb-12 space-y-8 pt-8">
        {/* User Plans Section - Only show when logged in */}
        {isAuthenticated && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <PlansSection
              title="Your Plans"
              plans={myPlans}
              count={myTotal}
              currentPage={myPage}
              totalPages={Math.ceil(myTotal / mySize)}
              isLoading={fetchStatus === "loading"}
              onPlanClick={handlePlanClick}
              onPageChange={handleMyPlansPageChange}
              searchQuery={myPlansSearch}
              onSearchChange={setMyPlansSearch}
              selectedCategory={myPlansCategory}
              onCategoryChange={setMyPlansCategory}
              showFilter={true}
              showSearch={true}
              emptyStateProps={{
                title: "You have no plans yet",
              }}
              skeletonCount={6}
              gridCols="md:grid-cols-2 lg:grid-cols-3"
            />
          </div>
        )}

        {/* Community Plans Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <PlansSection
            title="Community Plans"
            subtitle="Discover curated itineraries from fellow travelers"
            plans={plans}
            count={total}
            currentPage={page}
            totalPages={Math.ceil(total / size)}
            isLoading={communityFetchStatus === "loading"}
            onPlanClick={handlePlanClick}
            onPageChange={handleCommunityPlansPageChange}
            searchQuery={communityPlansSearch}
            onSearchChange={setCommunityPlansSearch}
            selectedCategory={communityPlansCategory}
            onCategoryChange={setCommunityPlansCategory}
            showFilter={true}
            showSearch={true}
            emptyStateProps={{
              title: "No Community Plans Yet",
            }}
            skeletonCount={9}
            gridCols="md:grid-cols-2 lg:grid-cols-3"
          />
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={closeModal} />
    </div>
  );
};
