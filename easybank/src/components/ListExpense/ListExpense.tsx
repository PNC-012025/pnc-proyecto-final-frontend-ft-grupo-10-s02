import { useEffect } from 'react';
import { useExpenseStore } from '../../store/useExpenseStore';
import { ExpenseItem } from '../ExpenseItem/ExpenseItem';
import './ListExpense.css'

export const ListExpense = () => {
    const { expenses, fetchExpenses } = useExpenseStore();

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);


    return (
        <div className='list-panel'>
            <div>
                <p className='resume-title'>Lista de reservas</p>
            </div>

            <div className='item-list-div'>
                {expenses.length === 0 ? (
                    <p>No hay gastos</p>
                ) : (
                    expenses.map((expenseItem, idx) => (
                        <ExpenseItem
                            key={expenseItem.id ?? `temp-id-${idx}`}
                            expenseItem={expenseItem}
                        />
                    ))
                )}

            </div>
        </div>
    )
}

