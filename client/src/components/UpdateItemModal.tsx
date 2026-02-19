'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { Vendor } from '@/store/useVendorStore';

export default function QuantityUpdateModal({
  item,
  type,
  onClose,
  onSubmit,
  vendors,
  loading,
}: {
  item: any;
  type: 'REPLENISHMENT' | 'ORDER' | 'ORDERREVERT';
  vendors: Vendor[];
  onClose: () => void;
  onSubmit: (data: {
    vendorId: string;
    vendorName: string;
    quantityChange: number;
    cost: number;
  }) => void;
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    vendorId: '',
    quantityChange: 0,
    vendorName: '',
    cost: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const quantityChange =
      type === 'REPLENISHMENT'
        ? formData.quantityChange || 0
        : -(formData.quantityChange || 0);
    onSubmit({
      ...formData,
      quantityChange,
    });
  };

  useEffect(() => {
    const handlePress: any = (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handlePress);

    return () => {
      document.removeEventListener('keydown', handlePress);
    };
  }, [onClose]);

  return (
    <motion.div
      className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className='bg-card border border-border rounded-2xl p-8 w-full max-w-md'
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-primary'>
            {type === 'REPLENISHMENT' ? 'Restock Item' : 'Order Out Item'}
          </h2>
          <button
            onClick={onClose}
            className='text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2'
          >
            <span className='keyboard-key'>Esc</span>
            <span>✕</span>
          </button>
        </div>

        <div className='mb-6 p-4 bg-background/50 rounded-lg'>
          <h3 className='font-semibold text-foreground'>
            {item?.name || 'Unknown Item'}
          </h3>
          <p className='text-sm text-muted-foreground'>
            Current Stock: {item?.quantity || 0}
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              {type === 'REPLENISHMENT'
                ? 'Vendor/Supplier *'
                : 'Customer/Order Reference *'}
            </label>
            {type === 'REPLENISHMENT' ? (
              <select
                required
                value={formData.vendorId}
                onChange={(e) => {
                  const selectedVendor = vendors.find(
                    (v) => v.vendorId === e.target.value,
                  );
                  setFormData((prev) => ({
                    ...prev,
                    vendorId: selectedVendor?.vendorId || '',
                    vendorName: selectedVendor?.name || '',
                  }));
                }}
                className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300'
              >
                <option value=''>Select Vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor.vendorId} value={vendor.vendorId}>
                    {vendor.vendorId} - {vendor.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type='text'
                required
                value={formData.vendorName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    vendorName: e.target.value,
                  }))
                }
                className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300'
                placeholder='Enter customer/order reference'
              />
            )}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-foreground mb-2'>
                Quantity *
              </label>
              <input
                type='number'
                required
                min='1'
                max={type === 'ORDER' ? item?.quantity || 0 : undefined}
                value={formData.quantityChange}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    quantityChange: parseInt(e.target.value) || 0,
                  }))
                }
                className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300'
                placeholder='0'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-foreground mb-2'>
                Cost per Unit (₹) *
              </label>
              <input
                type='number'
                required
                min='0'
                step='0.01'
                value={formData.cost}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    cost: parseFloat(e.target.value) || 0,
                  }))
                }
                className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300'
                placeholder='0.00'
              />
            </div>
          </div>

          {type === 'ORDER' &&
            formData.quantityChange > (item?.quantity || 0) && (
              <div className='text-sm text-destructive'>
                Cannot order more than available stock ({item?.quantity || 0})
              </div>
            )}

          <div className='bg-background/50 rounded-lg p-4'>
            <div className='flex justify-between text-sm'>
              <span>Total Cost:</span>
              <span className='font-semibold'>
                ₹
                {(
                  (formData.quantityChange || 0) * (formData.cost || 0)
                ).toFixed(2)}
              </span>
            </div>
            <div className='flex justify-between text-sm mt-1'>
              <span>New Stock Level:</span>
              <span className='font-semibold'>
                {type === 'REPLENISHMENT'
                  ? (item?.quantity || 0) + (formData.quantityChange || 0)
                  : (item?.quantity || 0) - (formData.quantityChange || 0)}
              </span>
            </div>
          </div>

          <div className='flex gap-4 pt-4'>
            <motion.button
              type='button'
              onClick={onClose}
              className='flex-1 py-3 px-6 border border-border text-muted-foreground rounded-lg hover:bg-muted hover:text-foreground transition-all duration-300'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              Cancel
            </motion.button>
            <motion.button
              type='submit'
              className={`flex-1 py-3 px-6 rounded-lg hover:neon-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                type === 'REPLENISHMENT'
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              disabled={
                loading ||
                (type === 'ORDER' &&
                  formData.quantityChange > (item?.quantity || 0))
              }
            >
              {loading ? (
                <div className='flex items-center justify-center gap-2'>
                  <Loader className='animate-spin h-4 w-4 text-white' />
                  Processing...
                </div>
              ) : type === 'REPLENISHMENT' ? (
                'Restock'
              ) : (
                'Order Out'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
