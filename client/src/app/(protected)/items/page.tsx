'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import useAuthStore from '@/store/useAuthStore';
import useItemStore from '@/store/useItemStore';
import { useRouter } from 'next/navigation';
import { Loader, Trash2, Eye } from 'lucide-react';
import useVendorStore, { Vendor } from '@/store/useVendorStore';
import { NewItemModal } from '@/components/NewItemModal';

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
  const { vendors, loading: vendorLoading, fetchVendors } = useVendorStore();
  const [filteredItems, setFilteredItems] = useState(items);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState<{
    show: boolean;
    item: any;
    type: 'REPLENISHMENT' | 'ORDER' | 'ORDERREVERT';
  }>({ show: false, item: null, type: 'REPLENISHMENT' });
  const [showDeleteModal, setShowDeleteModal] = useState<{
    show: boolean;
    item: any;
  }>({ show: false, item: null });
  const [showViewDetailsModal, setShowViewDetailsModal] = useState<{
    show: boolean;
    item: any;
  }>({ show: false, item: null });
  const { authUser } = useAuthStore();
  const router = useRouter();

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
    fetchVendors();
  }, [fetchItems, fetchVendors]);

  // Helper function to get stock status
  const getStockStatus = (item: any) => {
    if (!item || typeof item.quantity !== 'number') return 'out-of-stock';
    if (item.quantity === 0) return 'out-of-stock';
    if (item.quantity <= (item.threshold || 0)) return 'low-stock';
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
        (item.name || '').toLowerCase().includes(searchTerm.toLowerCase())
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
              <div className='flex justify-center items-center mb-4'>
                <Loader className='animate-spin h-12 w-12 text-primary' />
              </div>
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
                  onDelete={() => setShowDeleteModal({ show: true, item })}
                  onViewDetails={() =>
                    setShowViewDetailsModal({ show: true, item })
                  }
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
            vendors={vendors}
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
            vendors={vendors}
            onClose={() =>
              setShowQuantityModal({
                show: false,
                item: null,
                type: 'REPLENISHMENT',
              })
            }
            onSubmit={async (data) => {
              const result = await updateItemQuantity(
                showQuantityModal.item.id,
                {
                  vendorName: data.vendorName,
                  vendorId: data.vendorId,
                  cost: data.cost,
                  quantityUpdated: data.quantityChange,
                  updateType: 'REPLENISHMENT',
                }
              );
              if (result?.success) {
                setShowQuantityModal({
                  show: false,
                  item: null,
                  type: 'REPLENISHMENT',
                });
              }
            }}
            loading={loading}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal.show && (
          <DeleteConfirmationModal
            item={showDeleteModal.item}
            onClose={() => setShowDeleteModal({ show: false, item: null })}
            onConfirm={async () => {
              const result = await deleteItem(showDeleteModal.item.id);
              if (result?.success) {
                setShowDeleteModal({ show: false, item: null });
              }
            }}
            loading={loading}
          />
        )}
      </AnimatePresence>

      {/* View Details Modal */}
      <AnimatePresence>
        {showViewDetailsModal.show && (
          <ViewDetailsModal
            item={showViewDetailsModal.item}
            onClose={() => setShowViewDetailsModal({ show: false, item: null })}
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
  onViewDetails,
}: {
  item: any;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onQuantityUpdate: (type: 'REPLENISHMENT' | 'ORDER' | 'ORDERREVERT') => void;
  onDelete: () => void;
  onViewDetails: () => void;
}) {
  const stockStatus =
    (item?.quantity || 0) === 0
      ? 'out-of-stock'
      : (item?.quantity || 0) <= (item?.threshold || 0)
      ? 'low-stock'
      : 'in-stock';

  // Calculate total cost from update history with proper null checks
  const totalCost = (item?.updateHistory || []).reduce(
    (sum: number, update: any) =>
      sum + (update?.quantityUpdated || 0) * (update?.cost || 0),
    0
  );

  // Calculate last replenishment with proper null checks
  const lastReplenishment = (item?.updateHistory || [])
    .filter((update: any) => update?.updateType === 'REPLENISHMENT')
    .sort(
      (a: any, b: any) =>
        new Date(b?.date || 0).getTime() - new Date(a?.date || 0).getTime()
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
              {item?.name || 'Unknown Item'}
            </h3>
            <p className='text-sm text-muted-foreground'>
              Last Updated:{' '}
              {item?.lastDateOfUpdate
                ? new Date(item.lastDateOfUpdate).toLocaleDateString()
                : 'Never'}
            </p>
          </div>
          <div className='flex flex-col items-end gap-2'>
            <StockStatusBadge status={stockStatus} />
            <div className='w-20 h-20 rounded-lg overflow-hidden bg-muted/20'>
              <img
                src={
                  item?.image ||
                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo6ZeL1Ntu-zwEcgRli39ynixVj9yeQtfjAw&s'
                }
                alt={item?.name || 'Item'}
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
              {item?.quantity || 0}
            </p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>Threshold</p>
            <p className='text-xl font-bold text-muted-foreground'>
              {item?.threshold || 0}
            </p>
          </div>
        </div>

        {/* Stock Level Visual */}
        <div className='mb-4'>
          <div className='flex justify-between text-xs text-muted-foreground mb-1'>
            <span>Stock Level</span>
            <span>
              {Math.round(
                ((item?.quantity || 0) /
                  Math.max(item?.quantity || 0, (item?.threshold || 1) * 2)) *
                  100
              )}
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
                  ((item?.quantity || 0) /
                    Math.max(item?.quantity || 0, (item?.threshold || 1) * 2)) *
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
              {(item?.updateHistory || []).length}
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
                {(item?.updateHistory || []).length > 0 ? (
                  <div className='space-y-2 mb-4'>
                    {(item?.updateHistory || [])
                      .sort(
                        (a: any, b: any) =>
                          new Date(b?.date || 0).getTime() -
                          new Date(a?.date || 0).getTime()
                      )
                      .slice(0, 3)
                      .map((update: any, idx: number) => (
                        <div
                          key={idx}
                          className='flex justify-between items-center text-xs bg-background/50 rounded p-2'
                        >
                          <div>
                            <span className='text-foreground font-medium'>
                              {update?.vendorId || 'N/A'}
                              {': '}
                              {update?.vendorName || 'Unknown'}
                            </span>
                            <span
                              className={`ml-2 px-2 py-1 rounded-full text-xs ${
                                update?.updateType === 'REPLENISHMENT'
                                  ? 'bg-green-500/20 text-green-500'
                                  : 'bg-blue-500/20 text-blue-500'
                              }`}
                            >
                              {update?.updateType || 'UNKNOWN'}
                            </span>
                          </div>
                          <div className='text-right'>
                            <p className='text-foreground font-medium'>
                              {update?.updateType === 'REPLENISHMENT'
                                ? '+'
                                : '-'}
                              {update?.quantityUpdated || 0}
                            </p>
                            <p className='text-muted-foreground'>
                              ₹{(update?.cost || 0).toFixed(2)}/unit
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
                      {lastReplenishment?.date
                        ? new Date(lastReplenishment.date).toLocaleDateString()
                        : 'N/A'}{' '}
                      by {lastReplenishment?.vendorName || 'Unknown'}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className='grid grid-cols-3 gap-2 mt-4'>
          <motion.button
            type='button'
            className='py-2 px-4 bg-green-500/10 text-green-500 rounded-lg text-sm font-medium hover:bg-green-500 hover:text-white hover:neon-glow transition-all duration-300'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              onQuantityUpdate('REPLENISHMENT');
            }}
          >
            Restock
          </motion.button>
          <motion.button
            type='button'
            className='py-2 px-4 bg-blue-500/10 text-blue-500 rounded-lg text-sm font-medium hover:bg-blue-500 hover:text-white hover:neon-glow transition-all duration-300 flex items-center justify-center gap-1'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
          >
            <Eye size={14} />
            Details
          </motion.button>
          <motion.button
            type='button'
            className='py-2 px-4 bg-red-500/10 text-red-500 rounded-lg text-sm font-medium hover:bg-red-500 hover:text-white hover:neon-glow transition-all duration-300 flex items-center justify-center gap-1'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 size={14} />
            Delete
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
    inStock: items.filter(
      (item) => (item?.quantity || 0) > (item?.threshold || 0)
    ).length,
    lowStock: items.filter(
      (item) =>
        (item?.quantity || 0) <= (item?.threshold || 0) &&
        (item?.quantity || 0) > 0
    ).length,
    outOfStock: items.filter((item) => (item?.quantity || 0) === 0).length,
    totalValue: items.reduce((sum, item) => {
      const itemValue = (item?.updateHistory || []).reduce(
        (histSum: number, update: any) =>
          histSum + (update?.quantityUpdated || 0) * (update?.cost || 0),
        0
      );
      return sum + itemValue;
    }, 0),
    totalQuantity: items.reduce((sum, item) => sum + (item?.quantity || 0), 0),
    avgThreshold:
      items.length > 0
        ? items.reduce((sum, item) => sum + (item?.threshold || 0), 0) /
          items.length
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

function QuantityUpdateModal({
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

function DeleteConfirmationModal({
  item,
  onClose,
  onConfirm,
  loading,
}: {
  item: any;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
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
        <div className='text-center'>
          <div className='mb-6'>
            <div className='mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4'>
              <Trash2 className='w-8 h-8 text-red-600' />
            </div>
            <h2 className='text-2xl font-bold text-foreground mb-2'>
              Delete Item
            </h2>
            <p className='text-muted-foreground'>
              Are you sure you want to delete "{item?.name || 'this item'}"?
            </p>
            <p className='text-sm text-red-500 mt-2'>
              This action cannot be undone and will permanently delete all
              history for this item.
            </p>
          </div>

          <div className='bg-background/50 rounded-lg p-4 mb-6'>
            <div className='text-sm space-y-1'>
              <div className='flex justify-between'>
                <span>Current Stock:</span>
                <span className='font-medium'>{item?.quantity || 0}</span>
              </div>
              <div className='flex justify-between'>
                <span>Total Updates:</span>
                <span className='font-medium'>
                  {(item?.updateHistory || []).length}
                </span>
              </div>
            </div>
          </div>

          <div className='flex gap-4'>
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
              type='button'
              onClick={onConfirm}
              className='flex-1 py-3 px-6 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              disabled={loading}
            >
              {loading ? (
                <div className='flex items-center justify-center gap-2'>
                  <Loader className='animate-spin h-4 w-4' />
                  Deleting...
                </div>
              ) : (
                'Delete Item'
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ViewDetailsModal({
  item,
  onClose,
}: {
  item: any;
  onClose: () => void;
}) {
  const stockStatus =
    (item?.quantity || 0) === 0
      ? 'out-of-stock'
      : (item?.quantity || 0) <= (item?.threshold || 0)
      ? 'low-stock'
      : 'in-stock';

  const totalCost = (item?.updateHistory || []).reduce(
    (sum: number, update: any) =>
      sum + (update?.quantityUpdated || 0) * (update?.cost || 0),
    0
  );

  const totalReplenishments = (item?.updateHistory || []).filter(
    (update: any) => update?.updateType === 'REPLENISHMENT'
  ).length;

  const totalOrders = (item?.updateHistory || []).filter(
    (update: any) => update?.updateType === 'ORDER'
  ).length;

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
      className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 hide-scrollbar'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className='bg-card border border-border rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto'
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-3xl font-bold text-primary'>Item Details</h2>
          <button
            onClick={onClose}
            className='text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2'
          >
            <span className='keyboard-key'>Esc</span>
            <span>✕</span>
          </button>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
          {/* Item Image and Basic Info */}
          <div className='lg:col-span-1'>
            <div className='bg-background/50 rounded-lg p-6'>
              <div className='w-full h-48 rounded-lg overflow-hidden bg-muted/20 mb-4'>
                <img
                  src={
                    item?.image ||
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo6ZeL1Ntu-zwEcgRli39ynixVj9yeQtfjAw&s'
                  }
                  alt={item?.name || 'Item'}
                  className='w-full h-full object-cover'
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo6ZeL1Ntu-zwEcgRli39ynixVj9yeQtfjAw&s';
                  }}
                />
              </div>
              <h3 className='text-xl font-bold text-foreground mb-2'>
                {item?.name || 'Unknown Item'}
              </h3>
              <StockStatusBadge status={stockStatus} />
            </div>
          </div>

          {/* Stats Grid */}
          <div className='lg:col-span-2'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='bg-background/50 rounded-lg p-4 text-center'>
                <div className='text-2xl font-bold text-accent mb-1'>
                  {item?.quantity || 0}
                </div>
                <div className='text-xs text-muted-foreground'>
                  Current Stock
                </div>
              </div>
              <div className='bg-background/50 rounded-lg p-4 text-center'>
                <div className='text-2xl font-bold text-muted-foreground mb-1'>
                  {item?.threshold || 0}
                </div>
                <div className='text-xs text-muted-foreground'>Threshold</div>
              </div>
              <div className='bg-background/50 rounded-lg p-4 text-center'>
                <div className='text-2xl font-bold text-primary mb-1'>
                  ₹{totalCost.toFixed(0)}
                </div>
                <div className='text-xs text-muted-foreground'>Total Value</div>
              </div>
              <div className='bg-background/50 rounded-lg p-4 text-center'>
                <div className='text-2xl font-bold text-secondary mb-1'>
                  {(item?.updateHistory || []).length}
                </div>
                <div className='text-xs text-muted-foreground'>
                  Total Updates
                </div>
              </div>
              <div className='bg-background/50 rounded-lg p-4 text-center'>
                <div className='text-2xl font-bold text-green-500 mb-1'>
                  {totalReplenishments}
                </div>
                <div className='text-xs text-muted-foreground'>
                  Replenishments
                </div>
              </div>
              <div className='bg-background/50 rounded-lg p-4 text-center'>
                <div className='text-2xl font-bold text-blue-500 mb-1'>
                  {totalOrders}
                </div>
                <div className='text-xs text-muted-foreground'>Orders Out</div>
              </div>
              <div className='bg-background/50 rounded-lg p-4 text-center'>
                <div className='text-2xl font-bold text-muted-foreground mb-1'>
                  {item?.lastDateOfUpdate
                    ? new Date(item.lastDateOfUpdate).toLocaleDateString()
                    : 'Never'}
                </div>
                <div className='text-xs text-muted-foreground'>
                  Last Updated
                </div>
              </div>
              <div className='bg-background/50 rounded-lg p-4 text-center'>
                <div className='text-2xl font-bold text-chart-2 mb-1'>
                  {Math.round(
                    ((item?.quantity || 0) /
                      Math.max(
                        item?.quantity || 0,
                        (item?.threshold || 1) * 2
                      )) *
                      100
                  )}
                  %
                </div>
                <div className='text-xs text-muted-foreground'>Stock Level</div>
              </div>
            </div>
          </div>
        </div>

        {/* Update History */}
        <div className='bg-background/30 rounded-lg p-6'>
          <h3 className='text-xl font-bold text-foreground mb-4'>
            Complete Update History
          </h3>

          {(item?.updateHistory || []).length > 0 ? (
            <div className='space-y-3 max-h-96 overflow-y-auto'>
              {(item?.updateHistory || [])
                .sort(
                  (a: any, b: any) =>
                    new Date(b?.date || 0).getTime() -
                    new Date(a?.date || 0).getTime()
                )
                .map((update: any, idx: number) => (
                  <motion.div
                    key={idx}
                    className='flex justify-between items-center p-4 bg-card/50 rounded-lg border border-border hover:border-primary/30 transition-all duration-300'
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className='flex items-center gap-4'>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          update?.updateType === 'REPLENISHMENT'
                            ? 'bg-green-500'
                            : 'bg-blue-500'
                        }`}
                      />
                      <div>
                        <div className='flex items-center gap-2 mb-1'>
                          <span className='font-medium text-foreground'>
                            {update?.vendorId || 'N/A'}:{' '}
                            {update?.vendorName || 'Unknown'}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              update?.updateType === 'REPLENISHMENT'
                                ? 'bg-green-500/20 text-green-500'
                                : 'bg-blue-500/20 text-blue-500'
                            }`}
                          >
                            {update?.updateType || 'UNKNOWN'}
                          </span>
                        </div>
                        <div className='text-sm text-muted-foreground'>
                          {update?.date
                            ? new Date(update.date).toLocaleString()
                            : 'No date'}
                        </div>
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='font-bold text-foreground'>
                        {update?.updateType === 'REPLENISHMENT' ? '+' : '-'}
                        {update?.quantityUpdated || 0}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        ₹{(update?.cost || 0).toFixed(2)}/unit
                      </div>
                      <div className='text-sm font-medium text-primary'>
                        Total: ₹
                        {(
                          (update?.quantityUpdated || 0) * (update?.cost || 0)
                        ).toFixed(2)}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          ) : (
            <div className='text-center py-8'>
              <div className='text-4xl mb-2'>📊</div>
              <p className='text-muted-foreground'>
                No update history available
              </p>
            </div>
          )}
        </div>

        <div className='flex justify-end mt-6'>
          <motion.button
            onClick={onClose}
            className='px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:neon-glow transition-all duration-300'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
