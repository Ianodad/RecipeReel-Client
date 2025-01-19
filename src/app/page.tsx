'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, SlidersHorizontal, Star, Users, Clock } from 'lucide-react';

import { getAllRecipes, getAllCategories } from '@/services';
import { Skeleton } from '@/components/ui/skeleton';

/* -------------------------------------------------------------------
 * TypeScript Interfaces
 * ------------------------------------------------------------------- */
export interface Recipe {
  _id: string;
  title: string;
  description: string;
  category: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  image: string;
  // Add rating fields if needed:
  // averageRating?: number;
  // ratingsCount?: number;
}

export default function RecipeCatalog() {
  // -----------------------------
  // States for data
  // -----------------------------
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState<boolean>(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false);

  // -----------------------------
  // State for user filters/inputs
  // -----------------------------
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  // Sorting can be "newest", "oldest", etc.
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Cooking time range in minutes
  const [cookingTimeRange, setCookingTimeRange] = useState<[number, number]>([0, 120]);

  // Example: dietary checkboxes
  const [dietary, setDietary] = useState<string[]>([]);

  // Pagination
  const [page, setPage] = useState<number>(1);
  const limit = 9; // 9 recipes per page
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  // ------------------------------------------------------------------
  // Fetch categories on mount
  // ------------------------------------------------------------------
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true); // start loading
      try {
        const data = await getAllCategories();
        // Insert a custom "All" category at the start
        setCategories([{ _id: 'all', name: 'All' }, ...data]);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoadingCategories(false); // done loading
      }
    };

    fetchCategories();
  }, []);

  // ------------------------------------------------------------------
  // Fetch recipes whenever filters change
  // ------------------------------------------------------------------
  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoadingRecipes(true);
      try {
        const params = {
          search: searchTerm,
          category: selectedCategory === 'all' ? '' : selectedCategory,
          sortBy,
          cookingTimeMin: cookingTimeRange[0],
          cookingTimeMax: cookingTimeRange[1],
          dietary: dietary.join(','), // pass as CSV, or array if your API supports it
          page,
          limit,
        };

        const { recipes, totalPages } = await getAllRecipes(params);

        // If your API returns an object with { docs, totalPages, ... }, adjust accordingly:
        // setRecipes(data.docs);
        setTotalPages(totalPages);
        // For a simple example:
        setRecipes(recipes);
        // setTotalPages(5); // hard-coded example, or parse from your real API
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
      } finally {
        setIsLoadingRecipes(false); // done loading
      }
    };

    fetchRecipes();
  }, [searchTerm, selectedCategory, sortBy, cookingTimeRange, dietary, page]);

  // ------------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------------
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // reset pagination on search
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as 'newest' | 'oldest');
    setPage(1);
  };

  const handleSliderChange = (values: number[]) => {
    if (values.length === 2) {
      setCookingTimeRange([values[0], values[1]]);
      setPage(1);
    }
  };

  const handleDietaryChange = (option: string) => {
    // toggle on/off
    setDietary((prev) => (prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]));
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Example dietary restriction options
  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'gluten-free', label: 'Gluten Free' },
    { id: 'dairy-free', label: 'Dairy Free' },
    { id: 'keto', label: 'Keto' },
    { id: 'paleo', label: 'Paleo' },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header with Sort & Search */}
      <div className='border-b-2 border-black bg-white'>
        <div className='container mx-auto px-4 py-6'>
          <div className='mb-6 flex items-center justify-between'>
            <h1 className='text-3xl font-bold'>Browse Recipes</h1>
            <div className='flex items-center space-x-4'>
              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className='w-[180px] border-2 border-black'>
                  <SelectValue placeholder='Sort by' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='newest'>Newest First</SelectItem>
                  <SelectItem value='oldest'>Oldest First</SelectItem>
                  {/* more sort options if desired */}
                </SelectContent>
              </Select>

              <Button variant='outline' className='border-2 border-black'>
                <SlidersHorizontal className='mr-2 h-4 w-4' />
                Filters
              </Button>
            </div>
          </div>

          {/* Search box */}
          <div className='relative'>
            <Input
              placeholder='Search recipes, ingredients, or cuisines...'
              className='h-12 border-2 border-black pl-12'
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search className='absolute left-4 top-3.5 h-5 w-5 text-gray-400' />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto px-4 py-8'>
        <div className='flex gap-8'>
          {/* Filters Sidebar */}
          <div className='w-64 flex-shrink-0'>
            <div className='rounded-lg border-2 border-black bg-white p-6'>
              <h2 className='mb-6 text-xl font-semibold'>Filters</h2>

              {/* Category Filter */}
              <div className='mb-6'>
                <h3 className='mb-3 font-medium'>Category</h3>
                {isLoadingCategories ? (
                  <p>Loading categories...</p>
                ) : (
                  <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger className='border-2 border-black'>
                      <SelectValue placeholder='Select category' />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Cooking Time Filter */}
              <div className='mb-6'>
                <h3 className='mb-3 font-medium'>Cooking Time</h3>
                <div className='px-2'>
                  <Slider
                    value={cookingTimeRange}
                    onValueChange={handleSliderChange}
                    max={120}
                    step={5}
                    className='mb-2'
                  />
                  <div className='flex justify-between text-sm text-gray-600'>
                    <span>{cookingTimeRange[0]} min</span>
                    <span>{cookingTimeRange[1]} min</span>
                  </div>
                </div>
              </div>

              {/* Dietary Restrictions */}
              <div className='mb-6'>
                <h3 className='mb-3 font-medium'>Dietary Restrictions</h3>
                <div className='space-y-2'>
                  {dietaryOptions.map((option) => (
                    <div key={option.id} className='flex items-center space-x-2'>
                      <Checkbox
                        id={option.id}
                        className='border-black'
                        checked={dietary.includes(option.id)}
                        onCheckedChange={() => handleDietaryChange(option.id)}
                      />
                      <label htmlFor={option.id} className='text-sm'>
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {/* If you want an "Apply" button, you could do so here */}
            </div>
          </div>

          {/* Recipe Grid */}
          <div className='flex-1'>
            {isLoadingRecipes ? (
              /* (1) Show Skeletons while loading */
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {Array(9)
                  .fill(0)
                  .map((_, index) => (
                    <Card key={index} className='border-2 border-black'>
                      <CardContent className='p-0'>
                        {/* Image Skeleton */}
                        <Skeleton className='h-48 w-full object-cover' />
                        {/* Text Skeletons */}
                        <div className='space-y-2 p-4'>
                          <Skeleton className='h-5 w-3/4' />
                          <Skeleton className='h-4 w-1/2' />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : recipes.length === 0 ? (
              /* (2) If done loading but no recipes */
              <p>No recipes found.</p>
            ) : (
              /* (3) Else show the real data */
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {recipes.map((recipe) => (
                  <Card key={recipe._id} className='border-2 border-black transition-shadow hover:shadow-lg'>
                    <CardContent className='p-0'>
                      <img src={recipe.image} alt={recipe.title} className='h-48 w-full object-cover' />
                      <div className='p-4'>
                        <h3 className='mb-2 text-xl font-semibold'>{recipe.title}</h3>
                        <p className='mb-3 line-clamp-2 text-sm text-gray-600'>{recipe.description}</p>
                        <div className='flex items-center justify-between text-sm'>
                          {/* If you have rating data: */}
                          <div className='flex items-center space-x-4'>
                            <div className='flex items-center'>
                              <Star className='mr-1 h-4 w-4 text-yellow-400' />
                              <span>4.5</span>
                            </div>
                            <div className='flex items-center text-gray-600'>
                              <Users className='mr-1 h-4 w-4' />
                              <span>10</span>
                            </div>
                          </div>
                          <div className='flex items-center text-gray-600'>
                            <Clock className='mr-1 h-4 w-4' />
                            <span>{recipe.cookTime} min</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className='mt-8 flex justify-center space-x-2'>
                <Button
                  variant='outline'
                  className='border-2 border-black'
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  Previous
                </Button>
                {[...Array(totalPages)].map((_, i) => {
                  const p = i + 1;
                  return (
                    <Button
                      key={p}
                      variant={p === page ? 'default' : 'outline'}
                      className={p === page ? 'bg-black text-white' : 'border-2 border-black'}
                      onClick={() => handlePageChange(p)}
                    >
                      {p}
                    </Button>
                  );
                })}
                <Button
                  variant='outline'
                  className='border-2 border-black'
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
