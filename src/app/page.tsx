'use client';
import Image from 'next/image';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChefHat, Search, Star, Clock, Book } from 'lucide-react';
import { Footer, TopNavigation } from '@/components/common';

export default function Home() {
  const featuredRecipes = [
    {
      id: 1,
      title: 'Classic Tiramisu',
      rating: 4.8,
      time: '45 min',
      category: 'Desserts',
      image: '/api/placeholder/400/300',
    },
    {
      id: 2,
      title: 'Spicy Pad Thai',
      rating: 4.7,
      time: '30 min',
      category: 'Main Course',
      image: '/api/placeholder/400/300',
    },
    {
      id: 3,
      title: 'Quinoa Buddha Bowl',
      rating: 4.9,
      time: '25 min',
      category: 'Vegan',
      image: '/api/placeholder/400/300',
    },
  ];

  const categories = [
    { name: 'Desserts', icon: '🍰', count: 234 },
    { name: 'Main Course', icon: '🍽️', count: 456 },
    { name: 'Vegan', icon: '🥗', count: 189 },
    { name: 'Breakfast', icon: '🍳', count: 145 },
    { name: 'Quick & Easy', icon: '⚡', count: 278 },
    { name: 'Healthy', icon: '🥑', count: 312 },
  ];

  return (
    <>
      <TopNavigation />
      {/* Hero Section with Search */}
      <section className='border-b-2 border-black bg-white py-16'>
        <div className='container mx-auto px-4 text-center'>
          <h1 className='mb-6 text-4xl font-bold md:text-6xl'>Discover & Share Amazing Recipes</h1>
          <p className='mb-8 text-xl text-gray-600'>
            Join our community of food lovers and find your next favorite dish
          </p>

          <div className='relative mx-auto max-w-2xl'>
            <Input
              placeholder='Search recipes, ingredients, or categories...'
              className='h-14 border-2 border-black pl-12'
            />
            <Search className='absolute left-4 top-4 h-6 w-6 text-gray-400' />
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <h2 className='mb-8 text-3xl font-bold'>Featured Recipes</h2>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            {featuredRecipes.map((recipe) => (
              <Card key={recipe.id} className='border-2 border-black transition-shadow hover:shadow-lg'>
                <CardContent className='p-0'>
                  <img src={recipe.image} alt={recipe.title} className='h-48 w-full object-cover' />
                  <div className='p-4'>
                    <h3 className='mb-2 text-xl font-semibold'>{recipe.title}</h3>
                    <div className='flex items-center justify-between text-sm text-gray-600'>
                      <div className='flex items-center'>
                        <Star className='mr-1 h-4 w-4 text-yellow-400' />
                        {recipe.rating}
                      </div>
                      <div className='flex items-center'>
                        <Clock className='mr-1 h-4 w-4' />
                        {recipe.time}
                      </div>
                      <span>{recipe.category}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className='border-y-2 border-black bg-white py-16'>
        <div className='container mx-auto px-4'>
          <h2 className='mb-8 text-3xl font-bold'>Browse Categories</h2>
          <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6'>
            {categories.map((category) => (
              <Button
                key={category.name}
                variant='outline'
                className='flex h-auto flex-col items-center border-2 border-black py-6 hover:bg-gray-100'
              >
                <span className='mb-2 text-2xl'>{category.icon}</span>
                <span className='font-medium'>{category.name}</span>
                <span className='text-sm text-gray-600'>{category.count} recipes</span>
              </Button>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
