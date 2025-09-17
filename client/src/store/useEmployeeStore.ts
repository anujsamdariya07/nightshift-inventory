import { axiosInstance } from '@/lib/axios';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PerformanceReview {
  id: string;
  employee: Employee;
  reviewer: Employee;
  rating: number; // 1 to 5 rating
  comments: string;
  reviewDate: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  orgId: string;
  employeeId: string;
  name: string;
  email: string;
  password: string;
  mustChangePassword: boolean;
  role: 'ADMIN' | 'WORKER' | 'MANAGER';
  department: string;
  phone: string;
  location: string;
  performance: PerformanceReview[];
  experience: number;
  salary: number;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  attendance: number;
  hireDate: string;
  yearsOfService: number;
  manager: Employee | null;
  skills: string[];
  messages: Message[];
}

export interface EmployeeCreateData {
  name: string;
  email: string;
  department?: string;
  phone?: string;
  location?: string;
  experience?: number;
  salary?: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  mustChangePassword?: boolean;
  skills?: string[];
}

export interface EmployeeUpdateData extends Partial<EmployeeCreateData> {
  id?: string;
}

export interface EmployeeState {
  employees: Employee[];
  employee: Employee | null;
  loading: boolean;
  error: string | null;
}

const useEmployeeStore = create<EmployeeState>()(
  persist(
    (set) => ({
      employees: [],
      employee: null,
      loading: false,
      error: null,

      fetchEmployees: async () => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.get<Employee[]>('/employees');
          set({ employees: response.data, error: null });
          return {
            success: true,
            data: response.data,
            message: 'Employees Fetched Successfully!',
          };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          const msg = err.response?.data.message;
          set({ error: msg || 'Failed to fetch employees!' });
          toast.error('Error while fetching employees!', {
            description: msg,
          });
          return { success: false, error: msg };
        } finally {
          set({ loading: false });
        }
      },

      fetchEmployeeById: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.get<Employee>(
            `/employees/${id}`
          );
          set({ employee: response.data, error: null });
          return {
            success: true,
            data: response.data,
            message: 'Employee Fetched Successfully!',
          };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          const msg =
            err.response?.data.message ||
            'Failed to fetch the employee with the given ID!';
          set({ error: msg });
          toast.error('Error while fetching employee with the given ID!', {
            description: msg,
          });
          return { success: false, error: msg };
        } finally {
          set({ loading: false });
        }
      },

      createEmployee: async (employeeData: EmployeeCreateData) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.post<Employee>(
            '/employees',
            employeeData
          );
          const employee = response.data;
          set((state) => ({
            employees: [...state.employees, employee],
          }));
          set({ error: null });
          return {
            success: true,
            data: employee,
            message: 'Employee created successfully!',
          };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          const msg =
            err.response?.data.message || 'Failed to create the employee!';
          set({ error: msg });
          toast.error('Error while creating employee!', {
            description: msg,
          });
          return { success: false, error: msg };
        } finally {
          set({ loading: false });
        }
      },

      updateEmployee: async (id: string, employeeData: EmployeeUpdateData) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.put<Employee>(
            `/employees/${id}`,
            employeeData
          );
          const employee = response.data;
          set((state) => ({
            employee: state.employee?.id === id ? employee : state.employee,
            employees: state.employees.map((e) => (e.id === id ? employee : e)),
          }));
          set({ error: null });
          toast.success('Employee Updated Successfully!');
          return {
            success: true,
            data: employee,
            message: 'Employee Updated Successfully!',
          };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          const msg =
            err.response?.data.message || 'Failed to update the employee!';
          set({ error: msg });
          toast.error('Error while updating the employee!', {
            description: msg,
          });
          return { success: false, error: msg };
        } finally {
          set({ loading: false });
        }
      },

      deleteEmployee: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await axiosInstance.delete(`/employees/${id}`);
          set((state) => ({
            employees: state.employees.filter((e) => e.id !== id),
          }));
          set({ error: null });
          toast.success('Employee Deleted Successfully!');
          return {
            success: true,
            data: null,
            message: 'Employee Deleted Successfully!',
          };
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          const msg =
            err.response?.data.message || 'Failed to delete employee!';
          toast.error('Error while deleting employee!', {
            description: msg,
          });
          set({ error: msg });
          return { success: false, error: msg };
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'employee-storage',
    }
  )
);

export default useEmployeeStore;
