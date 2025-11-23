import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export interface AdminTransaction {
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

const fetchAdminTransactions = async (): Promise<AdminTransaction[]> => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/admin/transaction`, {
    headers: { Authorization: token ? `Bearer ${token}` : undefined },
  });
  return res.data?.data ?? [];
};

const fetchAdminTransactionById = async (
  id: string
): Promise<AdminTransaction | null> => {
  if (!id) return null;
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/admin/transaction`, {
    headers: { Authorization: token ? `Bearer ${token}` : undefined },
    params: { id },
  });
  return res.data?.data ?? null;
};

export const useAdminFindAll = () => {
  return useQuery<AdminTransaction[], Error>({
    queryKey: ["admin", "transactions"],
    queryFn: fetchAdminTransactions,
    staleTime: 1000 * 60 * 2,
  });
};

export const useAdminFindById = (id: string | null) => {
  return useQuery<AdminTransaction | null, Error>({
    queryKey: ["admin", "transaction", id],
    queryFn: () => (id ? fetchAdminTransactionById(id) : Promise.resolve(null)),
    enabled: !!id,
  });
};
