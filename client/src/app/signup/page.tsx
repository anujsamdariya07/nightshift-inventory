'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { axiosInstance } from '@/lib/axios';
import useAuthStore from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);

  const { signUp, loading, authUser } = useAuthStore.getState();

  const router = useRouter();

  const [formData, setFormData] = useState({
    orgName: '',
    orgMobileNo: '',
    orgEmail: '',
    orgGstNo: '',
    orgAddress: '',
    adminPassword: '',
  });
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await signUp(formData);

    if (result.success) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      // reset form
      setFormData({
        orgName: '',
        orgMobileNo: '',
        orgEmail: '',
        orgGstNo: '',
        orgAddress: '',
        adminPassword: '',
      });

      router.push('/dashboard');
    } else {
      setError(result.error || 'Something went wrong!');
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (authUser) {
      router.push('/');
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
              Organization Sign Up
            </h1>
            <p className='text-xl text-muted-foreground mb-8'>
              Register your organization and admin account to get started.
            </p>
            <div className='w-24 h-1 bg-gradient-to-r from-primary via-secondary to-accent mx-auto rounded-full' />
          </motion.div>
        </section>

        {/* Signup Form */}
        <section className='container mx-auto px-4'>
          <motion.div
            className='bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 max-w-3xl mx-auto'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className='text-2xl font-bold text-foreground mb-6'>
              Organization & Admin Details
            </h2>

            {error && (
              <div className='mb-4 p-3 rounded-lg bg-red-500/20 text-red-600'>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Organization Fields */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Organization Name
                  </label>
                  <input
                    type='text'
                    name='orgName'
                    value={formData.orgName}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 bg-input border border-border rounded-lg'
                    placeholder='Your organization name'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Mobile No
                  </label>
                  <input
                    type='text'
                    name='orgMobileNo'
                    value={formData.orgMobileNo}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 bg-input border border-border rounded-lg'
                    placeholder='+91 98765 43210'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Email
                  </label>
                  <input
                    type='email'
                    name='orgEmail'
                    value={formData.orgEmail}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 bg-input border border-border rounded-lg'
                    placeholder='org@example.com'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    GST No
                  </label>
                  <input
                    type='text'
                    name='orgGstNo'
                    value={formData.orgGstNo}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 bg-input border border-border rounded-lg'
                    placeholder='GST1234XXXX'
                  />
                </div>
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium mb-2'>
                    Address
                  </label>
                  <textarea
                    name='orgAddress'
                    value={formData.orgAddress}
                    onChange={handleChange}
                    rows={3}
                    required
                    className='w-full px-4 py-3 bg-input border border-border rounded-lg'
                    placeholder='Organization address'
                  />
                </div>
              </div>

              {/* Admin Fields */}
              <div className='pt-6 border-t border-border'>
                <label className='block text-sm font-medium mb-2'>
                  Password
                </label>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name='adminPassword'
                    value={formData.adminPassword}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 pr-10 bg-input border border-border rounded-lg'
                    placeholder='********'
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

              <motion.button
                type='submit'
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-300
                  ${
                    loading
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
                    <Loader2 className='h-5 w-5 animate-spin' />
                    <span>Signing Up...</span>
                  </motion.div>
                ) : (
                  'Sign Up'
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
          Organization registered successfully!
        </motion.div>
      )}
    </div>
  );
}
