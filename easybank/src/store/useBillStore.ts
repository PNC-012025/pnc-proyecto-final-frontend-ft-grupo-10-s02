import { create } from "zustand";
import axios from "axios";

export interface Bill {
  id: string;
  expenseName: string | null;
  category: string;
  amount: number;
  date: string;
  state: string;
}

interface BillStoreState {
  bills: Bill[];
  loading: boolean;
  error: string | null;
  fetchUserBills: (userId: string) => Promise<void>;
  reset: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;

export const useBillStore = create<BillStoreState>((set) => ({
  bills: [],
  loading: false,
  error: null,

  fetchUserBills: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/admin/userlist/${userId}/bills`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ bills: response.data.data, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error al obtener facturas",
        loading: false,
        bills: [],
      });
    }
  },

  reset: () => set({ bills: [], error: null, loading: false }),
}));
