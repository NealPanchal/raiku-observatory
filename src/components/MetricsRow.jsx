import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Mini Chart Options (No Grid, No Axis)
const miniChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
        x: { display: false },
        y: { display: false, beginAtZero: true }
    },
    elements: {
        point: { radius: 0 }
    },
    animation: false
};

const SimpleSparkline = ({ data, color = '#C0FF38' }) => {
    // Generate a simple array if one isn't passed (mock history)
    const mockData = {
        labels: Array(10).fill(''),
        datasets: [{
            data: Array(10).fill(0).map(() => data + (Math.random() - 0.5) * (data * 0.2)),
            borderColor: color,
            backgroundColor: `${color}20`,
            borderWidth: 2,
            tension: 0.4,
            fill: true
        }]
    };
    return <div style={{ height: '60px', width: '100%' }}><Line data={mockData} options={miniChartOptions} /></div>;
};

const MetricsRow = ({ metrics }) => {
    const cards = [
        { label: 'TPS', value: Math.round(metrics.tps).toLocaleString(), color: '#C0FF38', raw: metrics.tps },
        { label: 'SLOT TIME', value: `${Math.round(metrics.slotTime)}ms`, color: '#C0FF38', raw: metrics.slotTime },
        { label: 'DRIFT', value: `${metrics.drift.toFixed(2)}ms`, color: '#C0FF38', raw: Math.abs(metrics.drift) },
        { label: 'FEES', value: `${metrics.fees.toFixed(5)} SOL`, color: '#C0FF38', raw: metrics.fees * 100000 },
        { label: 'VOLATILITY', value: `${metrics.volatility.toFixed(1)}%`, color: '#C0FF38', raw: metrics.volatility }
    ];

    return (
        <div className="metrics-row">
            {cards.map((card, i) => (
                <div key={i} className="metric-card">
                    <div className="metric-label">{card.label}</div>
                    <div className="metric-value">
                        {card.value}
                    </div>
                    <SimpleSparkline data={card.raw} />
                </div>
            ))}
        </div>
    );
};

export default MetricsRow;
