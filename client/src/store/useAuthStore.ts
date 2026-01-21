import { axiosInstance } from '@/lib/axios';
import { Axios, AxiosError } from 'axios';
import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Types } from 'mongoose';
import { Employee } from './useEmployeeStore';
import { Vendor } from './useVendorStore';
import { Item } from './useItemStore';
import { Customer } from './useCustomerStore';
import { showErrorToast, showSuccessToast } from '@/components/ToastComponent';
import { Order } from './useOrderStore';

interface CheckAuthResponse {
  message: string;
  employee: Employee | null;
}

interface Organization {
  id: string;
  name: string;
  mobileNo: string;
  email: string;
  password: string;
  gstNo: string;
  address: string;
  employeeDetails: Array<Employee>;
  orders: Array<Order>;
  customers: Array<Customer>;
  items: Array<Item>;
  vendors: Array<Vendor>;
}

interface AuthState {
  authUser: Employee | null;
  isCheckingAuth: boolean;
  loading: boolean;
  organization: Organization | null;
  message: string | null;
  error: string | null;

  setAuthUser: (user: Employee | null) => void;
  checkAuth: () => Promise<void>;
  signUp: (
    orgData: OrgData,
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  login: (credentials: { email: string; password: string }) => Promise<{
    success: boolean;
    message?: string;
    error?: string;
    authUser?: Employee;
  }>;
  logout: () => Promise<void>;
  changePassword: ({
    password,
    confirmPassword,
  }: {
    password: string;
    confirmPassword: string;
  }) => Promise<{
    success: boolean;
    message?: string;
    error?: string;
    authUser?: Employee;
  }>;
}

interface OrgData {
  orgName: string;
  orgMobileNo: string;
  orgEmail: string;
  orgGstNo: string;
  orgAddress: string;
  adminPassword: string;
}

interface LoginData {
  email: string;
  password: string;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      authUser: null,
      isCheckingAuth: true,
      loading: false,
      error: null,
      organization: null,
      message: null,

      setAuthUser: (user) => set({ authUser: user }),

      checkAuth: async () => {
        try {
          const res = await axiosInstance.get<CheckAuthResponse>(
            '/auth/current',
            {
              withCredentials: true,
            },
          );
          console.log(1);
          console.log('FINE');
          set({ authUser: res.data.employee });
        } catch (error) {
          console.log('ERROR');
          console.error('Error in checkAuth', error);
          showErrorToast({
            message: 'Error in checking user!',
            description: 'Check auth not found!',
          });
          set({ authUser: null });
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      signUp: async (orgData: OrgData) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.post<{
            employee: Employee;
            organization: Organization;
            message: string;
          }>('/auth/sign-up', orgData);

          set({
            loading: false,
            authUser: response.data.employee,
            organization: response.data.organization,
          });

          showSuccessToast({
            message: 'Organization registered successfully!',
          });

          return { success: true, message: response.data.message };
        } catch (error: unknown) {
          const err = error as AxiosError<{ message: string }>;
          set({
            loading: false,
            error: err.response?.data?.message || 'Organization signup failed.',
          });

          showErrorToast({
            message: 'Error registering organization!',
            description: err.response?.data?.message || 'Something went wrong!',
          });

          return { success: false, error: err.response?.data?.message };
        }
      },

      login: async (loginData: LoginData) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.post<{
            employee: Employee;
            organization: Organization;
            message: string;
          }>('/auth/login', loginData);

          set({
            loading: false,
            authUser: response.data.employee,
            organization: response.data.organization,
            message: response.data.message,
          });

          showSuccessToast({ message: response.data.message });

          return {
            success: true,
            message: response.data.message,
            authUser: response.data.employee,
          };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          set({
            loading: false,
            error: err.response?.data?.message || 'Login failed.',
          });

          showErrorToast({
            message: 'Error logging in!',
            description: err.response?.data?.message || 'Something went wrong!',
          });

          return { success: false, error: err.response?.data?.message };
        }
      },

      logout: async () => {
        try {
          set({ loading: true });
          await axiosInstance.post(
            '/auth/logout',
            {},
            { withCredentials: true },
          );
          set({ authUser: null, organization: null });
          showSuccessToast({ message: 'Logged out successfully!' });
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          showErrorToast({
            message: 'Error logging out!',
            description: err.response?.data?.message || 'Something went wrong!',
          });
        } finally {
          set({ loading: false });
        }
      },

      changePassword: async ({ password, confirmPassword }) => {
        set({ loading: true, error: null });
        try {
          if (password !== confirmPassword) {
            set({ error: 'The passwords must match!' });
            showErrorToast({
              message: 'The passwords must match!',
              description: 'The passwords are not matching!',
            });
            return {
              success: false,
              message: 'The passwords are not matching!',
            };
          }

          await axiosInstance.post('/auth/change-password', {
            password,
            confirmPassword,
          });
          set({ error: null });
          return { success: true, message: 'Password changed successfully!' };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          const msg =
            err.response?.data.message || 'Failed to change password!';
          showErrorToast({
            message: 'Error while changing password!',
            description: msg,
          });
          set({ error: msg });
          return { success: false, message: msg };
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        authUser: state.authUser,
        organization: state.organization,
      }),
    },
  ),
);

export default useAuthStore;
