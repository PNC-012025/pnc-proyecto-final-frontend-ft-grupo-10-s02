// src/store/useAdminStore.ts
import { create } from "zustand";
import axios from "axios";
import {
  UserStatusInput,
  TransactionFiltersInput,
} from "../schema/admin-schema";

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
  dui: string;
}

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  senderAccount: string;
  receiverAccount: string;
  status: "completed" | "pending" | "failed";
}

interface AdminStoreState {
  users: User[];
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  fetchAllUsers: () => Promise<void>;
  fetchAllTransactions: (filters?: TransactionFiltersInput) => Promise<void>;
  updateUserStatus: (data: UserStatusInput) => Promise<void>;
  getUserById: (id: string) => Promise<User | null>;
  deleteUser: (id: string) => Promise<void>;
  changeUserRole: (id: string, roles: string[]) => Promise<void>;
  resetStore: () => void;
  getUserTransactions: (
    userId: string,
    limit?: number,
    page?: number
  ) => Promise<void>;
  getUserAccounts: (userId: string) => Promise<any[] | null>;
}

const API_URL = import.meta.env.VITE_API_URL;

export const useAdminStore = create<AdminStoreState>((set, get) => ({
  users: [],
  transactions: [],
  loading: false,
  error: null,

  // Obtener todos los usuarios
  fetchAllUsers: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/admin/userlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ users: response.data.data, loading: false });
    } catch (error) {
      console.error("Error fetching users:", error);
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Error desconocido",
        loading: false,
      });
    }
  },

  fetchAllTransactions: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/admin/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: filters,
      });
      set({ transactions: response.data.data, loading: false });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Error desconocido",
        loading: false,
      });
    }
  },

  // Actualizar estado de usuario
  updateUserStatus: async ({ id, status }: UserStatusInput) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_URL}/admin/users/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Actualización optimista
      set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? { ...user, isActive: status } : user
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Error updating user status:", error);
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Error al actualizar usuario",
        loading: false,
      });
      // Revertir cambios si falla
      await get().fetchAllUsers();
    }
  },

  getUserById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/admin/userlist/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ loading: false });
      return response.data.data; // Ajusta según la respuesta real
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Error desconocido",
        loading: false,
      });
      return null;
    }
  },

  deleteUser: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/admin/userlist/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Actualiza la lista de usuarios
      await get().fetchAllUsers();
      set({ loading: false });
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Error desconocido",
        loading: false,
      });
    }
  },

  changeUserRole: async (id: string, roles: string[]) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/admin/userlist/changerole/${id}`,
        { roles },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await get().fetchAllUsers();
      set({ loading: false });
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Error desconocido",
        loading: false,
      });
    }
  },

  getUserTransactions: async (userId: string, limit = 10, page = 0) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/admin/userlist/${userId}/transactions`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit, page },
        }
      );
      set({ transactions: response.data.data, loading: false });
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Error desconocido",
        loading: false,
      });
    }
  },

  getUserAccounts: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/admin/userlist/${userId}/accounts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ loading: false });
      return response.data.data; // rdv ixaz
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Error al obtener cuentas",
        loading: false,
      });
      return null;
    }
  },

  // Resetear store
  resetStore: () =>
    set({
      users: [],
      transactions: [],
      error: null,
      loading: false,
    }),
}));
