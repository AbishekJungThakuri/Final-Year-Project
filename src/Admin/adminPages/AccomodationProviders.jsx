import React, { useState, useEffect } from 'react';
import {
  getAllAccommodationServices,
  createAccommodationService,
  updateAccommodationService,
  deleteAccommodationService
} from '../api/AccomodationProviders';
import { uploadImage } from '../api/images';
import { Plus, Trash2, Pencil, LayoutList, Grid3x3, Search, MapPin, DollarSign, X } from 'lucide-react';

const AccommodationProvider = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('card');
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', city_id: '', full_address: '', accomodation_category: '',
    longitude: '', latitude: '', cost_per_night: '', image_ids: []
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState('');

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await getAllAccommodationServices({ size: pageSize, search });
      setServices(data);
    } catch (err) {
      setError('Failed to load accommodation services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [pageSize, search]);

  const resetForm = () => {
    setFormData({ name: '', description: '', city_id: '', full_address: '', accomodation_category: '',
      longitude: '', latitude: '', cost_per_night: '', image_ids: [] });
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
        const res = await uploadImage(file, 'accommodation_services');
        imageIds.push(res.id);
      }
      const payload = { ...formData, image_ids: imageIds };
      if (editingService) {
        await updateAccommodationService(editingService.id, payload);
      } else {
        await createAccommodationService(payload);
      }
      resetForm();
      fetchServices();
    } catch (err) {
      setError('Failed to save accommodation service');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name || '', description: service.description || '', city_id: service.city_id || '',
      full_address: service.full_address || '', accomodation_category: service.accomodation_category || '',
      longitude: service.longitude || '', latitude: service.latitude || '',
      cost_per_night: service.cost_per_night || '', image_ids: service.images?.map(img => img.id) || []
    });
    setImagePreviews(service.images?.map(img => img.url) || []);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteAccommodationService(id);
        fetchServices();
      } catch (err) {
        setError('Failed to delete accommodation service');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Accommodation Services</h1>
              <p className="text-slate-600 mt-1">Manage your accommodation listings</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                {[10, 20, 50, 100].map(size => (
                  <option key={size} value={size}>{size} items</option>
                ))}
              </select>
              <div className="flex bg-slate-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('card')}
                  className={`p-2 rounded-lg ${viewMode === 'card' ? 'bg-white text-blue-600 shadow' : 'text-slate-500'}`}
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-white text-blue-600 shadow' : 'text-slate-500'}`}
                >
                  <LayoutList size={18} />
                </button>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg"
              >
                <Plus size={18} /> Add Service
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex justify-between items-center">
            <span className="text-red-700">{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">{editingService ? 'Edit' : 'Add'} Accommodation</h2>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="City ID"
                  value={formData.city_id}
                  onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                  className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <textarea
                placeholder="Description *"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                rows="3"
                required
              />
              <input
                type="text"
                placeholder="Full Address"
                value={formData.full_address}
                onChange={(e) => setFormData({ ...formData, full_address: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
              <div className="grid grid-cols-3 gap-4">
                <select
                  value={formData.accomodation_category}
                  onChange={(e) => setFormData({ ...formData, accomodation_category: e.target.value })}
                  className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Category</option>
                  <option value="hotel">Hotel</option>
                  <option value="resort">Resort</option>
                  <option value="villa">Villa</option>
                  <option value="apartment">Apartment</option>
                </select>
                <input
                  type="text"
                  placeholder="Longitude"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Latitude"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="number"
                  placeholder="Cost per night"
                  value={formData.cost_per_night}
                  onChange={(e) => setFormData({ ...formData, cost_per_night: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border-2 border-dashed border-slate-200 rounded-xl focus:border-blue-300"
                  accept="image/*"
                />
                {imagePreviews.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {imagePreviews.map((url, index) => (
                      <img key={index} src={url} alt="Preview" className="h-16 w-16 object-cover rounded-lg border" />
                    ))}
                  </div>
                )}
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
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
                >
                  {editingService ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-slate-600">Loading...</span>
          </div>
        ) : viewMode === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <div key={service.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img
                    src={service.images?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'}
                    alt={service.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-2 bg-white bg-opacity-90 rounded-full shadow-sm text-blue-600 hover:bg-opacity-100"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 bg-white bg-opacity-90 rounded-full shadow-sm text-red-600 hover:bg-opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium capitalize">
                    {service.accomodation_category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{service.name}</h3>
                  <div className="flex items-center text-sm text-slate-500 mb-2">
                    <MapPin size={14} className="mr-2" />
                    {service.full_address || 'Address not specified'}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">ID: {service.city_id}</span>
                    <div className="flex items-center text-green-600 font-semibold">
                      <DollarSign size={16} />
                      {service.cost_per_night}/night
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left font-medium text-slate-700">Image</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-700">Name</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-700">City ID</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-700">Cost/Night</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-700">Category</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {services.map(service => (
                  <tr key={service.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <img 
                        src={service.images?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100'} 
                        alt="Service" 
                        className="h-12 w-12 object-cover rounded-lg" 
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{service.name}</td>
                    <td className="px-6 py-4 text-slate-600">{service.city_id}</td>
                    <td className="px-6 py-4 font-semibold text-green-600">${service.cost_per_night}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">
                        {service.accomodation_category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(service)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(service.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccommodationProvider;