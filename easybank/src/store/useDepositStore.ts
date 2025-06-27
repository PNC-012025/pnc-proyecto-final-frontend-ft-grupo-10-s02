import { create } from "zustand";
import axios from "axios";
import { DepositInput } from "../schema/deposit-schema";

interface DepositStoreState {
  loading: boolean;
  error: string | null;
  success: boolean;
  depositToAccount: (userId: string, data: DepositInput) => Promise<void>;
  reset: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;

export const useDepositStore = create<DepositStoreState>((set) => ({
  loading: false,
  error: null,
  success: false,

  depositToAccount: async (userId, data) => {
    set({ loading: true, error: null, success: false });
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/admin/userlist/${userId}/deposit`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ loading: false, success: true });
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Error al realizar el depósito",
        loading: false,
        success: false,
      });
    }
  },

  reset: () => set({ loading: false, error: null, success: false }),
}));
