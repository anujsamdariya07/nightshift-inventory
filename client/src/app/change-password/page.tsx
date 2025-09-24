'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Eye, EyeOff, Loader } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function ChangePasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { changePassword, loading, authUser } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength (optional)
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const passwordData = {
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    };

    const res = await changePassword(passwordData);

    if (res.success) {
      setShowToast(true);
      setMessage(res.message || 'Password changed successfully!');
      setTimeout(() => setShowToast(false), 3000);
      setFormData({ password: '', confirmPassword: '' });
      
      // Redirect to dashboard after successful password change
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } else {
      setError(res.error || 'Failed to change password. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    // Redirect if user is not authenticated
    if (!authUser) {
      router.push('/login');
    } else if (authUser && !authUser.mustChangePassword) {
      router.push('/dashboard')
    }
  }, [authUser]);

  return (
    <div className='min-h-screen bg-background'>
      <Navbar />

      <main className='pt-24 pb-16'>
        {/* Header Section */}
        <section className='container mx-auto px-4 mb-16'>
          <motion.div
            className='text-center max-w-4xl mx-auto'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className='text-4xl md:text-6xl font-bold font-mono text-primary neon-text mb-6'>
              Change Password
            </h1>
            <p className='text-xl text-muted-foreground mb-8'>
              Set up your account by creating a new secure password.
            </p>
            <div className='w-24 h-1 bg-gradient-to-r from-primary via-secondary to-accent mx-auto rounded-full' />
          </motion.div>
        </section>

        {/* Change Password Form */}
        <section className='container mx-auto px-4'>
          <motion.div
            className='bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 max-w-md mx-auto'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className='text-center mb-6'>
              <h2 className='text-2xl font-bold text-foreground mb-2'>
                Setup Your Account
              </h2>
              <p className='text-muted-foreground'>
                Create a new password to secure your account
              </p>
            </div>

            {error && (
              <div className='mb-4 p-3 rounded-lg bg-red-500/20 text-red-600'>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label className='block text-sm font-medium mb-2'>
                  New Password
                </label>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 pr-10 bg-input border border-border rounded-lg'
                    placeholder='Enter new password'
                    minLength={6}
                  />
                  <button
                    type='button'
                    className='absolute inset-y-0 right-3 flex items-center'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className='size-5 text-base-content/40' />
                    ) : (
                      <Eye className='size-5 text-base-content/40' />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>
                  Confirm Password
                </label>
                <div className='relative'>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 pr-10 bg-input border border-border rounded-lg'
                    placeholder='Confirm new password'
                    minLength={6}
                  />
                  <button
                    type='button'
                    className='absolute inset-y-0 right-3 flex items-center'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='size-5 text-base-content/40' />
                    ) : (
                      <Eye className='size-5 text-base-content/40' />
                    )}
                  </button>
                </div>
              </div>

              {/* Password strength indicator */}
              {formData.password && (
                <div className='text-xs text-muted-foreground'>
                  {formData.password.length < 6 ? (
                    <span className='text-red-500'>
                      Password must be at least 6 characters
                    </span>
                  ) : (
                    <span className='text-green-500'>
                      Password strength: Good
                    </span>
                  )}
                </div>
              )}

              <motion.button
                type='submit'
                disabled={loading || formData.password !== formData.confirmPassword}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-300
                  ${
                    loading || formData.password !== formData.confirmPassword
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-primary text-primary-foreground hover:neon-glow'
                  }
                `}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <motion.div
                    className='flex items-center justify-center gap-2'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Loader className='h-5 w-5 animate-spin' />
                    <span>Changing Password...</span>
                  </motion.div>
                ) : (
                  'Change Password'
                )}
              </motion.button>
            </form>
          </motion.div>
        </section>
      </main>

      {/* Toast Notification */}
      {showToast && (
        <motion.div
          className='fixed top-24 right-4 bg-accent text-accent-foreground px-6 py-3 rounded-lg shadow-lg z-50'
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
        >
          {message}
        </motion.div>
      )}
    </div>
  );
}