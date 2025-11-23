import axios from "axios";
import {
  useQuery,
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  active: boolean;
  dui: string;
  role: "ADMIN" | "USER";
}

const mapUser = (user: any): User => {
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
    role: (user.roles?.[0] as "ADMIN" | "USER") ?? "USER",
  };
};

export const fetchUsers = async (): Promise<User[]> => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/admin/userlist`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = response.data?.data ?? [];
  return data.map(mapUser);
};

export const useUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ["admin", "users"],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/admin/userlist/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("Usuario eliminado correctamente");
    },
    onError: () => {
      toast.error("No se pudo eliminar el usuario");
    },
  });
};

export const useUpdateUserRole = () => {
  const qc = useQueryClient();
  return useMutation<void, Error, { id: string; role: string }>({
    mutationFn: async ({ id, role }) => {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/admin/userlist/changerole/${id}`,
        { roles: [role] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    },
    onMutate: async ({ id, role }) => {
      await qc.cancelQueries({ queryKey: ["admin", "users"] });
      const previous = qc.getQueryData<User[]>(["admin", "users"] as QueryKey);
      qc.setQueryData<User[] | undefined>(
        ["admin", "users"] as QueryKey,
        (old) =>
          old?.map((u) =>
            u.id === id ? { ...u, role: role as User["role"] } : u
          )
      );
      return { previous };
    },
    onError: (_err, _variables, context: unknown) => {
      qc.setQueryData(
        ["admin", "users"] as QueryKey,
        (context as { previous?: User[] } | undefined)?.previous
      );
      toast.error("Error al actualizar el rol");
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
    onSuccess: () => {
      toast.success("Rol actualizado correctamente");
    },
  });
};

export const fetchUserById = async (id: string): Promise<User | null> => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/admin/userlist/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const user = response.data?.data;
  if (!user) return null;
  return mapUser(user);
};

export const useUserById = (id: string | null) => {
  return useQuery({
    queryKey: ["admin", "user", id],
    queryFn: () => (id ? fetchUserById(id) : Promise.resolve(null)),
    enabled: !!id,
  });
};
