import { notifyError, notifySucces } from '../../extras/notify';
import { useState } from 'react';
import { useExpense } from '../../hooks/useExpense';


export const BugdetForm = () => {

    const{dispatch, state} = useExpense()

    const [budget, setBudget] = useState(0);


    const handleSubmitBudget = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch({ type: 'add-budget', payload: { budget } })

        if (budget > 0) {
            notifySucces();
            localStorage.setItem("budgetInitial", JSON.stringify(budget));
            dispatch({type: 'close-modal'})
        } else {
            notifyError();
        }

    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBudget(+e.target.value);
    }

    return (
        <>
            <div className='main-form'>
                <form
                    className='form-main'

                    onSubmit={handleSubmitBudget}
                >
                    <label htmlFor="budget" className='form-label'>Escribe un presupuesto</label>
                    <input
                        min={0}
                        type="number"
                        id='budget'
                        className='form-input'
                        placeholder='Ingrese una cantidad'

                        value={budget}
                        onChange={handleChange}
                    />

                    <input
                        type="submit"
                        className={`form-submit ${state.budget ? 'disabled:opacity-20 cursor-default' : ''}`}
                        value={'Define Budget'}

                        // disabled={state.budget ? true : false}
                    />
                </form>
            </div>
        </>
    )
}
