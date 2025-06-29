import { toast } from "react-toastify";

export const notifySucces = () => toast.success('Gasto agregado correctamente', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    className: 'custom-toast'
});

export const notifySuccesEdit = () => toast.success('Gasto editado correctamente', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    className: 'custom-toast'
});

export const notifyError = () => toast.error('Complete el formulario', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    className: 'custom-toast'
});

export const notifyErrorAmount = () => toast.error('Cantidad inválida', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    className: 'custom-toast'
});