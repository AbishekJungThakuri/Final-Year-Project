// src/api/transportApi.js

import axios from '../../services/axiosInstances';
export const uploadImage = async (file, entity) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`/images?category=services`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};


export const searchCities = async (search) => {
  const response = await axios.get(`/cities/`, { params: { search } });
  return response.data;
};


export const getRoutesByCity = async (cityId) => {
  const response = await axios.get(`/transport-routes/city/${cityId}`);
  return response.data;
};