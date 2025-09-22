import { showErrorToast, showSuccessToast } from '@/components/ToastComponent';
import { axiosInstance } from '@/lib/axios';
import { AxiosError } from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  priceAtOrder: number;
}

export interface Order {
  id: string;
  orgId: string;
  employeeId: string;
  employeeName: string;
  customerId: string;
  customerName: string;
  orderId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'DELIVERED' | 'SHIPPED' | 'PROCESSING';
  orderDate: Date;
  deadline: Date;
  notes: string;
}

export interface OrderState {
  orders: Order[];
  order: Order | null;
  loading: boolean;
  error: string | null;

  findOrders: () => Promise<{
    success: boolean;
    data?: Order[];
    message: string;
    error?: any;
  }>;

  findOrderById: (id: string) => Promise<{
    success: boolean;
    data?: Order;
    message: string;
    error?: any;
  }>;

  createOrder: (orderData: OrderCreateData) => Promise<{
    success: boolean;
    data?: Order;
    message: string;
    error?: any;
  }>;

  updateOrder: (
    id: string,
    orderData: OrderUpdateData
  ) => Promise<{
    success: boolean;
    data?: Order;
    message: string;
    error?: any;
  }>;

  deleteOrder: (id: string) => Promise<{
    success: boolean;
    data?: null;
    message: string;
    error?: any;
  }>;

  logout: () => Promise<void>;
}

export interface OrderCreateData {
  customerId: string;
  customerName: string;
  employeeId?: string;
  employeeName?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'DELIVERED' | 'SHIPPED' | 'PROCESSING';
  orderDate: Date;
  deadline: Date;
  notes: string;
}

export interface OrderUpdateData {
  customerId?: string;
  customerName?: string;
  items?: OrderItem[];
  totalAmount?: number;
  status?: 'PENDING' | 'DELIVERED' | 'SHIPPED' | 'PROCESSING';
  deadline?: Date;
  notes?: string;
}

const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      order: null,
      loading: false,
      error: null,

      findOrders: async () => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.get<Order[]>('/orders');
          set({ orders: response.data, error: null });
          return {
            success: true,
            data: response.data,
            message: 'Orders fetched successfully!',
          };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          const msg = err.response?.data.message || 'Failed to fetch orders!';
          showErrorToast({
            message: 'Error while fetching orders!',
            description: msg,
          });
          set({ error: msg });
          return {
            success: false,
            error: error,
            message: 'Failed to fetch orders!',
          };
        } finally {
          set({ loading: false });
        }
      },

      findOrderById: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.get(`/orders/${id}`);
          set({ order: response.data, error: null });
          return {
            success: true,
            data: response.data,
            message: 'Order fetched successfully!',
          };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          const msg =
            err.response?.data.message || 'Error in fetching the order!';
          showErrorToast({
            message: 'Failed to fetch order!',
            description: msg,
          });
          set({ error: msg });
          return { success: false, message: 'Failed to fetch order!' };
        } finally {
          set({ loading: false });
        }
      },

      createOrder: async (orderData: OrderCreateData) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.post('/orders', orderData);
          set((state) => ({ orders: [...state.orders, response.data] }));
          set({ error: null });
          showSuccessToast({ message: 'Order created successfully!' });
          return {
            success: true,
            message: 'Order created successfully!',
            data: response.data,
          };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          const msg =
            err.response?.data.message || 'Errow while creating order!';
          showErrorToast({
            message: 'Failed to create order!',
            description: msg,
          });
          set({ error: msg });
          return { success: false, message: 'Failed to create order' };
        } finally {
          set({ loading: false });
        }
      },

      updateOrder: async (id: string, orderData: OrderUpdateData) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.put(`/orders/${id}`, orderData);
          set((state) => ({
            orders: state.orders.map((o) => (o.id === id ? response.data : o)),
          }));
          set({ error: null });
          return {
            success: true,
            data: response.data,
            message: 'Order updated successfully!',
          };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          const msg =
            err.response?.data.message || 'Error while updating order!';
          showErrorToast({
            message: 'Failed to update order!',
            description: msg,
          });
          set({ error: msg });
          return { success: false, message: 'Failed to update order!' };
        } finally {
          set({ loading: false });
        }
      },

      deleteOrder: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await axiosInstance.delete(`/orders/${id}`);
          set((state) => ({ orders: state.orders.filter((o) => o.id != id) }));
          showSuccessToast({ message: 'Order deleted successfully!' });
          return {
            success: true,
            data: null,
            message: 'Order deleted successfully!',
          };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          const msg =
            err.response?.data.message || 'Error while deleting order!';
          showErrorToast({
            message: 'Failed to delete object!',
            description: msg,
          });
          return { success: false, message: 'Failed to delete object!' };
        } finally {
          set({ loading: false });
        }
      },

      logout: async () => {
        set({ orders: [], order: null });
      },
    }),
    {
      name: 'order-storage',
    }
  )
);

export default useOrderStore;
