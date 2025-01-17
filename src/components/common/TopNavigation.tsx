'use client';
import { ChefHat } from 'lucide-react';
import { Button } from '../ui/button';
import { useUserStore } from '@/zustand';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function TopNavigation() {
  const { isAuthenticated, signout, role: userRole } = useUserStore();

  const router = useRouter();
  return (
    <header className='border-b-2 border-black bg-white'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <ChefHat className='h-8 w-8 text-black' />
            <span className='text-xl font-bold'>RecipeReel</span>
          </div>

          <nav className='hidden space-x-6 md:flex'>
            <Link href='/' className='font-medium text-black hover:text-gray-600'>
              Home
            </Link>
            <Link href='/recipe-catalog  ' className='font-medium text-black hover:text-gray-600'>
              Recipes
            </Link>
            <Link href='/recipe-detail' className='font-medium text-black hover:text-gray-600'>
              Categories
            </Link>
            {userRole != 'Viewer' && (
              <Link href='/dashboard' className='font-medium text-black hover:text-gray-600'>
                Dashboard
              </Link>
            )}
          </nav>
          {!isAuthenticated && (
            <div className='flex items-center space-x-4'>
              <Link href='/signin'>
                <Button variant='outline' className='border-2 border-black hover:bg-gray-100'>
                  Sign In
                </Button>
              </Link>
              <Link href='/signup'>
                <Button className='bg-black text-white hover:bg-gray-800'>Sign Up</Button>
              </Link>
            </div>
          )}
          {isAuthenticated && (
            <div className='flex items-center space-x-4'>
              <Button
                variant='outline'
                className='border-2 border-black hover:bg-gray-100'
                onClick={() => {
                  signout();
                  router.push('/signin');
                }}
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
