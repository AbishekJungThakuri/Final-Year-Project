import React, { useState, useEffect } from 'react';
import { getAllPlaces } from '../../Admin/api/places';

// Mock city and category data - replace or fetch from your API as needed
const CITIES = [
  { id: null, name: 'All Cities' },
  { id: 1, name: 'Kathmandu' },
  { id: 2, name: 'Pokhara' },
  { id: 3, name: 'Chitwan' },
];

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'historical', label: 'Historical' },
  { value: 'natural', label: 'Natural' },
  { value: 'religious', label: 'Religious' },
  { value: 'adventure', label: 'Adventure' },
];

const Place = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [cityFilter, setCityFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllPlaces({
          search: debouncedSearch,
          city_id: cityFilter,
          category: categoryFilter || undefined,
          page,
          size,
        });

        setPlaces(response.data || response);
        setTotalPages(response.total_pages || 1);
      } catch (err) {
        setError('Failed to load places.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [debouncedSearch, cityFilter, categoryFilter, page, size]);

  const goToPrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const goToNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="min-h-screen mt-10 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-14">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-orange-600 mb-12 text-center">
          Explore Beautiful Places
        </h1>

        {/* Filters & Page Size */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <select
            value={cityFilter ?? ''}
            onChange={(e) =>
              setCityFilter(e.target.value === '' ? null : Number(e.target.value))
            }
            className="rounded-md border border-gray-300 px-4 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            {CITIES.map((city) => (
              <option key={city.id ?? 'all'} value={city.id ?? ''}>
                {city.name}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-4 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            {CATEGORIES.map(({ value, label }) => (
              <option key={value || 'all'} value={value}>
                {label}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-2">
            <label
              htmlFor="pageSize"
              className="text-gray-700 font-semibold select-none"
            >
              Places per page:
            </label>
            <select
              id="pageSize"
              value={size}
              onChange={(e) => {
                setSize(parseInt(e.target.value, 10));
                setPage(1);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {[10, 20, 50, 100].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search input */}
        <div className="max-w-md mx-auto mb-10">
          <input
            type="text"
            placeholder="Search places..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-orange-400 text-gray-900 placeholder-gray-400 shadow-md transition"
          />
        </div>

        {/* Loading and error */}
        {loading && (
          <p className="text-center text-gray-600 text-lg font-semibold mb-6">Loading places...</p>
        )}

        {error && (
          <p className="text-center text-red-600 font-semibold mb-6">{error}</p>
        )}

        {!loading && !error && places.length === 0 && (
          <p className="text-center text-gray-500 text-lg mb-6">No places found.</p>
        )}

        {/* Places grid */}
        {!loading && !error && places.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {places.map((place) => (
                <div
                  key={place.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-[1.04] transition duration-300 cursor-pointer"
                  title={place.name}
                >
                  {place.images && place.images.length > 0 && place.images[0].url ? (
                    <img
                      src={place.images[0].url}
                      alt={place.name}
                      className="w-full h-52 object-cover rounded-t-2xl"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-52 bg-orange-100 flex items-center justify-center text-orange-400 text-8xl font-extrabold select-none rounded-t-2xl">
                      {place.name?.[0] || 'P'}
                    </div>
                  )}

                  <div className="p-5">
                    <h2 className="text-2xl font-bold text-orange-600 mb-2 truncate">{place.name}</h2>
                    <p className="text-gray-700 text-sm line-clamp-3 mb-4 min-h-[72px]">
                      {place.description}
                    </p>

                    <div className="flex flex-wrap gap-3 text-gray-600 text-xs">
                      {place.category && (
                        <span className="bg-orange-100 text-orange-700 rounded-full px-3 py-1 font-semibold select-none">
                          {place.category}
                        </span>
                      )}
                      {place.city && (
                        <span className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 select-none">
                          {place.city.name || place.city_id}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 text-sm text-gray-800 space-y-1 select-none">
                      {place.average_visit_duration && (
                        <div>
                          <strong>Avg. Visit Duration:</strong> {place.average_visit_duration} hrs
                        </div>
                      )}
                      {place.average_visit_cost && (
                        <div>
                          <strong>Avg. Visit Cost:</strong> ${place.average_visit_cost}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination controls at bottom */}
            <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-6">
              <button
                onClick={goToPrevious}
                disabled={page <= 1}
                className={`px-5 py-2 rounded-md font-semibold transition ${
                  page <= 1
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-orange-600 text-white hover:bg-orange-700 focus:ring-4 focus:ring-orange-300'
                }`}
              >
                Previous
              </button>

              <span className="text-gray-700 font-semibold select-none">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={goToNext}
                disabled={page >= totalPages}
                className={`px-5 py-2 rounded-md font-semibold transition ${
                  page >= totalPages
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-orange-600 text-white hover:bg-orange-700 focus:ring-4 focus:ring-orange-300'
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Place;
