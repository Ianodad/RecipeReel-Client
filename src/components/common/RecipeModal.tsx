'use client';

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Edit, Plus, Minus } from 'lucide-react';
import { createRecipe } from '@/services';
import { getAllCategories } from '@/services';
// Define Zod schemas
const ingredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name is required'),
  quantity: z.string().min(1, 'Quantity is required'),
  unit: z.string().min(1, 'Unit is required'),
});

const recipeFormSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  ingredients: z.array(ingredientSchema).min(1, 'At least one ingredient is required'),
  instructions: z.string().min(10, 'Instructions must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
  prepTime: z.string().min(1, 'Prep time is required'),
  cookTime: z.string().min(1, 'Cook time is required'),
  servings: z.string().min(1, 'Number of servings is required'),
  status: z.enum(['pending', 'approved', 'removed']).default('pending'),
});

export const RecipeModal = ({ isEdit = false, recipe = null, children, trigger }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Recipe' : 'Create New Recipe'}</DialogTitle>
        </DialogHeader>
        <RecipeForm isEdit={isEdit} initialData={recipe} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

const RecipeForm = ({ isEdit = false, initialData = null, onClose }) => {
  const [previewUrl, setPreviewUrl] = useState('');

  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        setFetchError(null);

        const data = await getAllCategories();
        // data should be an array of category objects, e.g. [{ id, name, ... }, ...]
        // Adjust to whatever structure your API returns
        console.log('getAllCategories', data);
        // For example, if each category is { id, name, ... }, you might store them directly
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setFetchError('Failed to fetch categories');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Initialize form with react-hook-form and zod resolver
  const form = useForm({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      ingredients: initialData?.ingredients || [{ name: '', quantity: '', unit: '' }],
      instructions: initialData?.instructions || '',
      category: initialData?.category || 'none',
      prepTime: initialData?.prepTime?.toString() || '',
      cookTime: initialData?.cookTime?.toString() || '',
      servings: initialData?.servings?.toString() || '',
      status: initialData?.status || 'pending',
    },
  });

  const addIngredient = () => {
    const currentIngredients = form.getValues('ingredients');
    form.setValue('ingredients', [...currentIngredients, { name: '', quantity: '', unit: '' }]);
  };

  const removeIngredient = (index: number) => {
    const currentIngredients = form.getValues('ingredients');
    if (currentIngredients.length > 1) {
      form.setValue(
        'ingredients',
        currentIngredients.filter((_, i) => i !== index)
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5000000) {
        form.setError('image', {
          type: 'manual',
          message: 'Image size should be less than 5MB',
        });
        return;
      }
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: z.infer<typeof recipeFormSchema>) => {
    try {
      // Transform data for submission
      const submitData = {
        ...data,
        prepTime: parseInt(data.prepTime),
        cookTime: parseInt(data.cookTime),
        servings: parseInt(data.servings),
      };
      const res = await createRecipe(submitData);
      console.log(res);
      console.log('Form submitted:', submitData);
      onClose?.();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipe Title *</FormLabel>
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
                <Textarea className='border-2 border-black' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='category'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className='border-2 border-black'>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {loadingCategories ? (
                    <SelectItem value='loading'>Loading categories...</SelectItem>
                  ) : fetchError ? (
                    <SelectItem value='error'>Error loading categories</SelectItem>
                  ) : (
                    categories.map((cat: any) => (
                      <SelectItem
                        key={cat._id}
                        value={cat.name} // or cat._id, depending on your API
                      >
                        {cat.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-3 gap-4'>
          <FormField
            control={form.control}
            name='prepTime'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prep Time (minutes)</FormLabel>
                <FormControl>
                  <Input type='number' min='0' className='border-2 border-black' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='cookTime'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cook Time (minutes)</FormLabel>
                <FormControl>
                  <Input type='number' min='0' className='border-2 border-black' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='servings'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Servings</FormLabel>
                <FormControl>
                  <Input type='number' min='1' className='border-2 border-black' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <div className='mb-2 flex items-center justify-between'>
            <FormLabel>Ingredients</FormLabel>
            <Button type='button' onClick={addIngredient} variant='outline' size='sm' className='border-2 border-black'>
              <Plus className='mr-1 h-4 w-4' /> Add Ingredient
            </Button>
          </div>

          {form.watch('ingredients').map((_, index) => (
            <div key={index} className='mb-4 flex gap-2'>
              <FormField
                control={form.control}
                name={`ingredients.${index}.name`}
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <Input placeholder='Name' className='border-2 border-black' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`ingredients.${index}.quantity`}
                render={({ field }) => (
                  <FormItem className='w-24'>
                    <FormControl>
                      <Input placeholder='Quantity' className='border-2 border-black' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`ingredients.${index}.unit`}
                render={({ field }) => (
                  <FormItem className='w-24'>
                    <FormControl>
                      <Input placeholder='Unit' className='border-2 border-black' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='button'
                variant='outline'
                size='icon'
                onClick={() => removeIngredient(index)}
                className='border-2 border-black'
                disabled={form.watch('ingredients').length === 1}
              >
                <Minus className='h-4 w-4' />
              </Button>
            </div>
          ))}
        </div>

        <FormField
          control={form.control}
          name='instructions'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions *</FormLabel>
              <FormControl>
                <Textarea className='min-h-32 border-2 border-black' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <div>
          <FormLabel>Recipe Image</FormLabel>
          <Input type='file' accept='image/*' onChange={handleImageChange} className='border-2 border-black' />
          {previewUrl && (
            <div className='mt-2'>
              <img src={previewUrl} alt='Preview' className='h-32 w-32 rounded-lg border-2 border-black object-cover' />
            </div>
          )}
        </div> */}

        <div className='flex justify-end space-x-4'>
          <Button type='button' variant='outline' className='border-2 border-black' onClick={onClose}>
            Cancel
          </Button>
          <Button type='submit' className='bg-black text-white hover:bg-gray-800'>
            {isEdit ? 'Update Recipe' : 'Create Recipe'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RecipeModal;
