import axios from 'axios';

const BASE_URL = 'http://localhost:8000'; 

export const getAllUsers = async ({
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

  const response = await axios.get(`${BASE_URL}/users/`, { params });
  return response.data.data;
};

export const getUserById = async (userId) => {
  const response = await axios.get(`${BASE_URL}/users/${userId}`);
  return response.data;
};