import { create } from 'zustand';
import axios from 'axios';
import { ExpenseType } from '../types';
import { useEasyBankStore } from './userStore';

const API_BASE = import.meta.env.VITE_API_URL;
type ExpenseStore = {
    expenses: ExpenseType[];

    fetchExpenses: () => Promise<void>;
    addExpense: (expense: Omit<ExpenseType, "id">) => Promise<void>;
    deleteExpense: (id: string) => Promise<void>;
    updateExpense: (id: string, expense: Omit<ExpenseType, "id">) => Promise<void>;
    payExpense: (id: string) => Promise<void>;
};

const {fetchWhoami} = useEasyBankStore.getState()

export const useExpenseStore = create<ExpenseStore>((set) => ({
    expenses: [],

    fetchExpenses: async () => {
        const token = localStorage.getItem("token");

        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };

        try {
            const res = await axios.get(`${API_BASE}/bill/findown`, config);

            set({ expenses: res.data.data });
        } catch (error) {
            console.error(error);
        }
    },

    addExpense: async (expense) => {
        const token = localStorage.getItem("token");

        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };

        try {
            await axios.post(`${API_BASE}/bill/create`, expense, config);
            await useExpenseStore.getState().fetchExpenses();
        } catch (error) {
            console.error(error);
        }
    },

    deleteExpense: async (id) => {
        const token = localStorage.getItem("token");

        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };

        try {
            await axios.delete(`${API_BASE}/bill/delete/${id}`, config);
            console.log('Borrando');
            await fetchWhoami()

            set((state) => ({
                expenses: state.expenses.filter((item) => item.id !== id),
            }));
        } catch (error) {
            console.error(error);
        }
    },

    updateExpense: async (id, expense) => {
        try {
            const token = localStorage.getItem("token");

            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            const res = await axios.patch(
                `${API_BASE}/${id}`,
                expense,
                config
            );
            set((state) => ({
                expenses: state.expenses.map((item) =>
                    item.id === id ? res.data : item
                ),
            }));
        } catch (error) {
            console.error(error);
        }
    },

    payExpense: async (id) => {
        const token = localStorage.getItem("token");

        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        try {
            await axios.patch(`${API_BASE}/bill/pay/${id}`, {}, config);

            await fetchWhoami()
            await useExpenseStore.getState().deleteExpense(id);
        } catch (error) {
            console.error(error);
        }
    },
}))
