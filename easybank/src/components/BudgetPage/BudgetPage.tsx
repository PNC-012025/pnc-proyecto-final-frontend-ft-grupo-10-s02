import { useState } from 'react';

import { Fade } from 'react-awesome-reveal'
import { FaGithub, FaMoneyBill, FaCoffee, FaHome, FaPlay } from "react-icons/fa";

import { useExpense } from '../../hooks/useExpense';
import { useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './BudgetPage.css'
import './Wave.css'

export const BudgetPage = () => {


    const { state, dispatch } = useExpense();

    const [budget, setBudget] = useState(0);

    const notifySucces =  ()=> toast.success('Budget added successfully', {
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

    const notifyError = ()=> toast.error('Error invalid budget', {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBudget(+e.target.value);
    }

    const handleSubmitBudget  = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch({ type: 'add-budget', payload: { budget } })

        if (budget > 0) {
            notifySucces();
            setTimeout(() => {
            }, 2000);
        }else{
            notifyError();
        }

    }

    return (
        <div className='budget-main'>

            <ToastContainer />

            <a href='https://github.com/AxelAlvarado34' target='_blank' className='git-content p-3 rounded-lg absolute top-5 left-5'>
                <FaGithub className='github_image' />
            </a>

            <div className='name-app top-8 right-7'>
                <p>Expense control app</p>
            </div>

            <div className='main-text'>
                <div className='title-text'>
                    <Fade triggerOnce={true} direction='down' duration={2500}>
                        <h1 className='app-title font-bold mb-5'><span className='gradient-text'>Take</span> control</h1>
                    </Fade>
                    <Fade triggerOnce={true} delay={1500} duration={2500}>
                        <h1 className='text-white text-9xl font-bold control-text'>
                            <span className='gradient-text-2'>Expenses</span>
                        </h1>
                    </Fade>
                    

                    <div className='icon-content'>
                        <Fade direction='up' triggerOnce={true} duration={2500}><FaMoneyBill className='icon-bub ico-money' /></Fade>
                        <Fade direction='up' triggerOnce={true} duration={2500} delay={100}><FaCoffee className='icon-bub ico-coffe' /></Fade>
                        <Fade direction='up' triggerOnce={true} duration={2500} delay={110}><FaHome className='icon-bub ico-home' /></Fade>
                        <Fade direction='up' triggerOnce={true} duration={2500} delay={120}><FaPlay className='icon-bub ico-play' /></Fade>
                    </div>

                </div>
            </div>

            <div className='main-form'>
                <Fade triggerOnce={true} delay={1000} duration={2500}>
                    <form
                        className='form-main'

                        onSubmit={handleSubmitBudget}
                    >
                        <label htmlFor="budget" className='form-label'>Write a budget</label>
                        <input
                            min={0}
                            type="number"
                            id='budget'
                            className='form-input'
                            placeholder='Enter amount...'

                            value={budget}
                            onChange={handleChange}
                        />

                        <input
                            type="submit"
                            className={`form-submit ${state.budget ? 'disabled:opacity-20 cursor-default' : ''}`}
                            value={'Define Budget'}

                            disabled={state.budget ? true : false}
                        />
                    </form>
                </Fade>
            </div>

            <div className="ocean">
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
            </div>
        </div>
    )
}
