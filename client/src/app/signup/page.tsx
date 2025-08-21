'use client';

import { ReactEventHandler, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    orgName: '',
    orgMobileNo: '',
    orgEmail: '',
    orgGstNo: '',
    orgAddress: '',
    adminName: '',
    adminPassword: '',
    adminMobileNo: '',
    adminAddress: '',
  });
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setFormData({
          orgName: '',
          orgMobileNo: '',
          orgEmail: '',
          orgGstNo: '',
          orgAddress: '',
          adminName: '',
          adminPassword: '',
          adminMobileNo: '',
          adminAddress: '',
        });
      } else {
        const msg = await res.text();
        setError(msg);
      }
    } catch (err) {
      setError('Something went wrong!');
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border'>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Admin Name
                  </label>
                  <input
                    type='text'
                    name='adminName'
                    value={formData.adminName}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 bg-input border border-border rounded-lg'
                    placeholder='Admin full name'
                  />
                </div>
                <div>
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

                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Mobile No
                  </label>
                  <input
                    type='text'
                    name='adminMobileNo'
                    value={formData.adminMobileNo}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 bg-input border border-border rounded-lg'
                    placeholder='+91 98765 43210'
                  />
                </div>
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium mb-2'>
                    Address
                  </label>
                  <textarea
                    name='adminAddress'
                    value={formData.adminAddress}
                    onChange={handleChange}
                    rows={3}
                    required
                    className='w-full px-4 py-3 bg-input border border-border rounded-lg'
                    placeholder='Admin address'
                  />
                </div>
              </div>

              <motion.button
                type='submit'
                className='w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:neon-glow transition-all duration-300'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign Up
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
