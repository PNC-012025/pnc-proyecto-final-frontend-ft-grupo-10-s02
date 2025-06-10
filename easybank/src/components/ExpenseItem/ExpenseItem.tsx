import { ExpenseType } from '../../types'
import { MdModeEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";

import './ExpenseItem.css'
import { formatCurrency } from '../../helpers';
import { useExpense } from '../../hooks/useExpense';
import { categories } from '../../data';

type ExpenseItemProps = {
    expenseItem: ExpenseType
}

export const ExpenseItem = ({ expenseItem }: ExpenseItemProps) => {

    const {dispatch} = useExpense();

    const categoryInfo = categories.filter((categoryState) => {
        return categoryState.id === expenseItem.category;
    })[0]    

    return (
        <div className='item-exp'>
            <div className='exp-text'>
                <figure>
                    <img src={`/images/icono_${categoryInfo.icon}.svg`} alt="icon_expense" />
                </figure>
                <div>
                    <p className='exp-p exp-categoy'>{categoryInfo.name}</p>
                    <p className='exp-p exp-name'>{expenseItem.expenseName}</p>
                    <p className='exp-p exp-amount'>{formatCurrency(expenseItem.amount)}</p>
                    <p className='exp-p exp-date'>Date: <span>{expenseItem.date}</span></p>
                </div>
            </div>

            <div className='btn-sect'>
                <button 
                    className='btn-edit btn'

                    onClick={()=> dispatch({type: 'get-expenseById', payload: {id: expenseItem.id}})}
                >
                    <MdModeEdit className='edit-icon' />
                </button>

                <button 
                    onClick={()=> dispatch({type: 'remove-expense', payload: {id: expenseItem.id}})}
                    className='btn-delete btn'
                >
                    <FaTrash className='del-icon' />
                </button>
            </div>
        </div>
    )
}
