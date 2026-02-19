import React from 'react';
import useSimulation from '../hooks/useSimulation';

// Sub-components (will be created next)
import MetricsRow from './MetricsRow';
import HeatmapSection from './HeatmapSection';
import ComparisonSection from './ComparisonSection';
import InstitutionalPanel from './InstitutionalPanel';
import ValidatorRow from './ValidatorRow';
import ArchitectureDiagram from './ArchitectureDiagram';
import AIAnalyst from './AIAnalyst';

const Dashboard = ({ simulationState, setSimulationState }) => {
    // Hook handles all data generation and logic intervals
    const {
        metrics,
        history,
        comparisonData,
        validatorData,
        eri,
        architecturalState
    } = useSimulation(simulationState.congestion);

    return (
        <div className="dashboard-grid">
            {/* 1. Key Metrics Row - Fixed Height */}
            <div className="glass-panel metrics-section">
                <div className="section-header">
                    <h2 className="section-title">Network Metrics</h2>
                    <span className="section-subtitle">Real-time Performance</span>
                </div>
                <MetricsRow metrics={metrics} />
            </div>

            {/* 2. Heatmap & Prediction - Fixed Height */}
            <div className="heatmap-section">
                <HeatmapSection history={history} congestion={simulationState.congestion} />
            </div>

            {/* 3. Main Comparison Area - Fixed Height */}
            <div className="comparison-section">
                <ComparisonSection
                    data={comparisonData}
                    congestion={simulationState.congestion}
                />
            </div>

            {/* 4. Validator & Architecture - Fixed Height */}
            <div className="validator-architecture-section">
                <div className="validator-architecture-row">
                    <div className="glass-panel">
                        <div className="section-header">
                            <h3 className="section-title">Validator Health</h3>
                            <span className="section-subtitle">Network Consensus</span>
                        </div>
                        <ValidatorRow data={validatorData} />
                    </div>
                    
                    <div className="glass-panel">
                        <div className="section-header">
                            <h3 className="section-title">Execution Pipeline</h3>
                            <span className="section-subtitle">System Architecture</span>
                        </div>
                        <ArchitectureDiagram state={architecturalState} />
                    </div>
                </div>
            </div>

            {/* 5. Institutional Panel - Fixed Height */}
            {simulationState.institutional && (
                <div className="glass-panel" style={{ minHeight: '120px' }}>
                    <div className="section-header">
                        <h3 className="section-title">Institutional Analytics</h3>
                        <span className="section-subtitle">Advanced Metrics</span>
                    </div>
                    <InstitutionalPanel
                        metrics={metrics}
                        congestion={simulationState.congestion}
                    />
                </div>
            )}

            {/* 6. Controls - Fixed Height */}
            <div className="controls-section">
                <div className="controls-row">
                    <div className="simulation-bar">
                        <div className="status-indicator">
                            Network Status:
                            <span className={simulationState.congestion ? "text-amber font-bold ml-2" : "text-neon font-bold ml-2"}>
                                {simulationState.congestion ? "CONGESTED" : "NORMAL"}
                            </span>
                        </div>

                        <div className="button-group">
                            <button
                                className={`simulation-btn compact-btn ${simulationState.institutional ? 'active' : ''}`}
                                onClick={() => setSimulationState(prev => ({ ...prev, institutional: !prev.institutional }))}
                            >
                                INSTITUTIONAL MODE: {simulationState.institutional ? 'ON' : 'OFF'}
                            </button>

                            <button
                                className={`simulation-btn compact-btn ${simulationState.congestion ? 'active' : ''}`}
                                onClick={() => setSimulationState(prev => ({ ...prev, congestion: !prev.congestion }))}
                            >
                                {simulationState.congestion ? 'STOP SIMULATION' : 'SIMULATE CONGESTION'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 7. AI Analyst - Fixed Height */}
            <div className="ai-section">
                <AIAnalyst eri={eri} congestion={simulationState.congestion} />
            </div>
        </div>
    );
};

export default Dashboard;
