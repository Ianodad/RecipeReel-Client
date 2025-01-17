import apiService from '@/services/apiService';
import { BASE_URL } from '@/constants';

// const handleRequest = async <T>(
//   request: Promise<AxiosResponse<T>>,
// ): Promise<T> => {
//   try {
//     const response = await request;
//     return response.data;
//   } catch (error) {
//     console.error(
//       `<message>${error.message} Error: ${error.operation}</message>`,
//     );
//     throw error;
//   }
// };
// Auth service functions
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await apiService.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const registerUser = async (userData: any) => {
  try {
    const response = await apiService.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

export const forgotUserPassword = async (email: any) => {
  try {
    const response = await apiService.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error('Forgot password request failed:', error);
    throw error;
  }
};

export const resetUserPassword = async (token: any, newPassword: any) => {
  try {
    const response = await apiService.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error('Password reset failed:', error);
    throw error;
  }
};