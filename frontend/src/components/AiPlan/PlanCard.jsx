import React from 'react';
import { useNavigate } from 'react-router-dom';

const PlanCard = ({ plan }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/edit/${plan.id}`)}
      className="cursor-pointer border rounded-lg shadow hover:shadow-lg p-4 transition-all"
    >
      {plan.image?.url && (
        <img
          src={plan.image.url}
          alt={plan.title}
          className="w-full h-40 object-cover rounded"
        />
      )}
      <h3 className="mt-2 font-semibold text-lg">{plan.title}</h3>
    </div>
  );
};

export default PlanCard;
