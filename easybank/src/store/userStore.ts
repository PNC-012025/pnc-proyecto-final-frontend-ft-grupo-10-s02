import { create } from "zustand";
import type { RegisterInput, LoginInput } from "../schema/user-schema";
import axios from "axios";
import { toast } from "react-toastify";

type UserRole = "ROLE_USER" | "ROLE_ADMIN";

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
      toast.success("Usuario registrado correctamente");
      console.log("Usuario registrado:", response.data);
    } catch (error: any) {
      let errorMessage = "Error al registrar al usuario";

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.data.message) {
          errorMessage = error.response.data.data.message;
        } else if (error.response?.data?.data.error) {
          errorMessage = error.response.data.data.error;
        } else if (error.response?.data?.data.errors) {
          errorMessage = Object.values(error.response.data.data.errors).join(" | ");
        }
      }

      toast.error(errorMessage);
      console.error("Error al registrar usuario:", error);
      throw error;
    }
  },

  fetchLogin: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, data);
      toast.success("Inicio de sesión exitoso");
      console.log("Inicio de sesión exitoso.", response.data);

      const token = response.data.data.token;
      localStorage.setItem("token", token);

      set({
        token,
        isAuthenticated: true,
      });

      await get().fetchWhoami();
    } catch (error: any) {
      let errorMessage = "Error al iniciar sesión";

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.data.message) {
          errorMessage = error.response.data.data.message;
        } else if (error.response?.data?.data.error) {
          errorMessage = error.response.data.data.error;
        } else if (error.response?.data?.data.errors) {
          errorMessage = Object.values(error.response.data.data.errors).join(" | ");
        }
      }

      toast.error(errorMessage);
      console.error("Error al iniciar sesión:", error);
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
    return get().userRoles.includes("ROLE_ADMIN");
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
