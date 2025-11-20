import { create } from "zustand";
import axios from "axios";
import { DepositInput } from "../schema/deposit-schema";

interface DepositStoreState {
  loading: boolean;
  error: string | null;
  success: boolean;
  deposit: (input: DepositInput) => Promise<void>;
  reset: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;

export const useDepositStore = create<DepositStoreState>((set) => ({
  loading: false,
  error: null,
  success: false,

  deposit: async ({ userId, accountId, amount, description }) => {
    set({ loading: true, error: null, success: false });
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/admin/userlist/${userId}/deposit`,
        { accountId, amount, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      set({ loading: false, success: true });
    } catch (error: unknown) {
      let message = "Error al depositar";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message ?? error.message ?? message;
      } else if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === "string") {
        message = error;
      }
      set({
        loading: false,
        error: message,
        success: false,
      });
    }
  },

  reset: () => set({ loading: false, error: null, success: false }),
}));
