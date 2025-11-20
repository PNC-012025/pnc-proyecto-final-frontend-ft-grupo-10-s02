import { Tag, LucideIcon } from 'lucide-react';
import "./styles/ExpensesTable.css";

interface Expense {
    id: string;
    name: string;
    amount: number;
    category: string;
    date: string;
}

interface Category {
    value: string;
    label: string;
    icon: LucideIcon;
    color: string;
}

interface ExpensesTableProps {
    expenses: Expense[];
    categories: Category[];
}

export default function ExpensesTable({ expenses, categories }: ExpensesTableProps) {
    return (
        <div className="table-container">
            <div className="table-header">
                <h3>Registro de Gastos</h3>
            </div>

            <div className="table-wrapper">
                <table className="expenses-table">
                    <thead>
                        <tr>
                            <th>Concepto</th>
                            <th>Categoría</th>
                            <th>Fecha</th>
                            <th className="right">Monto</th>
                        </tr>
                    </thead>

                    <tbody>
                        {expenses.map(expense => {
                            const category = categories.find(cat => cat.value === expense.category);
                            const Icon = category?.icon || Tag;

                            return (
                                <tr key={expense.id}>
                                    <td>{expense.name}</td>

                                    <td>
                                        <div className="category-cell">
                                            <Icon className={`category-icon ${category?.color || ""}`} />
                                            <span>{category?.label || expense.category}</span>
                                        </div>
                                    </td>

                                    <td>
                                        {new Date(expense.date).toLocaleDateString("es-MX", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </td>

                                    <td className="right amount">
                                        ${expense.amount.toLocaleString("es-MX")}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {expenses.length === 0 && (
                <div className="no-data">
                    No hay gastos registrados
                </div>
            )}
        </div>
    );
}
