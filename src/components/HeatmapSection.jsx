import React, { useRef, useEffect } from 'react';

const HeatmapSection = ({ history, congestion }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const container = canvas.parentElement;
        const width = canvas.width = container.clientWidth;
        const height = canvas.height = Math.max(120, container.clientHeight);

        ctx.clearRect(0, 0, width, height);

        const barWidth = width / 50; // Show last 50 points

        history.forEach((d, i) => {
            const intensity = d.val / 100;
            const r = Math.floor(intensity * 255);
            const g = Math.floor((1 - intensity) * 255);

            // Dynamic color: Green -> Red
            let fill = `rgba(${192 + (r - 192) * intensity}, ${255 - g * intensity}, 56, ${0.3 + intensity * 0.5})`;

            if (intensity > 0.6) fill = `rgba(255, 107, 107, ${intensity})`;

            ctx.fillStyle = fill;
            ctx.fillRect(i * barWidth, height - (height * intensity), barWidth - 1, height * intensity);
        });

    }, [history, congestion]);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--gap)', height: '200px' }}>
            <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="section-header">
                    <h3 className="section-title">24H Volatility Heatmap</h3>
                    <span className="section-subtitle">Pattern Recognition</span>
                </div>
                <canvas ref={canvasRef} style={{ width: '100%', height: '140px' }} />
            </div>

            <div className="glass-panel" style={{ borderLeft: '1px solid rgba(192, 255, 56, 0.15)' }}>
                <div className="section-header">
                    <h3 className="section-title">Predictive Congestion</h3>
                    <span className={`section-subtitle ${congestion ? 'text-amber' : 'text-neon'}`}>
                        Delay Prob: {congestion ? '89%' : '34%'}
                    </span>
                </div>
                <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.1)' }}>
                    [PREDICTION MODEL VISUALIZATION]
                </div>
            </div>
        </div>
    );
};

export default HeatmapSection;
