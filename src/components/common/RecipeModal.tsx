'use client';

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus } from 'lucide-react';

import { createRecipe, getAllCategories, updateRecipe, uploadImageToCloudinary } from '@/services';

/* -------------------------------------------------------------------------
 * TypeScript Interfaces
 * ------------------------------------------------------------------------- */
export interface Category {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  [key: string]: any; // fallback for extra fields if needed
}

export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface RecipeData {
  title: string;
  description?: string;
  ingredients: Ingredient[];
  instructions: string;
  category: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  image?: string;
}

interface RecipeModalProps {
  isEdit?: boolean;
  recipe?: RecipeData | null;
  trigger: React.ReactNode;
  // Add a callback for when the recipe is successfully created or updated
  onSuccess?: () => void;
}

/* -------------------------------------------------------------------------
 * Zod Schemas
 * ------------------------------------------------------------------------- */
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
  image: z.string().optional(),
});

type RecipeFormType = z.infer<typeof recipeFormSchema>;

/* -------------------------------------------------------------------------
 * RecipeModal Component
 * ------------------------------------------------------------------------- */
export const RecipeModal: React.FC<RecipeModalProps> = ({ isEdit = false, recipe = null, trigger, onSuccess }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='max-h-[70vh] max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Recipe' : 'Create New Recipe'}</DialogTitle>
        </DialogHeader>
        <RecipeForm
          isEdit={isEdit}
          initialData={recipe}
          onClose={() => setOpen(false)}
          onSuccess={onSuccess} // pass it down to form
        />
      </DialogContent>
    </Dialog>
  );
};

/* -------------------------------------------------------------------------
 * RecipeForm Component
 * ------------------------------------------------------------------------- */
interface RecipeFormProps {
  isEdit: boolean;
  initialData: RecipeData | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ isEdit, initialData, onClose, onSuccess }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Local preview of selected file
  const [localPreviewUrl, setLocalPreviewUrl] = useState('');
  // Track whether the image is in the process of uploading
  const [isImageUploading, setIsImageUploading] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingCategories(true);
        setFetchError(null);
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        setFetchError('Failed to fetch categories');
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchData();
  }, []);

  // Set up form with default values
  const form = useForm<RecipeFormType>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      ingredients: initialData?.ingredients || [{ name: '', quantity: '', unit: '' }],
      instructions: initialData?.instructions || '',
      category: initialData?.category || '',
      prepTime: initialData?.prepTime?.toString() || '',
      cookTime: initialData?.cookTime?.toString() || '',
      servings: initialData?.servings?.toString() || '',
      image: initialData?.image || '',
    },
  });

  /* -----------------------------------------------------------------------
   * Ingredient handlers
   * ----------------------------------------------------------------------- */
  const addIngredient = () => {
    const current = form.getValues('ingredients');
    form.setValue('ingredients', [...current, { name: '', quantity: '', unit: '' }]);
  };

  const removeIngredient = (index: number) => {
    const current = form.getValues('ingredients');
    if (current.length > 1) {
      form.setValue(
        'ingredients',
        current.filter((_, i) => i !== index)
      );
    }
  };

  /* -----------------------------------------------------------------------
   * Image upload handler
   * ----------------------------------------------------------------------- */
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show immediate local preview (optional but nice UX)
    const objectUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(objectUrl);

    // Mark uploading as true
    setIsImageUploading(true);

    if (file.size > 5_000_000) {
      form.setError('image', { type: 'manual', message: 'Image size should be less than 5MB' });
      setIsImageUploading(false);
      return;
    }

    try {
      const uploadResponse = await uploadImageToCloudinary(file);
      form.setValue('image', uploadResponse.url);
    } catch (error) {
      form.setError('image', { type: 'manual', message: 'Failed to upload image' });
    } finally {
      setIsImageUploading(false);
    }
  };

  /* -----------------------------------------------------------------------
   * Form submission
   * ----------------------------------------------------------------------- */
  const onSubmit = async (data: RecipeFormType) => {
    if (isImageUploading) {
      alert('Image is still uploading. Please wait...');
      return;
    }

    try {
      const submitData: RecipeData = {
        ...data,
        prepTime: parseInt(data.prepTime),
        cookTime: parseInt(data.cookTime),
        servings: parseInt(data.servings),
      };

      if (isEdit && initialData?._id) {
        await updateRecipe(initialData._id, submitData);
      } else {
        await createRecipe(submitData);
      }

      // When the server call succeeds:
      // 1) Close the modal
      onClose();
      // 2) Trigger parent's callback
      onSuccess?.();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        {/* Title */}
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipe Title *</FormLabel>
              <FormControl>
                <Input {...field} className='border-2 border-black' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} className='border-2 border-black' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name='category'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category *</FormLabel>
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
                    categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat.name}>
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

        {/* Prep Time, Cook Time, Servings */}
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

        {/* Ingredients */}
        <div>
          <div className='mb-2 flex items-center justify-between'>
            <FormLabel>Ingredients</FormLabel>
            <Button type='button' onClick={addIngredient} variant='outline' size='sm' className='border-2 border-black'>
              <Plus className='mr-1 h-4 w-4' />
              Add Ingredient
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

        {/* Instructions */}
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

        {/* Image Upload */}
        <FormLabel>Recipe Image</FormLabel>
        <Input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          // Optionally disable if we don't want them changing images while already uploading
          disabled={isImageUploading}
        />

        {/* Show Local Preview (before Cloudinary upload finishes) */}
        {localPreviewUrl && (
          <div className='mt-2'>
            <img src={localPreviewUrl} alt='Local Preview' className='h-32 w-32 object-cover' />
          </div>
        )}

        {/* Indicate image is uploading */}
        {isImageUploading && <p className='text-sm text-gray-600'>Uploading image. Please wait...</p>}

        {/* Buttons */}
        <div className='flex justify-end space-x-4'>
          <Button type='button' variant='outline' className='border-2 border-black' onClick={onClose}>
            Cancel
          </Button>
          {/* Disable the submit button if still uploading */}
          <Button type='submit' className='bg-black text-white hover:bg-gray-800' disabled={isImageUploading}>
            {isEdit ? 'Update Recipe' : 'Create Recipe'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RecipeModal;
