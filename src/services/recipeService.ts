import apiService from '@/services/apiService';
import { BASE_URL } from '@/constants';

// Types
interface Recipe {
  _id: string;
  title: string;
  description: string;
  category: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  image: string;
}

interface Ingredient {
  name: string;
  quantity: string;
}

interface CreateRecipeData {
  title: string;
  description: string;
  ingredients?: Ingredient[];
  instructions?: string;
  category?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  image?: string;
}
interface RecipeData {
  recipes: Recipe[];
  totalPages: number;
}

interface UpdateRecipeData {
  _id?: string;
  title?: string;
  description?: string;
  ingredients?: Ingredient[];
  instructions?: string;
  category?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  image?: string;
}

// Get all recipes
// Types for query parameters
interface RecipeQueryParams {
  search?: string;
  category?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
  status?: string;
}

// Updated getAllRecipes without pagination response
export const getAllRecipes = async (params: RecipeQueryParams = {}): Promise<RecipeData> => {
  try {
    // Convert params to query string parameters
    const queryParams = new URLSearchParams();

    // Add search parameter if exists
    if (params.search) {
      queryParams.append('search', params.search);
    }

    // Add category filter if exists
    if (params.category) {
      queryParams.append('category', params.category);
    }

    // Add sorting if exists
    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }

    // Add pagination parameters with defaults
    queryParams.append('page', String(params.page || 1));
    queryParams.append('limit', String(params.limit || 10));

    // Add status filter (default to approved)
    queryParams.append('status', params.status || 'approved');
    // Make the API call with query parameters
    const response = await apiService.get(`/recipes?${queryParams.toString()}`);
    console.log('responseALl', response.data);

    // Return the array of recipes directly
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch recipes:', error);
    throw error;
  }
};

// Get recipe by ID
export const getRecipeById = async (recipeId: string): Promise<Recipe> => {
  console.log('recipeId', recipeId);
  try {
    const response = await apiService.get(`/recipes/${recipeId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch recipe ${recipeId}:`, error);
    throw error;
  }
};

export const getRecipesByUser = async () => {
  try {
    const response = await apiService.get(`/recipes/user`);
    console.log('getRecipesByUser', response);
    return response.data.recipes;
  } catch (error) {
    console.error(`Failed to user fetch recipe `);
    throw error;
  }
};
// Create new recipe
export const createRecipe = async (recipeData: CreateRecipeData): Promise<Recipe> => {
  // console.log('recipeData', recipeData);
  try {
    const response = await apiService.post('/recipes', recipeData);
    return response.data;
  } catch (error) {
    console.error('Failed to create recipe:', error);
    throw error;
  }
};

// Update recipe
export const updateRecipe = async (recipeId: string | number, updateData: UpdateRecipeData): Promise<Recipe> => {
  try {
    const response = await apiService.put(`/recipes/${recipeId}`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update recipe ${recipeId}:`, error);
    throw error;
  }
};

// Delete recipe
export const deleteRecipe = async (recipeId: string | number): Promise<void> => {
  try {
    await apiService.delete(`/recipes/${recipeId}`);
  } catch (error) {
    console.error(`Failed to delete recipe ${recipeId}:`, error);
    throw error;
  }
};

// // Approve recipe (admin only)
// export const approveRecipe = async (recipeId: string): Promise<Recipe> => {
//   try {
//     const response = await apiService.patch(`/api/recipes/${recipeId}/approve`);
//     return response.data;
//   } catch (error) {
//     console.error(`Failed to approve recipe ${recipeId}:`, error);
//     throw error;
//   }
// };
