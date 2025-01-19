'use client';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Users, ChefHat, Star, Share2, BookmarkPlus, Printer, Facebook, Twitter } from 'lucide-react';

// Client components for interactive features

const RatingInput = () => {
  return (
    <div className='flex items-center space-x-1'>
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} className='transition-transform hover:scale-110'>
          <Star className='h-6 w-6 text-yellow-400' fill='currentColor' />
        </button>
      ))}
    </div>
  );
};

const CommentSection = () => {
  return (
    <div className='space-y-6'>
      <textarea
        className='w-full rounded-lg border-2 border-black p-4'
        placeholder='Share your thoughts about this recipe...'
        rows={4}
      />
      <Button className='bg-black text-white hover:bg-gray-800'>Post Comment</Button>
    </div>
  );
};

// Main component
const RecipeDetailPage = () => {
  const recipe = {
    title: 'Classic Homemade Tiramisu',
    author: 'Chef Maria Romano',
    rating: 4.8,
    reviews: 256,
    cookingTime: '45 minutes',
    servings: 8,
    difficulty: 'Intermediate',
    image: '/api/placeholder/800/400',
    description:
      'A classic Italian dessert made with layers of coffee-soaked ladyfingers and creamy mascarpone filling. This authentic tiramisu recipe has been passed down through generations.',
    ingredients: [
      '6 egg yolks',
      '1 cup white sugar',
      '1 1/4 cup mascarpone cheese',
      '1 3/4 cup heavy whipping cream',
      '2 packages ladyfinger cookies',
      '1 cup cold espresso',
      '1/2 cup coffee flavored liqueur',
      '2 tablespoons cocoa powder',
    ],
    instructions: [
      {
        step: 1,
        text: 'In a medium saucepan, whisk together egg yolks and sugar until well blended.',
      },
      {
        step: 2,
        text: 'Cook over medium heat, whisking constantly, until mixture boils and thickens.',
      },
      {
        step: 3,
        text: 'Remove from heat and stir in mascarpone until completely blended.',
      },
      // Additional steps would be added here
    ],
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section */}
      <div className='relative h-[400px]'>
        <img src={recipe.image} alt={recipe.title} className='h-full w-full object-cover' />
        <div className='absolute inset-0 bg-black bg-opacity-30' />
        <div className='absolute bottom-0 left-0 right-0 p-8 text-white'>
          <div className='container mx-auto'>
            <h1 className='mb-4 text-4xl font-bold'>{recipe.title}</h1>
            <div className='flex items-center space-x-6'>
              <div className='flex items-center space-x-2'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src='/avatar.png' />
                  <AvatarFallback>MR</AvatarFallback>
                </Avatar>
                <span>{recipe.author}</span>
              </div>
              <div className='flex items-center space-x-2'>
                <Star className='h-5 w-5 text-yellow-400' fill='currentColor' />
                <span>
                  {recipe.rating} ({recipe.reviews} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Content */}
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Main Content */}
          <div className='lg:col-span-2'>
            <Card className='border-2 border-black p-6'>
              {/* Recipe Quick Info */}
              <div className='mb-8 grid grid-cols-3 gap-4'>
                <div className='rounded-lg border-2 border-black p-4 text-center'>
                  <Clock className='mx-auto mb-2 h-6 w-6' />
                  <div className='font-medium'>{recipe.cookingTime}</div>
                  <div className='text-sm text-gray-600'>Cooking Time</div>
                </div>
                <div className='rounded-lg border-2 border-black p-4 text-center'>
                  <Users className='mx-auto mb-2 h-6 w-6' />
                  <div className='font-medium'>{recipe.servings} servings</div>
                  <div className='text-sm text-gray-600'>Yield</div>
                </div>
                <div className='rounded-lg border-2 border-black p-4 text-center'>
                  <ChefHat className='mx-auto mb-2 h-6 w-6' />
                  <div className='font-medium'>{recipe.difficulty}</div>
                  <div className='text-sm text-gray-600'>Difficulty</div>
                </div>
              </div>

              {/* Description */}
              <p className='mb-8 text-gray-600'>{recipe.description}</p>

              <Tabs defaultValue='instructions' className='mb-8'>
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger value='instructions'>Instructions</TabsTrigger>
                  <TabsTrigger value='ingredients'>Ingredients</TabsTrigger>
                </TabsList>
                <TabsContent value='instructions' className='mt-6'>
                  <div className='space-y-6'>
                    {recipe.instructions.map((instruction) => (
                      <div key={instruction.step} className='flex space-x-4'>
                        <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-black font-bold text-white'>
                          {instruction.step}
                        </div>
                        <p className='flex-1'>{instruction.text}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value='ingredients' className='mt-6'>
                  <ul className='space-y-2'>
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className='flex items-center space-x-2'>
                        <span className='h-2 w-2 rounded-full bg-black' />
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>

              {/* Rating and Comments */}
              <Separator className='my-8' />
              <div className='space-y-8'>
                <div>
                  <h3 className='mb-4 text-xl font-semibold'>Rate this recipe</h3>
                  <RatingInput />
                </div>
                <div>
                  <h3 className='mb-4 text-xl font-semibold'>Comments</h3>
                  <CommentSection />
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-1'>
            <div className='space-y-6'>
              {/* Action Buttons */}
              <Card className='border-2 border-black p-6'>
                <div className='space-y-4'>
                  <Button className='w-full bg-black text-white hover:bg-gray-800'>
                    <BookmarkPlus className='mr-2 h-4 w-4' />
                    Save Recipe
                  </Button>
                  <Button variant='outline' className='w-full border-2 border-black'>
                    <Printer className='mr-2 h-4 w-4' />
                    Print Recipe
                  </Button>
                </div>
              </Card>

              {/* Share */}
              <Card className='border-2 border-black p-6'>
                <h3 className='mb-4 font-semibold'>Share this recipe</h3>
                <div className='flex space-x-4'>
                  <Button variant='outline' className='flex-1 border-2 border-black'>
                    <Facebook className='h-4 w-4' />
                  </Button>
                  <Button variant='outline' className='flex-1 border-2 border-black'>
                    <Twitter className='h-4 w-4' />
                  </Button>
                  <Button variant='outline' className='flex-1 border-2 border-black'>
                    <Share2 className='h-4 w-4' />
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
