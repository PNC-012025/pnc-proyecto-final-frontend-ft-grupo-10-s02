

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
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

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

import '../styles/Dashboard/Graph.css'
import { Fade } from 'react-awesome-reveal';

export const GraphMonth = () => {
    const lineaData = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Saldo mensual',
                data: [1200, 1650, 980, 2100, 1870, 2300],
                fill: false,
                borderColor: '#14a542',
                backgroundColor: '#14a542',
                tension: 0.3,
            },
        ],
    };

    const pastelData = {
        labels: ['Compras', 'Suscripciones', 'Ahorros', 'Otros'],
        datasets: [
            {
                label: 'Gastos',
                data: [500, 300, 700, 200],
                backgroundColor: ['#14a542', '#00bcd4', '#ff9800', '#e91e63'],
                borderWidth: 1,
            },
        ],
    };

    const ingresosGastosData = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Ingresos',
                data: [2000, 2500, 2100, 2700, 3000, 2800],
                backgroundColor: '#14a542',
            },
            {
                label: 'Gastos',
                data: [1500, 1800, 1700, 1900, 2000, 2200],
                backgroundColor: '#e91e63',
            },
        ],
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            <div className="bg-white p-4 rounded-xl shadow-md h-80 graph">
                <Fade>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Saldo mensual</h2>
                    <Line data={lineaData} />
                </Fade>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md h-80 graph flex justify-center items-center">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Distribución de gastos</h2>
                <Pie data={pastelData} />
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md h-80 graph">
                <Fade>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Ingresos vs Gastos</h2>
                    <Bar data={ingresosGastosData} />
                </Fade>
            </div>
        </div>
    );
};
