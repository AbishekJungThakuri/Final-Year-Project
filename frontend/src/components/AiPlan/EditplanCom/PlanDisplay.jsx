import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const PlanDisplay = () => {
  const { data: plan, generateStatus, editStatus } = useSelector((state) => state.plan);
  const navigate = useNavigate();

  const isLoading = generateStatus === 'loading' || editStatus === 'loading';
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-gray-600 text-lg animate-pulse">Generating your travel plan...</p>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white shadow-lg rounded-2xl p-6">
      {/* Title & Description */}
      <div className="border-b pb-4 mb-4">
        <h2 className="text-3xl font-extrabold text-gray-800">{plan.title}</h2>
        <p className="mt-2 text-gray-600">{plan.description}</p>
      </div>

      {/* Image */}
      {plan.image?.url && (
        <div className="flex justify-center my-4">
          <img
            src={plan.image.url}
            alt="Trip visual"
            className="rounded-xl w-full max-w-md object-cover shadow-md"
          />
        </div>
      )}

      {/* Daily Plan */}
      <div className="space-y-6">
        {plan.days?.map((day) => (
          <div
            key={day.id}
            className="bg-gray-50 border-l-4 border-yellow-400 rounded-lg p-4 shadow-sm"
          >
            <h3 className="text-xl font-semibold text-gray-700">{day.title}</h3>
            <ul className="mt-2 ml-5 list-disc text-gray-600">
              {day.steps?.map((step) => (
                <li key={step.id} className="mb-1">
                  <span className="font-medium text-gray-700">{step.title}</span> – Rs{' '}
                  <span className="text-green-600 font-semibold">
                    {step.cost?.toFixed(2) || '0.00'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanDisplay;
