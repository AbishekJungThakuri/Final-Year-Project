import axios from 'axios';

const BASE_URL = 'http://localhost:8000'; 

export const getAllTransportServices = async ({
  search = '',
  sort_by = 'id',
  order = 'asc',
  page = 1,
  size = 50,
  route_category = null,
  transport_category = null
} = {}) => {
  const params = {
    search,
    sort_by,
    order,
    page,
    size,
  };

  if (route_category !== null) {
    params.route_category = route_category;
  }

  if (transport_category !== null) {
    params.transport_category = transport_category;
  }

  const response = await axios.get(`${BASE_URL}/transport-services/`, { params });
  return response.data.data;
};

export const getTransportServiceById = async (transportServiceId) => {
  const response = await axios.get(`${BASE_URL}/transport-services/${transportServiceId}`);
  return response.data;
};

// Create a transport service
export const createTransportService = async (transportServiceData) => {
  const response = await axios.post(`${BASE_URL}/transport-services/`, {
    route_ids: transportServiceData.route_ids || [],
    description: transportServiceData.description,
    image_ids: transportServiceData.image_ids || [],
    route_category: transportServiceData.route_category,
    transport_category: transportServiceData.transport_category,
    average_duration: transportServiceData.average_duration,
    cost: transportServiceData.cost
  });
  return response.data;
};

export const updateTransportService = async (transportServiceId, transportServiceData) => {
  const response = await axios.put(`${BASE_URL}/transport-services/${transportServiceId}`, transportServiceData);
  return response.data;
};

export const deleteTransportService = async (transportServiceId) => {
  const response = await axios.delete(`${BASE_URL}/transport-services/${transportServiceId}`);
  return response.data;
};