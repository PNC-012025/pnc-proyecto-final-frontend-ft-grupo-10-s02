import { create } from "zustand";
import type { RegisterInput, LoginInput } from '../schema/user-schema'
import axios from 'axios'


type EasyBankStore = {
    token: string | null;
    isAuthenticated: boolean;
    fetchRegister: (data: RegisterInput) => Promise<void>;
    fetchLogin: (data: LoginInput) => Promise<void>;
};

const API_URL = import.meta.env.VITE_API_URL

export const useEasyBankStore = create<EasyBankStore>((set) => ({
    token: null,
    isAuthenticated: false,

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
            const token = response.data.token;
            set({
                token,
                isAuthenticated: true,
            });

            localStorage.setItem("token", token);

        } catch (error) {
            console.log("Error al inicias sesión", error);
            throw error
        }
    },

    logout: () => {
        set({ token: null, isAuthenticated: false });
        localStorage.removeItem("token");
    },
}))