'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    orgEmail: '',
    adminPassword: '',
  });
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setFormData({ orgEmail: '', adminPassword: '' });
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
              Organization Login
            </h1>
            <p className='text-xl text-muted-foreground mb-8'>
              Sign in with your registered email and admin password.
            </p>
            <div className='w-24 h-1 bg-gradient-to-r from-primary via-secondary to-accent mx-auto rounded-full' />
          </motion.div>
        </section>

        {/* Login Form */}
        <section className='container mx-auto px-4'>
          <motion.div
            className='bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 max-w-md mx-auto'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className='text-2xl font-bold text-foreground mb-6'>Login</h2>

            {error && (
              <div className='mb-4 p-3 rounded-lg bg-red-500/20 text-red-600'>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label className='block text-sm font-medium mb-2'>Email</label>
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
                className='w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:neon-glow transition-all duration-300'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Login
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
          Login successful!
        </motion.div>
      )}
    </div>
  );
}
