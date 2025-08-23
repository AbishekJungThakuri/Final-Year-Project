import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPlansThunk } from '../../features/plan/PlanSlice';
import { useNavigate } from 'react-router-dom';
import PlanCard from '../../components/HomeComp/PlanCard';
import PromptInput from '../../components/HomeComp/PromptInput';



export const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: plans, fetchStatus } = useSelector((state) => state.plan);

  useEffect(() => {
    dispatch(fetchAllPlansThunk());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PromptInput />
        </div>
      </div>

      {/* Plans Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {fetchStatus === 'loading' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Loading Skeletons */}
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : Array.isArray(plans) && plans.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Your Travel Plans
              </h2>
              <div className="text-sm text-gray-500">
                {plans.length} plan{plans.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <svg className="w-24 h-24 mx-auto text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No plans yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start planning your perfect trip to Nepal by entering a prompt above!
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600">
                  💡 Try something like: "Plan a 7-day cultural tour of Kathmandu and Pokhara"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};