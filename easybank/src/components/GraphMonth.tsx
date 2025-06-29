import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Tooltip,
    Legend,
    ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Pie, Bar } from 'react-chartjs-2';
import { Fade } from 'react-awesome-reveal';
import { useCardStore } from '../store/useCardStore';
import { useTransactionStore } from '../store/useTransactionStore';
import '../styles/Dashboard/Graph.css';
import { useEffect, useState } from 'react';
import { useExpenseStore } from '../store/useExpenseStore';

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Tooltip,
    Legend
);

export const GraphMonth = () => {
    const { cardDetails } = useCardStore();
    const { expenses, fetchExpenses } = useExpenseStore();
    const { transactions, fetchTransactions } = useTransactionStore();

    const [pieData, setPieData] = useState<ChartData<'pie', number[], string>>({
        labels: [],
        datasets: [],
    });

    const [ingresosGastosData, setIngresosGastosData] = useState<ChartData<'bar', number[], string>>({
        labels: [],
        datasets: [],
    });

    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString('es-ES');

    useEffect(() => {
        fetchExpenses();
    }, []);

    useEffect(() => {
        const categoryNames: Record<string, string> = {
            '1': 'Ahorros',
            '2': 'Comida',
            '3': 'Hogar',
            '4': 'Gatos varios',
            '5': 'Ocio',
            '6': 'Salud',
            '7': 'Suscripciones',
        };
        const categoryMap = new Map<string, number>();

        expenses.forEach((e) => {
            const catId = e.category;
            const amount = Number(e.amount) || 0;
            const catName = categoryNames[catId] ?? 'Otros';
            categoryMap.set(catName, (categoryMap.get(catName) || 0) + amount);
        });

        let labels: string[] = [];
        let data: number[] = [];
        let backgroundColors: string[] = [];

        if (categoryMap.size === 0) {
            labels = ['Sin datos'];
            data = [1];
            backgroundColors = ['#d3d3d3'];
        } else {
            labels = Array.from(categoryMap.keys());
            data = Array.from(categoryMap.values());
            const defaultColors = [
                '#14a542', '#00bcd4', '#ff9800', '#e91e63',
                '#9c27b0', '#3f51b5', '#795548', '#607d8b',
                '#009688', '#f44336'
            ];
            backgroundColors = defaultColors.slice(0, labels.length);
        }

        setPieData({
            labels,
            datasets: [{
                label: 'Gastos por categoría',
                data,
                backgroundColor: backgroundColors,
                borderWidth: 1,
            }]
        });
    }, [expenses]);

    useEffect(() => {
        fetchTransactions();
    }, []);


    useEffect(() => {
        if (!transactions.length) {
            setIngresosGastosData({
                labels: ['Hoy'],
                datasets: [
                    { label: 'Ingresos', data: [0], backgroundColor: '#14a542' },
                    { label: 'Gastos', data: [0], backgroundColor: '#e91e63' },
                ],
            });
            return;
        }

        let ingresos = 0;
        let gastos = 0;

        transactions.forEach((t) => {
            const fechaTrans = new Date(t.date);
            const transDateStr = fechaTrans.toLocaleDateString('es-ES');

            if (transDateStr === dateString) {
                if (t.type === 'RECEIVER') {
                    ingresos += t.amount;
                } else if (t.type === 'SENDER') {
                    gastos += Math.abs(t.amount);
                }
            }
        });

        setIngresosGastosData({
            labels: ['Hoy'],
            datasets: [
                { label: 'Ingresos', data: [ingresos], backgroundColor: '#14a542' },
                { label: 'Gastos', data: [gastos], backgroundColor: '#e91e63' },
            ],
        });
    }, [transactions]);


    const lineaData = {
        labels: [dateString],
        datasets: [
            {
                label: 'Saldo del día',
                data: [cardDetails ? cardDetails.balance : 0],
                fill: false,
                borderColor: '#14a542',
                backgroundColor: '#14a542',
                tension: 0.3,
            },
        ],
    };

    return (
        <div className="graph-div grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            <div className="bg-white p-4 rounded-xl shadow-md h-80 graph">
                <Fade triggerOnce={true}>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Saldo del día</h2>
                    <Line data={lineaData} />
                </Fade>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md h-80 graph cir">
                <Fade triggerOnce={true}>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700 ml-10">Gastos por categoría</h2>
                    <Pie data={pieData} className='cir-f' />
                </Fade>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md h-80 graph ingr">
                <Fade triggerOnce={true}>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Ingresos vs Gastos (hoy)</h2>
                    <Bar data={ingresosGastosData} />
                </Fade>
            </div>
        </div>
    );
};
