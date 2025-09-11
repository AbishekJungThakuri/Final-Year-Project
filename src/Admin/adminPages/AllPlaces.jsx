import React, { useState, useEffect } from 'react';
import {
  getAllPlaces,
  createPlace,
  updatePlace,
  deletePlace
} from '../api/places';
import {
  uploadImage,
} from '../api/images';
import { getAllActivities } from '../api/activities'; // Import the activities API
import {
  Plus,
  X,
  Search,
  Trash2,
  Pencil,
  LayoutList,
  Grid3x3,
  Upload,
  RefreshCcw, // Added for reset
  MapPin,
  Clock,
  DollarSign,
  Route, // Placeholder for an activity icon
  Ticket,
} from 'lucide-react';
import Pagination from './Pagination';
import CityDropdown from './CityDropdown'; // Assuming this component exists
import ActivityDropdown from './ActivityDropdown'; // New component to be created

const PlaceActivitySection = ({ activities, onRemove }) => (
  <div className="space-y-3">
    {activities.map((activity, index) => (
      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col gap-3 relative">
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={16} />
        </button>
        <h4 className="font-semibold text-gray-800">Activity #{index + 1}</h4>
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-700">{activity.title}</span> ({activity.activity?.name || 'N/A'})
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">Duration: {activity.average_duration || 'N/A'} hrs</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">Cost: NPR {activity.average_cost || 'N/A'}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const MultiSelectCategory = ({ selectedCategories, onSelectChange }) => {
  const handleToggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      onSelectChange(selectedCategories.filter(c => c !== category));
    } else {
      onSelectChange([...selectedCategories, category]);
    }
  };
  const PLACE_CATEGORIES = [
    'natural',
    'cultural',
    'historic',
    'religious',
    'adventure',
    'wildlife',
    'educational',
    'architectural',
    'other',
  ];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {PLACE_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => handleToggleCategory(category)}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedCategories.includes(category)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

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
    categories: [],
    latitude: '',
    longitude: '',
    average_visit_duration: '',
    average_visit_cost: '',
    image_ids: []
  });

  

  
  // States for dynamic inputs
  const [selectedCity, setSelectedCity] = useState(null);
  const [placeActivities, setPlaceActivities] = useState([]);
  const [currentActivity, setCurrentActivity] = useState({
    activity_id: '',
    title: '',
    description: '',
    average_duration: '',
    average_cost: '',
  });

  // States for images
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  
  // States for categories
  const [categoryInput, setCategoryInput] = useState('');
  
  // Pagination and search states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const data = await getAllPlaces({ 
        size: pageSize, 
        page: currentPage,
        search 
      });
      setPlaces(data.data || []);
      setTotalPages(Math.ceil(data.total / data.size) || 0);
      setTotalItems(data.total || 0);
    } catch (err) {
      setError('Failed to load places');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, [currentPage, pageSize, search]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [search, pageSize]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      categories: [],
      latitude: '',
      longitude: '',
      average_visit_duration: '',
      average_visit_cost: '',
      image_ids: []
    });
    setSelectedFiles([]);
    setImagePreviews([]);
    setCategoryInput('');
    setEditingPlace(null);
    setShowForm(false);
    setSelectedCity(null);
    setPlaceActivities([]);
    setCurrentActivity({
      activity_id: '',
      title: '',
      description: '',
      average_duration: '',
      average_cost: '',
    });
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

  const handleAddCategory = () => {
    if (categoryInput.trim() && !formData.categories.includes(categoryInput.trim())) {
      setFormData({ 
        ...formData, 
        categories: [...formData.categories, categoryInput.trim()] 
      });
      setCategoryInput('');
    }
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter(cat => cat !== categoryToRemove)
    });
  };

  const handleCategoryInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCategory();
    }
  };

  const handleAddActivity = () => {
    if (currentActivity.activity_id && currentActivity.title) {
      setPlaceActivities([...placeActivities, {
        ...currentActivity,
        activity_id: currentActivity.activity_id,
      }]);
      // Reset current activity form fields
      setCurrentActivity({
        activity_id: '',
        title: '',
        description: '',
        average_duration: '',
        average_cost: '',
      });
    }
  };

  const handleRemoveActivity = (index) => {
    const newActivities = [...placeActivities];
    newActivities.splice(index, 1);
    setPlaceActivities(newActivities);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageIds = [...formData.image_ids];
      for (const file of selectedFiles) {
        const res = await uploadImage(file, 'place');
        imageIds.push(res.id);
      }

      const payload = {
        ...formData,
        city_id: selectedCity.id,
        image_ids: imageIds,
        activities: placeActivities.map(act => ({
          activity_id: act.activity_id,
          title: act.title,
          description: act.description,
          average_duration: act.average_duration,
          average_cost: act.average_cost,
        })),
      };

      if (editingPlace) {
        await updatePlace(editingPlace.id, payload);
      } else {
        await createPlace(payload);
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
      categories: place.categories || [],
      latitude: place.latitude,
      longitude: place.longitude,
      average_visit_duration: place.average_visit_duration,
      average_visit_cost: place.average_visit_cost,
      image_ids: place.images?.map(img => img.id) || []
    });
    setImagePreviews([...place.images?.map(img => img.url) || []]);
    setSelectedFiles([]);
    setSelectedCity(place.city || null);
    const mappedActivities = (place.place_activities || []).map(placeActivity => ({
      activity_id: placeActivity.activity?.id || placeActivity.activity_id,
      title: placeActivity.title,
      description: placeActivity.description,
      average_duration: placeActivity.average_duration,
      average_cost: placeActivity.average_cost,
      activity: placeActivity.activity 
    }));
  
    setPlaceActivities(mappedActivities || []);
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
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

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 h-full w-full bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingPlace ? 'Edit Place' : 'Add New Place'}
                </h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Place Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Phewa Lake" 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select City *</label>
                    <CityDropdown
                      selectedCity={selectedCity}
                      onCitySelect={setSelectedCity}
                      placeholder="Search and select city..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitude *</label>
                    <input 
                      type="text" 
                      placeholder="28.2096" 
                      value={formData.latitude} 
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitude *</label>
                    <input 
                      type="text" 
                      placeholder="83.9856" 
                      value={formData.longitude} 
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                      required 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea 
                    placeholder="Brief description of the place" 
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-24"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Avg. Visit Duration (hours)</label>
                    <input 
                      type="number" 
                      placeholder="e.g., 3" 
                      value={formData.average_visit_duration} 
                      onChange={(e) => setFormData({ ...formData, average_visit_duration: e.target.value })} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Avg. Visit Cost (NPR)</label>
                    <input 
                      type="number" 
                      placeholder="e.g., 500" 
                      value={formData.average_visit_cost} 
                      onChange={(e) => setFormData({ ...formData, average_visit_cost: e.target.value })} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                    />
                  </div>
                </div>

                {/* Categories Section */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Categories</label>
                  <MultiSelectCategory
                    selectedCategories={formData.categories}
                    onSelectChange={(newCategories) => setFormData({ ...formData, categories: newCategories })}
                  />
                </div>


                {/* Activities Section */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-700 border-b border-gray-200 pb-2">Activities at this Place</h3>
                  {placeActivities.length > 0 && (
                    <PlaceActivitySection activities={placeActivities} onRemove={handleRemoveActivity} />
                  )}
                  <div className="bg-gray-100 rounded-lg p-4 space-y-3">
                    <h4 className="font-semibold text-gray-800">Add New Activity</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Activity Type</label>
                        <ActivityDropdown
                          selectedActivity={currentActivity.activity_id}
                          onActivitySelect={(activity) => setCurrentActivity({ ...currentActivity, activity_id: activity.id, activity: activity })}
                          placeholder="Search for an activity..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                          type="text"
                          value={currentActivity.title}
                          onChange={(e) => setCurrentActivity({ ...currentActivity, title: e.target.value })}
                          placeholder="Title for this activity"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Avg. Duration (hours)</label>
                        <input
                          type="number"
                          value={currentActivity.average_duration}
                          onChange={(e) => setCurrentActivity({ ...currentActivity, average_duration: e.target.value })}
                          placeholder="e.g., 2"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Avg. Cost (NPR)</label>
                        <input
                          type="number"
                          value={currentActivity.average_cost}
                          onChange={(e) => setCurrentActivity({ ...currentActivity, average_cost: e.target.value })}
                          placeholder="e.g., 1000"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={currentActivity.description}
                          onChange={(e) => setCurrentActivity({ ...currentActivity, description: e.target.value })}
                          placeholder="Description of this specific activity"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                          rows="2"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddActivity}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <Plus size={16} />
                      Add Activity
                    </button>
                  </div>
                </div>
              
                {/* Image Upload Section */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Images</label>
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
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activities</th>
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
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {place.city?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {place.categories?.map((category, index) => (
                            <span 
                              key={index}
                              className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                            >
                              {category}
                            </span>
                          )) || <span className="text-gray-400 text-sm">No categories</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {place.place_activities?.map((activity, index) => (
                            <span 
                              key={index}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                            >
                              <Ticket size={12} className="mr-1" />
                              {activity.title}
                            </span>
                          )) || <span className="text-gray-400 text-sm">No activities</span>}
                        </div>
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
                  </div>
                  <div className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                    <MapPin size={14} className="text-gray-400" />
                    {place.city?.name || 'N/A'}
                  </div>
                  
                  {/* Categories */}
                  {place.categories?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {place.categories.map((category, index) => (
                        <span 
                          key={index}
                          className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Activities */}
                  {place.place_activities?.length > 0 && (
                    <div className="mb-3 space-y-1">
                      <div className="text-sm font-semibold text-gray-700">Activities:</div>
                      {place.place_activities.map((activity, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <Ticket size={14} className="mr-2 text-green-500" />
                          <span>{activity.title}</span>
                        </div>
                      ))}
                    </div>
                  )}

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

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={[10, 20, 50, 100]}
        />

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