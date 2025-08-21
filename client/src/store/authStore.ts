import { create } from 'zustand';

interface AuthUser {
  id: string;
  email: string;
  orgName?: string;
}

interface AuthState {
  authUser: AuthUser | null;
  setAuthUser: (user: AuthUser | null) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  setAuthUser: (user) => set({ authUser: user }),
}));

export default useAuthStore;
