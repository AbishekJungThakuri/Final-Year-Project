import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});

// Load access token if available
const accessToken = localStorage.getItem('accessToken');
if (accessToken) {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
}

// ✅ Add response interceptor for token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized and not retried yet
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh_token')
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error("No refresh token found");
        }

        // Call refresh endpoint
        const res = await axios.post('http://localhost:8000/auth/refresh_token', {
          refresh_token: refreshToken,
        });

        const newAccessToken = res.data.data.access_token;

        // Save & set new access token
        localStorage.setItem('accessToken', newAccessToken);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (err) {
        // If refresh fails → force logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        delete axiosInstance.defaults.headers.common['Authorization'];
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
