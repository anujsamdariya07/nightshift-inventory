import { axiosInstance } from '@/lib/axios';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CustomerOrder {
  orderId: string;
  status: 'pending' | 'shipped' | 'delivered' | 'processing';
  orderDate: Date;
  totalAmount: number;
}

export interface Customer {
  id: string;
  orgId: string;
  customerId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: 'active' | 'inactive';
  gstNo: string;
  dateOfJoining: Date;
  orders: CustomerOrder[];
  satisfactionLevel: number[];
  preferredCategories: string[];
}

export interface CustomerCreateData {
  name: string;
  phone: string;
  email: string;
  address: string;
  status: 'active' | 'inactive';
  preferredCategories: string[];
  gstNo: string;
  dateOfJoining: Date;
}

export interface CustomerUpdateData {
  name: string;
  phone: string;
  email: string;
  address: string;
  status: 'active' | 'inactive';
  preferredCategories: string[];
  gstNo: string;
  dateOfJoining: Date;
  orders: CustomerOrder[];
  satisfactionLevel: number[];
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface CustomerState {
  customers: Customer[];
  customer: Customer | null;
  loading: boolean;
  error: string | null;

  fetchCustomers: () => Promise<ApiResponse<Customer[]>>;
  fetchCustomerById: (id: string) => Promise<ApiResponse<Customer>>;
  createCustomer: (
    customerData: CustomerCreateData
  ) => Promise<ApiResponse<Customer>>;
  updateCustomer: (
    customerData: CustomerUpdateData,
    id: string
  ) => Promise<ApiResponse<Customer>>;
  deleteCustomer: (id: string) => Promise<ApiResponse<null>>;
}

const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      customers: [],
      customer: null,
      loading: false,
      error: null,

      fetchCustomers: async () => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.get<Customer[]>('/customers');
          set({ customers: response.data, error: null });
          return { success: true, data: response.data };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          const msg =
            err.response?.data.message || 'Failed to fetch customers!';
          set({ error: msg });
          toast.error('Error while fetching customers!', { description: msg });
          return { success: false, error: msg };
        } finally {
          set({ loading: false });
        }
      },

      fetchCustomerById: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.get<Customer>(
            `/customers/${id}`
          );
          set({ customer: response.data, error: null });
          return { success: true, data: response.data };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          const msg =
            err.response?.data.message || 'Failed to fetch the customer by ID!';
          set({ error: msg });
          toast.error('Error while fetching the customer by ID!', {
            description: msg,
          });
          return { success: false, error: msg };
        } finally {
          set({ loading: false });
        }
      },

      createCustomer: async (customerData: CustomerCreateData) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.post<Customer>(
            '/customers',
            customerData
          );
          const customer = response.data;
          set((state) => ({ customers: [customer, ...state.customers] }));
          set({ error: null });
          return {
            success: true,
            data: customer,
            message: 'Customer created successfully!',
          };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          const msg =
            err.response?.data.message || 'Failed to create customer!';
          set({ error: msg });
          toast.error('Error while creating customer!', { description: msg });
          return { success: false, error: msg };
        } finally {
          set({ loading: false });
        }
      },

      updateCustomer: async (customerData: CustomerUpdateData, id: string) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.put<Customer>(
            `/customers/${id}`,
            customerData
          );
          const customer = response.data;
          set((state) => ({
            customer: state.customer?.id === id ? customer : state.customer,
            customers: state.customers.map((c) => (c.id === id ? customer : c)),
          }));
          set({ error: null });
          return {
            success: true,
            data: customer,
            message: 'Customer updated successfully!',
          };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          const msg =
            err.response?.data.message || 'Failed to update customer!';
          set({ error: msg });
          toast.error('Error while updating customer!', { description: msg });
          return { success: false, error: msg };
        } finally {
          set({ loading: false });
        }
      },

      deleteCustomer: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await axiosInstance.delete(`/customers/${id}`);
          set((state) => ({
            customers: state.customers.filter((c) => c.id !== id),
          }));
          set({ error: null });
          toast.success('Customer deleted successfully!');
          return {
            success: true,
            data: null,
            message: 'Customer deleted successfully!',
          };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          const msg =
            err.response?.data.message || 'Failed to delete customer!';
          set({ error: msg });
          toast.error('Error while deleting customer!', { description: msg });
          return { success: false, error: msg };
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'customer-storage',
      partialize: (state) => ({
        customer: state.customer,
        customers: state.customers,
      }),
    }
  )
);

export default useCustomerStore;
