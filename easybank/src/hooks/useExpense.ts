import { useContext } from "react"
import { ExpenseContext } from "../context/ExpenseContext"

export const useExpense = ()=> {
    const context = useContext(ExpenseContext);
    return context;
}