'use client'

import { Vendor } from "@/store/useVendorStore";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useState } from "react";

export function NewItemModal({
  onClose,
  onSubmit,
  vendors,
  loading,
}: {
  onClose: () => void;
  onSubmit: (item: any) => void;
  vendors: Vendor[];
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    threshold: 10,
    image: '',
    vendorId: '',
    vendorName: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

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
          <h2 className='text-2xl font-bold text-primary'>Add New Item</h2>
          <button
            onClick={onClose}
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Item Name */}
          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              Item Name *
            </label>
            <input
              type='text'
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300'
              placeholder='Enter item name'
            />
          </div>

          {/* Vendor Dropdown */}
          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              Vendor/Supplier *
            </label>
            <select
              required
              value={formData.vendorId}
              onChange={(e) => {
                const selectedVendor = vendors.find(
                  (v) => v.vendorId === e.target.value
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
          </div>

          {/* Quantity and Threshold */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-foreground mb-2'>
                Initial Quantity *
              </label>
              <input
                type='number'
                required
                min='0'
                value={formData.quantity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: parseInt(e.target.value) || 0,
                  }))
                }
                className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300'
                placeholder='0'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-foreground mb-2'>
                Threshold *
              </label>
              <input
                type='number'
                required
                min='1'
                value={formData.threshold}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    threshold: parseInt(e.target.value) || 10,
                  }))
                }
                className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300'
                placeholder='10'
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              Image URL
            </label>
            <input
              type='url'
              value={formData.image}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, image: e.target.value }))
              }
              className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300'
              placeholder='https://example.com/image.jpg (optional)'
            />
          </div>

          {/* Buttons */}
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
              className='flex-1 py-3 px-6 bg-primary text-primary-foreground rounded-lg hover:neon-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              disabled={loading}
            >
              {loading ? (
                <div className='flex items-center justify-center gap-2'>
                  <Loader className='animate-spin h-4 w-4 text-primary-foreground' />
                  Adding...
                </div>
              ) : (
                'Add Item'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}