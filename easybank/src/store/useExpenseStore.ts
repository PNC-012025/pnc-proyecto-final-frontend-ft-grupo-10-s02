import { create } from 'zustand';
import axios from 'axios';
import { ExpenseType } from '../types';
import { useEasyBankStore } from './userStore';
import { useCardStore } from './useCardStore';

const API_BASE = import.meta.env.VITE_API_URL;

type ExpenseStore = {
    expenses: ExpenseType[];
    fetchExpenses: () => Promise<ExpenseType[]>;
    addExpense: (expense: Omit<ExpenseType, "id">) => Promise<void>;
    deleteExpense: (id: string) => Promise<void>;
    updateExpense: (id: string, expense: Omit<ExpenseType, "id">) => Promise<void>;
    payExpense: (id: string) => Promise<void>;
};

const { fetchWhoami } = useEasyBankStore.getState();

export const useExpenseStore = create<ExpenseStore>((set) => ({
    expenses: [],

    fetchExpenses: async () => {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const res = await axios.get(`${API_BASE}/bill/find?page=0&size=100`, config);

        const filtered = Array.isArray(res.data.data)
            ? res.data.data.filter((e: ExpenseType | null) => e !== null)
            : [];

        set({ expenses: filtered });
        return filtered;
    },

    addExpense: async (expense) => {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const res = await axios.post(`${API_BASE}/bill/create`, expense, config);

        const created = res.data.data;

        set((state) => ({
            expenses: [...state.expenses, created]
        }));

        return created;
    },

    deleteExpense: async (id) => {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        await axios.delete(`${API_BASE}/bill/delete/${id}`, config);
        await fetchWhoami();

        set((state) => ({
            expenses: state.expenses.filter((item) => item.id !== id),
        }));
    },

    updateExpense: async (id, expense) => {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const res = await axios.patch(`${API_BASE}/${id}`, expense, config);

        set((state) => ({
            expenses: state.expenses.map((item) =>
                item.id === id ? res.data : item
            ),
        }));
    },

    payExpense: async (id) => {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        await axios.patch(`${API_BASE}/bill/pay/${id}`, {}, config);

        await useExpenseStore.getState().fetchExpenses();
        await useCardStore.getState().fetchCardDetails();
    },
}));
