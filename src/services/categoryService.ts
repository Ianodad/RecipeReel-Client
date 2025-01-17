import apiService from '@/services/apiService';
import { BASE_URL } from '@/constants';

// Types
export interface Category {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  recipeCount?: number;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  icon?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
}

// Get all categories
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiService.get('/category');
    console.log('response.data.categories', response.data.categories);
    return response.data.categories;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw error;
  }
};

// Get category by ID
export const getCategoryById = async (categoryId: string): Promise<Category> => {
  try {
    const response = await apiService.get(`/category/${categoryId}`);
    return response.data.category;
  } catch (error) {
    console.error(`Failed to fetch category ${categoryId}:`, error);
    throw error;
  }
};

// Create new category
export const createCategory = async (categoryData: CreateCategoryData): Promise<Category> => {
  try {
    const response = await apiService.post('/category', categoryData);
    return response.data.category;
  } catch (error) {
    console.error('Failed to create category:', error);
    throw error;
  }
};

// Update category
export const updateCategory = async (categoryId: string, updateData: UpdateCategoryData): Promise<Category> => {
  try {
    const response = await apiService.put(`/category/${categoryId}`, updateData);
    return response.data.category;
  } catch (error) {
    console.error(`Failed to update category ${categoryId}:`, error);
    throw error;
  }
};

// Delete category
export const deleteCategory = async (categoryId: number): Promise<void> => {
  try {
    await apiService.delete(`/category/${categoryId}`);
  } catch (error) {
    console.error(`Failed to delete category ${categoryId}:`, error);
    throw error;
  }
};
