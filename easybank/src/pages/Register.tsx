import { NavLink, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { toast, ToastContainer } from "react-toastify"
import type { RegisterFormData } from "../types"
import { useEasyBankStore } from "../store/userStore"

import "../styles/register/Register.css"


export const Register = () => {

    const { fetchRegister } = useEasyBankStore()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm<RegisterFormData>()

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await fetchRegister(data)
            toast.success("Cuenta creada exitosamente")
            reset()
            setTimeout(() => {
                navigate("/login")
            }, 2000)
        } catch (error: any) {
            console.log(error);
        }
    }

    const formatDUI = (value: string) => {
        const digits = value.replace(/\D/g, "")
        if (digits.length <= 8) return digits
        return digits.slice(0, 8) + "-" + digits.slice(8, 9)
    }

    const handleDUIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatDUI(e.target.value)
        setValue("dui", formatted)
    }

    return (
        <>
            <ToastContainer
                className={"toast"}
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

            <div className="login-container">
                <div className="login-content-1"></div>

                <div className="login-content-2-r">
                    <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                        <img src="/logo.svg" alt="logo" className="login-logo" />

                        <div className="login-field">
                            <label htmlFor="username" className="login-label">Nombre de usuario:</label>
                            <input
                                className="login-input"
                                type="text"
                                id="username"
                                placeholder="Digíte su nombre de usuario."
                                {...register("username", { required: "El nombre de usuario es obligatorio." })}
                            />
                            {errors.username && <small style={{ color: "red" }}>{errors.username.message}</small>}
                        </div>

                        <div className="flex gap-10 sm:gap-2 par">
                            <div className="login-field">
                                <label htmlFor="firstname" className="login-label">Nombre:</label>
                                <input
                                    className="login-input w-1/2 name"
                                    type="text"
                                    id="firstname"
                                    placeholder="Digíte su nombre"
                                    {...register("firstName", { required: "El nombre es obligatorio." })}
                                />
                                {errors.firstName && <small style={{ color: "red" }}>{errors.firstName.message}</small>}
                            </div>

                            <div className="login-field">
                                <label htmlFor="lastname" className="login-label">Apellido:</label>
                                <input
                                    className="login-input w-1/2 name"
                                    type="text"
                                    id="lastname"
                                    placeholder="Digíte su apellido."
                                    {...register("lastName", { required: "El apellido es obligatorio." })}
                                />
                                {errors.lastName && <small style={{ color: "red" }}>{errors.lastName.message}</small>}
                            </div>
                        </div>

                        <div className="flex gap-10 sm:gap-2 par">
                            <div className="login-field">
                                <label htmlFor="dui" className="login-label">DUI:</label>
                                <input
                                    className="login-input name"
                                    type="text"
                                    id="dui"
                                    maxLength={10}
                                    placeholder="12345678-9"
                                    {...register("dui", {
                                        required: "El DUI es obligatorio.",
                                        pattern: {
                                            value: /^\d{8}-\d{1}$/,
                                            message: "Formato de DUI inválido. Ejemplo: 12345678-9"
                                        }
                                    })}
                                    onChange={handleDUIChange}
                                />
                                {errors.dui && <small style={{ color: "red" }}>{errors.dui.message}</small>}
                            </div>

                            <div className="login-field">
                                <label htmlFor="password" className="login-label">Contraseña:</label>
                                <input
                                    className="login-input name"
                                    type="password"
                                    id="password"
                                    placeholder="Digíte su contraseña."
                                    {...register("password", {
                                        required: "La contraseña es obligatoria.",
                                        pattern: {
                                            value: /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/,
                                            message: "Debe tener al menos 8 caracteres, una mayúscula y un carácter especial."
                                        }
                                    })}
                                />
                                {errors.password && <small style={{ color: "red" }}>{errors.password.message}</small>}
                            </div>
                        </div>

                        <div className="login-field">
                            <label htmlFor="email" className="login-label">Correo electrónico:</label>
                            <input
                                className="login-input"
                                type="email"
                                id="email"
                                placeholder="Digíte su correo electrónico"
                                {...register("email", {
                                    required: "El correo es obligatorio.",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Correo electrónico inválido."
                                    }
                                })}
                            />
                            {errors.email && <small style={{ color: "red" }}>{errors.email.message}</small>}
                        </div>

                        <div className="login-btns login-btns-r">
                            <NavLink to={"/login"} className={"login-cta login-cta-r login-back login-back-r"}>
                                Regresar
                            </NavLink>

                            <button type="submit" className="login-cta login-cta-r">
                                Registrarse
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
