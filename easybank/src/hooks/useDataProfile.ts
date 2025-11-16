import { useQuery } from "@tanstack/react-query"
import { useCardStore } from "../store/useCardStore"

export const useDataProfile = () => {
    
    const {fetchCardDetails} = useCardStore();

    const queryDataClient = useQuery({
        queryKey: ['dataClient'],
        queryFn: fetchCardDetails,
        staleTime: 1000 * 60* 5
    })
    
    return queryDataClient
}