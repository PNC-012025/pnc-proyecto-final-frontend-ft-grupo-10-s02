import { Plus, Tag, DollarSign, Calendar } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import './styles/AddExpenseForm.css';
import { useExpenseStore } from '../../../store/useExpenseStore';
import { useCardStore } from '../../../store/useCardStore';
import { notifyError, notifyErrorAmount, notifySucces } from '../../../extras/notify';
import { useExpensivesQuery } from '../../../hooks/useExpensives';

interface Category {
    value: string;
    label: string;
    icon: LucideIcon;
    color: string;
}

interface FormData {
    expenseName: string;
    amount: string;
    category: string;
    date: string;
}

interface AddExpenseFormProps {
    categories: Category[];
}

export default function AddExpenseForm({ categories }: AddExpenseFormProps) {

    const { queryClient } = useExpensivesQuery();

    const [formData, setFormData] = useState<FormData>({
        expenseName: '',
        amount: '',
        category: '',
        date: ''
    });

    const { addExpense } = useExpenseStore();
    const { cardDetails } = useCardStore();
    const balance = cardDetails?.balance ?? 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.expenseName || !formData.amount || !formData.category || !formData.date) {
            notifyError();
            return;
        }

        const amountNumber = Number(formData.amount);

        if (amountNumber <= 0) {
            notifyErrorAmount();
            return;
        }

        if (amountNumber > balance) {
            notifyErrorAmount();
            return;
        }

        await addExpense({
            expenseName: formData.expenseName,
            amount: amountNumber,
            category: formData.category,
            date: formData.date
        });

        notifySucces();

        queryClient.invalidateQueries({ queryKey: ["expensive"] });

        setFormData({
            expenseName: '',
            amount: '',
            category: '',
            date: ''
        });
    };

    return (
        <div className="expense-card">
            <div className="expense-header">
                <div className="icon-box">
                    <Plus className="icon" />
                </div>
                <h3>Agregar Gasto</h3>
            </div>

            <form onSubmit={handleSubmit} className="expense-form">
                <div className="form-group">
                    <label>Concepto</label>
                    <div className="input-wrapper">
                        <Tag className="input-icon" />
                        <input
                            type="text"
                            value={formData.expenseName}
                            onChange={(e) =>
                                setFormData({ ...formData, expenseName: e.target.value })
                            }
                            placeholder="Ej: Consulta médica"
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Monto</label>
                    <div className="input-wrapper">
                        <DollarSign className="input-icon" />
                        <input
                            type="number"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) =>
                                setFormData({ ...formData, amount: e.target.value })
                            }
                            placeholder="0.00"
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Categoría</label>
                    <select
                        value={formData.category}
                        onChange={(e) =>
                            setFormData({ ...formData, category: e.target.value })
                        }
                        required
                    >
                        <option value="">Seleccionar categoría</option>
                        {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Fecha</label>
                    <div className="input-wrapper">
                        <Calendar className="input-icon" />
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) =>
                                setFormData({ ...formData, date: e.target.value })
                            }
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="submit-btn">
                    <Plus className="btn-icon" />
                    Registrar Gasto
                </button>
            </form>
        </div>
    );
}
