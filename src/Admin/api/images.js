import axios from '../../services/axiosInstances';

// Valid parameter options for dropdown
export const IMAGE_PARAMETERS = {
  USER_PROFILE: 'user_profile',
  PLACE: 'place',
  ACTIVITY: 'activity',
  SERVICES: 'services',
  OTHER: 'other'
};

// Get all images
export const getAllImages = async ({
  search = '',
  sort_by = 'id',
  order = 'asc',
  page = 1,
  size = 50,
  parameter = null,
  user_id = null
} = {}) => {
  try {
    const params = {};
    
    // Only add parameters if they have values
    if (search && search.trim() !== '') {
      params.search = search.trim();
    }
    
    if (sort_by) {
      params.sort_by = sort_by;
    }
    
    if (order) {
      params.order = order;
    }
    
    if (page) {
      params.page = page;
    }
    
    if (size) {
      params.size = size;
    }
    
    if (parameter !== null && parameter !== '') {
      params.parameter = parameter;
    }
    
    if (user_id !== null) {
      params.user_id = user_id;
    }
    
    const response = await axios.get(`/images/`, { params });
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};

// Get single image by ID
export const getImageById = async (imageId) => {
  try {
    if (!imageId) {
      throw new Error('Image ID is required');
    }
    
    const response = await axios.get(`/images/${imageId}`);
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};

// Upload image (requires parameter selection)
export const uploadImage = async (imageFile, parameter) => {
  try {
    // Validate inputs
    if (!imageFile) {
      throw new Error('Image file is required');
    }
    
    if (!parameter) {
      throw new Error('Parameter is required');
    }
    
    // Validate parameter
    if (!Object.values(IMAGE_PARAMETERS).includes(parameter)) {
      throw new Error('Invalid parameter. Must be one of: user_profile, place, activity, services, other');
    }
    
    const formData = new FormData();
    formData.append('file', imageFile);
    
    const response = await axios.post(`/images/?category=${parameter}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};

// Update image (requires ID)
export const updateImage = async (imageId, imageData) => {
  try {
    if (!imageId) {
      throw new Error('Image ID is required');
    }
    
    if (!imageData) {
      throw new Error('Image data is required');
    }
    
    const response = await axios.put(`/images/${imageId}`, imageData);
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};

// Delete image (requires ID)
export const deleteImage = async (imageId) => {
  try {
    if (!imageId) {
      throw new Error('Image ID is required');
    }
    
    const response = await axios.delete(`/images/${imageId}`);
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};