import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPlansThunk } from '../../features/plan/PlanSlice';
import { useNavigate } from 'react-router-dom';
import PromptInput from '../../components/HomeComp/PromptInput';
import { getUser } from '../../features/plan/userSlice';
import { LoginModal } from '../../components/AuthComp/LoginModal';
import { PlanCard } from '../../components/HomeComp/PlanCard';

export const Home = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list: plans, fetchStatus } = useSelector((state) => state.plan);
  const { userplans } = useSelector((state) => state.user);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Fetch community plans (always available)
  useEffect(() => {
    dispatch(fetchAllPlansThunk());
  }, [dispatch]);

  // Fetch user plans only if logged in
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(getUser(user.id));
    }
  }, [isAuthenticated, user, dispatch]);

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

  const closeModal = () => setShowLoginModal(false);

  // Enhanced Skeleton Loader Component
  const SkeletonCard = () => (
    <div className="animate-pulse">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-50 h-full">
        <div className="h-48 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 relative">
          <div className="absolute top-4 right-4 w-16 h-8 bg-gray-300 rounded-full"></div>
        </div>
        <div className="p-6">
          <div className="h-6 bg-gray-200 rounded-lg mb-3"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Empty State Component
  const EmptyState = ({ title, description, showButton = false }) => (
    <div className="text-center py-20">
      <div className="max-w-md mx-auto">
        {/* Animated Icon */}
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-indigo-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
        {showButton && (
          <button 
            onClick={() => document.querySelector('input')?.focus()}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
          >
            Start Planning
          </button>
        )}
      </div>
    </div>
  );

  // Section Header Component
  const SectionHeader = ({ title, count, subtitle, showFilter = false }) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {title}
          </h2>
          {count !== undefined && (
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
              {count}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-gray-500 text-sm">{subtitle}</p>
        )}
      </div>
      {showFilter && (
        <div className="flex gap-2">
          {['all', 'recent', 'popular'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-indigo-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-white">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-white to-purple-50"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PromptInput onSubmit={handlePromptSubmit} />
        </div>
      </div>

      {/* Plans Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {fetchStatus === 'loading' ? (
          <div className="space-y-16">
            {/* Skeleton for user plans */}
            {isAuthenticated && (
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-6 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <SkeletonCard key={`user-skeleton-${i}`} />
                  ))}
                </div>
              </div>
            )}
            
            {/* Skeleton for community plans */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-56 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-6 w-8 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(8)].map((_, i) => (
                  <SkeletonCard key={`community-skeleton-${i}`} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            {/* User Plans Section - Only show when logged in */}
            {isAuthenticated && (
              <div className="animate-in slide-in-from-bottom-4 duration-700">
                <SectionHeader 
                  title="Your Plans" 
                  count={userplans?.length || 0}
                  subtitle="Your personalized travel itineraries"
                />
                
                {userplans && userplans.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userplans.map((plan, index) => (
                      <div 
                        key={plan.id}
                        className="animate-in slide-in-from-bottom-4 duration-500"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <PlanCard
                          plan={plan}
                          onClick={() => handlePlanClick(plan.id)}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="Start Your Journey"
                    description="Create your first travel plan by describing your dream trip in the prompt box above!"
                    showButton={true}
                  />
                )}
              </div>
            )}

            {/* Community Plans Section */}
            <div className="animate-in slide-in-from-bottom-4 duration-700 delay-300">
              {Array.isArray(plans) && plans.length > 0 ? (
                <>
                  <SectionHeader 
                    title="Community Plans" 
                    count={plans.length}
                    subtitle="Discover amazing itineraries shared by fellow travelers"
                    showFilter={true}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {plans.map((plan, index) => (
                      <div 
                        key={plan.id}
                        className="animate-in slide-in-from-bottom-4 duration-500"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <PlanCard
                          plan={plan}
                          onClick={() => handlePlanClick(plan.id)}
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <EmptyState
                  title="No Community Plans Yet"
                  description="Be the first to share an amazing travel plan with the community!"
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={closeModal} />
    </div>
  );
};