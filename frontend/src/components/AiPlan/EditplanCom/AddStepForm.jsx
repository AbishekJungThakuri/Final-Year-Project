import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addStepThunk } from '../../../features/plan/AiplanSlice';
import { fetchPlacesThunk, fetchCitiesThunk } from '../../../features/plan/LocationSlice';

const AddStepForm = ({ planId, dayId }) => {
  const dispatch = useDispatch();

  const places = useSelector((state) => state.location.places);
  const cities = useSelector((state) => state.location.cities);

  const [category, setCategory] = useState('visit');
  const [placeId, setPlaceId] = useState('');
  const [endCityId, setEndCityId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchPlacesThunk());
    dispatch(fetchCitiesThunk());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (category === 'visit' && !placeId) {
      setError('Please select a place');
      return;
    }
    if (category === 'transport' && !endCityId) {
      setError('Please select a city');
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        addStepThunk({
          planId,
          dayId,
          category,
          placeId: category === 'visit' ? placeId : null,
          endCityId: category === 'transport' ? endCityId : null,
        })
      ).unwrap();
      setPlaceId('');
      setEndCityId('');
    } catch (err) {
      setError(err || 'Failed to add step');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mt-4">
      <h4 className="mb-2 font-semibold">Add Step to Day</h4>

      <label className="block mb-1">
        Category:
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="ml-2 border rounded p-1"
        >
          <option value="visit">Visit</option>
          <option value="transport">Transport</option>
        </select>
      </label>

      {category === 'visit' && (
        <label className="block mb-2">
          Select Place:
          <select
            value={placeId}
            onChange={(e) => setPlaceId(e.target.value)}
            className="ml-2 border rounded p-1"
            required={category === 'visit'}
          >
            <option value="">-- Select Place --</option>
            {places.map((place) => (
              <option key={place.id} value={place.id}>
                {place.name}
              </option>
            ))}
          </select>
        </label>
      )}

      {category === 'transport' && (
        <label className="block mb-2">
          Select City:
          <select
            value={endCityId}
            onChange={(e) => setEndCityId(e.target.value)}
            className="ml-2 border rounded p-1"
            required={category === 'transport'}
          >
            <option value="">-- Select City --</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </label>
      )}

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Step'}
      </button>
    </form>
  );
};

export default AddStepForm;
