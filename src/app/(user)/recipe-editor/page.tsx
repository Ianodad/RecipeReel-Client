import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChefHat, Plus, Trash2, Image as ImageIcon, Save, Eye, X, MoveUp, MoveDown } from 'lucide-react';

const RecipeEditor = () => {
  const [ingredients, setIngredients] = useState([{ amount: '', unit: '', item: '' }]);
  const [steps, setSteps] = useState([{ instruction: '', tip: '' }]);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

  const categories = [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Dessert',
    'Snacks',
    'Beverages',
    'Appetizers',
    'Soups',
    'Salads',
    'Main Course',
    'Side Dishes',
  ];

  const difficultyLevels = ['Easy', 'Medium', 'Hard', 'Expert'];
  const cuisines = ['Italian', 'Mexican', 'Chinese', 'Indian', 'American', 'French', 'Japanese', 'Mediterranean'];
  const dietaryTags = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo', 'Low-Carb'];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { amount: '', unit: '', item: '' }]);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addStep = () => {
    setSteps([...steps, { instruction: '', tip: '' }]);
  };

  const removeStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const moveStep = (index, direction) => {
    const newSteps = [...steps];
    if (direction === 'up' && index > 0) {
      [newSteps[index], newSteps[index - 1]] = [newSteps[index - 1], newSteps[index]];
    } else if (direction === 'down' && index < steps.length - 1) {
      [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
    }
    setSteps(newSteps);
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4'>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>Create New Recipe</h1>
          <div className='flex space-x-4'>
            <Button variant='outline' className='border-2 border-black'>
              <Eye className='mr-2 h-4 w-4' />
              Preview
            </Button>
            <Button className='bg-black text-white hover:bg-gray-800'>
              <Save className='mr-2 h-4 w-4' />
              Save Recipe
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Main Form Content */}
          <div className='space-y-6 lg:col-span-2'>
            {/* Basic Information */}
            <Card className='border-2 border-black p-6'>
              <h2 className='mb-4 text-xl font-semibold'>Basic Information</h2>
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='title'>Recipe Title</Label>
                  <Input id='title' placeholder='Enter recipe title' className='border-2 border-black' />
                </div>

                <div>
                  <Label htmlFor='description'>Description</Label>
                  <Textarea
                    id='description'
                    placeholder='Write a brief description of your recipe'
                    className='border-2 border-black'
                    rows={4}
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='prepTime'>Preparation Time (minutes)</Label>
                    <Input id='prepTime' type='number' className='border-2 border-black' />
                  </div>
                  <div>
                    <Label htmlFor='cookTime'>Cooking Time (minutes)</Label>
                    <Input id='cookTime' type='number' className='border-2 border-black' />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='servings'>Servings</Label>
                    <Input id='servings' type='number' className='border-2 border-black' />
                  </div>
                  <div>
                    <Label>Difficulty</Label>
                    <Select>
                      <SelectTrigger className='border-2 border-black'>
                        <SelectValue placeholder='Select difficulty' />
                      </SelectTrigger>
                      <SelectContent>
                        {difficultyLevels.map((level) => (
                          <SelectItem key={level} value={level.toLowerCase()}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>

            {/* Ingredients Section */}
            <Card className='border-2 border-black p-6'>
              <h2 className='mb-4 text-xl font-semibold'>Ingredients</h2>
              <div className='space-y-4'>
                {ingredients.map((ingredient, index) => (
                  <div key={index} className='flex items-center space-x-4'>
                    <Input
                      placeholder='Amount'
                      className='w-24 border-2 border-black'
                      value={ingredient.amount}
                      onChange={(e) => {
                        const newIngredients = [...ingredients];
                        newIngredients[index].amount = e.target.value;
                        setIngredients(newIngredients);
                      }}
                    />
                    <Select
                      value={ingredient.unit}
                      onValueChange={(value) => {
                        const newIngredients = [...ingredients];
                        newIngredients[index].unit = value;
                        setIngredients(newIngredients);
                      }}
                    >
                      <SelectTrigger className='w-32 border-2 border-black'>
                        <SelectValue placeholder='Unit' />
                      </SelectTrigger>
                      <SelectContent>
                        {['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'piece'].map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder='Ingredient'
                      className='flex-1 border-2 border-black'
                      value={ingredient.item}
                      onChange={(e) => {
                        const newIngredients = [...ingredients];
                        newIngredients[index].item = e.target.value;
                        setIngredients(newIngredients);
                      }}
                    />
                    <Button
                      variant='outline'
                      size='icon'
                      className='border-2 border-black'
                      onClick={() => removeIngredient(index)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
                <Button variant='outline' className='w-full border-2 border-black' onClick={addIngredient}>
                  <Plus className='mr-2 h-4 w-4' />
                  Add Ingredient
                </Button>
              </div>
            </Card>

            {/* Instructions Section */}
            <Card className='border-2 border-black p-6'>
              <h2 className='mb-4 text-xl font-semibold'>Instructions</h2>
              <div className='space-y-4'>
                {steps.map((step, index) => (
                  <div key={index} className='space-y-2'>
                    <div className='flex items-start space-x-4'>
                      <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-black font-bold text-white'>
                        {index + 1}
                      </div>
                      <div className='flex-1 space-y-2'>
                        <Textarea
                          placeholder='Enter instruction step'
                          className='w-full border-2 border-black'
                          value={step.instruction}
                          onChange={(e) => {
                            const newSteps = [...steps];
                            newSteps[index].instruction = e.target.value;
                            setSteps(newSteps);
                          }}
                        />
                        <Input
                          placeholder='Add a tip (optional)'
                          className='w-full border-2 border-black'
                          value={step.tip}
                          onChange={(e) => {
                            const newSteps = [...steps];
                            newSteps[index].tip = e.target.value;
                            setSteps(newSteps);
                          }}
                        />
                      </div>
                      <div className='flex-shrink-0 space-y-2'>
                        <Button
                          variant='outline'
                          size='icon'
                          className='border-2 border-black'
                          onClick={() => moveStep(index, 'up')}
                          disabled={index === 0}
                        >
                          <MoveUp className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='outline'
                          size='icon'
                          className='border-2 border-black'
                          onClick={() => moveStep(index, 'down')}
                          disabled={index === steps.length - 1}
                        >
                          <MoveDown className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='outline'
                          size='icon'
                          className='border-2 border-black'
                          onClick={() => removeStep(index)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant='outline' className='w-full border-2 border-black' onClick={addStep}>
                  <Plus className='mr-2 h-4 w-4' />
                  Add Step
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className='space-y-6 lg:col-span-1'>
            {/* Image Upload */}
            <Card className='border-2 border-black p-6'>
              <h2 className='mb-4 text-xl font-semibold'>Recipe Image</h2>
              <div className='space-y-4'>
                <div className='rounded-lg border-2 border-dashed border-black p-4 text-center'>
                  {previewImage ? (
                    <div className='relative'>
                      <img src={previewImage} alt='Recipe preview' className='h-48 w-full rounded-lg object-cover' />
                      <Button
                        variant='outline'
                        size='icon'
                        className='absolute right-2 top-2 border-2 border-black bg-white'
                        onClick={() => setPreviewImage(null)}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  ) : (
                    <label className='block cursor-pointer'>
                      <input type='file' className='hidden' accept='image/*' onChange={handleImageUpload} />
                      <ImageIcon className='mx-auto mb-2 h-12 w-12 text-gray-400' />
                      <span className='text-sm text-gray-600'>Click to upload recipe image</span>
                    </label>
                  )}
                </div>
              </div>
            </Card>

            {/* Categories and Tags */}
            <Card className='border-2 border-black p-6'>
              <h2 className='mb-4 text-xl font-semibold'>Categories & Tags</h2>
              <div className='space-y-4'>
                <div>
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger className='border-2 border-black'>
                      <SelectValue placeholder='Select category' />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Cuisine</Label>
                  <Select>
                    <SelectTrigger className='border-2 border-black'>
                      <SelectValue placeholder='Select cuisine' />
                    </SelectTrigger>
                    <SelectContent>
                      {cuisines.map((cuisine) => (
                        <SelectItem key={cuisine} value={cuisine.toLowerCase()}>
                          {cuisine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Dietary Tags</Label>
                  <div className='mt-2 grid grid-cols-2 gap-2'>
                    {dietaryTags.map((tag) => (
                      <Button key={tag} variant='outline' className='border-2 border-black'>
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeEditor;
