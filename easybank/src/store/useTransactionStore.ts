import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import { useCardStore } from "./useCardStore";

type FormData = {
  firstName: string;
  lastName: string;
  accountNumber: string;
  amount: number;
  description: string;
};

interface Transaction {
  id: string;
  amount: number;
  description: string | null;
  accountNumber: string;
  date: string;
  type: "SENDER" | "RECEIVER";
  name: string;
}

interface TransactionState {
  popupOpen: boolean;
  setPopupOpen: (open: boolean) => void;
  sendTransaction: (data: FormData, onSuccess?: () => void) => Promise<void>;
  transactions: Transaction[];
  fetchTransactions: () => Promise<void>;
  getSentTransactions: () => Transaction[];
  getReceivedTransactions: () => Transaction[];
}

const API_BASE = import.meta.env.VITE_API_URL;

const { fetchCardDetails } = useCardStore.getState();

export const useTransactionStore = create<TransactionState>((set, get) => ({
  popupOpen: false,
  setPopupOpen: (open) => set({ popupOpen: open }),
  transactions: [],

  sendTransaction: async (data, onSuccess) => {
    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const processedData = {
        ...data,
        firstName: data.firstName.toLowerCase(),
        lastName: data.lastName.toLowerCase(),
      };

      await axios.post(`${API_BASE}/transaction/create`, processedData, config);
      toast.success("Transacción enviada con éxito");
      onSuccess?.();
      await fetchCardDetails();
      await useTransactionStore.getState().fetchTransactions();
    } catch (error) {
      toast.error("Error al enviar la transacción");
      console.log(error);
    }
  },

  fetchTransactions: async () => {
    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const res = await axios.get(`${API_BASE}/transaction/findown`, config);

      if (res.data?.data) {
        set({ transactions: res.data.data });
      } else {
        set({ transactions: [] });
      }
    } catch (error) {
      toast.error("Error al cargar las transacciones");
      console.log(error);
      set({ transactions: [] });
    }
  },
  getSentTransactions: () => {
    return get().transactions.filter((tx) => tx.type === "SENDER");
  },

  getReceivedTransactions: () => {
    return get().transactions.filter((tx) => tx.type === "RECEIVER");
  },
}));
