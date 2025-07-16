import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPlansThunk } from '../../features/plan/AiplanSlice';
import { useNavigate } from 'react-router-dom';

import PlanCard from '../../components/AiPlan/PlanCard';
import ChatInput from '../../components/AiPlan/EditplanCom/ChatInput';

export const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: plans, fetchStatus } = useSelector((state) => state.plan);

  useEffect(() => {
    dispatch(fetchAllPlansThunk());
  }, [dispatch]);

  return (
    <div className="p-4">
      <ChatInput />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-10">
        {fetchStatus === 'loading' && <p>Loading plans...</p>}
         {Array.isArray(plans) && plans.length > 0 ? (
             plans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} />
             )
            )
         ) : (  
          <p className="text-center col-span-full text-gray-500">No plans available.</p>
         )}
      </div>
    </div>
  );
};
