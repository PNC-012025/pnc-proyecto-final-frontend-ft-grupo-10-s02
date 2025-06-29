import { motion, AnimatePresence } from 'framer-motion';
import { useCardStore } from '../store/useCardStore';

export const ActivateCardPopup = () => {
    const { popupOpen, setPopupOpen, activateCard } = useCardStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await activateCard();
    };

    return (
        <AnimatePresence>
            {popupOpen && (
                <motion.div
                    className=" fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md motion"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <h2 className="text-xl font-semibold motion-header text-center">
                            Activación de Tarjeta
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="text-sm text-gray-700">
                                <input type="checkbox" id="terms" required className="mr-2" />
                                <label htmlFor="terms">
                                    Acepto los términos y condiciones del servicio. La activación es gratuita y permite usar todas las funcionalidades de la tarjeta digital.
                                </label>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 bg-green-500 motion-btn cursor-pointer text-white rounded-lg transition"
                            >
                                Activar tarjeta
                            </button>
                            <button
                                type="button"
                                onClick={() => setPopupOpen(false)}
                                className="w-full py-2 border mt-2 rounded-lg motion-cancel bg-blue-950 text-white"
                            >
                                Cancelar
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
