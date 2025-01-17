import { ChefHat } from 'lucide-react';

export function Footer() {
  return (
    <footer className='border-t-2 border-black bg-white py-8'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col items-center justify-between md:flex-row'>
          <div className='mb-4 flex items-center space-x-2 md:mb-0'>
            <ChefHat className='h-6 w-6 text-black' />
            <span className='font-bold'>RecipeReel</span>
          </div>
          <div className='flex space-x-6'>
            <a href='/about' className='text-black hover:text-gray-600'>
              About
            </a>
            <a href='/contact' className='text-black hover:text-gray-600'>
              Contact
            </a>
            <a href='/privacy' className='text-black hover:text-gray-600'>
              Privacy
            </a>
            <a href='/terms' className='text-black hover:text-gray-600'>
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
