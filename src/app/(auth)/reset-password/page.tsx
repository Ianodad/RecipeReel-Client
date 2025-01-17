import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChefHat, CheckCircle } from 'lucide-react';

const ResetPasswordPage = () => {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [password, setPassword] = React.useState('');

  const validatePassword = (pass) => {
    const minLength = pass.length >= 8;
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    return { minLength, hasUpperCase, hasLowerCase, hasNumber };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const requirements = validatePassword(password);

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 p-4'>
      <Card className='w-full max-w-md border-2 border-black'>
        <CardHeader className='space-y-4'>
          <div className='flex items-center justify-center'>
            <ChefHat className='h-12 w-12 text-black' />
          </div>
          <CardTitle className='text-center text-2xl font-bold'>Create New Password</CardTitle>
          <CardDescription className='text-center'>Please enter your new password below</CardDescription>
        </CardHeader>

        <CardContent>
          {isSubmitted ? (
            <div className='space-y-4 text-center'>
              <CheckCircle className='mx-auto h-12 w-12 text-green-500' />
              <Alert className='border-2 border-black bg-gray-50'>
                <AlertDescription className='py-2'>
                  Your password has been successfully reset. You can now sign in with your new password.
                </AlertDescription>
              </Alert>
              <Button
                className='mt-4 w-full bg-black text-white hover:bg-gray-800'
                onClick={() => {
                  /* Navigate to sign in */
                }}
              >
                Return to Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='space-y-2'>
                <Label htmlFor='password'>New Password</Label>
                <Input
                  id='password'
                  type='password'
                  placeholder='Enter your new password'
                  className='border-2 border-black'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='confirmPassword'>Confirm New Password</Label>
                <Input
                  id='confirmPassword'
                  type='password'
                  placeholder='Confirm your new password'
                  className='border-2 border-black'
                  required
                />
              </div>

              <div className='space-y-2 text-sm'>
                <p className='font-medium'>Password Requirements:</p>
                <ul className='space-y-1 text-gray-600'>
                  <li className={requirements.minLength ? 'text-green-600' : ''}>✓ At least 8 characters long</li>
                  <li className={requirements.hasUpperCase ? 'text-green-600' : ''}>✓ At least one uppercase letter</li>
                  <li className={requirements.hasLowerCase ? 'text-green-600' : ''}>✓ At least one lowercase letter</li>
                  <li className={requirements.hasNumber ? 'text-green-600' : ''}>✓ At least one number</li>
                </ul>
              </div>

              <Button type='submit' className='w-full bg-black text-white hover:bg-gray-800'>
                Reset Password
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className='text-center text-sm text-gray-600'>
          <p>
            Need help?{' '}
            <a href='/contact' className='font-semibold text-black hover:underline'>
              Contact Support
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
