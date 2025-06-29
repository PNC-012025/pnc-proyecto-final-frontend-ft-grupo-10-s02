import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "react-toastify";
import { CardDetailsSchema, CardDetails } from "../schema/card-schema";
import { useEasyBankStore } from "./userStore";

interface CardStore {
  isCardActive: boolean;
  popupOpen: boolean;
  cardDetails: CardDetails | null;
  setPopupOpen: (open: boolean) => void;
  activateCard: () => Promise<void>;
  fetchCardDetails: () => Promise<void>;
  clearCardDetails: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;


//funcion de limpiar
export const useCardStore = create<CardStore>()(
  persist(
    (set) => ({
      isCardActive: false,
      popupOpen: false,
      cardDetails: null,

      setPopupOpen: (open) => set({ popupOpen: open }),

      clearCardDetails: () => {
        set({ cardDetails: null });
      },

      activateCard: async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("Token no encontrado");

          const response = await axios.post(
            `${API_URL}/card/create`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.status === 201) {
            await useEasyBankStore.getState().fetchWhoami();
            set({ popupOpen: false });
            toast.success("Tarjeta activada con éxito");
          } else {
            toast.error("Algo salió mal al activar la tarjeta");
          }
        } catch (error) {
          toast.error("Algo salió mal al activar la tarjeta");
          set({ popupOpen: false });
          console.error(error);
        }
      },

      fetchCardDetails: async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("Token no encontrado");

          const response = await axios.get(
            `${API_URL}/account/findown`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          console.log(response.data.data);

          const parsed = CardDetailsSchema.parse(response.data.data);
          set({ cardDetails: parsed });
        } catch (error) {
          toast.error("Error al obtener los datos de la cuenta.");
          console.error("Error al obtener datos de la tarjeta!", error);
        }
      },
    }),
    {
      name: "card-store",
    }
  )
);
