'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

import { Search, SlidersHorizontal, Star, Users, Clock } from 'lucide-react';

import { getAllRecipes, getAllCategories } from '@/services';

export default function RecipeCatalog() {
  // -----------------------------
  // State for fetched data
  // -----------------------------
  const [recipes, setRecipes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // -----------------------------
  // State for user filters/input
  // -----------------------------
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const [page, setPage] = useState(1);
  const limit = 9; // show 9 recipes per page

  // For demonstration, we won’t fully wire cooking time or dietary restrictions,
  // but you can replicate the pattern for them:
  // const [cookingTimeRange, setCookingTimeRange] = useState<[number, number]>([0, 120]);
  // const [selectedDietary, setSelectedDietary] = useState<string[]>([]);

  // -----------------------------
  // Lifecycle: fetch categories once
  // -----------------------------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        // Or transform as needed
        setCategories([{ name: 'All', _id: 'all' }, ...data]);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // -----------------------------
  // Lifecycle: fetch recipes whenever filters change
  // -----------------------------
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { recipes } = await getAllRecipes({
          search: searchTerm || '',
          category: selectedCategory === 'all' ? '' : selectedCategory,
          sortBy,
          page,
          limit,
        });
        setRecipes(recipes);
        // If your API returns total count or total pages, store them in state for advanced pagination
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
      }
    };

    fetchRecipes();
  }, [searchTerm, selectedCategory, sortBy, page, limit]);

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // reset to page 1 on new search
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setPage(1); // reset to page 1
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPage(1); // reset to page 1
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Example placeholders for advanced filters
  // const handleApplyFilters = () => {
  //   // e.g. setCookingTimeRange, setSelectedDietary, etc.
  //   // then the effect fires fetchRecipes
  // };

  // For pagination demonstration (static)
  const totalPages = 5; // or from your API response

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
                  <SelectItem value='popular'>Most Popular</SelectItem>
                  <SelectItem value='rating'>Highest Rated</SelectItem>
                  <SelectItem value='time'>Cooking Time</SelectItem>
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

      <div className='container mx-auto px-4 py-8'>
        <div className='flex gap-8'>
          {/* Filters Sidebar */}
          <div className='w-64 flex-shrink-0'>
            <div className='rounded-lg border-2 border-black bg-white p-6'>
              <h2 className='mb-6 text-xl font-semibold'>Filters</h2>

              {/* Category Filter */}
              <div className='mb-6'>
                <h3 className='mb-3 font-medium'>Category</h3>
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className='border-2 border-black'>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat._id}
                        value={cat._id} // or cat.name if that's how you store it
                      >
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cooking Time Filter (Placeholder) */}
              <div className='mb-6'>
                <h3 className='mb-3 font-medium'>Cooking Time</h3>
                <div className='px-2'>
                  <Slider defaultValue={[0, 120]} max={120} step={5} className='mb-2' />
                  <div className='flex justify-between text-sm text-gray-600'>
                    <span>0 min</span>
                    <span>2 hrs</span>
                  </div>
                </div>
              </div>

              {/* Dietary Restrictions (Placeholder) */}
              <div className='mb-6'>
                <h3 className='mb-3 font-medium'>Dietary Restrictions</h3>
                <div className='space-y-2'>
                  {/* Example placeholders */}
                  <div className='flex items-center space-x-2'>
                    <Checkbox id='vegetarian' className='border-black' />
                    <label htmlFor='vegetarian' className='text-sm'>
                      Vegetarian
                    </label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Checkbox id='vegan' className='border-black' />
                    <label htmlFor='vegan' className='text-sm'>
                      Vegan
                    </label>
                  </div>
                  {/* ... */}
                </div>
              </div>

              <Button className='w-full bg-black text-white hover:bg-gray-800'>Apply Filters</Button>
            </div>
          </div>

          {/* Recipe Grid */}
          <div className='flex-1'>
            {recipes.length === 0 ? (
              <p>No recipes found.</p>
            ) : (
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {recipes.map((recipe) => (
                  <Card key={recipe._id} className='border-2 border-black transition-shadow hover:shadow-lg'>
                    <CardContent className='p-0'>
                      <img src={recipe.image} alt={recipe.title} className='h-48 w-full object-cover' />
                      <div className='p-4'>
                        <h3 className='mb-2 text-xl font-semibold'>{recipe.title}</h3>
                        <p className='mb-3 line-clamp-2 text-sm text-gray-600'>{recipe.description}</p>
                        <div className='flex items-center justify-between text-sm'>
                          <div className='flex items-center space-x-4'>
                            <div className='flex items-center'>
                              <Star className='mr-1 h-4 w-4 text-yellow-400' />
                              <span>{recipe.averageRating ?? '4.5'}</span>
                            </div>
                            <div className='flex items-center text-gray-600'>
                              <Users className='mr-1 h-4 w-4' />
                              <span>{recipe.ratingsCount ?? 10}</span>
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
            <div className='mt-8 flex justify-center space-x-2'>
              <Button
                variant='outline'
                className='border-2 border-black'
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
              >
                Previous
              </Button>
              {[...Array(totalPages)].map((_, idx) => {
                const pg = idx + 1;
                return (
                  <Button
                    key={pg}
                    variant={pg === page ? 'default' : 'outline'}
                    className={pg === page ? 'bg-black text-white' : 'border-2 border-black'}
                    onClick={() => handlePageChange(pg)}
                  >
                    {pg}
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
          </div>
        </div>
      </div>
    </div>
  );
}
