'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Star, Edit, Trash, Utensils } from 'lucide-react';
import { RecipeModal } from '@/components/common';
import Image from 'next/image';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { RecipeDetailView } from './RecipeDetailView';

export const RecipeItem = ({ recipe, onDelete }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailView, setShowDetailView] = useState<boolean>(false);

  console.log('recipe', recipe);
  const handleDelete = async () => {
    try {
      // Here you would typically make an API call to delete the recipe
      // await deleteRecipe(recipe.id);

      // Call the onDelete callback to update the UI
      onDelete(recipe._id);

      // Close the dialog
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete recipe:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <>
      <div className='flex transform cursor-pointer items-center justify-between rounded-lg border-2 border-black p-4 transition-all duration-200 ease-in-out hover:-translate-y-1 hover:bg-gray-50 hover:shadow-lg'>
        {/* Image and Content Container */}
        <div className='flex flex-1 items-center' onClick={() => setShowDetailView(true)}>
          {/* Image Section */}
          <div className='relative mr-4 h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg'>
            {recipe.image ? (
              <Image
                src={recipe.image}
                alt={recipe.title}
                fill
                sizes='96px'
                className='object-cover'
                priority={false}
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center bg-gray-100'>
                <Utensils className='h-8 w-8 text-gray-400' />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className='flex-1'>
            <h3 className='font-semibold'>{recipe.title}</h3>
            <div className='flex items-center space-x-4 text-sm text-gray-500'>
              <div className='flex items-center'>
                <Star className='mr-1 h-4 w-4 text-yellow-400' />
                {recipe.averageRating}
              </div>
              <div>{recipe.ratingsCount} reviews</div>
              <div>Prep: {recipe.prepTime}m</div>
              <div>Cook: {recipe.cookTime}m</div>
              <div>{recipe.category}</div>
            </div>
            <p className='mt-1 line-clamp-1 text-sm text-gray-600'>{recipe.description}</p>
          </div>
        </div>

        {/* Actions Section */}
        <div className='flex items-center space-x-2'>
          <RecipeModal
            isEdit={true}
            recipe={recipe}
            trigger={
              <Button variant='outline' size='icon' className='border-2 border-black'>
                <Edit className='h-4 w-4' />
              </Button>
            }
          />
          <Button
            variant='outline'
            size='icon'
            className='border-2 border-black'
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* Detail View */}
      <RecipeDetailView recipe={recipe} open={showDetailView} onOpenChange={setShowDetailView} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this recipe?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{recipe.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className='bg-red-500 hover:bg-red-600'>
              Delete Recipe
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
