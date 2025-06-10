import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CardDetailsSchema, CardDetails } from '../schema/card-schema';

interface CardStore {
    isCardActive: boolean;
    popupOpen: boolean;
    cardDetails: CardDetails | null;
    setPopupOpen: (open: boolean) => void;
    activateCard: () => Promise<void>;
    fetchCardDetails: () => Promise<void>;
}

export const useCardStore = create<CardStore>((set) => ({
    isCardActive: false,
    popupOpen: false,
    cardDetails: null,

    setPopupOpen: (open) => set({ popupOpen: open }),

    activateCard: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token no encontrado');

            const response = await axios.post('activar',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                set({ isCardActive: true, popupOpen: false });
                toast.success('Tarjeta activada con éxito');

                await useCardStore.getState().fetchCardDetails();

            } else {
                toast.error('Algo salió mal al activar la tarjeta');
            }
        } catch (error: any) {
            toast.error('Algo salió mal al activar la tarjeta');
            set({ isCardActive: false, popupOpen: false });
            console.error('Error al activar tarjeta:', error);
        }
    },

    fetchCardDetails: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token no encontrado');

            const response = await axios.get('detalles de tarjeta', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const parsed = CardDetailsSchema.parse(response.data);
            set({ cardDetails: parsed });
        } catch (error) {
            toast.error('Error al obtener los datos de la tarjeta.');
            console.error('Error al obtener datos de la tarjeta:', error);
        }
    },
}));
