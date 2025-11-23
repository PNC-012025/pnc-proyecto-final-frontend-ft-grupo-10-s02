import { create } from "zustand";
import axios from "axios";
import { UserStatusInput } from "../schema/admin-schema";
import { AccountResponseAdmin } from "../schema/account-schema";
import { toast } from "react-toastify";

// Tipos para evitar `any` al mapear respuestas del backend
interface ApiResponse<T> {
  data: T;
  message?: string;
}

interface AdminUserApi {
  id: string;
  username?: string;
  email: string;
  name?: string; // nombre completo en el backend
  active?: boolean;
  dui?: string;
  roles?: string[];
}

interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  active: boolean;
  dui: string;
  role: "ADMIN" | "USER";
}

interface AdminStoreState {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchAllUsers: () => Promise<void>;
  updateUserStatus: (data: UserStatusInput) => Promise<void>;
  getUserById: (id: string) => Promise<User | null>;
  deleteUser: (id: string) => Promise<void>;
  resetStore: () => void;
  updateUserRole: (userId: string, role: string) => Promise<void>;
  // Se agregó para reflejar la implementación existente
  getUserAccounts: (userId: string) => Promise<AccountResponseAdmin[] | null>;
}

const API_URL = import.meta.env.VITE_API_URL;

export const useAdminStore = create<AdminStoreState>((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchAllUsers: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<ApiResponse<AdminUserApi[]>>(
        `${API_URL}/admin/userlist?page=1&size=100`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const apiUsers = response.data.data;

      const users: User[] = apiUsers.map((user) => {
        const nameParts = (user.name ?? "Sin nombre").split(" ");
        const first_name = nameParts.slice(0, -1).join(" ") || "Sin nombre";
        const last_name = nameParts.slice(-1)[0] || "";

        // Normalizar role a los valores esperados
        const rawRole = user.roles?.[0] ?? "USER";
        const role: User["role"] = rawRole === "ADMIN" ? "ADMIN" : "USER";

        return {
          id: user.id,
          username: user.username || "",
          email: user.email,
          first_name,
          last_name,
          active: user.active ?? false,
          dui: user.dui || "Sin DUI",
          role,
        };
      });

      set({ users, loading: false });
    } catch (error) {
      console.error(error);
      set({
        loading: false,
        error: axios.isAxiosError(error) ? error.message : String(error),
      });
    }
  },

  // Actualizar estado de usuario
  updateUserStatus: async ({ id, status }: UserStatusInput) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_URL}/admin/users/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Actualización optimista
      set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? { ...user, active: status } : user
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Error updating user status:", error);
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Error al actualizar usuario",
        loading: false,
      });
      // Revertir cambios si falla
      await get().fetchAllUsers();
    }
  },

  getUserById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<ApiResponse<AdminUserApi>>(
        `${API_URL}/admin/userlist/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ loading: false });

      const user = response.data.data;
      const nameParts = (user.name ?? "Sin nombre").split(" ");
      const first_name = nameParts.slice(0, -1).join(" ") || "Sin nombre";
      const last_name = nameParts.slice(-1)[0] || "";

      const rawRole = user.roles?.[0] ?? "USER";
      const role: User["role"] = rawRole === "ADMIN" ? "ADMIN" : "USER";

      return {
        id: user.id,
        username: user.username || "",
        email: user.email,
        first_name,
        last_name,
        active: user.active ?? false,
        dui: user.dui || "Sin DUI",
        role,
      } as User;
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Error desconocido",
        loading: false,
      });
      return null;
    }
  },

  deleteUser: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/admin/userlist/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Actualiza la lista de usuarios
      await get().fetchAllUsers();
      set({ loading: false });
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Error desconocido",
        loading: false,
      });
    }
  },

  getUserAccounts: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<ApiResponse<AccountResponseAdmin[]>>(
        `${API_URL}/admin/userlist/${userId}/account`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ loading: false });
      return response.data.data;
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Error al obtener cuentas",
        loading: false,
      });
      return null;
    }
  },

  updateUserRole: async (userId: string, role: string) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/admin/userlist/changerole/${userId}`,
        { roles: [role] }, // Enviar como array
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Actualización optimista
      set((state) => ({
        users: state.users.map((user) =>
          user.id === userId
            ? {
                ...user,
                role: role === "ADMIN" ? "ADMIN" : "USER",
              }
            : user
        ),
        loading: false,
      }));
      toast.success("Rol actualizado correctamente");
    } catch (error) {
      console.error("Error updating user role:", error);
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Error al actualizar rol",
        loading: false,
      });
      toast.error("Error al actualizar el rol");
    }
  },

  // Resetear store
  resetStore: () =>
    set({
      users: [],
      error: null,
      loading: false,
    }),
}));
