import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export interface TransactionItem {
  transactionId: string;
  amount: number | string;
  date?: string;
  originAccount: {
    accountNumber: string;
    accountOwner: string;
  };
  destinationAccount: {
    accountNumber: string;
    accountOwner: string;
  };
}

export const fetchTransactions = async (): Promise<TransactionItem[]> => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/admin/transactions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data?.data ?? [];
};

export const fetchTransactionById = async (
  id: string
): Promise<TransactionItem | null> => {
  if (!id) return null;
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/admin/transactions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data?.data ?? null;
};

export const useTransactions = () => {
  return useQuery<TransactionItem[], Error>({
    queryKey: ["admin", "transactions"],
    queryFn: fetchTransactions,
    staleTime: 1000 * 60 * 2,
  });
};

export const useTransactionById = (id: string | null) => {
  return useQuery<TransactionItem | null, Error>({
    queryKey: ["admin", "transaction", id],
    queryFn: () => (id ? fetchTransactionById(id) : Promise.resolve(null)),
    enabled: !!id,
  });
};
