import React, { useState, useEffect } from 'react';
import {
  getAllTransportServices,
  createTransportService,
  updateTransportService,
  deleteTransportService,
  uploadImage,
  searchCities,
  getRoutesByCity
} from '../api/transportApi';
import { Plus, Trash2, Pencil, LayoutList, Grid3x3, Search, X, ChevronRight } from 'lucide-react';
import Pagination from './Pagination';

const TransportCategories = [
  'bus', 'taxi', 'bike', 'minibus', 'jeep', 'plane', 'helicopter', 'other'
];

const ServiceProvider = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    route_ids: [],
    description: '',
    route_category: 'road',
    transport_category: '',
    average_duration: '',
    cost: '',
    image_ids: []
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // New state for route selection
  const [citySearch, setCitySearch] = useState('');
  const [foundCities, setFoundCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [selectedRoutes, setSelectedRoutes] = useState([]);

  const fetchServices = async (page = currentPage) => {
    setLoading(true);
    try {
      const data = await getAllTransportServices({ size: pageSize, search, page });
      setServices(data.data);
      setCurrentPage(data.page);
      setTotalPages(Math.ceil(data.total / data.size));
      setTotalItems(data.total);
    } catch (err) {
      setError('Failed to load transport services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(currentPage);
  }, [pageSize, search, currentPage]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (citySearch.length > 2) {
        handleSearchCities(citySearch);
      } else {
        setFoundCities([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [citySearch]);

  const handleSearchCities = async (query) => {
    try {
      const cities = await searchCities(query);
      setFoundCities(cities.data);
    } catch (err) {
      console.error("Failed to search cities:", err);
      setError('Failed to search for cities.');
    }
  };

  const handleCitySelect = async (city) => {
    setSelectedCity(city);
    setCitySearch(city.name);
    setFoundCities([]);
    try {
      const routes = await getRoutesByCity(city.id);
      setAvailableRoutes(routes.data);
    } catch (err) {
      console.error("Failed to fetch routes:", err);
      setError('Failed to fetch routes for selected city.');
    }
  };

  const handleRouteSelect = (route) => {
    const isNextRouteValid = (lastRoute, newRoute) => {
      const isConnected = lastRoute.end_city.id === newRoute.start_city.id || lastRoute.end_city.id === newRoute.end_city.id;
      return isConnected;
    };
    
    // Determine the effective start and end city of the new route
    let effectiveRoute = { ...route };
    const lastRoute = selectedRoutes[selectedRoutes.length - 1];

    if (selectedRoutes.length > 0) {
      const currentEndCityId = lastRoute.end_city.id;
      if (route.start_city.id === currentEndCityId) {
        // Correct direction
      } else if (route.end_city.id === currentEndCityId) {
        // Reverse the route direction for the visual display
        effectiveRoute = {
          ...route,
          start_city: route.end_city,
          end_city: route.start_city
        };
      } else {
        setError('The next route must connect to the end city of the previous route.');
        return;
      }
    } else {
      // First route must start from the selected city
      if (route.start_city.id !== selectedCity.id) {
        // If it doesn't, check if the end city matches
        if (route.end_city.id === selectedCity.id) {
          effectiveRoute = {
            ...route,
            start_city: route.end_city,
            end_city: route.start_city
          };
        } else {
          setError('The first route must either start or end at the selected city.');
          return;
        }
      }
    }
    
    if (!selectedRoutes.some(r => r.id === route.id)) {
      setSelectedRoutes([...selectedRoutes, effectiveRoute]);
      setAvailableRoutes(prevRoutes => prevRoutes.filter(r => r.id !== route.id));
      setFormData(prevData => ({
        ...prevData,
        route_ids: [...prevData.route_ids, route.id]
      }));
    }

    const nextCityId = effectiveRoute.end_city.id;
    getRoutesByCity(nextCityId)
      .then(res => setAvailableRoutes(res.data))
      .catch(err => {
        console.error("Failed to fetch next routes:", err);
        setError('Failed to fetch next routes.');
      });
  };
  
  const handleRemoveRoute = (routeId) => {
    const routeToRemove = selectedRoutes.find(r => r.id === routeId);
    if (!routeToRemove) return;

    const index = selectedRoutes.findIndex(r => r.id === routeId);
    const newSelectedRoutes = selectedRoutes.slice(0, index);
    setSelectedRoutes(newSelectedRoutes);
    setFormData(prevData => ({
      ...prevData,
      route_ids: newSelectedRoutes.map(r => r.id)
    }));
    
    const lastCityId = newSelectedRoutes.length > 0 ? newSelectedRoutes[newSelectedRoutes.length - 1].end_city.id : selectedCity.id;
    getRoutesByCity(lastCityId)
      .then(res => {
        const removedRoutes = selectedRoutes.slice(index);
        setAvailableRoutes(prevAvailable => [...res.data, ...removedRoutes]);
      })
      .catch(err => {
        console.error("Failed to re-fetch routes:", err);
        setError('Failed to refresh available routes.');
      });
  };

  const resetForm = () => {
    setFormData({
      route_ids: [],
      description: '',
      route_category: 'road',
      transport_category: '',
      average_duration: '',
      cost: '',
      image_ids: []
    });
    setSelectedFiles([]);
    setImagePreviews([]);
    setEditingService(null);
    setShowForm(false);
    
    setCitySearch('');
    setFoundCities([]);
    setSelectedCity(null);
    setAvailableRoutes([]);
    setSelectedRoutes([]);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setImagePreviews(files.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageIds = [...formData.image_ids];
      for (const file of selectedFiles) {
        const res = await uploadImage(file, 'transport_services');
        imageIds.push(res.id);
      }
      
      const payload = { ...formData, image_ids: imageIds };
      payload.route_ids = payload.route_ids.map(Number);
      payload.cost = Number(payload.cost) || 0;
      payload.average_duration = Number(payload.average_duration) || 0;
      
      if (editingService) {
        await updateTransportService(editingService.id, payload);
      } else {
        await createTransportService(payload);
      }
      resetForm();
      fetchServices();
    } catch (err) {
      console.error(err);
      setError('Failed to save transport service');
    }
  };

  const handleEdit = async (service) => {
    setEditingService(service);
    setFormData({
      route_ids: service.route_segments?.map(s => s.route.id) || [],
      description: service.description || '',
      route_category: service.route_category || '',
      transport_category: service.transport_category || '',
      average_duration: service.average_duration || '',
      cost: service.cost || '',
      image_ids: service.images?.map(img => img.id) || []
    });
    setImagePreviews(service.images?.map(img => img.url) || []);
    setShowForm(true);

    if (service.route_segments && service.route_segments.length > 0) {
      const routesInOrder = service.route_segments
        .sort((a, b) => a.index - b.index)
        .map(s => s.route);

      setSelectedRoutes(routesInOrder);
      const firstCity = routesInOrder[0]?.start_city;
      if (firstCity) {
        setSelectedCity(firstCity);
        setCitySearch(firstCity.name);
        try {
          const lastCityId = routesInOrder[routesInOrder.length - 1].end_city.id;
          const newRoutes = await getRoutesByCity(lastCityId);
          setAvailableRoutes(newRoutes.data.filter(r => !routesInOrder.some(sr => sr.id === r.id)));
        } catch (err) {
          console.error("Failed to load routes for editing:", err);
          setError('Failed to load routes for editing.');
        }
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteTransportService(id);
        fetchServices();
      } catch (err) {
        console.error(err);
        setError('Failed to delete transport service');
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Transport Services</h1>
              <p className="text-gray-600 mt-1">Manage your transport services and routes</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search services..."
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all w-full sm:w-64"
                />
              </div>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                {[10, 20, 50, 64, 100].map(size => (
                  <option key={size} value={size}>{size} per page</option>
                ))}
              </select>
              <button
                onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
                className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 bg-white"
              >
                {viewMode === 'table' ? <Grid3x3 size={18} /> : <LayoutList size={18} />}
                <span className="hidden sm:inline">{viewMode === 'table' ? 'Card' : 'Table'}</span>
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus size={18} />
                Add Service
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingService ? 'Edit Service' : 'Add New Service'}
                  </h2>
                  <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Route</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
                    
                    {selectedRoutes.length > 0 && (
                      <div className="flex items-center flex-wrap gap-2">
                        {selectedRoutes.map((route, index) => (
                          <div key={index} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            <span>{route.start_city.name} to {route.end_city.name}</span>
                            <button type="button" onClick={() => handleRemoveRoute(route.id)} className="text-blue-500 hover:text-blue-700">
                                <X size={14} />
                            </button>
                            {index < selectedRoutes.length - 1 && <ChevronRight size={16} className="text-blue-500" />}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="relative">
                      {!selectedCity ? (
                        <>
                          <input
                            type="text"
                            value={citySearch}
                            onChange={(e) => setCitySearch(e.target.value)}
                            placeholder="Search for a starting city..."
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                          {foundCities.length > 0 && (
                            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                              {foundCities.map(city => (
                                <li
                                  key={city.id}
                                  onClick={() => handleCitySelect(city)}
                                  className="p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                                >
                                  {city.name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      ) : (
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-2">
                            Select a route from <span className="text-blue-600">{selectedCity.name}</span>:
                          </p>
                          {availableRoutes.length > 0 ? (
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {availableRoutes.map(route => (
                                <li
                                  key={route.id}
                                  onClick={() => handleRouteSelect(route)}
                                  className="p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">
                                        {route.start_city.name} to {route.end_city.name}
                                    </span>
                                    <span className="text-xs text-gray-500">{route.distance} km</span>
                                  </div>
                                  <span className="text-xs text-gray-500">Duration: {route.average_duration}h, Cost: ${route.average_cost}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">No more connecting routes found from this location.</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Other Form Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    placeholder="Enter service description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    rows="3"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Route Category</label>
                    <input
                      type="text"
                      value="road"
                      readOnly
                      className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transport Category</label>
                    <select
                      value={formData.transport_category}
                      onChange={(e) => setFormData({ ...formData, transport_category: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                      required
                    >
                      <option value="">Select a category</option>
                      {TransportCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Average Duration</label>
                    <input
                      type="number"
                      placeholder="e.g., 2.5"
                      step="0.1"
                      value={formData.average_duration}
                      onChange={(e) => setFormData({ ...formData, average_duration: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cost</label>
                    <input
                      type="number"
                      placeholder="e.g., 25.00"
                      step="0.01"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  {imagePreviews.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      {imagePreviews.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="h-20 w-20 object-cover rounded-lg border border-gray-300"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {editingService ? 'Update Service' : 'Create Service'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Content remains the same as before */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transport Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {services.map((service, index) => (
                    <tr key={service.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4">
                        {service.images?.[0]?.url ? (
                          <img
                            src={service.images[0].url}
                            alt="Service"
                            className="h-12 w-12 object-cover rounded-lg border border-gray-300"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No image</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{service.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {service.route_category || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          {service.transport_category || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{service.average_duration || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{service.cost || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(service)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(service.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {services.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-500">No transport services found</div>
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Add your first service
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                  <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="mb-3">
                      {service.images?.[0]?.url ? (
                        <img
                          src={service.images[0].url}
                          alt="Service"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-900 line-clamp-2">{service.description}</p>
                      <div className="flex gap-2 flex-wrap">
                        {service.route_category && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {service.route_category}
                          </span>
                        )}
                        {service.transport_category && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            {service.transport_category}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>Duration: {service.average_duration || 'N/A'}</div>
                        <div>Cost: {service.cost || 'N/A'}</div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {services.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-500">No transport services found</div>
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Add your first service
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {totalItems > 0 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceProvider;