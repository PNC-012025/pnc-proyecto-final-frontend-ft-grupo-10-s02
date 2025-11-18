import { ExpenseItem } from '../ExpenseItem/ExpenseItem';
import './ListExpense.css'
import { useExpensivesQuery } from '../../hooks/useExpensives';

export const ListExpense = () => {

    const {data} = useExpensivesQuery();

    return (
        <div className='list-panel'>
            <div>
                <p className='resume-title'>Lista de reservas</p>
            </div>

            <div className='item-list-div'>
                {data?.length === 0 ? (
                    <p>No hay gastos</p>
                ) : (
                    data?.map((expenseItem, idx) => (
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

