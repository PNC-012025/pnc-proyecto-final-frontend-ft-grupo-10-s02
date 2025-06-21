import { create } from "zustand";
import type { RegisterInput, LoginInput } from "../schema/user-schema";
import axios from "axios";

type UserRole = "USER" | "ADMIN";

type EasyBankStore = {
  token: string | null;
  isAuthenticated: boolean;
  isCardActive: boolean;
  userRoles: UserRole[];
  fetchRegister: (data: RegisterInput) => Promise<void>;
  fetchLogin: (data: LoginInput) => Promise<void>;
  fetchWhoami: () => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
};

const API_URL = import.meta.env.VITE_API_URL;

const savedToken = localStorage.getItem("token");

export const useEasyBankStore = create<EasyBankStore>((set, get) => ({
  token: savedToken,
  isAuthenticated: !!savedToken,
  isCardActive: false,
  userRoles: [],

  fetchRegister: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, data);
      console.log("Usuario registrado:", response.data);
    } catch (error) {
      console.log("Error al registrar al usuario", error);
      throw error;
    }
  },

  // Quitamos el parámetro navigate
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
      throw error;
    }
  },

  fetchWhoami: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado");

      const response = await axios.get(`${API_URL}/auth/whoami`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { active, roles } = response.data.data;

      set({
        isCardActive: active,
        userRoles: roles,
      });
    } catch (error) {
      console.error("Error al consultar whoami", error);
      set({
        isCardActive: false,
        userRoles: [],
      });
    }
  },

  isAdmin: () => {
    return get().userRoles.includes("ADMIN");
  },

  logout: () => {
    set({
      token: null,
      isAuthenticated: false,
      isCardActive: false,
      userRoles: [],
    });
    localStorage.removeItem("token");
  },
}));
