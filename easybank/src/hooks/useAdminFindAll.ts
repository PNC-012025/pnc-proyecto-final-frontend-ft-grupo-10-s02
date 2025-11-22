import axios from "axios";
import { useQuery } from "@tanstack/react-query";

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

const ADMIN_FINDALL_URL = "http://localhost:8080/api/admin/findall";

const fetchAdminFindAll = async (): Promise<AdminTransaction[]> => {
  const token = localStorage.getItem("token");
  const res = await axios.get(ADMIN_FINDALL_URL, {
    headers: { Authorization: token ? `Bearer ${token}` : undefined },
  });
  return res.data?.data ?? [];
};

export const useAdminFindAll = () => {
  return useQuery<AdminTransaction[], Error>({
    queryKey: ["admin", "findall"],
    queryFn: fetchAdminFindAll,
    staleTime: 1000 * 60 * 2,
  });
};
