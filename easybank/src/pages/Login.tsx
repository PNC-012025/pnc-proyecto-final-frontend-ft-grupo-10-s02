import { NavLink, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../styles/Login/Login.css"

import type { LoginFormData } from "../types"
import { useEasyBankStore } from "../store/userStore"
import { useEffect } from "react";

export const Login = () => {
    const { fetchLogin, isAuthenticated, isAdmin, userRoles } = useEasyBankStore()
    const navigate = useNavigate()

    // para verificar si es o no es 
    useEffect(() => {
        if (isAuthenticated && userRoles.length > 0) {
            if (isAdmin()) {
                toast.success("Redirigiendo a panel de administrador...");
                setTimeout(() => navigate("/admin"), 2000);
            } else {
                toast.success("Redirigiendo a dashboard de usuario...");
                setTimeout(() => navigate("/dashboard"), 2000);
            }
        }
    }, [isAuthenticated, isAdmin, userRoles, navigate]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<LoginFormData>()

    const onSubmit = async (data: LoginFormData) => {
        try {
            await fetchLogin(data)
            reset()
        } catch (error) {
            toast.error("Error al iniciar sesión")
        }
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

                <div className="login-content-2">
                    <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                        <img src="/logo.svg" alt="logo" className="login-logo" />

                        <div className="login-field">
                            <label htmlFor="user" className="login-label">Nombre de usuario:</label>
                            <input
                                className="login-input"
                                type="text"
                                id="user"
                                placeholder="Digíte su nombre de usuario."
                                {...register("username")}
                            />
                            {errors.username && <small style={{ color: "red" }}>{errors.username.message}</small>}
                        </div>

                        <div className="login-field">
                            <label htmlFor="pass" className="login-label">Contraseña:</label>
                            <input
                                className="login-input"
                                type="password"
                                id="pass"
                                placeholder="Digíte su contraseña."
                                {...register("password")}
                            />
                            {errors.password && <small style={{ color: "red" }}>{errors.password.message}</small>}
                        </div>

                        <NavLink to={"/register"} className="login-reg">
                            ¿No tienes una cuenta?, Crea una
                        </NavLink>

                        <div className="login-btns">
                            <NavLink to={"/"} className="login-cta login-back">
                                Regresar
                            </NavLink>
                            <button type="submit" className="login-cta">
                                Iniciar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
