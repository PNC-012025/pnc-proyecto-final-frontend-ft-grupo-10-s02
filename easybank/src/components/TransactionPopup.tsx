import { useTransactionStore } from '../store/useTransactionStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import '../styles/Popup.css';

type FormData = {
  firstName: string;
  lastName: string;
  accountNumber: string;
  amount: number;
  description: string;
};

export const TransactionPopup = () => {
  const { popupOpen, setPopupOpen, sendTransaction } = useTransactionStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      accountNumber: '',
      amount: 0,
      description: '',
    },
  });

  const onSubmit = (data: FormData) => {
    sendTransaction(data, () => {
      setPopupOpen(false);
      reset();
    });
  };

  return (
    <AnimatePresence>
      {popupOpen && (
        <motion.div
          className="popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="popup-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-4">Nueva Transacción</h2>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex gap-4">
                <div className="form-group flex-1">
                  <label>Nombre</label>
                  <input
                    {...register('firstName', { required: 'Nombre es obligatorio' })}
                    type="text"
                    placeholder="Nombre del destinatario"
                  />
                  {errors.firstName && <p className="error-msg">{errors.firstName.message}</p>}
                </div>

                <div className="form-group flex-1">
                  <label>Apellido</label>
                  <input
                    {...register('lastName', { required: 'Apellido es obligatorio' })}
                    type="text"
                    placeholder="Apellido del destinatario"
                  />
                  {errors.lastName && <p className="error-msg">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="form-group flex-1">
                  <label>Monto</label>
                  <input
                    {...register('amount', {
                      required: 'Monto es obligatorio',
                      min: { value: 0.01, message: 'El monto debe ser mayor a 0' },
                    })}
                    type="number"
                    step="0.01"
                    placeholder="Ej: 100.00"
                  />
                  {errors.amount && <p className="error-msg">{errors.amount.message}</p>}
                </div>

                <div className="form-group flex-1">
                  <label>Número de Cuenta</label>
                  <input
                    {...register('accountNumber', {
                      required: 'Número de cuenta es obligatorio',
                      maxLength: { value: 12, message: 'Máximo 12 dígitos' },
                      pattern: { value: /^[0-9]+$/, message: 'Solo números permitidos' },
                    })}
                    type="text"
                    maxLength={12}
                    placeholder="Número de cuenta a enviar Ej: 123456789"
                  />
                  {errors.accountNumber && <p className="error-msg">{errors.accountNumber.message}</p>}
                </div>
              </div>


              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  {...register('description', { required: 'Descripción es obligatoria' })}
                  placeholder="Describe la transacción"
                />
                {errors.description && <p className="error-msg">{errors.description.message}</p>}
              </div>

              <div className="form-group">
                <label>Fecha</label>
                <input
                  value={new Date().toISOString().split('T')[0]}
                  type="date"
                  readOnly
                  className="bg-gray-200 cursor-not-allowed date-input-readonly date"
                />
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  className="bg-gray-900 tr-b text-white px-4 py-2 rounded w-1/2"
                  onClick={() => {
                    setPopupOpen(false);
                    reset();
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className=" w-1/2 tr-b bg-green-500 text-white px-4 py-2 rounded">
                  Enviar
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
