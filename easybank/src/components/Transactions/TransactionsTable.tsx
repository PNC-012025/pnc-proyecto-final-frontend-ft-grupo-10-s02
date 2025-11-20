import { Transaction } from "../../store/useTransactionStore";
import './styles/TransactionsTable.css'

interface Props {
    transactions: Transaction[];
}

export function TransactionsTable({ transactions }: Props) {

    const totalTransactions = transactions.length;

    const totalIngresos = transactions
        .filter((t) => t.type === "RECEIVER")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalGastos = transactions
        .filter((t) => t.type !== "RECEIVER")
        .reduce((sum, t) => sum + t.amount, 0);

    const formatearFecha = (fecha: string): string => {
        return new Date(fecha).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const formatearMoneda = (monto: number): string => {
        return new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "USD",
        }).format(monto);
    };

    return (
        <div className="transactions-wrapper">
            <div className="header-section">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Mis Transacciones</h1>
                <p className="text-gray-600">Historial completo de tus movimientos</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card border-blue">
                    <p className="stat-label">Total Transacciones</p>
                    <p className="stat-value">{totalTransactions}</p>
                </div>

                <div className="stat-card border-green">
                    <p className="stat-label">Ingresos Totales</p>
                    <p className="stat-value green">
                        {formatearMoneda(totalIngresos)}
                    </p>
                </div>

                <div className="stat-card border-red">
                    <p className="stat-label">Gastos Totales</p>
                    <p className="stat-value red">
                        {formatearMoneda(totalGastos)}
                    </p>
                </div>
            </div>

            <div className="table-container">
                <div className="table-scroll">
                    <table className="transactions-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Descripción</th>
                                <th>Categoría</th>
                                <th className="monto">Monto</th>
                            </tr>
                        </thead>

                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td>{formatearFecha(transaction.date)}</td>

                                    <td>
                                        {transaction.description ??
                                            transaction.accountNumber}
                                    </td>

                                    <td>
                                        <span className="badge">
                                            {transaction.type ?? "General"}
                                        </span>
                                    </td>

                                    <td
                                        className={
                                            "amount " +
                                            (transaction.type === "RECEIVER"
                                                ? "green"
                                                : "red")
                                        }
                                    >
                                        {transaction.type === "RECEIVER"
                                            ? "+"
                                            : "-"}
                                        <span className="text-center">
                                            {formatearMoneda(transaction.amount)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
}
