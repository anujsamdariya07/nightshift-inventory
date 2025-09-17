'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import useAuthStore from '@/store/useAuthStore';
import useCustomerStore from '@/store/useCustomerStore';
import { useRouter } from 'next/navigation';

const statusColors = {
  active: 'accent',
  inactive: 'muted',
};

const filterOptions = [
  { label: 'All Customers', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

export default function CustomersPage() {
  const { customers, loading, error, fetchCustomers, createCustomer } =
    useCustomerStore();
  const [filteredCustomers, setFilteredCustomers] = useState(customers);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Update filtered customers when customers, filter, or search term changes
  useEffect(() => {
    let filtered = customers;

    if (activeFilter !== 'all') {
      filtered = filtered.filter(
        (customer) => customer.status === activeFilter
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.customerId
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          customer.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.preferredCategories.some((category) =>
            category.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    setFilteredCustomers(filtered);
  }, [activeFilter, searchTerm, customers]);

  if (loading && customers.length === 0) {
    return (
      <div className='min-h-screen bg-background'>
        <Navbar />
        <main className='pt-24 pb-16'>
          <div className='container mx-auto px-4 flex items-center justify-center h-96'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
              <p className='text-muted-foreground'>Loading customers...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
                Customers Management
              </h1>
              <p className='text-lg text-muted-foreground'>
                Track customer relationships and analyze buying patterns
              </p>
            </div>

            <div className='flex items-center gap-4'>
              <motion.button
                className='px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:neon-glow transition-all duration-300'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNewCustomerModal(true)}
              >
                Add Customer
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
                placeholder='Search customers, categories, or contact info...'
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

        {/* Error Message */}
        {error && (
          <section className='container mx-auto px-4 mb-8'>
            <div className='bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-500 text-center'>
              {error}
            </div>
          </section>
        )}

        {/* Customers Grid */}
        <section className='container mx-auto px-4'>
          <motion.div
            className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <AnimatePresence mode='popLayout'>
              {filteredCustomers.map((customer, index) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  index={index}
                  isSelected={selectedCustomer === customer.id}
                  onSelect={() =>
                    setSelectedCustomer(
                      selectedCustomer === customer.id ? null : customer.id
                    )
                  }
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredCustomers.length === 0 && !loading && (
            <motion.div
              className='text-center py-16'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className='text-6xl mb-4'>👥</div>
              <h3 className='text-xl font-semibold text-foreground mb-2'>
                No customers found
              </h3>
              <p className='text-muted-foreground'>
                {searchTerm || activeFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start by adding your first customer'}
              </p>
            </motion.div>
          )}
        </section>

        {/* Customer Stats */}
        <section className='container mx-auto px-4 mt-16'>
          <CustomerStats customers={filteredCustomers} />
        </section>
      </main>

      {/* New Customer Modal */}
      <AnimatePresence>
        {showNewCustomerModal && (
          <NewCustomerModal
            onClose={() => setShowNewCustomerModal(false)}
            onSubmit={async (newCustomerData) => {
              const result = await createCustomer(newCustomerData);
              if (result?.success) {
                setShowNewCustomerModal(false);
              }
            }}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CustomerCard({
  customer,
  index,
  isSelected,
  onSelect,
}: {
  customer: any;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  // Calculate average satisfaction level
  const avgSatisfaction =
    customer.satisfactionLevel.length > 0
      ? customer.satisfactionLevel.reduce(
          (sum: number, rating: number) => sum + rating,
          0
        ) / customer.satisfactionLevel.length
      : 0;

  // Calculate total orders and total spent from orders array
  const totalOrders = customer.orders.length;
  const totalSpent = customer.orders.reduce(
    (sum: number, order: any) => sum + order.totalAmount,
    0
  );

  // Get last order date
  const lastOrder =
    customer.orders.length > 0
      ? new Date(
          Math.max(
            ...customer.orders.map((order: any) =>
              new Date(order.orderDate).getTime()
            )
          )
        ).toLocaleDateString()
      : 'Never';

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

      {/* Customer Header */}
      <div className='relative z-10'>
        <div className='flex justify-between items-start mb-4'>
          <div>
            <h3 className='text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300'>
              {customer.name}
            </h3>
            <p className='text-sm text-muted-foreground'>
              {customer.customerId}
            </p>
            {customer.gstNo && (
              <p className='text-xs text-muted-foreground'>
                GST: {customer.gstNo}
              </p>
            )}
          </div>
          <div className='flex items-center gap-2'>
            <StatusBadge status={customer.status} />
          </div>
        </div>

        {/* Contact Info */}
        <div className='space-y-2 mb-4'>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <span className='text-primary'>📧</span>
            {customer.email}
          </div>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <span className='text-primary'>📞</span>
            +91-{customer.phone}
          </div>
          <div className='flex items-start gap-2 text-sm text-muted-foreground'>
            <span className='text-primary'>📍</span>
            <span className='flex-1'>{customer.address}</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className='grid grid-cols-2 gap-4 mb-4'>
          <div>
            <p className='text-xs text-muted-foreground'>Total Orders</p>
            <p className='text-sm font-bold text-foreground'>{totalOrders}</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>Total Spent</p>
            <p className='text-sm font-bold text-primary'>
              ₹{totalSpent.toLocaleString()}
            </p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>Last Order</p>
            <p className='text-sm font-medium text-foreground'>{lastOrder}</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>Satisfaction</p>
            <div className='flex items-center gap-1'>
              <span className='text-sm font-medium text-chart-2'>
                ⭐ {avgSatisfaction.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Preferred Categories */}
        <div className='mb-4'>
          <p className='text-xs text-muted-foreground mb-2'>
            Preferred Categories
          </p>
          <div className='flex flex-wrap gap-1'>
            {customer.preferredCategories
              .slice(0, 2)
              .map((category: string) => (
                <span
                  key={category}
                  className='px-2 py-1 text-xs bg-secondary/20 text-secondary rounded-full border border-secondary/30'
                >
                  {category}
                </span>
              ))}
            {customer.preferredCategories.length > 2 && (
              <span className='px-2 py-1 text-xs bg-muted/20 text-muted-foreground rounded-full border border-muted/30'>
                +{customer.preferredCategories.length - 2}
              </span>
            )}
          </div>
        </div>

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
                  Recent Orders
                </h4>
                {customer.orders.length > 0 ? (
                  <div className='space-y-2'>
                    {customer.orders.slice(0, 3).map((order: any) => (
                      <div
                        key={order.orderId}
                        className='flex justify-between items-center text-xs'
                      >
                        <span className='text-muted-foreground'>
                          {order.orderId}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full ${
                            order.status === 'delivered'
                              ? 'bg-green-500/20 text-green-500'
                              : order.status === 'shipped'
                              ? 'bg-blue-500/20 text-blue-500'
                              : 'bg-yellow-500/20 text-yellow-500'
                          }`}
                        >
                          {order.status}
                        </span>
                        <span className='text-foreground font-medium'>
                          ₹{order.totalAmount}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-xs text-muted-foreground'>No orders yet</p>
                )}

                <div className='mt-4 grid grid-cols-1 gap-2 text-xs'>
                  <div>
                    <span className='text-muted-foreground'>
                      Member Since:{' '}
                    </span>
                    <span className='text-foreground font-medium'>
                      {new Date(customer.dateOfJoining).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className='flex gap-2 mt-4'>
          <motion.button
            type='button'
            className='flex-1 py-2 px-4 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:neon-glow transition-all duration-300'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
          >
            View Orders
          </motion.button>
          <motion.button
            type='button'
            className='flex-1 py-2 px-4 bg-secondary/10 text-secondary rounded-lg text-sm font-medium hover:bg-secondary hover:text-secondary-foreground hover:neon-glow transition-all duration-300'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
          >
            Contact
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

function CustomerStats({ customers }: { customers: any[] }) {
  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.status === 'active').length,
    inactive: customers.filter((c) => c.status === 'inactive').length,
    totalRevenue: customers.reduce(
      (sum, customer) =>
        sum +
        customer.orders.reduce(
          (orderSum: number, order: any) => orderSum + order.totalAmount,
          0
        ),
      0
    ),
    avgSatisfaction:
      customers.length > 0
        ? customers.reduce((sum, customer) => {
            const customerAvg =
              customer.satisfactionLevel.length > 0
                ? customer.satisfactionLevel.reduce(
                    (s: number, r: number) => s + r,
                    0
                  ) / customer.satisfactionLevel.length
                : 0;
            return sum + customerAvg;
          }, 0) / customers.length
        : 0,
  };

  const totalOrders = customers.reduce(
    (sum, customer) => sum + customer.orders.length,
    0
  );
  const avgOrderValue = totalOrders > 0 ? stats.totalRevenue / totalOrders : 0;

  return (
    <motion.div
      className='bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-8'
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <h3 className='text-2xl font-bold text-foreground mb-6 text-center'>
        Customer Analytics
      </h3>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
        <StatCard label='Total Customers' value={stats.total} color='primary' />
        <StatCard label='Active' value={stats.active} color='accent' />
        <StatCard label='Inactive' value={stats.inactive} color='chart-2' />
        <StatCard
          label='Total Revenue'
          value={`₹${(stats.totalRevenue / 1000).toFixed(0)}K`}
          color='primary'
        />
        <StatCard
          label='Avg Order Value'
          value={`₹${avgOrderValue.toFixed(0)}`}
          color='secondary'
        />
        <StatCard
          label='Avg Satisfaction'
          value={stats.avgSatisfaction.toFixed(1)}
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

function NewCustomerModal({
  onClose,
  onSubmit,
  loading,
}: {
  onClose: () => void;
  onSubmit: (customer: any) => void;
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    preferredCategories: [] as string[],
    gstNo: '',
    status: 'active' as 'active' | 'inactive',
  });

  const categoryOptions = [
    'Industrial Tools',
    'Bearings',
    'Safety Equipment',
    'Hydraulics',
    'Pumps',
    'Electronic Components',
    'Safety Gear',
    'Construction Tools',
    'Hardware',
    'Auto Parts',
    'Filters',
    'Brake Components',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const customerData = {
      ...formData,
      dateOfJoining: new Date(),
    };

    onSubmit(customerData);
  };

  const toggleCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredCategories: prev.preferredCategories.includes(category)
        ? prev.preferredCategories.filter((c) => c !== category)
        : [...prev.preferredCategories, category],
    }));
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
        className='bg-card border border-border rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto'
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-primary'>Add New Customer</h2>
          <button
            onClick={onClose}
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-foreground mb-2'>
                Company Name *
              </label>
              <input
                type='text'
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300'
                placeholder='Enter company name'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-foreground mb-2'>
                Email *
              </label>
              <input
                type='email'
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300'
                placeholder='company@example.com'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-foreground mb-2'>
                Phone *
              </label>
              <input
                type='tel'
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300'
                placeholder='555-0123'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-foreground mb-2'>
                GST Number
              </label>
              <input
                type='text'
                value={formData.gstNo}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, gstNo: e.target.value }))
                }
                className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300'
                placeholder='GST Number (optional)'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              Address *
            </label>
            <textarea
              required
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300'
              placeholder='123 Business St, City, State 12345'
              rows={3}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as 'active' | 'inactive',
                }))
              }
              className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300'
            >
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-foreground mb-3'>
              Preferred Categories
            </label>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
              {categoryOptions.map((category) => (
                <motion.button
                  key={category}
                  type='button'
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-all duration-300 ${
                    formData.preferredCategories.includes(category)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {category}
                </motion.button>
              ))}
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
              className='flex-1 py-3 px-6 bg-primary text-primary-foreground rounded-lg hover:neon-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              disabled={loading}
            >
              {loading ? (
                <div className='flex items-center justify-center gap-2'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground'></div>
                  Creating...
                </div>
              ) : (
                'Add Customer'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
