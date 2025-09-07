import axios from '../../services/axiosInstances';
const BASE_URL = 'http://localhost:8000'; 

export const getAllAccommodationServices = async ({
  search = '',
  sort_by = 'id',
  order = 'asc',
  page = 1,
  size = 50,
  city_id = null,
  accommodation_category = null
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

  if (accommodation_category !== null) {
    params.accommodation_category = accommodation_category;
  }

  const response = await axios.get(`${BASE_URL}/accommodation-services/`, { params });
  return response.data;
};

export const getAccommodationServiceById = async (accommodationServiceId) => {
  const response = await axios.get(`${BASE_URL}/accommodation-services/${accommodationServiceId}`);
  return response.data;
};

// Create an accommodation service
export const createAccommodationService = async (accommodationServiceData) => {
  const response = await axios.post(`${BASE_URL}/accommodation-services/`, {
    name: accommodationServiceData.name,
    description: accommodationServiceData.description,
    city_id: accommodationServiceData.city_id,
    full_address: accommodationServiceData.full_address,
    accomodation_category: accommodationServiceData.accomodation_category,
    longitude: accommodationServiceData.longitude,
    latitude: accommodationServiceData.latitude,
    cost_per_night: accommodationServiceData.cost_per_night,
    image_ids: accommodationServiceData.image_ids || []
  });
  return response.data;
};

export const updateAccommodationService = async (accommodationServiceId, accommodationServiceData) => {
  const response = await axios.put(`${BASE_URL}/accommodation-services/${accommodationServiceId}`, accommodationServiceData);
  return response.data;
};

export const deleteAccommodationService = async (accommodationServiceId) => {
  const response = await axios.delete(`${BASE_URL}/accommodation-services/${accommodationServiceId}`);
  return response.data;
};