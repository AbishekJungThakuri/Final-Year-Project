import React, { useState, useEffect } from 'react';
import { 
  getAllTransportRoutes, 
  createTransportRoute, 
  updateTransportRoute, 
  deleteTransportRoute,
  getTransportServiceByCityId // Import the new API function
} from '../api/transportRoute';
import { 
  Plus, 
  Trash2, 
  Pencil, 
  LayoutList, 
  Grid3x3, 
  MapPin, 
  Clock, 
  DollarSign, 
  X,
  Route,
  ArrowRight,
  Filter,
  RefreshCcw // Icon for the reset button
} from 'lucide-react';
import Pagination from './Pagination';
import CityDropdown from './CityDropdown'; 

const TransportRoute = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('card');
  const [showForm, setShowForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  
  // States for city selection in the form
  const [selectedStartCity, setSelectedStartCity] = useState(null);
  const [selectedEndCity, setSelectedEndCity] = useState(null);

  // New state for the filter city
  const [filterCity, setFilterCity] = useState(null);
  
  const [formData, setFormData] = useState({
    start_city_id: '',
    end_city_id: '',
    distance: '',
    average_duration: '',
    average_cost: ''
  });
  
  const [pageSize, setPageSize] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Updated fetchRoutes function to handle the filter
  const fetchRoutes = async (page = 1, size = pageSize, cityId = filterCity?.id) => {
    setLoading(true);
    try {
      let data;
      if (cityId) {
        // Fetch routes for a specific city
        data = await getTransportServiceByCityId(cityId);
        // The API might not return pagination data, so we format it
        data = {
          data: data.data || [],
          page: 1,
          size: data.data?.length || 0,
          total: data.data?.length || 0,
        };
      } else {
        // Fetch all routes with pagination
        data = await getAllTransportRoutes({ page, size });
      }
      
      setRoutes(data.data);
      setCurrentPage(data.page);
      setTotalPages(Math.ceil(data.total / data.size));
      setTotalItems(data.total);
      
    } catch (err) {
      setError('Failed to load transport routes');
      setRoutes([]);
      setCurrentPage(1);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes(currentPage);
  }, [pageSize, currentPage, filterCity]); // Add filterCity as a dependency

  const resetForm = () => {
    setFormData({
      start_city_id: '',
      end_city_id: '',
      distance: '',
      average_duration: '',
      average_cost: ''
    });
    setEditingRoute(null);
    setShowForm(false);
    
    setSelectedStartCity(null);
    setSelectedEndCity(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoute) {
        await updateTransportRoute(editingRoute.id, formData);
      } else {
        await createTransportRoute(formData);
      }
      resetForm();
      fetchRoutes(); // Refetch data after create/update
    } catch (err) {
      setError('Failed to save transport route');
    }
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setFormData({
      start_city_id: route.start_city?.id || '',
      end_city_id: route.end_city?.id || '',
      distance: route.distance || '',
      average_duration: route.average_duration || '',
      average_cost: route.average_cost || ''
    });
    
    setSelectedStartCity(route.start_city || null);
    setSelectedEndCity(route.end_city || null);
    
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        await deleteTransportRoute(id);
        fetchRoutes(); // Refetch data after delete
      } catch (err) {
        setError('Failed to delete transport route');
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleStartCitySelect = (city) => {
    setSelectedStartCity(city);
    setFormData({ ...formData, start_city_id: city.id });
  };

  const handleEndCitySelect = (city) => {
    setSelectedEndCity(city);
    setFormData({ ...formData, end_city_id: city.id });
  };

  const handleFilterCitySelect = (city) => {
    setFilterCity(city);
    setCurrentPage(1); // Reset to the first page when a filter is applied
  };

  const clearFilter = () => {
    setFilterCity(null);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Transport Routes</h1>
              <p className="text-slate-600 mt-1">Manage transport route connections</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500"
              >
                {[12, 24, 60, 120].map(size => (
                  <option key={size} value={size}>{size} items</option>
                ))}
              </select>
              <div className="flex bg-slate-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('card')}
                  className={`p-2 rounded-lg ${viewMode === 'card' ? 'bg-white text-green-600 shadow' : 'text-slate-500'}`}
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-white text-green-600 shadow' : 'text-slate-500'}`}
                >
                  <LayoutList size={18} />
                </button>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg"
              >
                <Plus size={18} />
                Add Route
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter Section */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4 w-full md:w-1/2 lg:w-1/3">
            <Filter size={20} className="text-slate-500" />
            <div className="flex-1">
              <CityDropdown
                selectedCity={filterCity}
                onCitySelect={handleFilterCitySelect}
                placeholder="Filter routes by city..."
              />
            </div>
          </div>
          {filterCity && (
            <button
              onClick={clearFilter}
              className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors"
            >
              <RefreshCcw size={16} />
              Clear Filter
            </button>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex justify-between items-center mb-6">
            <span className="text-red-700">{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold">{editingRoute ? 'Edit' : 'Add'} Transport Route</h2>
                <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Start City Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Start City *</label>
                    <CityDropdown
                      selectedCity={selectedStartCity}
                      onCitySelect={handleStartCitySelect}
                      placeholder="Search start city..."
                    />
                  </div>
  
                  {/* End City Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">End City *</label>
                    <CityDropdown
                      selectedCity={selectedEndCity}
                      onCitySelect={handleEndCitySelect}
                      placeholder="Search end city..."
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Distance (km) *</label>
                    <input
                      type="number"
                      placeholder="Distance"
                      value={formData.distance}
                      onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Duration (hours) *</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="Duration"
                      value={formData.average_duration}
                      onChange={(e) => setFormData({ ...formData, average_duration: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Average Cost (NPR) *</label>
                    <input
                      type="number"
                      placeholder="Cost"
                      value={formData.average_cost}
                      onChange={(e) => setFormData({ ...formData, average_cost: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium"
                  >
                    {editingRoute ? 'Update' : 'Create'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
  
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-3 text-slate-600">Loading...</span>
          </div>
        ) : viewMode === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.map(route => (
              <div key={route.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <Route className="text-green-600" size={20} />
                      <span className="font-semibold text-slate-800">Route #{route.id}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(route)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(route.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center mb-4">
                    <div className="text-center">
                      <div className="font-semibold text-slate-900">{route.start_city?.name}</div>
                      <div className="text-sm text-slate-500">Start City</div>
                    </div>
                    <ArrowRight className="mx-4 text-green-600" size={20} />
                    <div className="text-center">
                      <div className="font-semibold text-slate-900">{route.end_city?.name}</div>
                      <div className="text-sm text-slate-500">End City</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <MapPin size={14} className="text-slate-400 mr-1" />
                        <span className="font-semibold text-slate-900">{route.distance}</span>
                      </div>
                      <div className="text-xs text-slate-500">km</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Clock size={14} className="text-slate-400 mr-1" />
                        <span className="font-semibold text-slate-900">{route.average_duration}</span>
                      </div>
                      <div className="text-xs text-slate-500">hours</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <DollarSign size={14} className="text-slate-400 mr-1" />
                        <span className="font-semibold text-green-600">NPR {route.average_cost}</span>
                      </div>
                      <div className="text-xs text-slate-500">avg cost</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-center">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium capitalize">
                      {route.route_category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {routes.length === 0 && (
              <div className="md:col-span-3 text-center py-10 text-slate-500">
                No routes found.
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left font-medium text-slate-700">Route</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-700">Start City</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-700">End City</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-700">Distance</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-700">Duration</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-700">Cost</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {routes.map(route => (
                  <tr key={route.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Route className="text-green-600" size={16} />
                        <span className="font-medium text-slate-900">#{route.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {route.start_city?.name}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {route.end_city?.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {route.distance} km
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {route.average_duration}h
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-600">
                      NPR {route.average_cost}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(route)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(route.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {routes.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-slate-500">
                      No routes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          show={!filterCity} // Hide pagination when a filter is active
        />
      </div>
    </div>
  );
};

export default TransportRoute;