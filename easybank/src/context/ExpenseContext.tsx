import { createContext, Dispatch, ReactNode, useMemo, useReducer } from "react";
import { ExpenseActions, expenseReducer, ExpenseState, initialState } from "../reducer/expense-reducer";

type ExpenseContextProps = {
    state: ExpenseState,
    dispatch: Dispatch<ExpenseActions>

    budgetMoney: number
    expensetMoney: number
    spentTotalMoney: number
}

export const ExpenseContext = createContext<ExpenseContextProps>(null!);

type ExpenseProviderProps = {
    children: ReactNode
}

export const ExpenseProvider = ({children} : ExpenseProviderProps)=> {

    const[state, dispatch] = useReducer(expenseReducer, initialState);

    const budgetMoney = state.budget;
    const expensetMoney = useMemo(()=> {
        return state.expenses.reduce((total, item) => total + item.amount, 0);
    },[state.expenses]) 

    const spentTotalMoney = budgetMoney - expensetMoney;

    return (
        <ExpenseContext.Provider
            value={{
                state,
                dispatch,
                
                budgetMoney,
                expensetMoney,
                spentTotalMoney
            }}
        >
            {children}
        </ExpenseContext.Provider>
    )
}