import React, { useState, useEffect } from 'react';

const PromptInput = ({ onSubmit }) => {
  const [input, setInput] = useState('');


  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSubmit(trimmed);  // 🔹 Call parent handler
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

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
