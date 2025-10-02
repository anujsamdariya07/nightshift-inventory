import { Customer } from "@/store/useCustomerStore";
import { Item } from "@/store/useItemStore";
import { Order, OrderCreateData, OrderItem } from "@/store/useOrderStore";
import { AnimatePresence, motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useState } from "react";

export function NewOrderModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
  customers,
  items,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: OrderCreateData) => void;
  customers: Customer[];
  items: Item[];
  loading: boolean;
}) {
  const [formData, setFormData] = useState<{
    customerId: string;
    customerName: string;
    items: OrderItem[];
    status: Order['status'];
    deadline: string;
    notes: string;
  }>({
    customerId: '',
    customerName: '',
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

  // const updateItem = (index: number, field: string, value: any) => {
  //   const updatedItems = formData.items.map((item, i) =>
  //     i === index ? { ...item, [field]: value } : item
  //   );
  //   setFormData({ ...formData, items: updatedItems });
  // };

  const updateItem = (index: number, updatedFields: Partial<OrderItem>) => {
    const updatedItems = formData.items.map((item, i) =>
      i === index ? { ...item, ...updatedFields } : item
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
                <div className='grid grid-cols-1 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-foreground mb-2'>
                      Select Customer
                    </label>
                    <select
                      value={formData.customerId}
                      onChange={(e) => {
                        const selectedCustomer =
                          customers &&
                          customers.find(
                            (c) => c.customerId === e.target.value
                          );
                        setFormData({
                          ...formData,
                          customerId: selectedCustomer?.customerId || '',
                          customerName: selectedCustomer?.name || '',
                        });
                      }}
                      className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'
                      required
                    >
                      <option value=''>Select Customer</option>
                      {customers &&
                        customers.map((customer) => (
                          <option
                            key={customer.customerId}
                            value={customer.customerId}
                          >
                            {customer.customerId} - {customer.name}
                          </option>
                        ))}
                    </select>
                  </div>
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
                    className='grid grid-cols-1 gap-4 p-4 bg-background/50 rounded-lg'
                  >
                    {/* Item Selection */}
                    <div>
                      <label className='block text-sm font-medium text-foreground mb-2'>
                        Select Item
                      </label>
                      <select
                        value={item.itemId}
                        onChange={(e) => {
                          const selectedItem = items.find(
                            (i) => i.itemId === e.target.value
                          );
                          updateItem(index, {
                            itemId: selectedItem?.itemId || '',
                            itemName: selectedItem?.name || '',
                          });
                        }}
                        className='w-full px-3 py-2 bg-input border border-border rounded text-foreground focus:border-primary'
                        required
                      >
                        <option value=''>Select Item</option>
                        {items.map((i) => (
                          <option key={i.itemId} value={i.itemId}>
                            {i.itemId} - {i.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity and Price in same row */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-foreground mb-2'>
                          Quantity
                        </label>
                        <input
                          type='number'
                          placeholder='Quantity'
                          min='1'
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(index, {
                              quantity: Number.parseInt(e.target.value) || 1,
                            })
                          }
                          className='w-full px-3 py-2 bg-input border border-border rounded text-foreground focus:border-primary'
                          required
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-foreground mb-2'>
                          Price per Unit (₹)
                        </label>
                        <input
                          type='number'
                          placeholder='Price'
                          min='0'
                          step='0.01'
                          value={item.priceAtOrder}
                          onChange={(e) =>
                            updateItem(index, {
                              priceAtOrder: Number.parseFloat(e.target.value),
                            })
                          }
                          className='w-full px-3 py-2 bg-input border border-border rounded text-foreground focus:border-primary'
                          required
                        />
                      </div>

                      <div className='flex items-end'>
                        <button
                          type='button'
                          onClick={() => removeItem(index)}
                          className='w-full px-3 py-2 bg-destructive/20 text-destructive rounded hover:bg-destructive hover:text-destructive-foreground transition-colors'
                          disabled={formData.items.length === 1}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Item Total Display */}
                    {item.quantity > 0 && item.priceAtOrder > 0 && (
                      <div className='bg-background/30 p-3 rounded border-l-4 border-primary'>
                        <p className='text-sm text-muted-foreground'>
                          Item Total:
                        </p>
                        <p className='text-lg font-bold text-primary'>
                          ₹{(item.quantity * item.priceAtOrder).toFixed(2)}
                        </p>
                      </div>
                    )}
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
              <div className='bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg border border-primary/20'>
                <h4 className='text-lg font-semibold text-foreground mb-2'>
                  Order Summary
                </h4>
                <div className='space-y-2'>
                  <div className='flex justify-between text-sm text-muted-foreground'>
                    <span>Items: {formData.items.length}</span>
                    <span>
                      Total Quantity:{' '}
                      {formData.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      )}
                    </span>
                  </div>
                  <div className='border-t pt-2'>
                    <p className='text-2xl font-bold text-primary'>
                      Total: ₹
                      {formData.items
                        .reduce(
                          (sum, item) =>
                            sum + item.quantity * item.priceAtOrder,
                          0
                        )
                        .toFixed(2)}
                    </p>
                  </div>
                </div>
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
                  {loading ? (
                    <div className='flex items-center justify-center space-x-2'>
                      <Loader className='animate-spin text-white' size={20} />
                      <span>Creating...</span>
                    </div>
                  ) : (
                    'Create Order'
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
