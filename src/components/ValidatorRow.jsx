import React from 'react';

const ValidatorCard = ({ label, value, trend, barValue }) => (
    <div style={{
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '4px'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-muted text-xs uppercase letter-spacing-1">{label}</span>
            {trend && <span className="text-muted text-xs">{trend}</span>}
        </div>
        <div className="font-mono font-bold text-white" style={{ fontSize: '1.5rem', margin: '10px 0' }}>{value}</div>

        {barValue !== undefined && (
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: 'auto' }}>
                <div style={{ width: `${Math.min(100, barValue)}%`, height: '100%', background: '#C0FF38' }}></div>
            </div>
        )}
    </div>
);

const ValidatorRow = ({ data }) => {
    return (
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: 'var(--gap)', 
            width: '100%',
            height: '100%'
        }}>
            <ValidatorCard label="Leader Consistency" value={`${data.consistency.toFixed(1)}%`} barValue={data.consistency} />
            <ValidatorCard label="Missed Slot Rate" value={`${data.missed.toFixed(2)}%`} trend="+0.01%" />
            <ValidatorCard label="Block Variance" value={data.variance} />
            <ValidatorCard label="Gossip Latency" value={data.gossip} />
        </div>
    );
};

export default ValidatorRow;
