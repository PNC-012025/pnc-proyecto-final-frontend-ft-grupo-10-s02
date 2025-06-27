import { create } from "zustand";
import axios from "axios";
import { UserStatusInput } from "../schema/admin-schema";
import { toast } from "react-toastify";

interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  active: boolean;
  dui: string;
  role: "ROLE_ADMIN" | "ROLE_USER";
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
}

const API_URL = import.meta.env.VITE_API_URL;

export const useAdminStore = create<AdminStoreState>((set, get) => ({
  users: [],
  transactions: [],
  loading: false,
  error: null,

  fetchAllUsers: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/admin/userlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const users = (response.data.data as any[]).map((user) => {
        const nameParts = (user.name ?? "Sin nombre").split(" ");
        const first_name = nameParts.slice(0, -1).join(" ") || "Sin nombre";
        const last_name = nameParts.slice(-1)[0] || "";

        return {
          id: user.id,
          username: user.username || "",
          email: user.email,
          first_name,
          last_name,
          active: user.active ?? false,
          dui: user.dui || "Sin DUI",
          role: user.roles?.[0] ?? "USER",
        };
      });

      set({ users, loading: false });
    } catch (error) {
      console.log(error);
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
          user.id === id ? { ...user, isActive: status } : user
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
      const response = await axios.get(`${API_URL}/admin/userlist/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ loading: false });

      const user = response.data.data;
      const nameParts = (user.name ?? "Sin nombre").split(" ");
      const first_name = nameParts.slice(0, -1).join(" ") || "Sin nombre";
      const last_name = nameParts.slice(-1)[0] || "";

      return {
        id: user.id,
        username: user.username || "",
        email: user.email,
        first_name,
        last_name,
        active: user.active ?? false,
        dui: user.dui || "Sin DUI",
        role: user.roles?.[0] ?? "USER",
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
      const response = await axios.get(
        `${API_URL}/admin/userlist/${userId}/accounts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ loading: false });
      return response.data.data; // rdv ixaz
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
            ? { ...user, role: role as "ROLE_ADMIN" | "ROLE_USER" }
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
