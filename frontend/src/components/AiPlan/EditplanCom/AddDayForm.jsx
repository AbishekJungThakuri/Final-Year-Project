import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addDayThunk } from '../../../features/plan/AiplanSlice';

const AddDayForm = ({ planId }) => {
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (title.trim()) {
      dispatch(addDayThunk({ planId, title }));
      setTitle('');
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h3 className="font-semibold mb-2">Add a New Day</h3>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Day Title"
        className="w-full border px-3 py-2 rounded mb-2"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Day
      </button>
    </div>
  );
};

export default AddDayForm;
