import React, { useState, useEffect } from 'react';
import {
  getAllTransportServices,
  createTransportService,
  updateTransportService,
  deleteTransportService
} from '../api/ServiceProviders';
import { uploadImage } from '../api/images';
import { Plus, Trash2, Pencil, LayoutList, Grid3x3, Search, X } from 'lucide-react';

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
    route_category: '',
    transport_category: '',
    average_duration: '',
    cost: '',
    image_ids: []
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState('');

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await getAllTransportServices({ size: pageSize, search });
      setServices(data);
    } catch (err) {
      setError('Failed to load transport services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [pageSize, search]);

  const resetForm = () => {
    setFormData({
      route_ids: [],
      description: '',
      route_category: '',
      transport_category: '',
      average_duration: '',
      cost: '',
      image_ids: []
    });
    setSelectedFiles([]);
    setImagePreviews([]);
    setEditingService(null);
    setShowForm(false);
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

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      route_ids: service.route_ids || [],
      description: service.description || '',
      route_category: service.route_category || '',
      transport_category: service.transport_category || '',
      average_duration: service.average_duration || '',
      cost: service.cost || '',
      image_ids: service.images?.map(img => img.id) || []
    });
    setImagePreviews(service.images?.map(img => img.url) || []);
    setShowForm(true);
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
              {/* Search */}
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
              
              {/* Page Size */}
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                {[10, 20, 50, 64, 100].map(size => (
                  <option key={size} value={size}>{size} per page</option>
                ))}
              </select>
              
              {/* View Toggle */}
              <button
                onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
                className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 bg-white"
              >
                {viewMode === 'table' ? <Grid3x3 size={18} /> : <LayoutList size={18} />}
                <span className="hidden sm:inline">{viewMode === 'table' ? 'Card' : 'Table'}</span>
              </button>
              
              {/* Add Button */}
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
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingService ? 'Edit Service' : 'Add New Service'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                      placeholder="e.g., Urban, Rural"
                      value={formData.route_category}
                      onChange={(e) => setFormData({ ...formData, route_category: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transport Category</label>
                    <input
                      type="text"
                      placeholder="e.g., Bus, Train"
                      value={formData.transport_category}
                      onChange={(e) => setFormData({ ...formData, transport_category: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Average Duration</label>
                    <input
                      type="text"
                      placeholder="e.g., 2 hours"
                      value={formData.average_duration}
                      onChange={(e) => setFormData({ ...formData, average_duration: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cost</label>
                    <input
                      type="text"
                      placeholder="e.g., $25"
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

        {/* Content */}
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
      </div>
    </div>
  );
};

export default ServiceProvider;