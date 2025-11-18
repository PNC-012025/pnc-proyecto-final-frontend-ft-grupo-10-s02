import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export interface DepositInput {
  userId: string;
  accountId: string;
  amount: number;
  description?: string;
}

export const useDeposit = () => {
  const qc = useQueryClient();
  return useMutation<void, Error, DepositInput>({
    mutationFn: async ({ userId, accountId, amount, description }) => {
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
    },
    onSuccess: (_data, variables) => {
      // invalidar cuentas del usuario para forzar refetch si aplica
      qc.invalidateQueries({
        queryKey: ["admin", "user", variables.userId, "accounts"],
      });
      toast.success("Depósito realizado correctamente");
    },
    onError: () => {
      toast.error("Error al realizar el depósito");
    },
  });
};
