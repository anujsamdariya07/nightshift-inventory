'use client';

import type React from 'react';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
              Get In Touch
            </h1>
            <p className='text-xl text-muted-foreground mb-8'>
              Ready to transform your inventory management? Let's discuss your
              needs.
            </p>
            <div className='w-24 h-1 bg-gradient-to-r from-primary via-secondary to-accent mx-auto rounded-full' />
          </motion.div>
        </section>

        {/* Contact Form and Info */}
        <section className='container mx-auto px-4'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            {/* Contact Form */}
            <motion.div
              className='bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8'
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className='text-2xl font-bold text-foreground mb-6'>
                Send us a message
              </h2>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div>
                  <label className='block text-sm font-medium text-foreground mb-2'>
                    Name
                  </label>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300'
                    placeholder='Your full name'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-foreground mb-2'>
                    Email
                  </label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300'
                    placeholder='your.email@company.com'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-foreground mb-2'>
                    Company
                  </label>
                  <input
                    type='text'
                    name='company'
                    value={formData.company}
                    onChange={handleChange}
                    className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300'
                    placeholder='Your company name'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-foreground mb-2'>
                    Message
                  </label>
                  <textarea
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none'
                    placeholder='Tell us about your inventory management needs...'
                  />
                </div>

                <motion.button
                  type='submit'
                  className='w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:neon-glow transition-all duration-300'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className='space-y-8'
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className='bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8'>
                <h3 className='text-xl font-bold text-foreground mb-6'>
                  Contact Information
                </h3>
                <div className='space-y-4'>
                  <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center'>
                      <span className='text-primary text-xl'>📧</span>
                    </div>
                    <div>
                      <p className='text-sm text-muted-foreground'>Email</p>
                      <p className='text-foreground font-medium'>
                        support@nightshift.com
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center'>
                      <span className='text-secondary text-xl'>📞</span>
                    </div>
                    <div>
                      <p className='text-sm text-muted-foreground'>Phone</p>
                      <p className='text-foreground font-medium'>
                        +1 (555) 123-4567
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center'>
                      <span className='text-accent text-xl'>📍</span>
                    </div>
                    <div>
                      <p className='text-sm text-muted-foreground'>Address</p>
                      <p className='text-foreground font-medium'>
                        123 Innovation Drive
                        <br />
                        Tech City, TC 12345
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className='bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8'>
                <h3 className='text-xl font-bold text-foreground mb-6'>
                  Follow Us
                </h3>
                <div className='flex gap-4'>
                  {[
                    { name: 'Twitter', icon: '𝕏', color: 'primary' },
                    { name: 'LinkedIn', icon: 'in', color: 'secondary' },
                    { name: 'GitHub', icon: 'gh', color: 'accent' },
                  ].map((social) => (
                    <motion.a
                      key={social.name}
                      href='#'
                      className={`w-12 h-12 bg-${social.color}/20 rounded-lg flex items-center justify-center text-${social.color} hover:bg-${social.color} hover:text-${social.color}-foreground hover:neon-glow transition-all duration-300`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
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
          Message sent successfully! We'll get back to you soon.
        </motion.div>
      )}
    </div>
  );
}
