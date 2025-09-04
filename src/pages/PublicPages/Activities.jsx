import React, { useEffect, useState } from 'react';
import { getAllActivities } from '../../Admin/api/activities';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllActivities({ search: debouncedSearch });
        setActivities(data);
      } catch (err) {
        setError('Failed to load activities.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [debouncedSearch]);

  return (
    <div className="min-h-screen mt-10 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-14">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-orange-600 mb-12 text-center">
          Explore Activities in Nepal
        </h1>

        {/* Search */}
        <div className="max-w-md mx-auto mb-10">
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-orange-400 text-gray-900 placeholder-gray-400 shadow-md transition"
          />
        </div>

        {loading && (
          <p className="text-center text-gray-600 text-lg font-semibold mb-6">Loading activities...</p>
        )}

        {error && (
          <p className="text-center text-red-600 font-semibold mb-6">{error}</p>
        )}

        {!loading && !error && activities.length === 0 && (
          <p className="text-center text-gray-500 text-lg mb-6">No activities found.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-[1.04] transition duration-300 cursor-pointer"
              title={activity.name}
            >
              {activity.image?.url ? (
                <img
                  src={activity.image.url}
                  alt={activity.name}
                  className="w-full h-52 object-cover rounded-t-2xl"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-52 bg-orange-100 flex items-center justify-center text-orange-400 text-8xl font-extrabold select-none rounded-t-2xl">
                  {activity.name?.[0] || 'A'}
                </div>
              )}

              <div className="p-5">
                <h2 className="text-2xl font-bold text-orange-600 mb-2 truncate">{activity.name}</h2>
                <p className="text-gray-700 text-sm line-clamp-4 min-h-[96px]">
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Activities;
