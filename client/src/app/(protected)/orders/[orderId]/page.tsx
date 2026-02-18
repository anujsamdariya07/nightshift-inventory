'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import useOrderStore, { Order, OrderItem } from '@/store/useOrderStore';
import {
  Loader,
  ArrowLeft,
  Package,
  User,
  Calendar,
  DollarSign,
  Clock,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter, useParams } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';

const statusColors = {
  PENDING: 'chart-4',
  PROCESSING: 'chart-1',
  SHIPPED: 'secondary',
  DELIVERED: 'accent',
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const router = useRouter();
  const { orders, loading, findOrders, updateOrder } = useOrderStore();
  const { authUser } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    if (!authUser) {
      router.push('/');
      return;
    }
    if (authUser.mustChangePassword) {
      router.push('/change-password');
      return;
    }

    if (orders.length === 0) {
      findOrders();
    }
  }, [authUser]);

  useEffect(() => {
    if (orders.length > 0 && orderId) {
      const foundOrder = orders.find((o) => o.orderId === orderId);
      setOrder(foundOrder || null);
    }
  }, [orders, orderId]);

  const handleUpdateStatus = async (status: Order['status']) => {
    if (!order) return;

    const result = await updateOrder(order.id, { status });
    if (result.success) {
      setShowUpdateModal(false);
      // Refresh order data
      const updatedOrder = orders.find((o) => o.orderId === orderId);
      if (updatedOrder) {
        setOrder({ ...updatedOrder, status });
      }
    }
  };

  if (loading && !order) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>
          <Loader className='w-10 h-10 mx-auto mb-4 animate-spin text-primary' />
          <p className='text-muted-foreground'>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order && !loading) {
    return (
      <div className='min-h-screen bg-background'>
        <Navbar />
        <main className='pt-24 pb-16'>
          <div className='container mx-auto px-4'>
            <div className='text-center py-16'>
              <div className='text-6xl mb-4'>📦</div>
              <h3 className='text-xl font-semibold text-foreground mb-2'>
                Order not found
              </h3>
              <p className='text-muted-foreground mb-6'>
                The order you're looking for doesn't exist or has been removed.
              </p>
              <Button
                onClick={() => router.push('/orders')}
                className='bg-primary text-primary-foreground'
              >
                Back to Orders
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className='min-h-screen bg-background'>
      <Navbar />

      <main className='pt-24 pb-16'>
        {/* Header Section */}
        <section className='container mx-auto px-4 mb-8'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Button
              variant='ghost'
              onClick={() => router.push('/orders')}
              className='mb-4 text-primary hover:text-primary/80'
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back to Orders
            </Button>

            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
              <div>
                <h1 className='text-4xl md:text-5xl font-bold font-mono text-primary neon-text mb-2'>
                  {order.orderId}
                </h1>
                <p className='text-lg text-muted-foreground'>
                  Order placed on{' '}
                  {new Date(order.orderDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div className='flex items-center gap-4'>
                <StatusBadge status={order.status} />
                <Button
                  onClick={() => setShowUpdateModal(true)}
                  className='bg-primary text-primary-foreground hover:neon-glow'
                >
                  Update Status
                </Button>
                <Button
                  onClick={() => setShowUpdateModal(true)}
                  className='bg-primary text-primary-foreground hover:neon-glow'
                >
                  Download Invoice
                </Button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Order Details Grid */}
        <section className='container mx-auto px-4'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
            {/* Main Order Info */}
            <motion.div
              className='lg:col-span-2 space-y-6'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Items Card */}
              <Card className='bg-card/50 backdrop-blur-sm border border-border p-6'>
                <div className='flex items-center gap-2 mb-4'>
                  <Package className='w-5 h-5 text-primary' />
                  <h2 className='text-xl font-bold text-foreground'>
                    Order Items ({order.items?.length || 0})
                  </h2>
                </div>

                <div className='space-y-3'>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <motion.div
                        key={index}
                        className='flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border hover:border-primary/50 transition-all'
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <div className='flex-1'>
                          <p className='text-sm font-semibold text-foreground'>
                            {item.itemName}
                          </p>
                          <p className='text-xs text-muted-foreground mt-1'>
                            Qty: {item.quantity} × ₹
                            {item.priceAtOrder.toFixed(2)}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='text-lg font-bold text-primary'>
                            ₹{(item.quantity * item.priceAtOrder).toFixed(2)}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className='text-sm text-muted-foreground text-center py-4'>
                      No items in this order
                    </p>
                  )}
                </div>

                {/* Total */}
                <div className='mt-6 pt-4 border-t border-border'>
                  <div className='flex justify-between items-center'>
                    <span className='text-lg font-semibold text-foreground'>
                      Total Amount
                    </span>
                    <span className='text-2xl font-bold text-primary neon-text'>
                      ₹{order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Notes Card */}
              {order.notes && (
                <Card className='bg-card/50 backdrop-blur-sm border border-border p-6'>
                  <div className='flex items-center gap-2 mb-4'>
                    <FileText className='w-5 h-5 text-primary' />
                    <h2 className='text-xl font-bold text-foreground'>
                      Order Notes
                    </h2>
                  </div>
                  <p className='text-sm text-foreground bg-background/50 p-4 rounded-lg border border-border'>
                    {order.notes}
                  </p>
                </Card>
              )}
            </motion.div>

            {/* Sidebar Info */}
            <motion.div
              className='space-y-6'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Customer Info */}
              <Card className='bg-card/50 backdrop-blur-sm border border-border p-6'>
                <div className='flex items-center gap-2 mb-4'>
                  <User className='w-5 h-5 text-primary' />
                  <h2 className='text-lg font-bold text-foreground'>
                    Customer Details
                  </h2>
                </div>
                <div className='space-y-3'>
                  <div>
                    <p className='text-xs text-muted-foreground'>
                      Customer Name
                    </p>
                    <p className='text-sm font-medium text-foreground'>
                      {order.customerName}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-muted-foreground'>Customer ID</p>
                    <p className='text-sm font-medium text-foreground'>
                      {order.customerId}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Employee Info */}
              <Card className='bg-card/50 backdrop-blur-sm border border-border p-6'>
                <div className='flex items-center gap-2 mb-4'>
                  <User className='w-5 h-5 text-primary' />
                  <h2 className='text-lg font-bold text-foreground'>
                    Processed By
                  </h2>
                </div>
                <div className='space-y-3'>
                  <div>
                    <p className='text-xs text-muted-foreground'>
                      Employee Name
                    </p>
                    <p className='text-sm font-medium text-foreground'>
                      {order.employeeName}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-muted-foreground'>Employee ID</p>
                    <p className='text-sm font-medium text-foreground'>
                      {order.employeeId}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Dates Card */}
              <Card className='bg-card/50 backdrop-blur-sm border border-border p-6'>
                <div className='flex items-center gap-2 mb-4'>
                  <Calendar className='w-5 h-5 text-primary' />
                  <h2 className='text-lg font-bold text-foreground'>
                    Important Dates
                  </h2>
                </div>
                <div className='space-y-3'>
                  <div>
                    <p className='text-xs text-muted-foreground'>Order Date</p>
                    <p className='text-sm font-medium text-foreground'>
                      {new Date(order.orderDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-muted-foreground'>Deadline</p>
                    <p className='text-sm font-medium text-foreground'>
                      {new Date(order.deadline).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-muted-foreground'>
                      Days Until Deadline
                    </p>
                    <p className='text-sm font-medium text-foreground'>
                      {Math.ceil(
                        (new Date(order.deadline).getTime() -
                          new Date().getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}{' '}
                      days
                    </p>
                  </div>
                </div>
              </Card>

              {/* Order Summary */}
              <Card className='bg-card/50 backdrop-blur-sm border border-border p-6'>
                <div className='flex items-center gap-2 mb-4'>
                  <DollarSign className='w-5 h-5 text-primary' />
                  <h2 className='text-lg font-bold text-foreground'>
                    Order Summary
                  </h2>
                </div>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-muted-foreground'>
                      Order ID
                    </span>
                    <span className='text-sm font-medium text-foreground'>
                      {order.orderId}
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-muted-foreground'>
                      Status
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-muted-foreground'>
                      Total Items
                    </span>
                    <span className='text-sm font-medium text-foreground'>
                      {order.items?.length || 0}
                    </span>
                  </div>
                  <div className='flex justify-between items-center pt-3 border-t border-border'>
                    <span className='text-sm font-semibold text-foreground'>
                      Total Amount
                    </span>
                    <span className='text-lg font-bold text-primary'>
                      ₹{order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Update Status Modal */}
      {showUpdateModal && (
        <UpdateStatusModal
          order={order}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleUpdateStatus}
          loading={loading}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Order['status'] }) {
  const colorClass = statusColors[status] || 'muted';

  return (
    <Badge
      className={`px-3 py-1 text-xs font-medium rounded-full bg-${colorClass}/20 text-${colorClass} border border-${colorClass}/30`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}

function UpdateStatusModal({
  order,
  onClose,
  onUpdate,
  loading,
}: {
  order: Order;
  onClose: () => void;
  onUpdate: (status: Order['status']) => void;
  loading: boolean;
}) {
  const [selectedStatus, setSelectedStatus] = useState<Order['status']>(
    order.status,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(selectedStatus);
  };

  return (
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
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              className='flex-1'
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              className='flex-1 bg-primary text-primary-foreground'
              disabled={loading}
            >
              {loading ? (
                <div className='flex items-center justify-center gap-2'>
                  <Loader className='animate-spin' size={20} />
                  <span>Updating...</span>
                </div>
              ) : (
                'Update Status'
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
