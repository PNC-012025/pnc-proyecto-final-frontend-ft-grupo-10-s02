import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AccountResponseAdmin } from "../schema/account-schema";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchUserAccounts = async (
  userId: string
): Promise<AccountResponseAdmin[]> => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/admin/userlist/${userId}/account`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data?.data ?? [];
};

export const useUserAccounts = (userId: string | null, enabled = false) => {
  return useQuery<AccountResponseAdmin[], Error>({
    queryKey: ["admin", "user", userId, "accounts"],
    queryFn: () => (userId ? fetchUserAccounts(userId) : Promise.resolve([])),
    enabled: !!userId && enabled,
    staleTime: 1000 * 60,
  });
};

export const useRefreshUserAccounts = () => {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (userId: string) => {
      // no-op mutation used to trigger invalidation from outside
    },
    onSuccess: (_data, userId) => {
      qc.invalidateQueries({ queryKey: ["admin", "user", userId, "accounts"] });
    },
  });
};
