import { NavLink } from "react-router-dom"
import "../styles/Login/Login.css"

export const Login = () => {
    return (
        <div className="login-container">
            <div className="login-content-1"></div>

            <div className="login-content-2">

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

                    <div className="login-field">
                        <label htmlFor="pass" className="login-label">Contraseña:</label>
                        <input
                            className="login-input"
                            type="password"
                            id="pass"
                            placeholder="Digíte su contraseña."
                        />
                    </div>

                    <NavLink to={"/register"} className={"login-reg"}>
                        ¿No tienes una cuenta?, Crea una
                    </NavLink>

                    <div className="login-btns">
                        <NavLink to={"/"} className={"login-cta login-back"}>
                            Regresar
                        </NavLink>
                        <NavLink to={"/"} className="login-cta">
                            <input
                                type="submit"
                                value={"Iniciar Sesión"}
                            />
                        </NavLink>
                    </div>
                </form>
            </div>
        </div>
    )
}
