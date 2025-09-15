'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import useAuthStore from '@/store/useAuthStore';
import useItemStore from '@/store/useItemStore';
import { useRouter } from 'next/navigation';

const stockStatusColors = {
  'in-stock': 'accent',
  'low-stock': 'chart-2',
  'out-of-stock': 'destructive',
};

const filterOptions = [
  { label: 'All Items', value: 'all' },
  { label: 'In Stock', value: 'in-stock' },
  { label: 'Low Stock', value: 'low-stock' },
  { label: 'Out of Stock', value: 'out-of-stock' },
];

export default function ItemsPage() {
  const {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItemQuantity,
    deleteItem,
  } = useItemStore();
  const [filteredItems, setFilteredItems] = useState(items);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState<{
    show: boolean;
    item: any;
    type: 'replenishment' | 'order';
  }>({ show: false, item: null, type: 'replenishment' });

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Helper function to get stock status
  const getStockStatus = (item: any) => {
    if (item.quantity === 0) return 'out-of-stock';
    if (item.quantity <= item.threshold) return 'low-stock';
    return 'in-stock';
  };

  // Update filtered items when items, filter, or search term changes
  useEffect(() => {
    let filtered = items;

    if (activeFilter !== 'all') {
      filtered = filtered.filter(
        (item) => getStockStatus(item) === activeFilter
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [activeFilter, searchTerm, items]);

  if (loading && items.length === 0) {
    return (
      <div className='min-h-screen bg-background'>
        <Navbar />
        <main className='pt-24 pb-16'>
          <div className='container mx-auto px-4 flex items-center justify-center h-96'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
              <p className='text-muted-foreground'>Loading items...</p>
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
                Inventory Management
              </h1>
              <p className='text-lg text-muted-foreground'>
                Track stock levels, monitor thresholds, and manage inventory
                updates
              </p>
            </div>

            <div className='flex items-center gap-4'>
              <motion.button
                className='px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:neon-glow transition-all duration-300'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNewItemModal(true)}
              >
                Add Item
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
                placeholder='Search items by name...'
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

        {/* Items Grid */}
        <section className='container mx-auto px-4'>
          <motion.div
            className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <AnimatePresence mode='popLayout'>
              {filteredItems.map((item, index) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  index={index}
                  isSelected={selectedItem === item.id}
                  onSelect={() =>
                    setSelectedItem(selectedItem === item.id ? null : item.id)
                  }
                  onQuantityUpdate={(type) =>
                    setShowQuantityModal({ show: true, item, type })
                  }
                  onDelete={deleteItem}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredItems.length === 0 && !loading && (
            <motion.div
              className='text-center py-16'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className='text-6xl mb-4'>📦</div>
              <h3 className='text-xl font-semibold text-foreground mb-2'>
                No items found
              </h3>
              <p className='text-muted-foreground'>
                {searchTerm || activeFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start by adding your first inventory item'}
              </p>
            </motion.div>
          )}
        </section>

        {/* Inventory Stats */}
        <section className='container mx-auto px-4 mt-16'>
          <InventoryStats items={filteredItems} />
        </section>
      </main>

      {/* New Item Modal */}
      <AnimatePresence>
        {showNewItemModal && (
          <NewItemModal
            onClose={() => setShowNewItemModal(false)}
            onSubmit={async (newItemData) => {
              const result = await createItem(newItemData);
              if (result?.success) {
                setShowNewItemModal(false);
              }
            }}
            loading={loading}
          />
        )}
      </AnimatePresence>

      {/* Quantity Update Modal */}
      <AnimatePresence>
        {showQuantityModal.show && (
          <QuantityUpdateModal
            item={showQuantityModal.item}
            type={showQuantityModal.type}
            onClose={() =>
              setShowQuantityModal({
                show: false,
                item: null,
                type: 'replenishment',
              })
            }
            onSubmit={async (data) => {
              const result = await updateItemQuantity(
                showQuantityModal.item.id,
                data.quantityChange,
                data.vendorName,
                data.cost,
                showQuantityModal.type
              );
              if (result?.success) {
                setShowQuantityModal({
                  show: false,
                  item: null,
                  type: 'replenishment',
                });
              }
            }}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ItemCard({
  item,
  index,
  isSelected,
  onSelect,
  onQuantityUpdate,
  onDelete,
}: {
  item: any;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onQuantityUpdate: (type: 'replenishment' | 'order') => void;
  onDelete: (id: string) => void;
}) {
  const stockStatus =
    item.quantity === 0
      ? 'out-of-stock'
      : item.quantity <= item.threshold
      ? 'low-stock'
      : 'in-stock';

  // Calculate total cost from update history
  const totalCost = item.updateHistory.reduce(
    (sum: number, update: any) => sum + update.quantityUpdated * update.cost,
    0
  );

  // Calculate last replenishment
  const lastReplenishment = item.updateHistory
    .filter((update: any) => update.updateType === 'replenishment')
    .sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];

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

      {/* Item Header */}
      <div className='relative z-10'>
        <div className='flex justify-between items-start mb-4'>
          <div className='flex-1'>
            <h3 className='text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300'>
              {item.name}
            </h3>
            <p className='text-sm text-muted-foreground'>
              Last Updated:{' '}
              {new Date(item.lastDateOfUpdate).toLocaleDateString()}
            </p>
          </div>
          <div className='flex flex-col items-end gap-2'>
            <StockStatusBadge status={stockStatus} />
            <div className='w-20 h-20 rounded-lg overflow-hidden bg-muted/20'>
              <img
                src={item.image}
                alt={item.name}
                className='w-full h-full object-cover'
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo6ZeL1Ntu-zwEcgRli39ynixVj9yeQtfjAw&s';
                }}
              />
            </div>
          </div>
        </div>

        {/* Stock Info */}
        <div className='grid grid-cols-2 gap-4 mb-4'>
          <div>
            <p className='text-xs text-muted-foreground'>Current Stock</p>
            <p
              className={`text-xl font-bold ${
                stockStatus === 'out-of-stock'
                  ? 'text-destructive'
                  : stockStatus === 'low-stock'
                  ? 'text-chart-2'
                  : 'text-accent'
              }`}
            >
              {item.quantity}
            </p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>Threshold</p>
            <p className='text-xl font-bold text-muted-foreground'>
              {item.threshold}
            </p>
          </div>
        </div>

        {/* Stock Level Visual */}
        <div className='mb-4'>
          <div className='flex justify-between text-xs text-muted-foreground mb-1'>
            <span>Stock Level</span>
            <span>
              {(
                (item.quantity / Math.max(item.quantity, item.threshold * 2)) *
                100
              ).toFixed(0)}
              %
            </span>
          </div>
          <div className='h-2 bg-muted/20 rounded-full overflow-hidden'>
            <motion.div
              className={`h-full ${
                stockStatus === 'out-of-stock'
                  ? 'bg-destructive'
                  : stockStatus === 'low-stock'
                  ? 'bg-chart-2'
                  : 'bg-accent'
              }`}
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(
                  (item.quantity /
                    Math.max(item.quantity, item.threshold * 2)) *
                    100,
                  100
                )}%`,
              }}
              transition={{ duration: 1, delay: index * 0.1 }}
            />
          </div>
        </div>

        {/* Summary Stats */}
        <div className='grid grid-cols-2 gap-4 mb-4 text-xs'>
          <div>
            <span className='text-muted-foreground'>Total Updates: </span>
            <span className='text-foreground font-medium'>
              {item.updateHistory.length}
            </span>
          </div>
          <div>
            <span className='text-muted-foreground'>Total Value: </span>
            <span className='text-foreground font-medium'>
              ₹{totalCost.toFixed(2)}
            </span>
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
                  Recent Updates
                </h4>
                {item.updateHistory.length > 0 ? (
                  <div className='space-y-2 mb-4'>
                    {item.updateHistory
                      .sort(
                        (a: any, b: any) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime()
                      )
                      .slice(0, 3)
                      .map((update: any, idx: number) => (
                        <div
                          key={idx}
                          className='flex justify-between items-center text-xs bg-background/50 rounded p-2'
                        >
                          <div>
                            <span className='text-foreground font-medium'>
                              {update.vendorName}
                            </span>
                            <span
                              className={`ml-2 px-2 py-1 rounded-full text-xs ${
                                update.updateType === 'replenishment'
                                  ? 'bg-green-500/20 text-green-500'
                                  : 'bg-blue-500/20 text-blue-500'
                              }`}
                            >
                              {update.updateType}
                            </span>
                          </div>
                          <div className='text-right'>
                            <p className='text-foreground font-medium'>
                              {update.updateType === 'replenishment'
                                ? '+'
                                : '-'}
                              {update.quantityUpdated}
                            </p>
                            <p className='text-muted-foreground'>
                              ₹{update.cost}/unit
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className='text-xs text-muted-foreground mb-4'>
                    No updates yet
                  </p>
                )}

                {lastReplenishment && (
                  <div className='text-xs mb-4'>
                    <span className='text-muted-foreground'>
                      Last Replenishment:{' '}
                    </span>
                    <span className='text-foreground font-medium'>
                      {new Date(lastReplenishment.date).toLocaleDateString()} by{' '}
                      {lastReplenishment.vendorName}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className='grid grid-cols-2 gap-2 mt-4'>
          <motion.button
            type='button'
            className='py-2 px-4 bg-green-500/10 text-green-500 rounded-lg text-sm font-medium hover:bg-green-500 hover:text-white hover:neon-glow transition-all duration-300'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              onQuantityUpdate('replenishment');
            }}
          >
            Restock
          </motion.button>
          <motion.button
            type='button'
            className='py-2 px-4 bg-blue-500/10 text-blue-500 rounded-lg text-sm font-medium hover:bg-blue-500 hover:text-white hover:neon-glow transition-all duration-300'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              onQuantityUpdate('order');
            }}
          >
            Order Out
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function StockStatusBadge({ status }: { status: string }) {
  const colorClass =
    stockStatusColors[status as keyof typeof stockStatusColors] || 'muted';
  const statusText =
    {
      'in-stock': 'In Stock',
      'low-stock': 'Low Stock',
      'out-of-stock': 'Out of Stock',
    }[status] || status;

  return (
    <motion.span
      className={`px-2 py-1 text-xs font-medium rounded-full bg-${colorClass}/20 text-${colorClass} border border-${colorClass}/30`}
      whileHover={{ scale: 1.05 }}
    >
      {statusText}
    </motion.span>
  );
}

function InventoryStats({ items }: { items: any[] }) {
  const stats = {
    total: items.length,
    inStock: items.filter((item) => item.quantity > item.threshold).length,
    lowStock: items.filter(
      (item) => item.quantity <= item.threshold && item.quantity > 0
    ).length,
    outOfStock: items.filter((item) => item.quantity === 0).length,
    totalValue: items.reduce((sum, item) => {
      const itemValue = item.updateHistory.reduce(
        (histSum: number, update: any) =>
          histSum + update.quantityUpdated * update.cost,
        0
      );
      return sum + itemValue;
    }, 0),
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    avgThreshold:
      items.length > 0
        ? items.reduce((sum, item) => sum + item.threshold, 0) / items.length
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
        Inventory Analytics
      </h3>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
        <StatCard label='Total Items' value={stats.total} color='primary' />
        <StatCard label='In Stock' value={stats.inStock} color='accent' />
        <StatCard label='Low Stock' value={stats.lowStock} color='chart-2' />
        <StatCard
          label='Out of Stock'
          value={stats.outOfStock}
          color='destructive'
        />
        <StatCard
          label='Total Value'
          value={`₹${(stats.totalValue / 1000).toFixed(1)}K`}
          color='primary'
        />
        <StatCard
          label='Total Quantity'
          value={stats.totalQuantity}
          color='secondary'
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

function NewItemModal({
  onClose,
  onSubmit,
  loading,
}: {
  onClose: () => void;
  onSubmit: (item: any) => void;
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    threshold: 10,
    image: '',
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

function QuantityUpdateModal({
  item,
  type,
  onClose,
  onSubmit,
  loading,
}: {
  item: any;
  type: 'replenishment' | 'order';
  onClose: () => void;
  onSubmit: (data: {
    quantityChange: number;
    vendorName: string;
    cost: number;
  }) => void;
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    quantityChange: 0,
    vendorName: '',
    cost: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const quantityChange =
      type === 'replenishment'
        ? formData.quantityChange
        : -formData.quantityChange;
    onSubmit({
      ...formData,
      quantityChange,
    });
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
          <h2 className='text-2xl font-bold text-primary'>
            {type === 'replenishment' ? 'Restock Item' : 'Order Out Item'}
          </h2>
          <button
            onClick={onClose}
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            ✕
          </button>
        </div>

        <div className='mb-6 p-4 bg-background/50 rounded-lg'>
          <h3 className='font-semibold text-foreground'>{item.name}</h3>
          <p className='text-sm text-muted-foreground'>
            Current Stock: {item.quantity}
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              {type === 'replenishment'
                ? 'Vendor/Supplier Name *'
                : 'Customer/Order Reference *'}
            </label>
            <input
              type='text'
              required
              value={formData.vendorName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, vendorName: e.target.value }))
              }
              className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300'
              placeholder={
                type === 'replenishment'
                  ? 'Enter vendor name'
                  : 'Enter customer/order reference'
              }
            />
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
                max={type === 'order' ? item.quantity : undefined}
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

          {type === 'order' && formData.quantityChange > item.quantity && (
            <div className='text-sm text-destructive'>
              Cannot order more than available stock ({item.quantity})
            </div>
          )}

          <div className='bg-background/50 rounded-lg p-4'>
            <div className='flex justify-between text-sm'>
              <span>Total Cost:</span>
              <span className='font-semibold'>
                ₹{(formData.quantityChange * formData.cost).toFixed(2)}
              </span>
            </div>
            <div className='flex justify-between text-sm mt-1'>
              <span>New Stock Level:</span>
              <span className='font-semibold'>
                {type === 'replenishment'
                  ? item.quantity + formData.quantityChange
                  : item.quantity - formData.quantityChange}
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
                type === 'replenishment'
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              disabled={
                loading ||
                (type === 'order' && formData.quantityChange > item.quantity)
              }
            >
              {loading ? (
                <div className='flex items-center justify-center gap-2'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                  Processing...
                </div>
              ) : type === 'replenishment' ? (
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
