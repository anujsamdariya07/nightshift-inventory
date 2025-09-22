import { axiosInstance } from '@/lib/axios';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UpdateHistory {
  vendorName: string;
  quantityUpdated: number;
  cost: number;
  updateType: 'replenishment' | 'order';
  date: Date;
}

export interface Item {
  id: string;
  orgId: string;
  name: string;
  itemId: string,
  quantity: number;
  threshold: number;
  lastDateOfUpdate: Date;
  image: string;
  updateHistory: UpdateHistory[];
}

interface ItemState {
  items: Item[];
  item: Item | null;
  loading: boolean;
  error: string | null;

  fetchItems: () => Promise<{
    success: boolean;
    items?: Item[];
    error?: string;
  }>;
  fetchItemById: (
    id: string
  ) => Promise<{ success: boolean; item?: Item; error?: string }>;
  createItem: (itemData: ItemCreateData) => Promise<{
    success: boolean;
    item?: Item;
    message?: string;
    error?: string;
  }>;
  updateItem: (
    itemData: ItemUpdateData,
    id: string
  ) => Promise<{
    success: boolean;
    item?: Item;
    message?: string;
    error?: string;
  }>;
  deleteItem: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateItemQuantity: (
    id: string,
    quantityChange: number,
    vendorName: string,
    cost: number,
    updateType: 'replenishment' | 'order'
  ) => Promise<{ success: boolean; item?: Item; error?: string }>;
  logout: () => Promise<void>;
}

interface ItemCreateData {
  name: string;
  quantity: number;
  threshold: number;
  image?: string;
}

interface ItemUpdateData {
  name: string;
  quantity: number;
  threshold: number;
  image?: string;
  updateHistory: UpdateHistory[];
}

const useItemStore = create<ItemState>()(
  persist(
    (set, get) => ({
      items: [],
      item: null,
      loading: false,
      error: null,

      fetchItems: async () => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.get('/items');
          set({ items: response.data, error: null });
          return { success: true, items: response.data };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          set({
            error: err.response?.data.message || 'Failed to fetch items!',
          });

          toast.error('Error while fetching items!', {
            description: err.response?.data.message || 'Something went wrong!',
          });

          return { success: false, error: err.response?.data.message };
        } finally {
          set({ loading: false });
        }
      },

      fetchItemById: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.get(`/items/${id}`);
          set({ item: response.data, error: null });
          return { success: true, item: response.data };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          set({
            error:
              err.response?.data.message || 'Failed to fetch the item by ID!',
          });
          toast.error('Error while fetching the item by ID!', {
            description: err.response?.data.message || 'Something went wrong!',
          });
          return { success: false, error: err.response?.data.message };
        } finally {
          set({ loading: false });
        }
      },

      createItem: async (itemData: ItemCreateData) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.post('/items', itemData);
          const item = response.data;
          set((state) => ({
            items: [item, ...state.items],
          }));
          set({ error: null });
          return {
            success: true,
            item: item,
            message: 'Item created successfully!',
          };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          set({
            error: err.response?.data.message || 'Failed to create item!',
          });
          toast.error('Error while creating item!', {
            description: err.response?.data.message || 'Something went wrong!',
          });
          return { success: false, error: err.response?.data.message };
        } finally {
          set({ loading: false });
        }
      },

      updateItem: async (itemData: ItemUpdateData, id: string) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.put(`/items/${id}`, itemData);
          const item = response.data;
          set((state) => ({
            item: state.item?.id === id ? item : state.item,
            items: state.items.map((i) => (i.id === id ? item : i)),
          }));
          set({ error: null });
          return {
            success: true,
            message: 'Item updated successfully!',
            item: item,
          };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          set({
            error: err.response?.data.message || 'Failed to update item!',
          });
          toast.error('Error while updating item!', {
            description: err.response?.data.message || 'Something went wrong!',
          });
          return { success: false, error: err.response?.data.message };
        } finally {
          set({ loading: false });
        }
      },

      deleteItem: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await axiosInstance.delete(`/items/${id}`);
          set((state) => ({
            items: state.items.filter((i) => i.id !== id),
          }));
          set({ error: null });
          toast.success('Item deleted successfully!');
          return { success: true };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          set({
            error: err.response?.data.message || 'Failed to delete item!',
          });
          toast.error('Error while deleting item!', {
            description: err.response?.data.message || 'Something went wrong!',
          });
          return { success: false, error: err.response?.data.message };
        } finally {
          set({ loading: false });
        }
      },

      updateItemQuantity: async (
        id: string,
        quantityChange: number,
        vendorName: string,
        cost: number,
        updateType: 'replenishment' | 'order'
      ) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.patch(`/items/${id}/quantity`, {
            quantityChange,
            vendorName,
            cost,
            updateType,
          });
          const item = response.data;
          set((state) => ({
            item: state.item?.id === id ? item : state.item,
            items: state.items.map((i) => (i.id === id ? item : i)),
          }));
          set({ error: null });
          toast.success(
            `Item quantity ${
              updateType === 'replenishment' ? 'replenished' : 'ordered'
            } successfully!`
          );
          return { success: true, item: item };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          set({
            error:
              err.response?.data.message || 'Failed to update item quantity!',
          });
          toast.error('Error while updating item quantity!', {
            description: err.response?.data.message || 'Something went wrong!',
          });
          return { success: false, error: err.response?.data.message };
        } finally {
          set({ loading: false });
        }
      },

      logout: async () => {
        set({ items: [], item: null });
      },
    }),
    {
      name: 'item-storage',
      partialize: (state) => ({
        item: state.item,
        items: state.items,
      }),
    }
  )
);

export default useItemStore;
