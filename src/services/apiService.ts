import axios from 'axios';
import { toast } from 'react-toastify';
import logger from '@/lib/logger';
import { BASE_URL } from '@/constants';
import { getToken } from '@/lib/utils';
// Create an Axios instance with default configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor: attach token if present
apiClient.interceptors.request.use(
  (config) => {
    // 1. Attempt to get token from local storage
    const token = getToken('token');
    // 2. If not found there, try cookies (optional):
    // const cookieToken = getCookie('token'); // you’d need a getCookie helper
    // 3. Attach whichever token you find
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // if (!token && cookieToken) {
    //   config.headers.Authorization = `Bearer ${cookieToken}`;
    // }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Response interceptor  for handling errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;

    if (!expectedError) {
      logger.log(error);
      toast.error('An unexpected error occurred.');
    }

    console.error('API error:', error);
    return Promise.reject(error);
  }
);

// Axios service for making GET and POST requests

const apiService = {
  // GET request
  get: async (endpoint: string, params = {}, config: object = {}) => {
    try {
      const response = await apiClient.get(endpoint, { params, ...config });
      return response;
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    }
  },

  // POST request
  post: async (endpoint: string, data: any, config: object = {}) => {
    try {
      const response = await apiClient.post(endpoint, data, config);
      return response;
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error);
      throw error;
    }
  },
  // PUT request
  put: async (endpoint: string, data: any, config: object = {}) => {
    try {
      const response = await apiClient.put(endpoint, data, config);
      return response;
    } catch (error) {
      console.error(`PUT ${endpoint} failed:`, error);
      throw error;
    }
  },

  // PATCH request
  patch: async (endpoint: string, data: any, config: object = {}) => {
    try {
      const response = await apiClient.patch(endpoint, data, config);
      return response;
    } catch (error) {
      console.error(`PATCH ${endpoint} failed:`, error);
      throw error;
    }
  },

  // DELETE request
  delete: async (endpoint: string, config: object = {}) => {
    try {
      const response = await apiClient.delete(endpoint, config);
      return response;
    } catch (error) {
      console.error(`DELETE ${endpoint} failed:`, error);
      throw error;
    }
  },
};
export default apiService;
