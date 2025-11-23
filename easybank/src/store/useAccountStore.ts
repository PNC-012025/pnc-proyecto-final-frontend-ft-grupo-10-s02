import { create } from "zustand";
import axios from "axios";
import { AccountResponseAdmin } from "../schema/account-schema";

interface AccountStoreState {
  accounts: AccountResponseAdmin[];
  loading: boolean;
  error: string | null;
  fetchUserAccounts: (userId: string) => Promise<void>;
  reset: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;

export const useAccountStore = create<AccountStoreState>((set) => ({
  accounts: [],
  loading: false,
  error: null,

  fetchUserAccounts: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/admin/userlist/${userId}/account`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ accounts: response.data.data, loading: false });
    } catch (error: unknown) {
      let message = "Error al obtener cuentas";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message || message;
      }
      set({
        error: message,
        loading: false,
        accounts: [],
      });
    }
  },

  reset: () => set({ accounts: [], error: null, loading: false }),
}));
