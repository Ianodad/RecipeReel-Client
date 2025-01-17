'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Star, Edit, Trash, Clock, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface RecipeDetailViewProps {
  recipe: Recipe;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export const RecipeDetailView: React.FC<RecipeDetailViewProps> = ({ recipe, open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-3xl overflow-y-auto'>
        <DialogHeader>
          <div className='flex items-center justify-between'>
            <DialogTitle className='text-2xl font-bold'>{recipe.title}</DialogTitle>
            <Badge
              variant={
                recipe.status === 'approved' ? 'default' : recipe.status === 'pending' ? 'secondary' : 'destructive'
              }
            >
              {recipe.status.charAt(0).toUpperCase() + recipe.status.slice(1)}
            </Badge>
          </div>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Meta Information */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='flex items-center'>
                <Star className='mr-1 h-5 w-5 text-yellow-400' />
                <span className='font-medium'>{recipe.averageRating}</span>
                <span className='ml-1 text-gray-500'>({recipe.ratingsCount} reviews)</span>
              </div>
              <Separator orientation='vertical' className='h-4' />
              <div className='flex items-center'>
                <Clock className='mr-1 h-4 w-4' />
                <span>Total: {recipe.prepTime + recipe.cookTime}m</span>
              </div>
              <Separator orientation='vertical' className='h-4' />
              <div className='flex items-center'>
                <Users className='mr-1 h-4 w-4' />
                <span>Serves {recipe.servings}</span>
              </div>
            </div>
            <Badge variant='outline'>{recipe.category}</Badge>
          </div>

          {/* Description */}
          <div>
            <h3 className='mb-2 text-lg font-semibold'>Description</h3>
            <p className='text-gray-600'>{recipe.description}</p>
          </div>

          {/* Times */}
          <div className='grid grid-cols-2 gap-4'>
            <Card className='p-4'>
              <h4 className='font-medium text-gray-500'>Prep Time</h4>
              <p className='text-2xl font-bold'>{recipe.prepTime} mins</p>
            </Card>
            <Card className='p-4'>
              <h4 className='font-medium text-gray-500'>Cook Time</h4>
              <p className='text-2xl font-bold'>{recipe.cookTime} mins</p>
            </Card>
          </div>

          {/* Ingredients */}
          <div>
            <h3 className='mb-3 text-lg font-semibold'>Ingredients</h3>
            <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className='flex items-center justify-between rounded border p-2'>
                  <span>{ingredient.name}</span>
                  <span className='text-gray-600'>
                    {ingredient.quantity} {ingredient.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className='mb-3 text-lg font-semibold'>Instructions</h3>
            <div className='space-y-4'>
              {recipe.instructions.split('\n').map((instruction, index) => (
                <div key={index} className='flex gap-4'>
                  <span className='font-bold text-gray-400'>{index + 1}.</span>
                  <p>{instruction}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className='border-t pt-4 text-sm text-gray-500'>
            <p>Created: {new Date(recipe.createdAt).toLocaleDateString()}</p>
            <p>Last updated: {new Date(recipe.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
