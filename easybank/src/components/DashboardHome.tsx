import { useEffect, useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import { FaPaperPlane } from "react-icons/fa";
import { TbTransfer } from "react-icons/tb";
import { TbTextWrap } from "react-icons/tb";
import { IoIosTrendingUp } from "react-icons/io";
import { IoTrendingDown } from "react-icons/io5";


import '../styles/Dashboard/Dash_Home.css';
import { GraphMonth } from './GraphMonth';
import { ActivateCardPopup } from './ActivateCardPopup';
import { useCardStore } from '../store/useCardStore';

const currencyRates: { [key: string]: number } = {
    EUR: 0.92,
    GBP: 0.78,
    MXN: 17.1,
    JPY: 155.2,
    CAD: 1.37
};

export const DashboardHome = () => {
    const [amount, setAmount] = useState<number>(0);
    const [currency, setCurrency] = useState<string>('EUR');
    const [result, setResult] = useState<string>('');

    const { setPopupOpen, cardDetails, isCardActive, fetchCardDetails } = useCardStore();

    const handleConversion = (e: React.FormEvent) => {
        e.preventDefault();
        const rate = currencyRates[currency];
        const converted = amount * rate;
        setResult(`$${amount} USD = ${converted.toFixed(2)} ${currency}`);
    };

    useEffect(() => {
        if (isCardActive) {
            fetchCardDetails();
        }
    }, [isCardActive, fetchCardDetails]);

    return (
        <main>
            <div className='home-header flex justify-between items-center'>
                <div className='client-card'>
                    <p className='client-p'>
                        {cardDetails ? `${cardDetails.firstName} ${cardDetails.lastName}` : 'Cliente'}
                    </p>
                </div>

                <div>
                    <img src="/logo.svg" alt="logo" className='w-50' />
                </div>
            </div>

            <section className='main-home'>
                <div className='home-1'>

                    <Fade direction='up' className='card-layout' triggerOnce={true}>
                        <div className='card-debit'>
                            <div className='card-content'>
                                <div className='accoun-debit'>
                                    <p className='de-t'>Saldo actual</p>
                                    <p className='de-p'>
                                        {cardDetails ? `$${cardDetails.balance.toFixed(2)}` : '$00.00'}
                                    </p>
                                </div>

                                <div className='account-data'>
                                    <p className='da-pa'>
                                        {cardDetails ?
                                            `**** **** **** ${cardDetails.accountNumber.slice(-4)}` :
                                            '**** **** **** *088'
                                        }
                                    </p>
                                    <p className='da-da'>
                                        {cardDetails ? cardDetails.expiryDate : '09/25'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Fade>

                    <Fade className='history-layout' direction='up'>
                        <div className='card-history'>
                            <div className='history-text'>
                                <TbTextWrap className='h-i' />
                                <p className='h-p'>Transacciones</p>
                            </div>

                            <div className='history-text'>
                                <IoIosTrendingUp className='text-white rounded-full bg-green-500 tr' />
                                <div className='flex justify-between items-center w-full'>
                                    <div>
                                        <p className='h-p'>Ahorro</p>
                                        <p className='text-sm text-gray-400'>12.01.2020 09:34</p>
                                    </div>

                                    <div>
                                        <p>$100</p>
                                    </div>
                                </div>
                            </div>

                            <div className='history-text'>
                                <IoTrendingDown className='bg-red-500 text-white rounded-full tr' />
                                <div className='flex justify-between items-center w-full'>
                                    <div>
                                        <p className='h-p'>Comida de la semana</p>
                                        <p className='text-sm text-gray-400'>12.01.2020 09:34</p>
                                    </div>

                                    <div>
                                        <p className='text-red-500'>-$80</p>
                                    </div>
                                </div>
                            </div>


                            <div className='history-text'>
                                <IoIosTrendingUp className='bg-green-500 text-white rounded-full tr' />
                                <div className='flex justify-between items-center w-full'>
                                    <div>
                                        <p className='h-p'>Salario</p>
                                        <p className='text-sm text-gray-400'>12.01.2020 09:34</p>
                                    </div>
                                    <div>
                                        <p>$800</p>

                                    </div>
                                </div>
                            </div>


                            <div className='history-text'>
                                <IoTrendingDown className='bg-red-500 text-white rounded-full tr' />
                                <div className='flex justify-between items-center w-full'>
                                    <div>
                                        <p className='h-p'>Servicios Básicos</p>
                                        <p className='text-sm text-gray-400'>12.01.2020 09:34</p>
                                    </div>
                                    <div>
                                        <p className='text-red-500'>-$150</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Fade>

                </div>

                <div className='home-2'>
                    <Fade direction='right' triggerOnce={true}>
                        <div className='cashback'>
                            <div className='text-home'>
                                <h1 className='text-3xl home-title'>Activa tu tarjeta ya mismo</h1>
                                <p className='home-p'>
                                    Aprovecha esta oportunidad única para
                                    maximizar tus ahorros. Al
                                    activar esta tarjeta, Es fácil, rápido y totalmente gratis.
                                </p>
                                <button className='home-cta' onClick={() => setPopupOpen(true)}>Actívala</button>
                            </div>

                            <div>
                                <img className='home-fig' src="/wm-full.png" alt="" />
                            </div>
                        </div>
                    </Fade>

                    <ActivateCardPopup />

                    <div className='tr-cont'>
                        <Fade direction='up' triggerOnce={true}>
                            <div className='home-tr'>
                                <div className='tr-text'>
                                    <FaPaperPlane />
                                    <p className='tr-p'>Transferencia</p>
                                </div>

                                <form className='tr-form'>
                                    <input
                                        className='tr-in'
                                        type="number"
                                        max={20}
                                        placeholder='5345 0879 1254 0382 9238'
                                    />
                                    <input
                                        className='tr-sub'
                                        type="submit"
                                    />
                                </form>

                                <p className='visa'>Visa o MasterCard para cualquier banco</p>
                            </div>
                        </Fade>

                        <Fade direction='up' triggerOnce={true} delay={100}>
                            <div className='home-tr'>
                                <div className='tr-text'>
                                    <TbTransfer className='tr-i' />
                                    <p className='tr-p'>Conversión</p>
                                </div>

                                <form className='tr-form' onSubmit={handleConversion}>
                                    <input
                                        className='tr-in'
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                                        placeholder='$0.00'
                                        min={0}
                                        step={0.01}
                                        required
                                    />

                                    <select
                                        className='tr-in'
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                    >
                                        <option value="EUR">Euro (EUR)</option>
                                        <option value="GBP">Libra esterlina (GBP)</option>
                                        <option value="MXN">Peso mexicano (MXN)</option>
                                        <option value="JPY">Yen japonés (JPY)</option>
                                        <option value="CAD">Dólar canadiense (CAD)</option>
                                    </select>

                                    <input
                                        className='tr-sub'
                                        type="submit"
                                        value="Convertir"
                                    />
                                </form>

                                {result ? (
                                    <p className='visa'>{result}</p>
                                ) : (
                                    <p className='visa'>Método de conversión para tus movimientos</p>
                                )}
                            </div>
                        </Fade>
                    </div>
                </div>
            </section>

            <div className='graph'>
                <GraphMonth />
            </div>
        </main>
    );
};
