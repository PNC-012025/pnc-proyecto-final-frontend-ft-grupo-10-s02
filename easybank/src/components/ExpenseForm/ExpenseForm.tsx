
import { useEffect, useMemo, useState } from 'react'
import { categories } from '../../data'

import { useExpense } from '../../hooks/useExpense'
import { notifyError, notifyErrorAmount, notifySucces, notifySuccesEdit } from '../../extras/notify'

import './ExpenseForm.css'
import { useCardStore } from '../../store/useCardStore'
import { useExpenseStore } from '../../store/useExpenseStore'

export const ExpenseForm = () => {

    const { state } = useExpense();

    const initialExpense = {
        expenseName: '',
        amount: 0.0,
        category: '',
        date: ''
    }

    const expensetMoney = useMemo(() => {
        return state.expenses.reduce((total, item) => total + item.amount, 0);
    }, [state.expenses])



    const [expense, setExpense] = useState(initialExpense);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setExpense({
            ...expense,
            [name]: name === 'amount' ? parseFloat(value) : value
        })
    }

    const { addExpense, updateExpense } = useExpenseStore();
    

   const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (Object.values(expense).includes('')) {
            notifyError();
            return;
        }

        if (expense.amount <= 0) {
            notifyErrorAmount();
            return;
        }

        if (expense.amount > balance) {
            notifyErrorAmount();
            return;
        }

        if (state.editingId) {
            notifySuccesEdit();
            await updateExpense(state.editingId, expense);
        } else {
            notifySucces();
            await addExpense(expense);
        }

        setExpense(initialExpense);
    };


    useEffect(() => {
        if (state.editingId) {
            const editItemExpense = state.expenses.filter((expenseState) => {
                return expenseState.id === state.editingId;
            })[0];

            setExpense(editItemExpense);
        }

    }, [state.editingId])


    const { cardDetails } = useCardStore();
    const balance = cardDetails?.balance ?? 0;

    return (
        <div className='form-panel'>
            <p className='form-title'>Nueva reserva</p>

            <form
                className='form-expense'

                onSubmit={handleSubmit}
            >
                <div className='form-camp'>
                    <div className='form-block'>
                        <label htmlFor="expenseName" className='form-expense-label'>Nombre del gasto:</label>
                        <input
                            type="text"
                            id='expenseName'
                            name='expenseName'
                            className='form-expense-input'
                            placeholder='Nombre del gasto...'

                            value={expense.expenseName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className='form-block'>
                        <label htmlFor="amount" className='form-expense-label'>Cantidad:</label>
                        <input
                            type="number"
                            step="0.01"
                            id='amount'
                            name='amount'
                            className='form-expense-input'
                            placeholder='$0.00...'

                            value={expense.amount}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className='form-camp'>
                    <div className='form-block'>
                        <label htmlFor="category" className='form-expense-label'>Categoría:</label>
                        <select
                            name="category"
                            id="category"
                            className='category-input'

                            value={expense.category}
                            onChange={handleChange}
                        >
                            <option value="" className='category-opt'>Selecciona</option>
                            {
                                categories.map((category) => (
                                    <option key={category.id} className='category-opt' value={category.id}>{category.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div className='form-block'>
                        <label htmlFor="date" className='form-expense-label'>Fecha:</label>
                        <input
                            type="date"
                            id='date'
                            name='date'
                            className='form-expense-input'

                            value={expense.date}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <input
                    type="submit"
                    className='form-expense-submit disabled:opacity-20'
                    value={'Agrega reserva'}
                    disabled={(balance-expensetMoney) <= 0}
                />
            </form>
        </div>
    )
}
