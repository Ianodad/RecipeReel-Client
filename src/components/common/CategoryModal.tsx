'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { createCategory } from '@/services';

// Define Zod schema for category
const categoryFormSchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().optional(),
  icon: z.string().optional(),
  // color: z.string().min(1, 'Please select a color'),
  // parentCategory: z.string(),
  // isVisible: z.boolean().default(true),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const CategoryModal = ({ isEdit = false, category = null, trigger, onSubmitCategory }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Category' : 'Create New Category'}</DialogTitle>
        </DialogHeader>
        <CategoryForm
          isEdit={isEdit}
          initialData={category}
          onClose={() => setOpen(false)}
          onSubmitCategory={(data) => {
            onSubmitCategory?.(data);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

interface CategoryFormProps {
  isEdit?: boolean;
  initialData?: any;
  onClose: () => void;
  onSubmitCategory?: (data: CategoryFormValues) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  isEdit = false,
  initialData = null,
  onClose,
  onSubmitCategory,
}) => {
  // Initialize form with react-hook-form and zod resolver
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      color: initialData?.color || '#000000',
      isVisible: initialData?.isVisible ?? true,
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    console.log('help', data);
    try {
      // Transform the data before submission
      const submitData = {
        ...data,
      };
      // const res = await createCategory(submitData);
      // console.log('Category created:', res);
      onSubmitCategory?.(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
      form.setError('root', {
        type: 'manual',
        message: 'Failed to save category. Please try again.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input className='border-2 border-black' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  className='border-2 border-black'
                  placeholder='Brief description of this category'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='icon'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <Input className='border-2 border-black' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name='isVisible'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
              <div className='space-y-0.5'>
                <FormLabel className='text-base'>Visibility</FormLabel>
                <div className='text-sm text-gray-500'>
                  Category will be {field.value ? 'visible' : 'hidden'} to users
                </div>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        /> */}

        {isEdit && initialData && (
          <div className='rounded-lg bg-gray-50 p-4'>
            <div className='text-sm text-gray-500'>Recipe Count</div>
            <div className='text-2xl font-bold'>{initialData.recipeCount || 0}</div>
            <div className='text-xs text-gray-400'>This is automatically calculated</div>
          </div>
        )}

        <div className='flex justify-end space-x-4'>
          <Button type='button' variant='outline' className='border-2 border-black' onClick={onClose}>
            Cancel
          </Button>
          <Button type='submit' className='bg-black text-white hover:bg-gray-800'>
            {isEdit ? 'Update Category' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CategoryModal;
