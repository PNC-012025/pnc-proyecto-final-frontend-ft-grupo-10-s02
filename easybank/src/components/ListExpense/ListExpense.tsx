import { useExpense } from '../../hooks/useExpense'
import { ExpenseItem } from '../ExpenseItem/ExpenseItem';
import './ListExpense.css'

export const ListExpense = () => {

    const{state} = useExpense();

    return (
        <div className='list-panel'>
            <div>
                <p className='resume-title'>Lista de gastos</p>
            </div>

            <div className='item-list-div'>
                {state.expenses.map((expenseItem) => (
                    <ExpenseItem key={expenseItem.id} expenseItem={expenseItem}/>
                ))}
            </div>
        </div>
    )
}
