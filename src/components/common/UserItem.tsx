'use client';

import React, { useState } from 'react';
import { Mail, UserCircle, UserCog, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { UserModal } from './UserModal';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface UserItemProps {
  user: User;
  onEdit: (userId: string, data: Partial<User>) => void;
  onDelete: (userId: string) => void;
}

export const UserItem: React.FC<UserItemProps> = ({ user, onEdit, onDelete }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const getRoleBadgeColor = (role: string): string => {
    const colors = {
      Admin: 'bg-red-100 text-red-800',
      Contributor: 'bg-blue-100 text-blue-800',
      Viewer: 'bg-gray-100 text-gray-800',
    };
    return colors[role] || colors.Viewer;
  };

  const handleDelete = () => {
    onDelete(user._id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between rounded-lg border-2 border-black p-4 hover:bg-gray-50'>
        <div className='flex items-center space-x-4'>
          <UserCircle className='h-10 w-10 text-gray-400' />
          <div>
            <h3 className='font-semibold'>{user.name}</h3>
            <div className='flex items-center space-x-2 text-sm text-gray-500'>
              <Mail className='h-4 w-4' />
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        <div className='flex items-center space-x-4'>
          <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
          <div className='flex items-center space-x-2'>
            <UserModal
              user={user}
              onSave={onEdit}
              trigger={
                <Button variant='outline' size='icon' className='border-2 border-black'>
                  <UserCog className='h-4 w-4' />
                </Button>
              }
            />
            <Button
              variant='outline'
              size='icon'
              className='border-2 border-black hover:border-red-500 hover:bg-red-50'
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {user.name}&apos;s account? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className='bg-red-500 text-white hover:bg-red-600'>
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
