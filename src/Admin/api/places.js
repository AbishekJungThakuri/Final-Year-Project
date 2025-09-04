import axios from 'axios';

const BASE_URL = 'http://localhost:8000'; 

export const getAllPlaces = async ({
  search = '',
  sort_by = 'id',
  order = 'asc',
  page = 1,
  size = 50,
  city_id = null
} = {}) => {
  const params = {
    search,
    sort_by,
    order,
    page,
    size,
  };

  if (city_id !== null) {
    params.city_id = city_id;
  }

  const response = await axios.get(`${BASE_URL}/places/`, { params });
  return response.data.data;
};

export const getPlaceById = async (placeId) => {
  const response = await axios.get(`${BASE_URL}/places/${placeId}`);
  return response.data;
};

// Create a place
export const createPlace = async (placeData) => {
  const response = await axios.post(`${BASE_URL}/places/`, {
    name: placeData.name,
    category: placeData.category,
    longitude: placeData.longitude,
    latitude: placeData.latitude,
    description: placeData.description,
    city_id: placeData.city_id,
    average_visit_duration: placeData.average_visit_duration,
    average_visit_cost: placeData.average_visit_cost,
    activities: placeData.activities || [],
    image_ids: placeData.image_ids || []
  });
  return response.data;
};

export const updatePlace = async (placeId, placeData) => {
  const response = await axios.put(`${BASE_URL}/places/${placeId}`, placeData);
  return response.data;
};

export const deletePlace = async (placeId) => {
  const response = await axios.delete(`${BASE_URL}/places/${placeId}`);
  return response.data;
};