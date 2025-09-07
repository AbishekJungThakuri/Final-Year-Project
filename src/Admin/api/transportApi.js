// src/api/transportApi.js

import axios from '../../services/axiosInstances';
const BASE_URL = 'http://localhost:8000';

/**
 * Fetches all transport services.
 * @param {object} params - Pagination and filter parameters.
 */
export const getAllTransportServices = async ({
  search = '',
  sort_by = 'id',
  order = 'asc',
  page = 1,
  size = 50,
  route_category = null,
  transport_category = null
} = {}) => {
  const params = { search, sort_by, order, page, size };
  if (route_category !== null) params.route_category = route_category;
  if (transport_category !== null) params.transport_category = transport_category;
  const response = await axios.get(`${BASE_URL}/transport-services/`, { params });
  return response.data;
};

/**
 * Creates a new transport service.
 * @param {object} payload - The service data.
 */
export const createTransportService = async (payload) => {
  const response = await axios.post(`${BASE_URL}/transport-services/`, payload);
  return response.data;
};

/**
 * Updates an existing transport service.
 * @param {string} id - The ID of the service to update.
 * @param {object} payload - The updated service data.
 */
export const updateTransportService = async (id, payload) => {
  const response = await axios.put(`${BASE_URL}/transport-services/${id}`, payload);
  return response.data;
};

/**
 * Deletes a transport service.
 * @param {string} id - The ID of the service to delete.
 */
export const deleteTransportService = async (id) => {
  const response = await axios.delete(`${BASE_URL}/transport-services/${id}`);
  return response.data;
};

/**
 * Uploads an image.
 * @param {File} file - The image file to upload.
 * @param {string} entity - The entity type (e.g., 'transport_services').
 */
export const uploadImage = async (file, entity) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${BASE_URL}/images?category=services`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

/**
 * Fetches cities by a search query.
 * @param {string} search - The search term for cities.
 */
export const searchCities = async (search) => {
  const response = await axios.get(`${BASE_URL}/cities/`, { params: { search } });
  return response.data;
};

/**
 * Fetches transport routes from a specific city.
 * @param {number} cityId - The ID of the starting city.
 */
export const getRoutesByCity = async (cityId) => {
  const response = await axios.get(`${BASE_URL}/transport-routes/city/${cityId}`);
  return response.data;
};