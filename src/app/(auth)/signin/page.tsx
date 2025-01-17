'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChefHat } from 'lucide-react';
import { z } from 'zod';
import { loginUser } from '@/services/authService';
import { useUserStore } from '@/zustand';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const signInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

type SignInSchema = z.infer<typeof signInSchema>;

const SignInPage = () => {
  const { signin } = useUserStore();
  const router = useRouter();
  // Define form
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Handle form submission
  const onSubmit = async ({ email, password }: SignInSchema) => {
    console.log(email, password);
    const { message, token } = await loginUser(email, password);
    await signin(token);
    
    if (token){
      router.push('/');
    }

    // Handle form submission
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 p-4'>
      <Card className='w-full max-w-md border-2 border-black'>
        <CardHeader className='space-y-4'>
          <div className='flex items-center justify-center'>
            <ChefHat className='h-12 w-12 text-black' />
          </div>
          <CardTitle className='text-center text-2xl font-bold'>Welcome Back</CardTitle>
          <CardDescription className='text-center'>Sign in to access your recipes and continue cooking</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='you@example.com' type='email' className='border-2 border-black' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center justify-between'>
                      <FormLabel>Password</FormLabel>
                      <Link href='/forgot-password' className='text-sm text-black hover:underline'>
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Enter your password'
                        className='border-2 border-black'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full bg-black text-white hover:bg-gray-800'>
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>

        <Separator className='my-4 bg-black' />

        <CardFooter className='flex flex-col space-y-4 text-center'>
          <p className='text-sm text-gray-600'>
            Don't have an account?{' '}
            <Link href='/signup' className='font-semibold text-black hover:underline'>
              Sign up
            </Link>
          </p>

          <Button
            variant='outline'
            className='w-full border-2 border-black hover:bg-gray-100'
            onClick={() => {
              /* Handle demo login */
            }}
          >
            Try Demo Account
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignInPage;
