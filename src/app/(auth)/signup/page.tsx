'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChefHat } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { registerUser } from '@/services/authService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters' })
      .max(50, { message: 'Name must be less than 50 characters' }),
    email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Please enter a valid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/^[A-Za-z\d]{8,}$/, {
        message: 'Password must contain only alphabets and numbers and be at least 8 characters long',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupSchema = z.infer<typeof signupSchema>;

const SignupPage = () => {
  const router = useRouter();

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupSchema) => {
    console.log('SignupSchema', data);
    const role = 'Contributor';
    try {
      const { confirmPassword, ...registrationData } = data;
      const { user } = await registerUser({ role: role, ...registrationData });

      // Optionally handle successful registration
      console.log('Registration successful:', user);

      // You might want to automatically log the user in
      // or redirect them to the login page
      if (user) {
        router.push('/signin');
      }
      console.log('Form data:', data);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 p-4'>
      <Card className='w-full max-w-md border-2 border-black'>
        <CardHeader className='space-y-4'>
          <div className='flex items-center justify-center'>
            <ChefHat className='h-12 w-12 text-black' />
          </div>
          <CardTitle className='text-center text-2xl font-bold'>Create Your Recipe Account</CardTitle>
          <CardDescription className='text-center'>
            Join our community of food lovers and start sharing your recipes
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter your name' className='border-2 border-black' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder='you@example.com' className='border-2 border-black' {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Create a password'
                        className='border-2 border-black'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Confirm your password'
                        className='border-2 border-black'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                className='w-full bg-black text-white hover:bg-gray-800'
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Signing up...' : 'Sign Up'}
              </Button>
            </form>
          </Form>
        </CardContent>

        <Separator className='my-4 bg-black' />

        <CardFooter className='flex flex-col space-y-4 text-center'>
          <p className='text-sm text-gray-600'>
            Already have an account?{' '}
            <Link href='/signin' className='font-semibold text-black hover:underline'>
              Log in
            </Link>
          </p>

          <p className='text-xs text-gray-500'>By signing up, you agree to our Terms of Service and Privacy Policy</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupPage;
