import { create } from "zustand";
import type { RegisterInput, LoginInput } from '../schema/user-schema'
import axios from 'axios'
import { useCardStore } from "./useCardStore";

type EasyBankStore = {
    token: string | null;
    isAuthenticated: boolean;
    isCardActive: boolean;
    fetchRegister: (data: RegisterInput) => Promise<void>;
    fetchLogin: (data: LoginInput) => Promise<void>;
    fetchWhoami: () => Promise<void>;
    logout: () => void;
};

const API_URL = import.meta.env.VITE_API_URL

export const useEasyBankStore = create<EasyBankStore>((set, get) => ({
    token: null,
    isAuthenticated: false,
    isCardActive: false,

    fetchRegister: async (data) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, data);
            console.log("Usuario registrado:", response.data);
        } catch (error) {
            console.log("Error en la registrar al usuario", error);
            throw error;
        }
    },

    fetchLogin: async (data) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, data);
            console.log("Inicio de sesión exitoso.", response.data);
            const token = response.data.data.token;

            localStorage.setItem("token", token);

            set({
                token,
                isAuthenticated: true,
            });

            await get().fetchWhoami();

        } catch (error) {
            console.log("Error al iniciar sesión", error);
            throw error
        }
    },

    fetchWhoami: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token no encontrado');

            const response = await axios.get(`${API_URL}/auth/whoami`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const active = response.data.data.active;
            console.log(response.data.data);


            set({ isCardActive: active });

        } catch (error) {
            console.error("Error al consultar whoami", error);
            set({ isCardActive: false });
        }
    },

    logout: () => {
        set({ token: null, isAuthenticated: false, isCardActive: false });
        localStorage.removeItem("token");
        useCardStore.getState().clearCardDetails();
    }
}));
