'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { BookOpen, LayoutGrid, Calendar } from 'lucide-react';
import { AlertDialog } from '@radix-ui/react-alert-dialog';

interface Recipe {
  id: number;
  title: string;
  status: string;
  rating: number;
  reviews: number;
}

interface Category {
  id: number;
  name: string;
  description: string;
  parentCategory: string;
  color: string;
  isVisible: boolean;
  recipeCount: number;
  createdAt?: string;
  updatedAt?: string;
  recipes?: Recipe[];
}

interface CategoryDetailViewProps {
  category: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({ category, open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-3xl overflow-y-auto'>
        <DialogHeader>
          <div className='flex items-center justify-between'>
            <DialogTitle className='flex items-center gap-3 text-2xl font-bold'>
              <div className='h-4 w-4 rounded-full' style={{ backgroundColor: category.color }} />
              {category.name}
            </DialogTitle>
            <Badge variant={category.isVisible ? 'default' : 'secondary'}>
              {category.isVisible ? 'Visible' : 'Hidden'}
            </Badge>
          </div>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Quick Stats */}
          <div className='grid grid-cols-3 gap-4'>
            <Card className='p-4'>
              <div className='flex items-center gap-2'>
                <BookOpen className='h-5 w-5 text-gray-500' />
                <div>
                  <p className='text-sm text-gray-500'>Total Recipes</p>
                  <p className='text-2xl font-bold'>{category.recipeCount}</p>
                </div>
              </div>
            </Card>
            <Card className='p-4'>
              <div className='flex items-center gap-2'>
                <LayoutGrid className='h-5 w-5 text-gray-500' />
                <div>
                  <p className='text-sm text-gray-500'>Parent Category</p>
                  <p className='text-lg font-medium'>
                    {category.parentCategory === 'none' ? 'None' : category.parentCategory}
                  </p>
                </div>
              </div>
            </Card>
            <Card className='p-4'>
              <div className='flex items-center gap-2'>
                <Calendar className='h-5 w-5 text-gray-500' />
                <div>
                  <p className='text-sm text-gray-500'>Created</p>
                  <p className='text-lg font-medium'>
                    {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Description */}
          {category.description && (
            <div>
              <h3 className='mb-2 text-lg font-semibold'>Description</h3>
              <p className='text-gray-600'>{category.description}</p>
            </div>
          )}

          <Separator />

          {/* Recipes in Category */}
          <div>
            <h3 className='mb-4 text-lg font-semibold'>Recipes in this Category</h3>
            {category.recipes && category.recipes.length > 0 ? (
              <div className='space-y-3'>
                {category.recipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className='flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50'
                  >
                    <div>
                      <h4 className='font-medium'>{recipe.title}</h4>
                      <div className='flex items-center gap-3 text-sm text-gray-500'>
                        <span>{recipe.rating} rating</span>
                        <span>•</span>
                        <span>{recipe.reviews} reviews</span>
                      </div>
                    </div>
                    <Badge>{recipe.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className='py-8 text-center text-gray-500'>No recipes in this category yet</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDetailView;
