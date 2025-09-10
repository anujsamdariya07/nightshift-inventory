import { axiosInstance } from '@/lib/axios';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Vendor {
  id: string;
  orgId: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  gstNo: string;
  address: string;
}

interface VendorCreateData {
  name: string;
  email: string;
  phone: string;
  status?: 'active' | 'inactive';
  gstNo: string;
  address: string;
}

interface VendorUpdateData {
  name?: string;
  email?: string;
  phone?: string;
  status?: 'active' | 'inactive';
  gstNo?: string;
  address?: string;
}

interface VendorState {
  vendors: Vendor[];
  vendor: Vendor | null;
  loading: boolean;
  error: string | null;

  fetchVendors: () => Promise<{
    success: boolean;
    vendors?: Vendor[];
    error?: string;
  }>;
  fetchVendorById: (
    id: string
  ) => Promise<{ success: boolean; vendor?: Vendor; error?: string }>;
  createVendor: (
    vendorData: VendorCreateData
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  updateVendor: (
    vendorData: VendorUpdateData,
    id: string
  ) => Promise<{
    success: boolean;
    message?: string;
    vendor?: Vendor;
    error?: string;
  }>;
  deleteVendor: (
    id: string
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
}

const useVendorStore = create<VendorState>()(
  persist(
    (set) => ({
      vendor: null,
      vendors: [],
      loading: false,
      error: null,

      fetchVendors: async () => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.get('/vendors');
          const vendors = response.data.map((v: any) => ({
            ...v,
            id: v.id?.date || v.id,
            orgId: v.orgId?.date || v.orgId,
          }));
          set({ vendors: vendors, error: null });

          return { success: true, vendors: vendors };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          set({
            error: err.response?.data?.message || 'Failed to get vendors!',
          });

          toast.error('Error while fetching vendors!', {
            description: err.response?.data?.message || 'Something went wrong!',
          });

          return { success: false, error: err.response?.data?.message };
        } finally {
          set({ loading: false });
        }
      },

      fetchVendorById: async (id: string) => {
        set({ error: null, loading: true });

        try {
          const response = await axiosInstance.get(`/vendors/${id}`);
          const vendor = {
            ...response.data,
            id: response.data.id?.date || response.data.id,
            orgId: response.data.orgId?.date || response.data.orgId,
          };
          set({
            vendor: vendor,
            error: null,
          });
          return { success: true, vendor: vendor };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          set({
            error: err.response?.data?.message || 'Failed to get the vendor!',
          });

          toast.error('Error while fetching vendor!', {
            description: err.response?.data?.message || 'Something went wrong!',
          });

          return { success: false, error: err.response?.data?.message };
        } finally {
          set({ loading: false });
        }
      },

      createVendor: async (vendorData: VendorCreateData) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.post('/vendors', vendorData);
          const vendor = {
            ...response.data,
            id: response.data.id?.date || response.data.id,
            orgId: response.data.orgId?.date || response.data.orgId,
          };
          set((state) => ({
            vendors: [vendor, ...state.vendors],
          }));
          set({ error: null });
          return { success: true, message: 'Vendor created successfully!' };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          set({
            error: err.response?.data?.message || 'Failed to create vendor!',
          });

          toast.error('Error while creating vendor!', {
            description: err.response?.data?.message || 'Something went wrong!',
          });

          return { success: false, error: err.response?.data?.message };
        } finally {
          set({ loading: false });
        }
      },

      updateVendor: async (vendorData: VendorUpdateData, id: string) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.put(
            `/vendors/${id}`,
            vendorData
          );
          const vendor = {
            ...response.data,
            id: response.data.id?.date || response.data.id,
            orgId: response.data.orgId?.date || response.data.orgId,
          };
          set((state) => ({
            vendor: vendor,
            vendors: state.vendors.map((v) => (v.id == id ? vendor : v)),
            error: null,
          }));
          toast.success('Vendor updated successfully!');
          return {
            success: true,
            message: 'Vendor updated successfully!',
            vendor: vendor,
          };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          set({
            error: err.response?.data?.message || 'Failed to update vendor!',
          });

          toast.error('Error while updating vendor!', {
            description: err.response?.data?.message || 'Something went wrong!',
          });

          return { success: false, error: err.response?.data?.message };
        } finally {
          set({ loading: false });
        }
      },

      deleteVendor: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await axiosInstance.delete(`/vendors/${id}`);
          set((state) => ({
            vendors: state.vendors.filter((v) => v.id !== id),
          }));
          set({ error: null });
          toast.success('Vendor deleted successfully!');
          return { success: true, message: 'Vendor deleted successfully' };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          set({
            error: err.response?.data?.message || 'Failed to delete vendor!',
          });

          toast.error('Error while deleting vendor!', {
            description: err.response?.data?.message || 'Something went wrong!',
          });

          return { success: false, error: err.response?.data?.message };
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'vendor-storage',
      partialize: (state) => ({ vendor: state.vendor, vendors: state.vendor }),
    }
  )
);

export default useVendorStore;
