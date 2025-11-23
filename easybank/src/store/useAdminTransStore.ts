import { create } from "zustand";
import axios from "axios";
import { Transaction } from "../schema/transaction-schema";

interface AdminTransStoreState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  reset: () => void;
  findById: (id: string) => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL;

export const useAdminTransStore = create<AdminTransStoreState>((set) => ({
  transactions: [],
  loading: false,
  error: null,

  fetchTransactions: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/admin/transaction`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({
        transactions: response.data.data,
        loading: false,
      });
    } catch (error) {
      let errorMessage = "Error al obtener transacciones";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      }

      set({
        error: errorMessage,
        loading: false,
        transactions: [],
      });
    }
  },

  findById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/admin/transaction`, {
        params: { id },
        headers: { Authorization: `Bearer ${token}` },
      });
      set({
        transactions: response.data.data,
        loading: false,
      });
    } catch (error) {
      let errorMessage = "Error al obtener la transacción";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      }
      set({
        error: errorMessage,
        loading: false,
        transactions: [],
      });
    }
  },

  reset: () => set({ transactions: [], error: null, loading: false }),
}));
