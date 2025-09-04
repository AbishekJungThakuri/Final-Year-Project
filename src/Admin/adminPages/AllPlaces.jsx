import React, { useState, useEffect } from 'react';
import {
  getAllPlaces,
  createPlace,
  updatePlace,
  deletePlace
} from '../api/places';
import {
  uploadImage,
  updateImage,
  deleteImage
} from '../api/images';
import { Plus, X, Search, Trash2, Pencil, LayoutList, Grid3x3, Upload } from 'lucide-react';

const AllPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [showForm, setShowForm] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    latitude: '',
    longitude: '',
    average_visit_duration: '',
    average_visit_cost: '',
    city_id: '',
    image_ids: []
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState('');

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const data = await getAllPlaces({ size: pageSize, search });
      setPlaces(data);
    } catch (err) {
      setError('Failed to load places');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, [pageSize, search]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      latitude: '',
      longitude: '',
      average_visit_duration: '',
      average_visit_cost: '',
      city_id: '',
      image_ids: []
    });
    setSelectedFiles([]);
    setImagePreviews([]);
    setEditingPlace(null);
    setShowForm(false);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImagePreview = (index, isExisting = false) => {
    if (isExisting) {
      const newImageIds = [...formData.image_ids];
      newImageIds.splice(index, 1);
      setFormData({ ...formData, image_ids: newImageIds });
      
      const newPreviews = [...imagePreviews];
      newPreviews.splice(index, 1);
      setImagePreviews(newPreviews);
    } else {
      const existingCount = editingPlace ? editingPlace.images?.length || 0 : 0;
      const fileIndex = index - existingCount;
      
      const newFiles = [...selectedFiles];
      newFiles.splice(fileIndex, 1);
      setSelectedFiles(newFiles);
      
      const newPreviews = [...imagePreviews];
      newPreviews.splice(index, 1);
      setImagePreviews(newPreviews);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageIds = [...formData.image_ids];
      for (const file of selectedFiles) {
        const res = await uploadImage(file, 'place');
        imageIds.push(res.id);
      }
      if (editingPlace) {
        await updatePlace(editingPlace.id, { ...formData, image_ids: imageIds });
      } else {
        await createPlace({ ...formData, image_ids: imageIds });
      }
      resetForm();
      fetchPlaces();
    } catch (err) {
      console.error(err);
      setError('Failed to save place');
    }
  };

  const handleEdit = (place) => {
    setEditingPlace(place);
    setFormData({
      name: place.name,
      description: place.description,
      category: place.category,
      latitude: place.latitude,
      longitude: place.longitude,
      average_visit_duration: place.average_visit_duration,
      average_visit_cost: place.average_visit_cost,
      city_id: place.city_id,
      image_ids: place.images?.map(img => img.id) || []
    });
    setImagePreviews([...place.images?.map(img => img.url) || []]);
    setSelectedFiles([]);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this place?')) {
      try {
        await deletePlace(id);
        fetchPlaces();
      } catch (err) {
        console.error(err);
        setError('Failed to delete place');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">All Places</h1>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search places..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {[10, 20, 50, 64, 100].map(size => (
                  <option key={size} value={size}>{size} places</option>
                ))}
              </select>
              <button
                onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                {viewMode === 'table' ? <Grid3x3 size={18} /> : <LayoutList size={18} />}
                {viewMode === 'table' ? 'Card View' : 'Table View'}
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus size={18} /> Add Place
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {editingPlace ? 'Edit Place' : 'Add New Place'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Place Name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                  required 
                />
                <input 
                  type="text" 
                  placeholder="Category" 
                  value={formData.category} 
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                  required 
                />
                <input 
                  type="text" 
                  placeholder="Latitude" 
                  value={formData.latitude} 
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} 
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                  required 
                />
                <input 
                  type="text" 
                  placeholder="Longitude" 
                  value={formData.longitude} 
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} 
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                  required 
                />
                <input 
                  type="text" 
                  placeholder="Average Visit Duration" 
                  value={formData.average_visit_duration} 
                  onChange={(e) => setFormData({ ...formData, average_visit_duration: e.target.value })} 
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                />
                <input 
                  type="text" 
                  placeholder="Average Visit Cost" 
                  value={formData.average_visit_cost} 
                  onChange={(e) => setFormData({ ...formData, average_visit_cost: e.target.value })} 
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                />
                <input 
                  type="text" 
                  placeholder="City ID" 
                  value={formData.city_id} 
                  onChange={(e) => setFormData({ ...formData, city_id: e.target.value })} 
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                  required 
                />
              </div>
              <textarea 
                placeholder="Description" 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-24"
                rows="3"
              />
              
              {/* Image Upload Section */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Images</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="file" 
                    multiple 
                    onChange={handleImageChange} 
                    className="hidden"
                    accept="image/*"
                    id="imageUpload"
                  />
                  <button 
                    type="button"
                    onClick={() => document.getElementById('imageUpload').click()}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Upload size={16} />
                    Upload Images
                  </button>
                </div>
                {imagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {imagePreviews.map((url, index) => (
                      <div key={index} className="relative group">
                        <img src={url} alt="preview" className="h-20 w-20 object-cover rounded-lg border-2 border-gray-100" />
                        <button
                          type="button"
                          onClick={() => {
                            const existingCount = editingPlace ? editingPlace.images?.length || 0 : 0;
                            removeImagePreview(index, index < existingCount);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={resetForm} 
                  className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingPlace ? 'Update Place' : 'Create Place'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && !loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {places.map(place => (
                    <tr key={place.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        {place.images?.[0]?.url ? (
                          <img src={place.images[0].url} alt={place.name} className="h-12 w-12 object-cover rounded-lg" />
                        ) : (
                          <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">No image</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{place.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{place.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {place.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {place.latitude}, {place.longitude}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(place)} 
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Pencil size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(place.id)} 
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Card View */}
        {viewMode === 'card' && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {places.map(place => (
              <div key={place.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {place.images?.length > 0 ? (
                  <img
                    src={place.images[0].url}
                    alt={place.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                    No image available
                  </div>
                )}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{place.name}</h3>
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full ml-2">
                      {place.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{place.description}</p>
                  <div className="space-y-1 text-sm text-gray-500 mb-4">
                    <div>📍 {place.latitude}, {place.longitude}</div>
                    {place.average_visit_duration && <div>⏱️ {place.average_visit_duration}</div>}
                    {place.average_visit_cost && <div>💰 {place.average_visit_cost}</div>}
                  </div>
                  <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                    <button 
                      onClick={() => handleEdit(place)} 
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(place.id)} 
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && places.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No places found</div>
            <button
              onClick={() => setShowForm(true)}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Add your first place
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPlaces;