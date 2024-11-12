import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import type { RegisterData } from '../../types/user';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  favoriteAuthors: z.array(z.string()).min(1, 'Add at least one favorite author'),
  favoriteBooks: z.array(z.string()).min(1, 'Add at least one favorite book'),
  favoriteMovies: z.array(z.string()).min(1, 'Add at least one favorite movie'),
  bio: z.string().optional()
});

const RegisterForm = () => {
  const register = useAuthStore(state => state.register);
  const { register: registerField, handleSubmit, formState: { errors } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      await register(data);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          {...registerField('email')}
          type="email"
          className="w-full p-2 rounded border border-gray-700 bg-gray-800"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Username</label>
        <input
          {...registerField('username')}
          type="text"
          className="w-full p-2 rounded border border-gray-700 bg-gray-800"
        />
        {errors.username && (
          <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          {...registerField('password')}
          type="password"
          className="w-full p-2 rounded border border-gray-700 bg-gray-800"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          {...registerField('bio')}
          className="w-full p-2 rounded border border-gray-700 bg-gray-800"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#FF1B4C] text-white py-2 rounded hover:bg-[#E01543] transition-colors"
      >
        Create Account
      </button>
    </form>
  );
};

export default RegisterForm;