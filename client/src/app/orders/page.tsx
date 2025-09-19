'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import useOrderStore, { Order, OrderCreateData, OrderItem } from '@/store/useOrderStore';

const statusColors = {
  PENDING: 'chart-4',
  PROCESSING: 'chart-1',
  SHIPPED: 'secondary',
  DELIVERED: 'accent',
};

const priorityColors = {
  low: 'muted',
  medium: 'chart-2',
  high: 'chart-4',
};

const filterOptions = [
  { label: 'All Orders', value: 'all' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Shipped', value: 'SHIPPED' },
  { label: 'Delivered', value: 'DELIVERED' },
];

export default function OrdersPage() {
  const { orders, loading, findOrders, createOrder, updateOrder, deleteOrder } =
    useOrderStore();
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    // Fetch orders on component mount
    findOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (activeFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === activeFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some((item) =>
            item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    setFilteredOrders(filtered);
  }, [activeFilter, searchTerm, orders]);

  const handleCreateOrder = async (orderData: OrderCreateData) => {
    const result = await createOrder(orderData);
    if (result.success) {
      setShowNewOrderModal(false);
    }
  };

  const handleUpdateOrder = async (id: string, status: Order['status']) => {
    const orderToUpdate = orders.find((o) => o.id === id);
    if (!orderToUpdate) return;

    const updateData = {
      employeeId: orderToUpdate.employeeId,
      employeeName: orderToUpdate.employeeName,
      status,
      orderDate: orderToUpdate.orderDate,
    };

    const result = await updateOrder(id, updateData);
    if (result.success) {
      setShowUpdateModal(false);
      setSelectedOrder(null);
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>
          <motion.div
            className='w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4'
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className='text-muted-foreground'>Loading orders...</p>
        </div>
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
                Orders Management
              </h1>
              <p className='text-lg text-muted-foreground'>
                Track and manage all customer orders in real-time
              </p>
            </div>

            <div className='flex items-center gap-4'>
              <motion.button
                className='px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:neon-glow transition-all duration-300'
                onClick={() => setShowNewOrderModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                New Order
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
                placeholder='Search orders, customers, or items...'
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

        {/* Orders Grid */}
        <section className='container mx-auto px-4'>
          <motion.div
            className='grid grid-cols-1 lg:grid-cols-2 gap-6'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <AnimatePresence mode='popLayout'>
              {filteredOrders.map((order, index) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  index={index}
                  onUpdateStatus={(order) => {
                    setSelectedOrder(order);
                    setShowUpdateModal(true);
                  }}
                  onDelete={(id) => deleteOrder(id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredOrders.length === 0 && !loading && (
            <motion.div
              className='text-center py-16'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className='text-6xl mb-4'>📦</div>
              <h3 className='text-xl font-semibold text-foreground mb-2'>
                No orders found
              </h3>
              <p className='text-muted-foreground'>
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </section>

        {/* Stats Summary */}
        <section className='container mx-auto px-4 mt-16'>
          <OrderStats orders={filteredOrders} />
        </section>
      </main>

      {/* New Order Modal */}
      <NewOrderModal
        isOpen={showNewOrderModal}
        onClose={() => setShowNewOrderModal(false)}
        onSubmit={handleCreateOrder}
        loading={loading}
      />

      {/* Update Status Modal */}
      <UpdateStatusModal
        isOpen={showUpdateModal}
        order={selectedOrder}
        onClose={() => {
          setShowUpdateModal(false);
          setSelectedOrder(null);
        }}
        onUpdate={handleUpdateOrder}
        loading={loading}
      />
    </div>
  );
}

function OrderCard({
  order,
  index,
  onUpdateStatus,
  onDelete,
}: {
  order: Order;
  index: number;
  onUpdateStatus: (order: Order) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className='bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group relative'
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      layout
    >
      {/* Order Header */}
      <div className='flex justify-between items-start mb-4'>
        <div>
          <h3 className='text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300'>
            {order.orderId}
          </h3>
          <p className='text-sm text-muted-foreground'>{order.customerName}</p>
          <p className='text-xs text-muted-foreground'>
            Employee: {order.employeeName}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Order Summary */}
      <div className='grid grid-cols-2 gap-4 mb-4'>
        <div>
          <p className='text-xs text-muted-foreground'>Order Date</p>
          <p className='text-sm font-medium text-foreground'>
            {new Date(order.orderDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className='text-xs text-muted-foreground'>Total Amount</p>
          <p className='text-sm font-bold text-primary'>
            ${order.totalAmount.toFixed(2)}
          </p>
        </div>
        <div>
          <p className='text-xs text-muted-foreground'>Deadline</p>
          <p className='text-sm font-medium text-foreground'>
            {new Date(order.deadline).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className='text-xs text-muted-foreground'>Items</p>
          <p className='text-sm font-medium text-foreground'>
            {order.items.length} items
          </p>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className='mb-4'>
          <p className='text-xs text-muted-foreground mb-1'>Notes</p>
          <p className='text-sm text-foreground bg-background/50 p-2 rounded'>
            {order.notes}
          </p>
        </div>
      )}

      {/* Items Preview */}
      <div className='mb-4'>
        <p className='text-xs text-muted-foreground mb-2'>
          Items ({order.items.length})
        </p>
        <div className='space-y-2'>
          {order.items
            .slice(0, expanded ? order.items.length : 2)
            .map((item, itemIndex) => (
              <ItemRow key={itemIndex} item={item} />
            ))}
        </div>
      </div>

      {/* Expand/Collapse Button */}
      {order.items.length > 2 && (
        <motion.button
          className='w-full py-2 text-sm text-primary hover:text-primary/80 transition-colors duration-300'
          onClick={() => setExpanded(!expanded)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {expanded ? 'Show Less' : `Show ${order.items.length - 2} More Items`}
        </motion.button>
      )}

      {/* Action Buttons */}
      <div className='flex gap-2 mt-4'>
        <motion.button
          className='flex-1 py-2 px-4 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300'
          onClick={() => onUpdateStatus(order)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Update Status
        </motion.button>
        <motion.button
          className='py-2 px-4 bg-destructive/10 text-destructive rounded-lg text-sm font-medium hover:bg-destructive hover:text-destructive-foreground transition-all duration-300'
          onClick={() => onDelete(order.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Delete
        </motion.button>
      </div>

      {/* Glow effect */}
      <div className='absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl' />
    </motion.div>
  );
}

function ItemRow({ item }: { item: OrderItem }) {
  return (
    <div className='flex items-center justify-between p-3 bg-background/50 rounded-lg'>
      <div className='flex-1'>
        <p className='text-sm font-medium text-foreground'>{item.itemName}</p>
        <p className='text-xs text-muted-foreground'>
          Qty: {item.quantity} × ${item.priceAtOrder}
        </p>
      </div>
      <div className='text-right'>
        <p className='text-sm font-bold text-foreground'>
          ${(item.quantity * item.priceAtOrder).toFixed(2)}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Order['status'] }) {
  const colorClass = statusColors[status] || 'muted';

  return (
    <motion.span
      className={`px-2 py-1 text-xs font-medium rounded-full bg-${colorClass}/20 text-${colorClass} border border-${colorClass}/30`}
      whileHover={{ scale: 1.05 }}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </motion.span>
  );
}

function OrderStats({ orders }: { orders: Order[] }) {
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'PENDING').length,
    processing: orders.filter((o) => o.status === 'PROCESSING').length,
    shipped: orders.filter((o) => o.status === 'SHIPPED').length,
    delivered: orders.filter((o) => o.status === 'DELIVERED').length,
    totalValue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
  };

  return (
    <motion.div
      className='bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-8'
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <h3 className='text-2xl font-bold text-foreground mb-6 text-center'>
        Order Statistics
      </h3>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
        <StatCard label='Total Orders' value={stats.total} color='primary' />
        <StatCard label='Pending' value={stats.pending} color='chart-4' />
        <StatCard label='Processing' value={stats.processing} color='chart-1' />
        <StatCard label='Shipped' value={stats.shipped} color='secondary' />
        <StatCard label='Delivered' value={stats.delivered} color='accent' />
        <StatCard
          label='Total Value'
          value={`$${stats.totalValue.toFixed(0)}`}
          color='primary'
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

function NewOrderModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: OrderCreateData) => void;
  loading: boolean;
}) {
  const [formData, setFormData] = useState<{
    customerId: string;
    customerName: string;
    employeeId: string;
    employeeName: string;
    items: Array<{
      itemId: string;
      itemName: string;
      quantity: number;
      priceAtOrder: number;
    }>;
    status: Order['status'];
    deadline: string;
    notes: string;
  }>({
    customerId: '',
    customerName: '',
    employeeId: '',
    employeeName: '',
    items: [{ itemId: '', itemName: '', quantity: 1, priceAtOrder: 0 }],
    status: 'PENDING',
    deadline: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const orderData: OrderCreateData = {
      customerId: formData.customerId,
      customerName: formData.customerName,
      employeeId: formData.employeeId,
      employeeName: formData.employeeName,
      items: formData.items,
      totalAmount: formData.items.reduce(
        (sum, item) => sum + item.quantity * item.priceAtOrder,
        0
      ),
      status: formData.status,
      orderDate: new Date(),
      deadline: new Date(formData.deadline),
      notes: formData.notes,
    };

    onSubmit(orderData);

    // Reset form
    setFormData({
      customerId: '',
      customerName: '',
      employeeId: '',
      employeeName: '',
      items: [{ itemId: '', itemName: '', quantity: 1, priceAtOrder: 0 }],
      status: 'PENDING',
      deadline: '',
      notes: '',
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { itemId: '', itemName: '', quantity: 1, priceAtOrder: 0 },
      ],
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = formData.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFormData({ ...formData, items: updatedItems });
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((_, i) => i !== index),
      });
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
            className='bg-card border border-border rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto'
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-bold text-primary'>
                Create New Order
              </h2>
              <button
                onClick={onClose}
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Customer Information */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-foreground'>
                  Customer Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <input
                    type='text'
                    placeholder='Customer ID'
                    value={formData.customerId}
                    onChange={(e) =>
                      setFormData({ ...formData, customerId: e.target.value })
                    }
                    className='px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'
                    required
                  />
                  <input
                    type='text'
                    placeholder='Customer Name'
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    className='px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'
                    required
                  />
                </div>
              </div>

              {/* Employee Information */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-foreground'>
                  Employee Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <input
                    type='text'
                    placeholder='Employee ID'
                    value={formData.employeeId}
                    onChange={(e) =>
                      setFormData({ ...formData, employeeId: e.target.value })
                    }
                    className='px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'
                    required
                  />
                  <input
                    type='text'
                    placeholder='Employee Name'
                    value={formData.employeeName}
                    onChange={(e) =>
                      setFormData({ ...formData, employeeName: e.target.value })
                    }
                    className='px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'
                    required
                  />
                </div>
              </div>

              {/* Items */}
              <div className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <h3 className='text-lg font-semibold text-foreground'>
                    Order Items
                  </h3>
                  <button
                    type='button'
                    onClick={addItem}
                    className='px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm hover:bg-secondary/80 transition-colors'
                  >
                    Add Item
                  </button>
                </div>

                {formData.items.map((item, index) => (
                  <div
                    key={index}
                    className='grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-background/50 rounded-lg'
                  >
                    <input
                      type='text'
                      placeholder='Item ID'
                      value={item.itemId}
                      onChange={(e) =>
                        updateItem(index, 'itemId', e.target.value)
                      }
                      className='px-3 py-2 bg-input border border-border rounded text-foreground placeholder-muted-foreground focus:border-primary'
                      required
                    />
                    <input
                      type='text'
                      placeholder='Item Name'
                      value={item.itemName}
                      onChange={(e) =>
                        updateItem(index, 'itemName', e.target.value)
                      }
                      className='px-3 py-2 bg-input border border-border rounded text-foreground placeholder-muted-foreground focus:border-primary'
                      required
                    />
                    <input
                      type='number'
                      placeholder='Quantity'
                      min='1'
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(
                          index,
                          'quantity',
                          Number.parseInt(e.target.value) || 1
                        )
                      }
                      className='px-3 py-2 bg-input border border-border rounded text-foreground placeholder-muted-foreground focus:border-primary'
                      required
                    />
                    <input
                      type='number'
                      placeholder='Price'
                      min='0'
                      step='0.01'
                      value={item.priceAtOrder}
                      onChange={(e) =>
                        updateItem(
                          index,
                          'priceAtOrder',
                          Number.parseFloat(e.target.value) || 0
                        )
                      }
                      className='px-3 py-2 bg-input border border-border rounded text-foreground placeholder-muted-foreground focus:border-primary'
                      required
                    />
                    <button
                      type='button'
                      onClick={() => removeItem(index)}
                      className='px-3 py-2 bg-destructive/20 text-destructive rounded hover:bg-destructive hover:text-destructive-foreground transition-colors'
                      disabled={formData.items.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Order Details */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-foreground mb-2'>
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as Order['status'],
                      })
                    }
                    className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'
                  >
                    <option value='PENDING'>Pending</option>
                    <option value='PROCESSING'>Processing</option>
                    <option value='SHIPPED'>Shipped</option>
                    <option value='DELIVERED'>Delivered</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-foreground mb-2'>
                    Deadline
                  </label>
                  <input
                    type='date'
                    value={formData.deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, deadline: e.target.value })
                    }
                    className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'
                    required
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className='block text-sm font-medium text-foreground mb-2'>
                  Notes
                </label>
                <textarea
                  placeholder='Additional notes about the order...'
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
                  className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'
                />
              </div>

              {/* Total Amount Display */}
              <div className='bg-background/50 p-4 rounded-lg'>
                <h4 className='text-lg font-semibold text-foreground mb-2'>
                  Order Summary
                </h4>
                <p className='text-xl font-bold text-primary'>
                  Total: $
                  {formData.items
                    .reduce(
                      (sum, item) => sum + item.quantity * item.priceAtOrder,
                      0
                    )
                    .toFixed(2)}
                </p>
              </div>

              {/* Submit Buttons */}
              <div className='flex gap-4 pt-4'>
                <button
                  type='button'
                  onClick={onClose}
                  className='flex-1 py-3 px-6 border border-border text-muted-foreground rounded-lg hover:bg-muted hover:text-foreground transition-all duration-300'
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='flex-1 py-3 px-6 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 disabled:opacity-50'
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Order'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function UpdateStatusModal({
  isOpen,
  order,
  onClose,
  onUpdate,
  loading,
}: {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onUpdate: (id: string, status: Order['status']) => void;
  loading: boolean;
}) {
  const [selectedStatus, setSelectedStatus] =
    useState<Order['status']>('PENDING');

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
    }
  }, [order]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (order) {
      onUpdate(order.id, selectedStatus);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && order && (
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
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-bold text-primary'>
                Update Order Status
              </h2>
              <button
                onClick={onClose}
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                ✕
              </button>
            </div>

            <div className='mb-4'>
              <p className='text-sm text-muted-foreground'>Order ID</p>
              <p className='text-lg font-semibold text-foreground'>
                {order.orderId}
              </p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-foreground mb-2'>
                  New Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value as Order['status'])
                  }
                  className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'
                >
                  <option value='PENDING'>Pending</option>
                  <option value='PROCESSING'>Processing</option>
                  <option value='SHIPPED'>Shipped</option>
                  <option value='DELIVERED'>Delivered</option>
                </select>
              </div>

              <div className='flex gap-4 pt-4'>
                <button
                  type='button'
                  onClick={onClose}
                  className='flex-1 py-3 px-6 border border-border text-muted-foreground rounded-lg hover:bg-muted hover:text-foreground transition-all duration-300'
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='flex-1 py-3 px-6 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 disabled:opacity-50'
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
