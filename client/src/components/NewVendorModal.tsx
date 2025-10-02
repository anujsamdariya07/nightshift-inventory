'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export function NewVendorModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (vendorData: any) => Promise<any>;
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gstNo: '',
    address: '',
    status: 'active' as 'active' | 'inactive',
    specialities: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pathName = usePathname();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await onSubmit(formData);
      if (result.success) {
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          gstNo: '',
          address: '',
          status: 'active',
          specialities: [] as string[],
        });
        if (pathName !== '/vendors') router.push('/vendors');
        onClose();
      }
    } catch (error) {
      console.error('Error creating vendor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className='bg-card border border-border rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto'
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-bold text-primary'>
                Add New Vendor
              </h2>
              <button
                onClick={onClose}
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Basic Information */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-foreground'>
                  Basic Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <input
                    type='text'
                    placeholder='Vendor Name'
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className='px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'
                    required
                  />
                  <input
                    type='email'
                    placeholder='Email Address'
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className='px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'
                    required
                  />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <input
                    type='tel'
                    placeholder='Phone Number'
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className='px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'
                    required
                  />
                  <input
                    type='text'
                    placeholder='GST Number'
                    value={formData.gstNo}
                    onChange={(e) =>
                      setFormData({ ...formData, gstNo: e.target.value })
                    }
                    className='px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'
                    required
                  />
                </div>
                <textarea
                  placeholder='Address'
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'
                  rows={3}
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className='block text-sm font-medium text-foreground mb-2'>
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as 'active' | 'inactive',
                    })
                  }
                  className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'
                >
                  <option value='active'>Active</option>
                  <option value='inactive'>Inactive</option>
                </select>
              </div>

              {/* Specialties */}
              <div>
                <label className='block text-sm font-medium text-foreground mb-2'>
                  Specialties
                </label>
                <div className='flex flex-wrap gap-2 mb-2'>
                  {formData.specialities.map((spec, idx) => (
                    <span
                      key={idx}
                      className='px-2 py-1 text-sm bg-primary/20 text-primary rounded-full flex items-center gap-1'
                    >
                      {spec}
                      <button
                        type='button'
                        className='ml-1 text-xs text-destructive'
                        onClick={() =>
                          setFormData({
                            ...formData,
                            specialities: formData.specialities.filter(
                              (_, i) => i !== idx
                            ),
                          })
                        }
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type='text'
                  placeholder='Add specialty and press Enter'
                  className='w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const value = e.currentTarget.value.trim();
                      if (value && !formData.specialities.includes(value)) {
                        setFormData({
                          ...formData,
                          specialities: [...formData.specialities, value],
                        });
                      }
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>

              {/* Submit Buttons */}
              <div className='flex gap-4 pt-4'>
                <button
                  type='button'
                  onClick={onClose}
                  className='flex-1 py-3 px-6 border border-border text-muted-foreground rounded-lg hover:bg-muted hover:text-foreground transition-all duration-300'
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='flex-1 py-3 px-6 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 disabled:opacity-50'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                      <span>Creating...</span>
                      <Loader className='animate-spin h-4 w-4 text-primary-foreground' />
                    </div>
                  ) : (
                    'Add Vendor'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
