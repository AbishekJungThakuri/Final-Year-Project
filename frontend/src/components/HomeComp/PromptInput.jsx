import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { generatePlanThunk } from '../../features/plan/AiplanSlice';

const PromptInput = () => {
  const [input, setInput] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: plan, generateStatus } = useSelector((state) => state.plan);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (trimmed) {
      dispatch(generatePlanThunk(trimmed));
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  useEffect(() => {
    if (generateStatus === 'succeeded' && plan?.id) {
      navigate(`/plan/${plan.id}`);
    }
  }, [generateStatus, plan, navigate]);

  return (
    <div className="text-center mt-30">
      <h1 className="text-2xl font-semibold">
        Plan your <span className="text-red-500">Perfect Trip</span> to Nepal{' '}
        <span className="text-orange-400">Effortlessly!</span>
      </h1>
      <input
        type="text"
        value={input}
        placeholder="Give a prompt..."
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-1/2 p-3 mt-10 border rounded-xl"
      />
    </div>
  );
};

export default PromptInput;
