import BudgetSummary from './components/BudgetSummary';
import MainCategories from './components/MainCategories';
import ExpensesTable from './components/ExpensesTable';
import AddExpenseForm from './components/AddExpenseForm';
import { categories } from '../../data';
import { useExpensivesQuery } from '../../hooks/useExpensives';

export default function ExpensesDashboard() {

    const { data } = useExpensivesQuery();

    const allowedCategories = ["Ahorros", "Comida", "Hogar", "Salud"];

    const categoryTotals = categories
        .filter(cat => allowedCategories.includes(cat.label))
        .map(cat => ({
            ...cat,
            total: (data ?? [])
                .filter(exp => exp.category === cat.value)
                .reduce((sum, exp) => sum + exp.amount, 0),
        }));


    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900">Panel de Gastos</h1>
                    <p className="text-gray-600 mt-5">Gestiona y controla tus finanzas</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
                    <div className="lg:col-span-2 space-y-6">

                        <BudgetSummary />

                        <MainCategories categories={categoryTotals} />

                        <ExpensesTable
                            expenses={(data ?? []).map(e => ({
                                id: e.id,
                                name: e.expenseName,
                                amount: e.amount,
                                category: e.category,
                                date: e.date
                            }))}
                            categories={categories}
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <AddExpenseForm categories={categories} />
                    </div>
                </div>
            </div>
        </div>
    );
}
