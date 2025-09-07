import React, { useState, useEffect } from 'react';
import {
  getAllActivities,
  createActivity,
  updateActivity,
  deleteActivity
} from '../api/activities';
import {
  uploadImage,
  getAllImages,
  deleteImage
} from '../api/images';
import { Plus, X, Search, Trash2, Pencil, LayoutList, Grid3x3, Upload } from 'lucide-react';

const AllActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_id: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState('');

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const data = await getAllActivities({ size: pageSize, search });
      setActivities(data.data);
    } catch (err) {
      setError('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [pageSize, search]);

  const resetForm = () => {
    setFormData({ name: '', description: '', image_id: '' });
    setSelectedFile(null);
    setImagePreview(null);
    setEditingActivity(null);
    setShowForm(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImagePreview = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (editingActivity) {
      setFormData({ ...formData, image_id: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageId = formData.image_id;
      if (selectedFile) {
        const uploaded = await uploadImage(selectedFile, 'activity');
        imageId = uploaded.id;
      }
      
      if (editingActivity) {
        await updateActivity(editingActivity.id, { ...formData, image_id: imageId });
      } else {
        await createActivity({ ...formData, image_id: imageId });
      }
      resetForm();
      fetchActivities();
    } catch (err) {
      console.error(err);
      setError('Failed to save activity');
    }
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setFormData({
      name: activity.name,
      description: activity.description,
      image_id: activity.image?.id || ''
    });
    setImagePreview(activity.image?.url || null);
    setSelectedFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await deleteActivity(id);
        fetchActivities();
      } catch (err) {
        console.error(err);
        setError('Failed to delete activity');
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Activities</h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activities..."
            className="border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[10, 20, 50, 64, 100].map(size => (
              <option key={size} value={size}>{size} activities</option>
            ))}
          </select>
          <button
            onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
            className="border rounded-lg px-3 py-2 hover:bg-gray-50 flex items-center gap-1 transition-colors"
          >
            {viewMode === 'table' ? <Grid3x3 size={16} /> : <LayoutList size={16} />} View
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} /> Add Activity
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Activity Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-3">
                <label className="text-sm font-medium text-gray-700">Activity Image</label>
                <input 
                  type="file" 
                  onChange={handleImageChange} 
                  className="hidden"
                  accept="image/*"
                  id="activityImageUpload"
                />
                <button 
                  type="button"
                  onClick={() => document.getElementById('activityImageUpload').click()}
                  className="flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700 transition-colors"
                >
                  <Upload size={14} />
                  Upload Image
                </button>
              </div>
              
              {imagePreview && (
                <div className="relative inline-block">
                  <img src={imagePreview} alt="preview" className="h-20 w-20 object-cover rounded-lg border shadow-sm" />
                  <button
                    type="button"
                    onClick={removeImagePreview}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button 
                type="button" 
                onClick={resetForm} 
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                {editingActivity ? 'Update Activity' : 'Create Activity'}
              </button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="text-gray-500">Loading activities...</div>
        </div>
      )}

      {viewMode === 'table' && !loading && (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Image</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activities.map(activity => (
                <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    {activity.image?.url ? (
                      <img src={activity.image.url} alt={activity.name} className="h-12 w-12 object-cover rounded-lg border" />
                    ) : (
                      <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                        No image
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{activity.name}</td>
                  <td className="px-4 py-3 text-gray-600">{activity.description}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(activity)} 
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(activity.id)} 
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
        </div>
      )}

      {viewMode === 'card' && !loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {activities.map(activity => (
            <div key={activity.id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                {activity.image?.url ? (
                  <img src={activity.image.url} alt={activity.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="text-gray-400 text-sm">No image</div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2 text-gray-900">{activity.name}</h2>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{activity.description}</p>
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => handleEdit(activity)} 
                    className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(activity.id)} 
                    className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && activities.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No activities found</div>
          <button
            onClick={() => setShowForm(true)}
            className="text-blue-600 hover:text-blue-800"
          >
            Create your first activity
          </button>
        </div>
      )}
    </div>
  );
};

export default AllActivities;