import React from 'react';

const AIAnalyst = ({ eri, congestion }) => {
    let msg = "";
    let borderColor = "#C0FF38"; // Neon

    if (congestion) {
        msg = "CRITICAL: Network congestion detected. Slot time deviation +150ms. High probability of inclusion failure for low-priority txs. RECOMMENDED: Increase priority fee > 0.005 SOL and reduce leverage.";
        borderColor = "#FF4D4D"; // Red
    } else if (eri > 40) {
        msg = "WARNING: Elevated drift variance observed. Validator gossip latency increasing. Monitor slip tolerance. Execution windows narrowing.";
        borderColor = "#FFB020"; // Amber
    } else {
        msg = "SYSTEM NOMINAL: INFRASTRUCTURE STABLE. BLOCK PRODUCTION OPTIMIZED. DETERMINISTIC EXECUTION PATHS AVAILABLE. CAPITAL EFFICIENCY 99.8%.";
        borderColor = "#C0FF38";
    }

    return (
        <div className="ai-analyst" style={{
            borderLeft: `3px solid ${borderColor}`,
            background: `linear-gradient(90deg, ${borderColor}10 0%, transparent 100%)`,
        }}>
            <div className="section-header">
                <h3 className="section-title" style={{ color: borderColor }}>AI EXECUTION ANALYST</h3>
                <span className="section-subtitle" style={{ color: borderColor }}>ACTIVE</span>
            </div>
            <p className="ai-analyst-content font-mono">
                {msg}
            </p>
        </div>
    );
};

export default AIAnalyst;
