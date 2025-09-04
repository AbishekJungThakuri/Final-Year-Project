import axios from 'axios';

const BASE_URL = 'http://localhost:8000'; 

export const getAllActivities = async ({
  search = '',
  sort_by = 'id',
  order = 'asc',
  page = 1,
  size = 50
} = {}) => {
  const params = {
    search,
    sort_by,
    order,
    page,
    size,
  };

  const response = await axios.get(`${BASE_URL}/activities/`, { params });
  return response.data.data;
};

export const getActivityById = async (activityId) => {
  const response = await axios.get(`${BASE_URL}/activities/${activityId}`);
  return response.data;
};

// Create an activity
export const createActivity = async (activityData) => {
  const response = await axios.post(`${BASE_URL}/activities/`, {
    name: activityData.name,
    description: activityData.description,
    image_id: activityData.image_id
  });
  return response.data;
};

export const updateActivity = async (activityId, activityData) => {
  const response = await axios.put(`${BASE_URL}/activities/${activityId}`, activityData);
  return response.data;
};

export const deleteActivity = async (activityId) => {
  const response = await axios.delete(`${BASE_URL}/activities/${activityId}`);
  return response.data;
};