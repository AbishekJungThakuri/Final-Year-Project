import axios from '../../services/axiosInstances';

export const getAllTransportRoutes = async ({
  page = 1,
  size = 50
} = {}) => {
  const params = {
    page,
    size,
  };

  const response = await axios.get(`/transport-routes/`, { params });
  return response.data;
};

export const getTransportServiceByCityId = async (cityId) => {
  const response = await axios.get(`/transport-routes/city/${cityId}`);
  return response.data;
};

// Create a transport routes
export const createTransportRoute = async (transportRouteData) => {
  const response = await axios.post(`/transport-routes/`, {
    start_city_id: transportRouteData.start_city_id,
    end_city_id: transportRouteData.end_city_id,
    route_category: "road",
    distance: transportRouteData.distance,
    average_duration: transportRouteData.average_duration,
    average_cost: transportRouteData.average_cost
  });
  return response.data;
};

export const updateTransportRoute = async (transportRouteId, transportRouteData) => {
  const response = await axios.put(`/transport-routes/${transportRouteId}`, {
    start_city_id: transportRouteData.start_city_id,
    end_city_id: transportRouteData.end_city_id,
    route_category: "road",
    distance: transportRouteData.distance,
    average_duration: transportRouteData.average_duration,
    average_cost: transportRouteData.average_cost
  });
  return response.data;
};

export const deleteTransportRoute = async (transportRouteId) => {
  const response = await axios.delete(`/transport-routes/${transportRouteId}`);
  return response.data;
};