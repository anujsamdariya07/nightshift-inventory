import { axiosInstance } from '@/lib/axios';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { create } from 'zustand';
import {Types} from 'mongoose'


interface AuthUser {
  id: Types.ObjectId;
  orgId: Types.ObjectId;
  name: string;
  username: string;
  password: string;
  mustChangePassword: boolean;
  role: 'admin' | 'employee' | 'manager';
  mobileNo: string;
  address: string;
  attendance: number;
  messages: string | null;
}

interface Employee {}
interface Order {}
interface Customer {}
interface Item {}
interface Vendor {}

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
  authUser: AuthUser | null;
  isCheckingAuth: boolean;
  loading: boolean;
  organization: Organization | null;
  error: string | null;

  setAuthUser: (user: AuthUser | null) => void;
  checkAuth: () => Promise<void>;
  signUp: (
    orgData: OrgData
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  login: (
    credentials: { username: string; password: string }
  ) => Promise<{ success: boolean; message?: string; error?: string }>; 
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
  username: string,
  password: string,
}

const useAuthStore = create<AuthState>(((set) => ({
  authUser: null,
  isCheckingAuth: true,
  loading: false,
  error: null,
  organization: null,

  setAuthUser: (user) => set({ authUser: user }),

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get<AuthUser>('/auth/current', {
        withCredentials: true,
      });
      set({ authUser: res.data });
    } catch (error) {
      console.error('Error in checkAuth', error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (orgData: OrgData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post<{
        employee: AuthUser;
        organization: Organization;
        message: string;
      }>('/auth/sign-up', orgData);

      set({
        loading: false,
        authUser: response.data.employee,
        organization: response.data.organization,
      });

      toast.success('Organization registered successfully!');

      return { success: true, message: response.data.message };
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      set({
        loading: false,
        error: err.response?.data?.message || 'Organization signup failed.',
      });

      toast.error('Error registering organization!', {
        description: err.response?.data?.message || 'Something went wrong!',
      });

      return { success: false, error: err.response?.data?.message };
    }
  },

  login: async (loginData: LoginData) => {
    set({loading: true, error: null})
    try {
      const response = await axiosInstance.post<{
        employee: AuthUser,
        organization: Organization,
        message: string
      }>('/auth/login', loginData)
      
      set({
        loading: false,
        authUser: response.data.employee,
        organization: response.data.organization,
      })

      toast.success(response.data.message);

      return { success: true, message: response.data.message };
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      set({
        loading: false,
        error: err.response?.data?.message || 'Login failed.',
      });

      toast.error('Error logging in!', {
        description: err.response?.data?.message || 'Something went wrong!',
      });

      return { success: false, error: err.response?.data?.message };
    }
  }


})));

export default useAuthStore;
