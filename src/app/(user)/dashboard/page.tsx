'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  ChefHat,
  Star,
  Users,
  Settings,
  PlusCircle,
  Trash,
  Edit,
  BarChart,
  Heart,
  Clock,
  FolderPlus,
} from 'lucide-react';
import { RecipeModal, UserItem } from '@/components/common';
import CategoryModal from '@/components/common/CategoryModal';
import { RecipeItem } from '@/components/common/RecipeItem';
import { CategoryItem } from '@/components/common/CategoryItem';
import {
  getAllCategories,
  deleteCategory,
  Category,
  createCategory,
  getAllUsers,
  updateUserRole,
  deleteUser,
  User,
  getRecipesByUser,
  getAllRecipes,
} from '@/services';
import { useUserStore } from '@/zustand';
const DashboardPage = () => {
  const { role: userRole } = useUserStore();

  // ---------------------------
  // State for users
  // ---------------------------
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  // ---------------------------
  // State for categories
  // ---------------------------
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------------------------
  // State for recipes
  // ---------------------------
  const [recipes, setRecipes] = useState<any[]>([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [recipeError, setRecipeError] = useState<string | null>(null);

  console.log('userRole', userRole);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        setError('Failed to load categories');
        console.error('Error fetching categories:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      if (userRole === 'Admin') {
        try {
          setIsLoadingUsers(true);
          const data = await getAllUsers();
          console.log('user data', data);
          setUsers(data);
        } catch (err) {
          setUserError('Failed to load users');
          console.error('Error fetching users:', err);
        } finally {
          setIsLoadingUsers(false);
        }
      } else {
        console.log('Not authorized to fetch users');
        setIsLoadingUsers(false);
      }
    };

    // Only fetch if user is Admin or Contributor
    // (Your original code commented out — you can decide how you want to handle it)
    // if (userRole === 'Admin' || userRole === 'Contributor') {
    //   fetchUsers();
    // } else {
    //   setIsLoadingUsers(false);
    // }

    // For demo, fetch unconditionally
    fetchUsers();
  }, [userRole]);

  // ---------------------------
  // NEW: Fetch recipes
  // ---------------------------
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoadingRecipes(true);

        if (userRole === 'Admin') {
          // Fetch all recipes
          console.log('admin');
          const data = await getAllRecipes(); // e.g. getAllRecipes({ status: 'approved' })
          setRecipes(data);
        } else if (userRole === 'Contributor') {
          // Fetch recipes belonging to the logged-in user
        console.log('Contributor', userRole);

          const data = await getRecipesByUser();
          setRecipes(data);
        } else {
          // If Viewer (or any other role), you can decide what to do,
          // e.g., fetch nothing or fetch publicly available recipes
          setRecipes([]);
        }
      } catch (error) {
        setRecipeError('Failed to load recipes');
        console.error('Error fetching recipes:', error);
      } finally {
        setIsLoadingRecipes(false);
      }
    };

    fetchRecipes();
  }, [userRole]);

  // Mocked user data (for your Profile Header)
  const userData = {
    name: 'John Doe',
    email: 'john@example.com',
    joinDate: 'January 2024',
    avatar: '/api/placeholder/40/40',
  };

  // Example stats data
  const stats = {
    recipes: 24,
    followers: 156,
    likes: 1234,
    views: 45600,
  };

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------
  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await deleteCategory(categoryId);
      setCategories((prevCategories) => prevCategories.filter((cat) => cat.id !== categoryId));
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const handleCreateCategory = async (category: Category) => {
    try {
      // Optimistic update
      setCategories((prevCategories) => [...prevCategories, category]);

      // Make the API call
      const res = await createCategory(category);

      // Update the category with server response
      setCategories((prevCategories) =>
        prevCategories.map((cat) => (cat.id === category.id ? { ...cat, ...res } : cat))
      );

      console.log('Category created:', res);
    } catch (error) {
      // Revert if fail
      setCategories((prevCategories) => prevCategories.filter((cat) => cat.id !== category.id));
      console.error('Failed to create category:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Optimistic update
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      // Make API call
      await deleteUser(userId);
    } catch (error) {
      // Revert if fail
      console.error('Failed to delete user:', error);
      setUserError('Failed to delete user. Please try again.');
    }
  };

  const handleEditUser = async (userId: string, updatedData: Partial<User>) => {
    try {
      // Optimistic update
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, ...updatedData } : user)));

      // Make API call (assuming updateUser is a function you have)
      if ('role' in updatedData) {
        await updateUserRole(userId, { role: updatedData.role as User['role'] });
      } else {
        // If you have a separate `updateUser` service:
        // await updateUser(userId, updatedData);
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      setUserError('Failed to update user. Please try again.');
    }
  };

  // If you want to allow recipe deletion from the UI
  const handleDeleteRecipe = (recipeId: string | number) => {
    setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== recipeId));
  };

  // --------------------------------------------------
  // Contributor (and Admin) Dashboard
  // --------------------------------------------------
  const ContributorDashboard = () => (
    <>
      <div className='space-y-6'>
        {/* Quick Stats */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
          <Card className='border-2 border-black'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-500'>Total Recipes</p>
                  <h3 className='text-2xl font-bold'>{stats.recipes}</h3>
                </div>
                <ChefHat className='h-8 w-8 text-black' />
              </div>
            </CardContent>
          </Card>
          <Card className='border-2 border-black'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-500'>Followers</p>
                  <h3 className='text-2xl font-bold'>{stats.followers}</h3>
                </div>
                <Users className='h-8 w-8 text-black' />
              </div>
            </CardContent>
          </Card>
          <Card className='border-2 border-black'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-500'>Total Likes</p>
                  <h3 className='text-2xl font-bold'>{stats.likes}</h3>
                </div>
                <Heart className='h-8 w-8 text-black' />
              </div>
            </CardContent>
          </Card>
          <Card className='border-2 border-black'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-500'>Total Views</p>
                  <h3 className='text-2xl font-bold'>{stats.views}</h3>
                </div>
                <BarChart className='h-8 w-8 text-black' />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Tabbed Content */}
      <Tabs defaultValue='recipes' className='mt-5 w-full'>
        <TabsList className='mb-0 grid w-full grid-cols-3'>
          <TabsTrigger value='recipes' className='text-lg'>
            {userRole === 'Admin' ? 'All Recipes' : 'My Recipes'}
          </TabsTrigger>
          {userRole === 'Admin' && (
            <>
              <TabsTrigger value='categories' className='text-lg'>
                Categories
              </TabsTrigger>
              <TabsTrigger value='users' className='text-lg'>
                Users
              </TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Recipes Tab */}
        <TabsContent value='recipes'>
          <Card className='border-2 border-black'>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle>{userRole === 'Admin' ? 'All Recipes' : 'My Recipes'}</CardTitle>
              <RecipeModal
                trigger={
                  <Button className='bg-black text-white hover:bg-gray-800'>
                    <PlusCircle className='mr-2 h-4 w-4' />
                    New Recipe
                  </Button>
                }
              />
            </CardHeader>
            <CardContent>
              {isLoadingRecipes ? (
                <div className='flex justify-center py-6'>
                  <p>Loading recipes...</p>
                </div>
              ) : recipeError ? (
                <div className='flex justify-center py-6 text-red-500'>
                  <p>{recipeError}</p>
                </div>
              ) : !recipes || recipes.length === 0  ? (
                <div className='flex justify-center py-6'>
                  <p>No recipes on the list.</p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {recipes.map((recipe) => (
                    <RecipeItem key={recipe.id} recipe={recipe} onDelete={handleDeleteRecipe} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Section */}
        {userRole === 'Admin' && (
          <>
            <TabsContent value='categories'>
              <Card className='border-2 border-black'>
                <CardHeader className='flex flex-row items-center justify-between'>
                  <CardTitle>Recipe Categories</CardTitle>
                  <div className='flex items-center space-x-2'>
                    <CategoryModal
                      trigger={
                        <Button className='bg-black text-white hover:bg-gray-800'>
                          <PlusCircle className='mr-2 h-4 w-4' />
                          Add Category
                        </Button>
                      }
                      onSubmitCategory={handleCreateCategory}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className='flex justify-center py-6'>
                      <p>Loading categories...</p>
                    </div>
                  ) : error ? (
                    <div className='flex justify-center py-6 text-red-500'>
                      <p>{error}</p>
                    </div>
                  ) : (
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                      {categories.map((category) => (
                        <CategoryItem key={category.id} category={category} onDelete={handleDeleteCategory} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='users'>
              <Card className='border-2 border-black'>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingUsers ? (
                    <div className='flex justify-center py-6'>
                      <p>Loading users...</p>
                    </div>
                  ) : userError ? (
                    <div className='flex justify-center py-6 text-red-500'>
                      <p>{userError}</p>
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      {users?.map((user) => (
                        <UserItem key={user._id} user={user} onEdit={handleEditUser} onDelete={handleDeleteUser} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </>
  );

  // --------------------------------------------------
  // (Optional) Admin-Only Dashboard Example
  // --------------------------------------------------
  const AdminDashboard = () => (
    <div className='space-y-6'>
      {/* Admin Stats */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <Card className='border-2 border-black'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-500'>Total Users</p>
                <h3 className='text-2xl font-bold'>2,456</h3>
              </div>
              <Users className='h-8 w-8 text-black' />
            </div>
          </CardContent>
        </Card>
        <Card className='border-2 border-black'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-500'>Total Recipes</p>
                <h3 className='text-2xl font-bold'>12,345</h3>
              </div>
              <ChefHat className='h-8 w-8 text-black' />
            </div>
          </CardContent>
        </Card>
        <Card className='border-2 border-black'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-500'>Pending Reviews</p>
                <h3 className='text-2xl font-bold'>45</h3>
              </div>
              <Clock className='h-8 w-8 text-black' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className='border-2 border-black'>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {[1, 2, 3].map((item) => (
              <div key={item} className='flex items-center justify-between rounded-lg border-2 border-black p-4'>
                <div className='flex items-center space-x-4'>
                  <Avatar>
                    <AvatarImage src={userData.avatar} />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-medium'>New recipe submitted</p>
                    <p className='text-sm text-gray-500'>by Jane Smith</p>
                  </div>
                </div>
                <div className='flex items-center space-x-2'>
                  <Badge>Pending Review</Badge>
                  <Button variant='outline' size='sm' className='border-2 border-black'>
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // --------------------------------------------------
  // (Optional) Viewer Dashboard Example
  // --------------------------------------------------
  const ViewerDashboard = () => (
    <div className='space-y-6'>
      {/* Saved Recipes */}
      <Card className='border-2 border-black'>
        <CardHeader>
          <CardTitle>Saved Recipes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {[1, 2, 3].map((item) => (
              <div key={item} className='flex items-center justify-between rounded-lg border-2 border-black p-4'>
                <div className='flex items-center space-x-4'>
                  <img src='/api/placeholder/60/60' alt='Recipe' className='w-15 h-15 rounded-lg object-cover' />
                  <div>
                    <h3 className='font-semibold'>Chocolate Cake</h3>
                    <p className='text-sm text-gray-500'>Saved 2 days ago</p>
                  </div>
                </div>
                <Button variant='outline' className='border-2 border-black'>
                  View Recipe
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className='border-2 border-black'>
        <CardHeader>
          <CardTitle>My Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {[1, 2, 3].map((item) => (
              <div key={item} className='flex items-center justify-between rounded-lg border-2 border-black p-4'>
                <div className='flex items-center space-x-4'>
                  <Star className='h-5 w-5 text-yellow-400' />
                  <div>
                    <p className='font-medium'>You rated Italian Pasta</p>
                    <p className='text-sm text-gray-500'>2 days ago</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        {/* Profile Header */}
        <div className='mb-8'>
          <div className='mb-6 flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <Avatar className='h-16 w-16'>
                <AvatarImage src={userData.avatar} />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <h1 className='text-2xl font-bold'>{userData.name}</h1>
                <p className='text-gray-500'>Member since {userData.joinDate}</p>
              </div>
            </div>
            <Button variant='outline' className='border-2 border-black'>
              <Settings className='mr-2 h-4 w-4' />
              Settings
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        {(userRole === 'Contributor' || userRole === 'Admin') && <ContributorDashboard />}
        {/* If you want Admin to see a separate dashboard, you could do: */}
        {/* {userRole === 'Admin' && <AdminDashboard />} */}

        {/* If the user is purely a Viewer, you might do: */}
        {/* {userRole === 'Viewer' && <ViewerDashboard />} */}
      </div>
    </div>
  );
};

export default DashboardPage;
