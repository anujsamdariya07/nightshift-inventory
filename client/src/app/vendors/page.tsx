'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import useVendorStore, { type Vendor } from '@/store/useVendorStore';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';
import { usePathname, useRouter } from 'next/navigation';

const statusColors = {
  active: 'accent',
  inactive: 'muted',
};

const filterOptions = [
  { label: 'All Vendors', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

export default function VendorsPage() {
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [showNewVendorModal, setShowNewVendorModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const { authUser } = useAuthStore();
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Vendor | null>(null);

  const {
    fetchVendors,
    vendors,
    loading,
    error,
    createVendor,
    updateVendor,
    deleteVendor,
  } = useVendorStore();

  // Load vendors on component mount
  useEffect(() => {
    const loadVendors = async () => {
      await fetchVendors();
    };
    loadVendors();
  }, [fetchVendors]);
  useEffect(() => {
    if (!authUser) router.push('/');
    else if (authUser && authUser.mustChangePassword)
      router.push('/change-password');
  }, []);

  // Filter vendors based on search and filter criteria
  useEffect(() => {
    // console.log('vendors', vendors)
    let filtered = vendors || [];

    if (activeFilter !== 'all') {
      filtered = filtered.filter((vendor) => vendor.status === activeFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (vendor) =>
          vendor.vendorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vendor.specialities.some((specialty) =>
            specialty.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    setFilteredVendors(filtered);
  }, [activeFilter, searchTerm, vendors]);

  // Helper functions to calculate averages
  const calculateAverage = (arr: number[]): number => {
    if (!arr || arr.length === 0) return 0;
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
  };

  const handleDeleteVendor = (vendor: Vendor) => {
    setDeleteTarget(vendor);
  };

  const confirmDeleteVendor = async () => {
    if (!deleteTarget) return;
    const result = await deleteVendor(deleteTarget.id);
    if (result.success) {
      setDeleteTarget(null);
    }
  };

  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setShowEditModal(true);
  };

  return (
    <div className='min-h-screen bg-background'>
      <Navbar />

      <main className='pt-24 pb-16'>
        {/* Header Section */}
        <section className='container mx-auto px-4 mb-8'>
          <motion.div
            className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h1 className='text-4xl md:text-5xl font-bold font-mono text-primary neon-text mb-2'>
                Vendors Management
              </h1>
              <p className='text-lg text-muted-foreground'>
                Manage supplier relationships and track performance
              </p>
            </div>

            <div className='flex items-center gap-4'>
              <motion.button
                className='px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:neon-glow transition-all duration-300'
                onClick={() => setShowNewVendorModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Vendor
              </motion.button>
              <motion.button
                className='px-6 py-3 border border-secondary text-secondary rounded-lg font-semibold hover:bg-secondary hover:text-secondary-foreground transition-all duration-300'
                onClick={() => setShowFilters(!showFilters)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Filters
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* Search and Filters */}
        <section className='container mx-auto px-4 mb-8'>
          <div className='flex flex-col md:flex-row gap-4'>
            {/* Search Bar */}
            <motion.div
              className='flex-1'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <input
                type='text'
                placeholder='Search vendors, specialties, or contact info...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300'
              />
            </motion.div>

            {/* Filter Buttons */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  className='flex flex-wrap gap-2'
                  initial={{ opacity: 0, x: 20, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: 'auto' }}
                  exit={{ opacity: 0, x: 20, width: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {filterOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                        activeFilter === option.value
                          ? 'bg-primary text-primary-foreground neon-glow'
                          : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
                      }`}
                      onClick={() => setActiveFilter(option.value)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <div className='container mx-auto px-4 text-center py-16 flex flex-col items-center gap-4'>
            <Loader className='w-10 h-10 text-primary animate-spin' />
            <div className='text-2xl text-primary'>Loading vendors...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className='container mx-auto px-4 text-center py-16'>
            <div className='text-xl text-destructive mb-4'>Error: {error}</div>
            <button
              onClick={() => fetchVendors()}
              className='px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90'
            >
              Retry
            </button>
          </div>
        )}

        {/* Vendors Grid */}
        {!loading && !error && (
          <section className='container mx-auto px-4'>
            <motion.div
              className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <AnimatePresence mode='popLayout'>
                {filteredVendors.map((vendor, index) => (
                  <VendorCard
                    key={vendor.id}
                    vendor={vendor}
                    index={index}
                    isSelected={selectedVendor === vendor.id}
                    onSelect={() =>
                      setSelectedVendor(
                        selectedVendor === vendor.id ? null : vendor.id
                      )
                    }
                    onEdit={() => handleEditVendor(vendor)}
                    onDelete={() => handleDeleteVendor(vendor)}
                    calculateAverage={calculateAverage}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredVendors.length === 0 && !loading && (
              <motion.div
                className='text-center py-16'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className='text-6xl mb-4'>🏭</div>
                <h3 className='text-xl font-semibold text-foreground mb-2'>
                  No vendors found
                </h3>
                <p className='text-muted-foreground'>
                  Try adjusting your search or filter criteria
                </p>
              </motion.div>
            )}
          </section>
        )}

        {/* Vendor Stats */}
        {!loading && !error && filteredVendors.length > 0 && (
          <section className='container mx-auto px-4 mt-16'>
            <VendorStats
              vendors={filteredVendors}
              calculateAverage={calculateAverage}
            />
          </section>
        )}
      </main>

      {/* New Vendor Modal */}
      <NewVendorModal
        isOpen={showNewVendorModal}
        onClose={() => setShowNewVendorModal(false)}
        onSubmit={createVendor}
      />

      {/* Edit Vendor Modal */}
      <EditVendorModal
        isOpen={showEditModal}
        vendor={editingVendor}
        onClose={() => {
          setShowEditModal(false);
          setEditingVendor(null);
        }}
        onSubmit={updateVendor}
      />

      {/* Delete Vendor Modal */}
      <DeleteVendorModal
        isOpen={!!deleteTarget}
        vendor={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDeleteVendor}
      />
    </div>
  );
}

interface VendorCardProps {
  vendor: Vendor;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  calculateAverage: (arr: number[]) => number;
}

function VendorCard({
  vendor,
  index,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  calculateAverage,
}: VendorCardProps) {
  const avgRating = calculateAverage(vendor.rating);
  const avgOnTimeDelivery = calculateAverage(vendor.onTimeDelivery);
  const avgResponseTime = calculateAverage(vendor.responseTime);

  return (
    <motion.div
      className='bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group cursor-pointer'
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      onClick={onSelect}
      layout
    >
      {/* Neon glow effect on hover */}
      <div className='absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl' />

      {/* Vendor Header */}
      <div className='relative z-10'>
        <div className='flex justify-between items-start mb-4'>
          <div>
            <h3 className='text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300'>
              {vendor.name}
            </h3>
            <p className='text-sm text-muted-foreground'>{vendor.vendorId}</p>
          </div>
          <div className='flex items-center gap-2'>
            <StatusBadge status={vendor.status} />
            {avgRating > 0 && <RatingBadge rating={avgRating} />}
          </div>
        </div>

        {/* Contact Info */}
        <div className='space-y-2 mb-4'>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <span className='text-primary'>📧</span>
            {vendor.email}
          </div>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <span className='text-primary'>📞</span>
            {vendor.phone}
          </div>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <span className='text-primary'>🏢</span>
            {vendor.gstNo}
          </div>
          {vendor.address && (
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <span className='text-primary'>📍</span>
              {vendor.address}
            </div>
          )}
        </div>

        {/* Specialties */}
        {vendor.specialities && vendor.specialities.length > 0 && (
          <div className='mb-4'>
            <p className='text-xs text-muted-foreground mb-2'>Specialities</p>
            <div className='flex flex-wrap gap-1'>
              {vendor.specialities.map((specialty) => (
                <span
                  key={specialty}
                  className='px-2 py-1 text-xs bg-primary/20 text-primary rounded-full border border-primary/30'
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className='grid grid-cols-2 gap-4 mb-4'>
          <div>
            <p className='text-xs text-muted-foreground'>Total Restocks</p>
            <p className='text-sm font-bold text-foreground'>
              {vendor.totalRestocks || 0}
            </p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>Total Value</p>
            <p className='text-sm font-bold text-primary'>
              ₹{vendor.totalValue?.toLocaleString() || '0'}
            </p>
          </div>
        </div>

        {/* Performance Indicators */}
        {(avgOnTimeDelivery > 0 || avgResponseTime > 0) && (
          <div className='space-y-2 mb-4'>
            {avgOnTimeDelivery > 0 && (
              <PerformanceBar
                label='On-time Delivery'
                value={Math.round(avgOnTimeDelivery)}
                color='accent'
              />
            )}
            {avgResponseTime > 0 && (
              <PerformanceBar
                label='Response Time'
                value={Math.round(avgResponseTime)}
                color='secondary'
              />
            )}
          </div>
        )}

        {/* Expanded Content */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className='border-t border-border pt-4 mt-4'>
                <h4 className='text-sm font-semibold text-foreground mb-3'>
                  Replenishment History
                </h4>
                {vendor.replenishmentHistory &&
                vendor.replenishmentHistory.length > 0 ? (
                  <div className='space-y-2 max-h-32 overflow-y-auto'>
                    {vendor.replenishmentHistory.map((item, idx) => (
                      <div key={idx} className='flex justify-between text-sm'>
                        <span className='text-muted-foreground'>
                          {item.itemName}
                        </span>
                        <span className='text-foreground'>
                          {item.quantity} × ₹{item.cost}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-sm text-muted-foreground'>
                    No replenishment history available
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className='flex gap-2 mt-4'>
          <motion.button
            className='flex-1 py-2 px-4 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            Edit
          </motion.button>
          <motion.button
            className='flex-1 py-2 px-4 bg-destructive/10 text-destructive rounded-lg text-sm font-medium hover:bg-destructive hover:text-destructive-foreground transition-all duration-300'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            Delete
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colorClass =
    statusColors[status as keyof typeof statusColors] || 'muted';

  return (
    <motion.span
      className={`px-2 py-1 text-xs font-medium rounded-full bg-${colorClass}/20 text-${colorClass} border border-${colorClass}/30`}
      whileHover={{ scale: 1.05 }}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </motion.span>
  );
}

function RatingBadge({ rating }: { rating: number }) {
  return (
    <motion.div
      className='flex items-center gap-1 px-2 py-1 bg-chart-2/20 text-chart-2 rounded-full border border-chart-2/30'
      whileHover={{ scale: 1.05 }}
    >
      <span className='text-xs'>⭐</span>
      <span className='text-xs font-medium'>{rating.toFixed(1)}</span>
    </motion.div>
  );
}

function PerformanceBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className='flex justify-between items-center mb-1'>
        <span className='text-xs text-muted-foreground'>{label}</span>
        <span className='text-xs font-medium text-foreground'>{value}%</span>
      </div>
      <div className='w-full h-1.5 bg-muted rounded-full overflow-hidden'>
        <motion.div
          className={`h-full bg-${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(value, 100)}%` }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
    </div>
  );
}

function VendorStats({
  vendors,
  calculateAverage,
}: {
  vendors: Vendor[];
  calculateAverage: (arr: number[]) => number;
}) {
  const stats = {
    total: vendors.length,
    active: vendors.filter((v) => v.status === 'active').length,
    inactive: vendors.filter((v) => v.status === 'inactive').length,
    totalValue: vendors.reduce(
      (sum, vendor) => sum + (vendor.totalValue || 0),
      0
    ),
    avgRating:
      vendors.length > 0
        ? calculateAverage(
            vendors.flatMap((v) => v.rating).filter((r) => r > 0)
          )
        : 0,
  };

  return (
    <motion.div
      className='bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-8'
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <h3 className='text-2xl font-bold text-foreground mb-6 text-center'>
        Vendor Statistics
      </h3>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6'>
        <StatCard label='Total Vendors' value={stats.total} color='primary' />
        <StatCard label='Active' value={stats.active} color='accent' />
        <StatCard label='Inactive' value={stats.inactive} color='muted' />
        <StatCard
          label='Total Value'
          value={`${(stats.totalValue / 1000).toFixed(0)}K`}
          color='primary'
        />
        <StatCard
          label='Avg Rating'
          value={stats.avgRating > 0 ? stats.avgRating.toFixed(1) : 'N/A'}
          color='chart-2'
        />
      </div>
    </motion.div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <motion.div
      className='text-center p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-all duration-300'
      whileHover={{ scale: 1.05, y: -2 }}
    >
      <motion.div
        className={`text-2xl font-bold font-mono text-${color} neon-text mb-1`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        {value}
      </motion.div>
      <div className='text-xs text-muted-foreground'>{label}</div>
    </motion.div>
  );
}

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

function EditVendorModal({
  isOpen,
  vendor,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  vendor: Vendor | null;
  onClose: () => void;
  onSubmit: (vendorData: any, id: string) => Promise<any>;
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

  // Update form data when vendor changes
  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone,
        gstNo: vendor.gstNo,
        address: vendor.address || '',
        status: vendor.status,
        specialities: vendor.specialities || [],
      });
    }
  }, [vendor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor) return;

    setIsSubmitting(true);

    try {
      const result = await onSubmit(formData, vendor.id);
      if (result.success) {
        onClose();
      }
    } catch (error) {
      console.error('Error updating vendor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!vendor) return null;

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
              <h2 className='text-2xl font-bold text-primary'>Edit Vendor</h2>
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

              {/* Additional Info Display */}
              <div className='bg-muted/20 p-4 rounded-lg'>
                <h4 className='text-sm font-semibold text-foreground mb-2'>
                  Current Stats
                </h4>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <span className='text-muted-foreground'>Vendor ID:</span>
                    <span className='ml-2 text-foreground'>
                      {vendor.vendorId}
                    </span>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>
                      Total Restocks:
                    </span>
                    <span className='ml-2 text-foreground'>
                      {vendor.totalRestocks || 0}
                    </span>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>Total Value:</span>
                    <span className='ml-2 text-foreground'>
                      ₹{vendor.totalValue?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>Specialities:</span>
                    <span className='ml-2 text-foreground'>
                      {vendor.specialities && vendor.specialities.length}
                    </span>
                  </div>
                </div>
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
                  className='flex-1 py-3 px-6 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className='w-5 h-5 animate-spin' />
                      Updating...
                    </>
                  ) : (
                    'Update Vendor'
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

function DeleteVendorModal({
  isOpen,
  vendor,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  vendor: Vendor | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!vendor) return null;

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
            className='bg-card border border-border rounded-2xl p-6 w-full max-w-md'
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className='text-xl font-bold text-destructive mb-4'>
              Delete Vendor
            </h2>
            <p className='text-sm text-muted-foreground mb-6'>
              Are you sure you want to delete{' '}
              <span className='font-semibold'>{vendor.name}</span>? This action
              cannot be undone.
            </p>
            <div className='flex gap-4'>
              <button
                onClick={onClose}
                className='flex-1 py-2 px-4 border border-border rounded-lg hover:bg-muted'
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className='flex-1 py-2 px-4 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90'
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// TODO: 1. Observe and handle intializing vendors
// TODO: 2. Handle updating vendors
// TODO: 3. Handle deleting vendors
