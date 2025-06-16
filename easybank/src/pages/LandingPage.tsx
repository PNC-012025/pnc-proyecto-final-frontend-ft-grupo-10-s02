import { NavLink } from "react-router"
import { CiMenuFries } from "react-icons/ci";
import SplitText from "../animations/SplitText"
import { useState } from "react"

import '../styles/Landing/Landingpage.css'
import { Fade } from "react-awesome-reveal";
import Marquee from "react-fast-marquee";
import GradientText from "../animations/GradientText";


export const LandingPage = () => {

    const [isOpen, setIsOpen] = useState(false);
    const closeMenu = () => setIsOpen(false);

    return (

        <main className="app-container">



            <header className="headerPage">

                <nav className={'navbar'}>

                    <figure className="logo">
                        <img src="./logo.svg" alt="logo" />
                    </figure>

                    <button className="hamburguer" onClick={() => setIsOpen(!isOpen)}>
                        <CiMenuFries size={24} />
                    </button>


                    <div className={`navlist ${isOpen ? "open" : ""}`}>
                        <a href="" className="navlink">Inicio</a>
                        <a href="#about" className="navlink">Sobre nosotros</a>
                        <a href="#clients" className="navlink">Clientes</a>
                    </div>

                    <div className="navactions">
                        <NavLink to={"/login"} className="navbtn desktop">Registrate</NavLink>
                    </div>

                </nav>


                {isOpen && <div className="overlay" onClick={closeMenu}></div>}

                <div className="headerinfo">
                    <div className="textheader">
                        <SplitText
                            text="Disfruta tu tarjeta"
                            className="text-2xl font-semibold text-center textheader-1"
                            delay={100}
                            duration={0.6}
                            ease="power3.out"
                            splitType="chars"
                            from={{ opacity: 0, y: 40 }}
                            to={{ opacity: 1, y: 0 }}
                            threshold={0.1}
                            rootMargin="-100px"
                            textAlign="center"
                        />
                        <SplitText
                            text="Disfruta tu vida"
                            className="text-2xl font-semibold text-center textheader-2"
                            delay={100}
                            duration={0.6}
                            ease="power3.out"
                            splitType="chars"
                            from={{ opacity: 0, y: 40 }}
                            to={{ opacity: 1, y: 0 }}
                            threshold={0.1}
                            rootMargin="-100px"
                            textAlign="center"
                        />
                    </div>

                    <div className="cardsimages">
                        <img src="./images/card3.png" alt="cardimage" className="header-image card1" />
                        <img src="./images/card2.png" alt="cardimage" className="header-image card2" />
                        <img src="./images/card4.png" alt="cardimage" className="header-image card3" />
                    </div>

                </div>

            </header>


            <section className="aboutUs" id="about">

                <SplitText
                    text="Sobre Nosotros"
                    className="text-2xl font-semibold text-center aboutTitle"
                    delay={100}
                    duration={0.6}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"
                />


                <div className="about-container">

                    <Fade direction="left" triggerOnce={true}>
                        <img src="/image.png" alt="banner-about" className="banner-about" />
                    </Fade>


                    <div className="cardsAbout">

                        <Fade direction="right" triggerOnce={true} className="card-1">
                            <div className="cardAb">
                                <div className="infoCardAb">
                                    <figure className="AbImgContainer">
                                        <img className="AbImage" src="./ligero.png" alt="rayoImage" />
                                    </figure>

                                    <p className="cardTitleAb">Transacciones rápidas</p>
                                </div>

                                <p className="cardAbDes">
                                    Envía dinero, paga servicios o recarga tu celular en segundos.
                                    Accede a tus movimientos frecuentes con solo un clic.
                                </p>
                            </div>
                        </Fade>

                        <Fade direction="right" delay={200} triggerOnce={true} className="card-2">
                            <div className="cardAb">
                                <div className="infoCardAb">
                                    <figure className="AbImgContainer">
                                        <img className="AbImage" src="./proteger.png" alt="rayoImage" />
                                    </figure>

                                    <p className="cardTitleAb">Seguridad siempre a tu cuenta</p>
                                </div>

                                <p className="cardAbDes">
                                    Protegemos tu información con tecnología de punta.
                                    Activa notificaciones, verifica tu identidad y mantén tu cuenta siempre segura
                                </p>
                            </div>
                        </Fade>

                        <Fade direction="right" delay={400} triggerOnce={true} className="card-3">
                            <div className="cardAb">
                                <div className="infoCardAb">
                                    <figure className="AbImgContainer">
                                        <img className="AbImage" src="./dollar.png" alt="rayoImage" />
                                    </figure>

                                    <p className="cardTitleAb">Crece de mejor tus ahorros</p>
                                </div>

                                <p className="cardAbDes">
                                    Haz que tu dinero trabaje por ti. Descubre opciones de ahorro con
                                    rendimientos atractivos y alcanza tus metas más rápido.
                                </p>
                            </div>
                        </Fade>

                    </div>


                </div>

            </section>



            <section className="pay-section">

                <SplitText
                    text="Válido para pagos con"
                    className="text-6xl w-full font-semibold text-center textpay"
                    delay={100}
                    duration={0.6}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"
                />


                <div className="card-pay-section">
                    <Fade direction="up" triggerOnce={true} >
                        <div className="pay-container">
                            <img src="/apple.png" className="pay-image" alt="apple" />
                        </div>
                    </Fade>

                    <Fade direction="up" triggerOnce={true} delay={800}>
                        <div className="pay-container">
                            <img src="/visa.png" className="pay-image" alt="visa" />
                        </div>
                    </Fade>

                    <Fade direction="up" triggerOnce={true} delay={1000}>
                        <div className="pay-container">
                            <img src="/google.png" className="pay-image" alt="google" />
                        </div>
                    </Fade>

                    <Fade direction="up" triggerOnce={true} delay={1000}>
                        <div className="pay-container">
                            <img src="/mc.png" className="pay-image" alt="mc" />
                        </div>
                    </Fade>
                </div>

            </section>


            <section className="client-section" id="clients">

                <GradientText
                    colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                    animationSpeed={3}
                    showBorder={false}
                    className="custom-class title-client"
                >
                    Nuestros Clientes
                </GradientText>

                <Marquee speed={50} gradient={false} className="clients-cards">
                    <div className="card-client">
                        <div className="client-info">
                            <figure className="client-figure">
                                <img src="./client-1.png" alt="client" className="client-photo" />
                            </figure>
                            <div className="client-text">
                                <p className="client-name">Luis Herrera</p>
                                <img src="/stars-5.png" alt="star" className="client-stars" />
                            </div>
                        </div>

                        <div className="client-pr">
                            <p className="client-des">
                                La app del banco es súper intuitiva. Puedo hacer transferencias
                                y pagar mis servicios en segundos. ¡Excelente servicio!
                            </p>
                        </div>
                    </div>

                    <div className="card-client">
                        <div className="client-info">
                            <figure className="client-figure">
                                <img src="./client-2.png" alt="client" className="client-photo" />
                            </figure>
                            <div className="client-text">
                                <p className="client-name">Emma Rodríguez</p>
                                <img src="/stars-5.png" alt="star" className="client-stars" />
                            </div>
                        </div>

                        <div className="client-pr">
                            <p className="client-des">
                                Me encanta lo fácil que es manejar mis cuentas desde el celular. Además, la atención al cliente es de primera.
                            </p>
                        </div>
                    </div>

                    <div className="card-client">
                        <div className="client-info">
                            <figure className="client-figure">
                                <img src="./client-3.png" alt="client" className="client-photo" />
                            </figure>
                            <div className="client-text">
                                <p className="client-name">David Okoro</p>
                                <img src="/stars-5.png" alt="star" className="client-stars" />
                            </div>
                        </div>

                        <div className="client-pr">
                            <p className="client-des">
                                Desde que uso esta app, todo es más práctico. Nunca tuve problemas, y el soporte es muy eficiente.
                            </p>
                        </div>
                    </div>

                    <div className="card-client">
                        <div className="client-info">
                            <figure className="client-figure">
                                <img src="./client-4.png" alt="client" className="client-photo" />
                            </figure>
                            <div className="client-text">
                                <p className="client-name">Mei Lin Zhang</p>
                                <img src="/stars-5.png" alt="star" className="client-stars" />
                            </div>
                        </div>

                        <div className="client-pr">
                            <p className="client-des">
                                Muy cómoda y segura. Puedo consultar mis movimientos y hacer todo sin tener que ir al banco.
                            </p>
                        </div>
                    </div>

                    <div className="card-client">
                        <div className="client-info">
                            <figure className="client-figure">
                                <img src="./client-5.png" alt="client" className="client-photo" />
                            </figure>
                            <div className="client-text">
                                <p className="client-name">Tomás Müller</p>
                                <img src="/stars-5.png" alt="star" className="client-stars" />
                            </div>
                        </div>

                        <div className="client-pr">
                            <p className="client-des">
                                Gran experiencia. La aplicación funciona rápido y las notificaciones me mantienen siempre al tanto.
                            </p>
                        </div>
                    </div>

                    <div className="card-client">
                        <div className="client-info">
                            <figure className="client-figure">
                                <img src="./client-6.png" alt="client" className="client-photo" />
                            </figure>
                            <div className="client-text">
                                <p className="client-name">Isabela Ferreira</p>
                                <img src="/stars-5.png" alt="star" className="client-stars" />
                            </div>
                        </div>

                        <div className="client-pr">
                            <p className="client-des">
                                ¡La mejor app bancaria que he usado! Me hace sentir en control total de mis finanzas. ¡La recomiendo!
                            </p>
                        </div>
                    </div>
                </Marquee>
            </section>

        </main>
    )
}
