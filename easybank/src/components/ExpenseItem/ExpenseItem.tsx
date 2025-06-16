import { ExpenseType } from '../../types'
import { MdModeEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";

import './ExpenseItem.css'
import { formatCurrency } from '../../helpers';
import { categories } from '../../data';
import { useExpenseStore } from '../../store/useExpenseStore';

type ExpenseItemProps = {
    expenseItem: ExpenseType
}

export const ExpenseItem = ({ expenseItem }: ExpenseItemProps) => {

    const { deleteExpense, payExpense } = useExpenseStore()

    const categoryInfo = categories.filter((categoryState) => {
        return categoryState.id === expenseItem.category;
    })[0]

    return (
        <div className='item-exp'>
            <div className='exp-text'>
                <figure>
                    <img
                        className='item-img'
                        src={`/images/icono_${categoryInfo ? categoryInfo.icon : "default"}.svg`}
                        alt='icon_expense'
                    />
                </figure>
                <div>
                    <p className='exp-p exp-categoy'>{categoryInfo ? categoryInfo.name : ''}</p>
                    <p className='exp-p exp-name'>{expenseItem.expenseName}</p>
                    <p className='exp-p exp-amount'>{formatCurrency(expenseItem.amount)}</p>
                    <p className='exp-p exp-date'>Fecha: <span>{expenseItem.date?.split("T")[0] ?? ''}</span></p>
                </div>
            </div>

            <div className='btn-sect'>
                <button
                    onClick={() => payExpense(expenseItem.id)}
                    className='btn-completed btn'
                    title='Marcar como completado'
                >
                    <FaCheck className='check-icon' />
                </button>

                <button
                    className='btn-edit btn'
                    onClick={() => console.log('ja')}
                >
                    <MdModeEdit className='edit-icon' />
                </button>

                <button
                    onClick={() => deleteExpense(expenseItem.id)}
                    className='btn-delete btn'
                >
                    <FaTrash className='del-icon' />
                </button>
            </div>
        </div>
    )
}
