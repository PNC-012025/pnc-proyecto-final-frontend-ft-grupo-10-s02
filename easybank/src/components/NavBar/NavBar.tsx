import { Fade } from 'react-awesome-reveal';
import { MdAttachMoney, MdMoneyOff } from "react-icons/md";

import { IoCloseOutline } from "react-icons/io5";

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import './NavBar.css';
import { formatCurrency } from'../../helpers';
import { useCardStore } from "../../store/useCardStore";

import { useExpenseStore } from "../../store/useExpenseStore";

type NavBarProps = {
    showMenu: boolean;
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NavBar = ({ showMenu, setShowMenu }: NavBarProps) => {

    const { expenses } = useExpenseStore();

    const expensetMoney = expenses.reduce((total, item) => total + item.amount, 0);

    const cardDetails = useCardStore(state => state.cardDetails);;
    const balance = cardDetails?.balance ?? 0;

    const percentage = balance > 0 ? (expensetMoney / balance) * 100 : 0;

    let color = '#4caf50';
    if (percentage >= 50 && percentage < 100) color = '#deb82c';
    if (percentage === 100) color = '#f44336';

    return (
        <Fade triggerOnce direction='left' duration={1000}>
            <nav className={`nav ${showMenu ? 'show-menu' : 'close-menu'}`}>

                <IoCloseOutline
                    className='close-icon'
                    onClick={() => setShowMenu(false)}
                />

                <div>
                    <figure className='graf-cont'>
                        <CircularProgressbar
                            value={+percentage}
                            text={`${percentage.toFixed(0)}%`}
                            styles={buildStyles({ 
                                trailColor: '#b3aeae',
                                pathColor: color,
                                textColor: color,
                            })}
                            className='progress-bar'
                        />
                    </figure>

                    <div className='money-div'>
                        <div className='money-cont'>
                            <MdAttachMoney className='ico ico-dis' />
                            <p className='mon-p'>Tarjeta:{' '}
                                <span className='amount font-bold'>{formatCurrency(balance)}</span>
                            </p>
                        </div>

                        <div className='money-cont'>
                            <MdMoneyOff className='ico ico-spent' />
                            <p className='mon-p'>Gastado:{' '}
                                <span className='amount font-bold'>{formatCurrency(expensetMoney)}</span>
                            </p>
                        </div>

                        <div className='money-cont'>
                            <MdAttachMoney className='ico ico-ava' />
                            <p className='mon-p'>Disponible:{' '}
                                <span className='amount font-bold'>{formatCurrency(balance - expensetMoney)}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </nav>
        </Fade>
    )
}

