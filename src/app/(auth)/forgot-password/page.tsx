import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChefHat, ArrowLeft } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 p-4'>
      <Card className='w-full max-w-md border-2 border-black'>
        <CardHeader className='space-y-4'>
          <div className='flex items-center justify-center'>
            <ChefHat className='h-12 w-12 text-black' />
          </div>
          <CardTitle className='text-center text-2xl font-bold'>Reset Password</CardTitle>
          <CardDescription className='text-center'>
            Enter your email address and we'll send you instructions to reset your password
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isSubmitted ? (
            <Alert className='border-2 border-black bg-gray-50'>
              <AlertDescription className='py-2 text-center'>
                If an account exists with that email, you'll receive password reset instructions shortly. Please check
                your email.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email Address</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='you@example.com'
                  className='border-2 border-black'
                  required
                />
              </div>

              <Button type='submit' className='w-full bg-black text-white hover:bg-gray-800'>
                Send Reset Instructions
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className='flex justify-center'>
          <Button
            variant='link'
            className='text-black hover:text-gray-600'
            onClick={() => {
              /* Handle navigation */
            }}
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
