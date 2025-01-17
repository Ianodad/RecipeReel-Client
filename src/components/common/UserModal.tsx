'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserCog, Trash, Mail, UserCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Contributor' | 'Viewer';
  createdAt: string;
}

interface UserModalProps {
  user: User;
  trigger: React.ReactNode;
  onSave: (userId: string, updatedData: Partial<User>) => void;
}

// User Edit Modal Component
export const UserModal: React.FC<UserModalProps> = ({ user, trigger, onSave }) => {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(user.role);

  const handleSave = () => {
    onSave(user._id, { role });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>Edit User Role</DialogTitle>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label>User Information</Label>
            <div className='rounded-lg border p-4'>
              <div className='flex items-center space-x-4'>
                <UserCircle className='h-12 w-12 text-gray-400' />
                <div>
                  <p className='font-medium'>{user.name}</p>
                  <p className='text-sm text-gray-500'>{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='role'>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className='border-2 border-black'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Admin'>Admin</SelectItem>
                <SelectItem value='Contributor'>Contributor</SelectItem>
                <SelectItem value='Viewer'>Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='flex justify-end space-x-4'>
          <Button variant='outline' className='border-2 border-black' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className='bg-black text-white hover:bg-gray-800' onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
