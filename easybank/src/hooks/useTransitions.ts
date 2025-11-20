import { useQuery } from "@tanstack/react-query";
import { useTransactionStore } from "../store/useTransactionStore";
import { useEasyBankStore } from "../store/userStore";

export const useTransitions = () => {
  const { fetchTransactions } = useTransactionStore();
  const token = useEasyBankStore((s) => s.token);

  const transitionsQuery = useQuery({
    queryKey: ["transitions"],
    queryFn: fetchTransactions,
    staleTime: 1000 * 60 * 5,
    enabled: !!token, // only run when token is available
    retry: false,
  });

  return transitionsQuery;
};
