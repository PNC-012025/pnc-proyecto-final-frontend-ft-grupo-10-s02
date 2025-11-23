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

export interface Transaction {
  id: string;
  amount: number;
  description: string | null;
  accountNumber: string;
  date: string;
  type: string;
  name: string;
}

interface TransactionState {
  popupOpen: boolean;
  setPopupOpen: (open: boolean) => void;
  sendTransaction: (data: FormData, onSuccess?: () => void) => Promise<void>;
  transactions: Transaction[];
  fetchTransactions: () => Promise<Transaction[]>;
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
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.data.message ||
          error.response?.data?.data.error ||
          error.response?.data.data ||
          "Error desconocido en el servidor";

        toast.error(`Error al enviar la transacción: ${message}`);
        console.error("Error detalle:", error.response?.data);
      } else {
        toast.error("Error inesperado. Por favor, intenta de nuevo.");
        console.error("Error desconocido:", error);
      }
    }
  },


  fetchTransactions: async (): Promise<Transaction[]> => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.get(`${API_BASE}/transaction/find?page=0&size=100`, config);

      const list = res.data?.data || [];

      set({ transactions: list });
      return list;


    } catch (error) {
      set({ transactions: [] });
      console.log(error);
      return [];
    }
  },

  getSentTransactions: () => {
    return get().transactions.filter((tx) => tx.type === "SENDER");
  },

  getReceivedTransactions: () => {
    return get().transactions.filter((tx) => tx.type === "RECEIVER");
  },
}));
