'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { CategoryModal } from '@/components/common';
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
import CategoryDetailView from './CategoryDetailView';

interface Category {
  id: number;
  name: string;
  description?: string;
  parentCategory: string;
  color: string;
  isVisible: boolean;
  recipeCount: number;
}

interface CategoryItemProps {
  category: Category;
  onDelete: (id: number) => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({ category, onDelete }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);

  const handleDelete = async () => {
    try {
      // Here you would typically make an API call to delete the category
      // await deleteCategory(category.id);

      // Call the onDelete callback to update the UI
      onDelete(category.id);

      // Close the dialog
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete category:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <>
      <div
        className='flex transform cursor-pointer items-center justify-between rounded-lg border-2 border-black p-4 transition-all duration-200 ease-in-out hover:-translate-y-1 hover:bg-gray-50 hover:shadow-lg'
      >
        <div onClick={() => setShowDetailView(true)}>
          <div className='mb-2 h-3 w-3 rounded-full' style={{ backgroundColor: category.color }} />
          <h3 className='font-semibold'>{category.name}</h3>
          <p className='text-sm text-gray-500'>{category.recipeCount} recipes</p>
        </div>
        <div
          className='flex items-center space-x-2'
          onClick={(e) => e.stopPropagation()} // Prevent any parent click handlers
        >
          <CategoryModal
            isEdit={true}
            category={category}
            trigger={
              <Button variant='outline' size='icon' className='border-2 border-black'>
                <Edit className='h-4 w-4' />
              </Button>
            }
          />
          <Button
            variant='outline'
            size='icon'
            className='border-2 border-black hover:border-red-500 hover:bg-red-50'
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash className='h-4 w-4' />
          </Button>
        </div>
      </div>
      <CategoryDetailView category={category} open={showDetailView} onOpenChange={setShowDetailView} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{category.name}"?
              {category.recipeCount > 0 && (
                <div className='mt-2 font-medium text-red-500'>
                  Warning: This category contains {category.recipeCount} recipes that will be uncategorized.
                </div>
              )}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className='bg-red-500 text-white hover:bg-red-600'>
              Delete Category
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CategoryItem;
