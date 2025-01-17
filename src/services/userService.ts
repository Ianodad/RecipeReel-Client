import apiService from '@/services/apiService';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Contributor' | 'Viewer';
}

export interface UpdateUserData {
  name?: string;
  email?: string;
}

export interface UpdateUserRoleData {
  role: 'Admin' | 'Contributor' | 'Viewer';
}

// Get all users (Admin or authorized role only)
export const getAllUsers = async (): Promise<User[]> => {
  console.log('heere');
  try {
    const response = await apiService.get('/users');
    console.log('response', response);
    return response.data.users;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiService.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId: string): Promise<User> => {
  try {
    const response = await apiService.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch user ${userId}:`, error);
    throw error;
  }
};

// Update user
export const updateUser = async (userId: string, updateData: UpdateUserData): Promise<User> => {
  try {
    const response = await apiService.put(`/users/${userId}`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update user ${userId}:`, error);
    throw error;
  }
};

// Update user role (Admin only)
export const updateUserRole = async (userId: string, roleData: UpdateUserRoleData): Promise<User> => {
  try {
    const response = await apiService.patch(`/users/${userId}/role`, roleData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update role for user ${userId}:`, error);
    throw error;
  }
};

// Delete user (Admin only)
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await apiService.delete(`/users/${userId}`);
  } catch (error) {
    console.error(`Failed to delete user ${userId}:`, error);
    throw error;
  }
};
