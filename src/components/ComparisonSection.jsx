import React from 'react';
import { Line } from 'react-chartjs-2';

const createChartData = (label, color) => ({
    labels: Array(20).fill(''),
    datasets: [{
        label: label,
        data: Array(20).fill(0).map(() => Math.random() * 100),
        borderColor: color,
        backgroundColor: `${color}10`,
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0
    }]
});

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } },
    animation: false
};

const ComparisonSection = ({ data, congestion }) => {
    return (
        <div className="comparison-section">
            {/* Probabilistic Panel */}
            <div className="glass-panel comparison-panel">
                <div className="section-header">
                    <h3 className="section-title">PROBABILISTIC (LIVE)</h3>
                    <span className={`section-subtitle ${congestion ? 'text-amber' : 'text-neon'}`}>LIVE</span>
                </div>

                <div className="font-mono font-bold text-white" style={{ fontSize: '3.5rem', lineHeight: 1 }}>
                    <span className={congestion ? "text-amber" : "text-white"}>{data.probLatency}ms</span>
                </div>

                <div style={{ height: '100px', margin: '15px 0' }}>
                    <Line data={createChartData('Probabilistic', congestion ? '#FFB020' : '#FF6B6B')} options={chartOptions} />
                </div>

                <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span className="text-muted text-sm">Inclusion Probability</span>
                        <span className={Number(data.inclusion) < 80 ? "text-amber font-bold" : "text-neon font-bold"}>{data.inclusion}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${data.inclusion}%`, background: Number(data.inclusion) < 80 ? '#FFB020' : '#C0FF38' }}></div>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <span className="text-muted text-sm">Block Queue Jitter</span>
                    <span className="text-mono text-neon">{data.jitter}</span>
                </div>
            </div>

            {/* Deterministic Panel */}
            <div className="glass-panel">
                <div className="section-header">
                    <h3 className="section-title">DETERMINISTIC (SIM)</h3>
                    <span className="section-subtitle text-neon">SIMULATED</span>
                </div>

                <div className="font-mono font-bold text-neon" style={{ fontSize: '3.5rem', lineHeight: 1 }}>
                    {data.detLatency}ms
                </div>

                <div className="chart-container">
                    <Line data={createChartData('Probabilistic', '#C0FF38')} options={chartOptions} />
                </div>

                <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span className="text-muted text-sm">Inclusion Probability</span>
                        <span className="text-neon font-bold">100.0%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: '100%', background: '#C0FF38' }}></div>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <span className="text-muted text-sm">Block Queue Order</span>
                    <span className="text-mono text-neon">0ms (Perfect)</span>
                </div>
            </div>
        </div>
    );
};

export default ComparisonSection;
