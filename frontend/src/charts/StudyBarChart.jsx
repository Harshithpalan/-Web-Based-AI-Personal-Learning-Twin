import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            labels: { color: '#94a3b8' }
        },
    },
    scales: {
        y: {
            grid: { color: '#334155' },
            ticks: { color: '#94a3b8' }
        },
        x: {
            grid: { display: false },
            ticks: { color: '#94a3b8' }
        }
    }
};

const StudyBarChart = ({ chartData }) => {
    const data = {
        labels: chartData?.labels || [],
        datasets: [
            {
                label: 'Hours Spent',
                data: chartData?.values || [],
                backgroundColor: '#6366f1',
                borderRadius: 8,
            }
        ],
    };

    return (
        <div style={{ height: '300px' }}>
            <Bar options={options} data={data} />
        </div>
    );
}

export default StudyBarChart;
