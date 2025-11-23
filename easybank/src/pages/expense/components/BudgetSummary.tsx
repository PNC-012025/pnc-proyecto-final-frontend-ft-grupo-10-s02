import { TrendingDown } from 'lucide-react';
import './styles/BudgetSummary.css';
import { useEffect } from "react";
import { useExpenseStore } from "../../../store/useExpenseStore";
import { useCardStore } from "../../../store/useCardStore";

export default function BudgetSummary() {

    const { expenses, fetchExpenses } = useExpenseStore();
    const { cardDetails, fetchCardDetails } = useCardStore();

    useEffect(() => {
        fetchExpenses();
        fetchCardDetails();
    }, []);

    const budget = cardDetails?.balance ?? 0;

    const totalSpent = (expenses ?? []).reduce(
        (sum, item) => sum + (item?.amount ?? 0),
        0
    );

    const remaining = budget - totalSpent;

    const percentageUsed = budget > 0 ? (totalSpent / budget) * 100 : 0;

    return (
        <div className="budget-card">
            <div className="budget-container">
                <div className="budget-left">
                    <div className="budget-header">
                        <div className="header-icon-box">
                            <TrendingDown className="header-icon" />
                        </div>

                        <div>
                            <h2 className="budget-title">Resumen de Presupuesto</h2>
                            <p className="budget-subtitle">Período actual</p>
                        </div>
                    </div>

                    <div className="budget-grid">
                        <div className="budget-item">
                            <p className="budget-label">Presupuesto Total</p>
                            <p className="budget-value">
                                ${budget.toLocaleString('es-MX')}
                            </p>
                        </div>

                        <div className="budget-item">
                            <p className="budget-label">Total Gastado</p>
                            <p className="budget-value spent">
                                ${totalSpent.toLocaleString('es-MX')}
                            </p>
                        </div>

                        <div className="budget-item">
                            <p className="budget-label">Disponible</p>
                            <p className="budget-value available">
                                ${remaining.toLocaleString('es-MX')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="circle-wrapper">
                    <svg className="circle" viewBox="0 0 160 160">
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="#e5e7eb"
                            strokeWidth="12"
                            fill="none"
                        />
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke={
                                percentageUsed > 90
                                    ? '#dc2626'
                                    : percentageUsed > 70
                                        ? '#f59e0b'
                                        : '#3b82f6'
                            }
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 70}`}
                            strokeDashoffset={`${2 * Math.PI * 70 * (1 - percentageUsed / 100)}`}
                            strokeLinecap="round"
                            className="circle-progress"
                        />
                    </svg>

                    <div className="circle-center">
                        <span className="circle-percentage">
                            {percentageUsed.toFixed(0)}%
                        </span>
                        <span className="circle-label">Utilizado</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
