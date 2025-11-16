import { useQuery } from "@tanstack/react-query"
import { useTransactionStore } from "../store/useTransactionStore"

export const useTransitions = () => {
  
    const {fetchTransactions} = useTransactionStore();

    const transitionsQuery = useQuery({
        queryKey: ['transitions'],
        queryFn: fetchTransactions,
        staleTime: 1000 * 60 * 5,

    })
  
    return transitionsQuery
}