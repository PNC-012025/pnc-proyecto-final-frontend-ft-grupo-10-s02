import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useExpenseStore } from "../store/useExpenseStore";

export const useExpensivesQuery = () => {
    const { fetchExpenses } = useExpenseStore();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['expensive'],
        queryFn: fetchExpenses,
        staleTime: 1000 * 60 * 5,
        retry: false
    });

    return { ...query, queryClient };
};
