'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, ChefHat, Clock, Star, Users, Filter, SlidersHorizontal } from 'lucide-react';

const RecipeCatalog = () => {
  const [activeFilters, setActiveFilters] = useState({
    category: 'all',
    cooking_time: [0, 120],
    dietary: [],
  });

  // Sample data
  const recipes = [
    {
      id: 1,
      title: 'Homemade Pizza',
      image: '/api/placeholder/300/200',
      rating: 4.8,
      reviews: 234,
      cookingTime: '45 min',
      category: 'Main Course',
      difficulty: 'Medium',
      author: 'Chef John',
      description: 'Classic homemade pizza with a crispy crust and fresh toppings.',
    },
    // ... more recipes would be added here
  ];

  const categories = ['All', 'Breakfast', 'Main Course', 'Desserts', 'Appetizers', 'Soups', 'Salads', 'Vegan'];

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
      {/* Header with Search */}
      <div className='border-b-2 border-black bg-white'>
        <div className='container mx-auto px-4 py-6'>
          <div className='mb-6 flex items-center justify-between'>
            <h1 className='text-3xl font-bold'>Browse Recipes</h1>
            <div className='flex items-center space-x-4'>
              <Select defaultValue='newest'>
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

          <div className='relative'>
            <Input
              placeholder='Search recipes, ingredients, or cuisines...'
              className='h-12 border-2 border-black pl-12'
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
                <Select defaultValue='all'>
                  <SelectTrigger className='border-2 border-black'>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.toLowerCase()} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cooking Time Filter */}
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

              {/* Dietary Restrictions */}
              <div className='mb-6'>
                <h3 className='mb-3 font-medium'>Dietary Restrictions</h3>
                <div className='space-y-2'>
                  {dietaryOptions.map((option) => (
                    <div key={option.id} className='flex items-center space-x-2'>
                      <Checkbox id={option.id} className='border-black' />
                      <label htmlFor={option.id} className='text-sm'>
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button className='w-full bg-black text-white hover:bg-gray-800'>Apply Filters</Button>
            </div>
          </div>

          {/* Recipe Grid */}
          <div className='flex-1'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {Array(9)
                .fill(recipes[0])
                .map((recipe, index) => (
                  <Card key={index} className='border-2 border-black transition-shadow hover:shadow-lg'>
                    <CardContent className='p-0'>
                      <img src={recipe.image} alt={recipe.title} className='h-48 w-full object-cover' />
                      <div className='p-4'>
                        <h3 className='mb-2 text-xl font-semibold'>{recipe.title}</h3>
                        <p className='mb-3 line-clamp-2 text-sm text-gray-600'>{recipe.description}</p>
                        <div className='flex items-center justify-between text-sm'>
                          <div className='flex items-center space-x-4'>
                            <div className='flex items-center'>
                              <Star className='mr-1 h-4 w-4 text-yellow-400' />
                              <span>{recipe.rating}</span>
                            </div>
                            <div className='flex items-center text-gray-600'>
                              <Users className='mr-1 h-4 w-4' />
                              <span>{recipe.reviews}</span>
                            </div>
                          </div>
                          <div className='flex items-center text-gray-600'>
                            <Clock className='mr-1 h-4 w-4' />
                            <span>{recipe.cookingTime}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {/* Pagination */}
            <div className='mt-8 flex justify-center space-x-2'>
              <Button variant='outline' className='border-2 border-black'>
                Previous
              </Button>
              {[1, 2, 3, 4, 5].map((page) => (
                <Button
                  key={page}
                  variant={page === 1 ? 'default' : 'outline'}
                  className={page === 1 ? 'bg-black text-white' : 'border-2 border-black'}
                >
                  {page}
                </Button>
              ))}
              <Button variant='outline' className='border-2 border-black'>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCatalog;
