import { NavLink } from "react-router-dom"
import "../styles/register/Register.css"

export const Register = () => {
    return (
        <div className="login-container">
            <div className="login-content-1"></div>

            <div className="login-content-2-r">

                <form className="login-form">
                    <img src="/logo.svg" alt="logo" className="login-logo" />

                    <div className="login-field">
                        <label htmlFor="user" className="login-label">Nombre de usuario:</label>
                        <input
                            className="login-input"
                            type="text"
                            id="user"
                            placeholder="Digíte su nombre de usuario."
                        />
                    </div>

                    <div className="flex gap-10 sm:gap-2 par">
                        <div className="login-field">
                            <label htmlFor="user" className="login-label">Nombre:</label>
                            <input
                                className="login-input w-1/2 name"
                                type="text"
                                id="user"
                                placeholder="Digíte su nombre"
                            />
                        </div>

                        <div className="login-field">
                            <label htmlFor="lastname" className="login-label">Apellido:</label>
                            <input
                                className="login-input w-1/2 name"
                                type="text"
                                id="lastname"
                                placeholder="Digíte su apellido."
                            />
                        </div>
                    </div>

                    <div className="flex gap-10 sm:gap-2 par">
                        <div className="login-field">
                            <label htmlFor="dui" className="login-label">DUI:</label>
                            <input
                                className="login-input name"
                                type="text"
                                id="dui"
                                placeholder="Digíte su DUI 1234567-8"
                            />
                        </div>

                        <div className="login-field">
                            <label htmlFor="pass" className="login-label">Contraseña:</label>
                            <input
                                className="login-input name"
                                type="password"
                                id="pass"
                                placeholder="Digíte su contraseña."
                            />
                        </div>
                    </div>

                    <div className="login-field">
                        <label htmlFor="email" className="login-label">Correo electrónico:</label>
                        <input
                            className="login-input"
                            type="email"
                            id="email"
                            placeholder="Digíte su correo electrónico"
                        />
                    </div>

                    <div className="login-btns">
                        <NavLink to={"/login"} className={"login-cta login-back"}>
                            Regresar
                        </NavLink>
                        <NavLink to={"/login"} className="login-cta">
                            <input
                                type="submit"
                                value={"Registrarse"}
                            />
                        </NavLink>
                    </div>
                </form>
            </div>
        </div>
    )
}
