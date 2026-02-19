import React from 'react';

const InstitutionalPanel = ({ metrics, congestion }) => {
    return (
        <div style={{
            height: '100px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--gap)',
            flexShrink: 0
        }}>
            <div className="glass-panel" style={{ padding: '15px' }}>
                <span className="text-muted text-xs uppercase">Capital at Risk</span>
                <div className="font-mono text-neon font-bold text-xl">$4.2M</div>
                <div style={{ height: '6px', width: '100%', background: '#333', marginTop: '5px' }}>
                    <div style={{ width: congestion ? '80%' : '20%', height: '100%', background: '#FF4D4D' }}></div>
                </div>
            </div>
            <div className="glass-panel" style={{ padding: '15px' }}>
                <span className="text-muted text-xs uppercase">Slippage Exposure</span>
                <div className="font-mono text-white font-bold text-xl">0.05%</div>
                <div style={{ height: '6px', width: '100%', background: '#333', marginTop: '5px' }}>
                    <div style={{ width: '45%', height: '100%', background: '#FFB020' }}></div>
                </div>
            </div>
            <div className="glass-panel" style={{ padding: '15px' }}>
                <span className="text-muted text-xs uppercase">Liquidation Probability</span>
                <div className="font-mono text-white font-bold text-xl">1.2%</div>
                <div style={{ height: '6px', width: '100%', background: '#333', marginTop: '5px' }}>
                    <div style={{ width: '5%', height: '100%', background: '#C0FF38' }}></div>
                </div>
            </div>
        </div>
    );
};

export default InstitutionalPanel;
