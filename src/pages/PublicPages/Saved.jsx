import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchSavedPlansThunk } from '../../features/plan/SavedPlanSlice';
import { LoginModal } from '../../components/AuthComp/LoginModal';
import PlansSection from '../../components/HomeComp/PlanSection';

export const SavedPackage = () => {const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Separate search and filter states for each section
  const [myPlansSearch, setMyPlansSearch] = useState('');
  const [myPlansCategory, setMyPlansCategory] = useState('recent');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { list: myPlans, page: myPage, size: mySize, total: myTotal, fetchStatus } = useSelector((state) => state.savedPlan);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Helper function to get sort parameters from category
  const getSortParams = (category) => {
    switch (category) {
      case 'recent':
        return { sort_by: 'created_at', order: 'desc' };
      case 'popular':
        return { sort_by: 'vote_count', order: 'asc' };
      case 'rating':
        return { sort_by: 'rating', order: 'asc' };
      default:
        return { sort_by: 'created_at', order: 'desc' };
    }
  };


  // Fetch user plans only if logged in
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const sortParams = getSortParams(myPlansCategory);
      dispatch(fetchSavedPlansThunk({ 
        page: 1, 
        size: 12,
        search: myPlansSearch,
        ...sortParams
      }));
    }
  }, [isAuthenticated, user, dispatch, myPlansSearch, myPlansCategory]);

  // Handle Plan Click
  const handlePlanClick = (planId) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      navigate(`/plan/${planId}`);
    }
  };

  // Handle pagination for my plans
  const handleMyPlansPageChange = (newPage) => {
    if (isAuthenticated && user?.id) {
      const sortParams = getSortParams(myPlansCategory);
      dispatch(fetchMyPlansThunk({ 
        page: newPage, 
        size: mySize,
        search: myPlansSearch,
        ...sortParams
      }));
    }
  };

  const closeModal = () => setShowLoginModal(false);

  return (
    <div className="min-h-screen">
      <div className="mt-10 max-w-6xl mx-auto px-6 pb-12 space-y-8 pt-8">
        {isAuthenticated && (
          <div>
            <PlansSection
              title="Saved Plans"
              plans={myPlans}
              count={myTotal}
              currentPage={myPage}
              totalPages={Math.ceil(myTotal / mySize)}
              isLoading={fetchStatus === 'loading'}
              onPlanClick={handlePlanClick}
              onPageChange={handleMyPlansPageChange}
              searchQuery={myPlansSearch}
              onSearchChange={setMyPlansSearch}
              selectedCategory={myPlansCategory}
              onCategoryChange={setMyPlansCategory}
              showFilter={true}
              showSearch={true}
              emptyStateProps={{
                title: "You have no saved plans",
              }}
              skeletonCount={6}
              gridCols="md:grid-cols-2 lg:grid-cols-3"
            />
          </div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={closeModal} />
    </div>
  );
}
