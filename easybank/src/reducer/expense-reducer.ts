import type { ExpenseType } from "../types"

export type ExpenseActions =
    { type: 'add-budget', payload: { budget: number } } |
    { type: 'show-modal' } |
    { type: 'close-modal' } |
    { type: 'add-expense', payload: { expense: ExpenseType } } |
    { type: 'remove-expense', payload: { id: ExpenseType['id'] } } |
    { type: 'get-expenseById', payload: { id: ExpenseType['id'] } } |
    { type: 'edit-expense', payload: { expense: ExpenseType } } |
    { type: 'reset-app' }

export type ExpenseState = {
    budget: number
    expenses: ExpenseType[]
    editingId: ExpenseType['id']
    modal: boolean
}

const getExpensesStorage = () => {
    return JSON.parse(localStorage.getItem('expensesItems')!) || [];
}

const getBudgetStorage = () => {
    return JSON.parse(localStorage.getItem('budgetInitial')!) || 0;
}

export const initialState: ExpenseState = {
    budget: getBudgetStorage(),
    expenses: getExpensesStorage(),
    editingId: '',
    modal: false
}

export const expenseReducer = (
    state: ExpenseState = initialState,
    action: ExpenseActions
) => {

    if (action.type === "add-budget") {

        return {
            ...state,
            budget: action.payload.budget
        }
    }

    if (action.type === "add-expense") {

        return {
            ...state,
            expenses: [...state.expenses, action.payload.expense],
            editingId: ''
        }
    }

    if (action.type === "remove-expense") {

        const updateExpenses = state.expenses.filter((item) => {
            return item.id !== action.payload.id;
        })

        return {
            ...state,
            expenses: updateExpenses
        }
    }

    if (action.type === "reset-app") {

        return {
            ...state,
            budget: 0,
            expenses: [],
            editingId: ''
        }
    }

    if (action.type === "get-expenseById") {
        return {
            ...state,
            editingId: action.payload.id
        }
    }

    if (action.type === 'edit-expense') {

        const updateExpenses = state.expenses.map((expenseState) => {
            return expenseState.id === action.payload.expense.id ? action.payload.expense : expenseState;
        })

        return {
            ...state,
            expenses: updateExpenses,
            editingId: ''
        }
    }

    if (action.type === 'show-modal') {
        return {
            ...state,
            modal: true
        }
    }

    if (action.type === 'close-modal') {
        return {
            ...state,
            modal: false
        }
    }

    return state;
}