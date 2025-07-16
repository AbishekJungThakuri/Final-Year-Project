import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  editPlanThunk,
  deletePlanThunk,
  fetchPlanByIdThunk,
} from '../features/plan/AiplanSlice';

import AddDayForm from '../components/AiPlan/EditplanCom/AddDayForm';
import AddStepForm from '../components/AiPlan/EditplanCom/AddStepForm';

const EditPlan = () => {
  const { id: planId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: plan, editStatus, fetchStatus } = useSelector((state) => state.plan);

  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    dispatch(fetchPlanByIdThunk(planId));
  }, [dispatch, planId]);

  const handlePromptSubmit = async () => {
    const trimmed = prompt.trim();
    if (!trimmed) return;

    setChatHistory((prev) => [...prev, { role: 'user', content: trimmed }]);
    setPrompt('');

    const res = await dispatch(editPlanThunk({ planId, prompt: trimmed }));
    if (res.meta.requestStatus === 'fulfilled') {
      setChatHistory((prev) => [
        ...prev,
        { role: 'assistant', content: res.payload.description || 'Plan updated!' },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlePromptSubmit();
    }
  };

  const handleDelete = () => {
    dispatch(deletePlanThunk(planId)).then(() => {
      navigate('/');
    });
  };

  if (fetchStatus === 'loading' || !plan) return <p className="text-center mt-10">Loading plan...</p>;

  // Get latest dayId
  const latestDayId = plan.days?.[plan.days.length - 1]?.id;

  return (
    <div className="flex h-screen">
      {/* Left - Chat Interface */}
      <div className="w-1/3 h-fit border-r p-6 flex flex-col justify-between bg-white">
        <div className="space-y-4 overflow-y-auto mb-4 pr-2">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`max-w-xs px-4 py-2 rounded-lg shadow-sm text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white self-end ml-auto'
                  : 'bg-gray-200 text-gray-800 self-start mr-auto'
              }`}
            >
              {msg.content}
            </div>
          ))}
          {editStatus === 'loading' && (
            <div className="text-gray-600 text-sm animate-pulse">Typing...</div>
          )}
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a prompt and press Enter..."
          rows={3}
          className="w-full p-3 border rounded-xl"
        />
      </div>

      {/* Right - Plan Viewer + Controls */}
      <div className="w-2/3 overflow-y-auto p-6 bg-gray-50 space-y-6">
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h1 className="text-2xl font-bold">{plan.title}</h1>
          <p className="text-gray-700">{plan.description}</p>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded mt-4"
          >
            Delete Plan
          </button>
        </div>

        {plan.image?.url && (
          <div className="flex justify-center">
            <img
              src={plan.image.url}
              alt="Plan"
              className="rounded-xl shadow w-full max-w-md object-cover"
            />
          </div>
        )}

        {/* Display All Days */}
        <div className="space-y-6">
          {plan.days?.map((day) => (
            <div
              key={day.id}
              className="bg-white p-4 rounded-xl shadow border-l-4 border-yellow-500"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">{day.title}</h3>
              <ul className="list-disc ml-6 mt-2 text-gray-700">
                {day.steps?.map((step) => (
                  <li key={step.id} className="mb-1">
                    <strong>{step.title}</strong> – Rs{' '}
                    <span className="text-green-600 font-semibold">
                      {step.cost?.toFixed(2) || '0.00'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

           {/* AddDayForm (at bottom) */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <AddDayForm planId={plan.id} />
        </div>
        
        {/* AddStepForm (single – add to latest day) */}
        {latestDayId && (
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Add Step to Latest Day</h3>
            <AddStepForm dayId={latestDayId} planId={plan.id} />
          </div>
        )}

       
      </div>
    </div>
  );
};

export default EditPlan;
