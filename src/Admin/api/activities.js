import axios from '../../services/axiosInstances';

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

  const response = await axios.get(`/activities/`, { params });
  return response.data;
};

export const getActivityById = async (activityId) => {
  const response = await axios.get(`/activities/${activityId}`);
  return response.data;
};

// Create an activity
export const createActivity = async (activityData) => {
  const response = await axios.post(`/activities/`, {
    name: activityData.name,
    description: activityData.description,
    image_id: activityData.image_id
  });
  return response.data;
};

export const updateActivity = async (activityId, activityData) => {
  const response = await axios.put(`/activities/${activityId}`, activityData);
  return response.data;
};

export const deleteActivity = async (activityId) => {
  const response = await axios.delete(`/activities/${activityId}`);
  return response.data;
};