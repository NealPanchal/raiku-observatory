import { useState, useEffect, useRef } from 'react';

// Configuration constants
const CONFIG = {
    updateInterval: 1000,
    historyLength: 50
};

const useSimulation = (congestionActive = false) => {
    // State for all metrics
    const [metrics, setMetrics] = useState({
        tps: 2500,
        slotTime: 400,
        drift: 0,
        fees: 0.00005,
        volatility: 12.5
    });

    const [history, setHistory] = useState([]); // Array of { val: number } for heatmap

    const [comparisonData, setComparisonData] = useState({
        probLatency: 450,
        detLatency: 120,
        inclusion: 99.8,
        jitter: '15ms'
    });

    const [validatorData, setValidatorData] = useState({
        consistency: 99.8,
        missed: 0.01,
        variance: '7ms',
        gossip: '72ms'
    });

    const [eri, setEri] = useState(12.4);
    const [architecturalState, setArchitecturalState] = useState(0); // Progress tick

    // Refs for animation loops if needed, but we'll use intervals for React state updates

    useEffect(() => {
        const interval = setInterval(() => {
            // multipliers
            const baseMult = congestionActive ? 1.5 : 1;
            const volMult = congestionActive ? 3 : 1;

            // 1. Generate Metrics
            const newMetrics = {
                tps: 2500 + Math.random() * 1500 * baseMult,
                slotTime: 400 + Math.random() * 200 * baseMult,
                drift: Math.random() * 50 * volMult - 25,
                fees: 0.00001 + Math.random() * 0.00005 * baseMult * 2,
                volatility: Math.random() * 100 * volMult
            };
            setMetrics(newMetrics);

            // 2. Update History (Heatmap Data)
            setHistory(prev => {
                const newData = [...prev, { val: newMetrics.volatility, time: Date.now() }];
                if (newData.length > CONFIG.historyLength) newData.shift();
                return newData;
            });

            // 3. Comparison Data
            const baseLat = congestionActive ? 800 : 450;
            const latVol = congestionActive ? 350 : 150;

            setComparisonData({
                probLatency: Math.round(baseLat + Math.random() * latVol),
                detLatency: Math.round(120 + Math.random() * 20),
                inclusion: (congestionActive ? 65 + Math.random() * 25 : 85 + Math.random() * 10).toFixed(1),
                jitter: congestionActive ? Math.floor(Math.random() * 200) + 'ms' : '15ms'
            });

            // 4. Validator Data
            setValidatorData({
                consistency: (congestionActive ? 94 : 99.5) + (Math.random() * 0.5),
                missed: (congestionActive ? 4.5 : 0.01) + (Math.random() * 0.1),
                variance: (congestionActive ? Math.floor(Math.random() * 400 + 100) : Math.floor(Math.random() * 20 + 5)) + 'ms',
                gossip: (congestionActive ? Math.floor(Math.random() * 300 + 200) : Math.floor(Math.random() * 50 + 40)) + 'ms'
            });

            // 5. ERI Calculation
            const driftComp = Math.abs(newMetrics.drift);
            const feeComp = newMetrics.fees * 100000;
            let risk = (newMetrics.volatility * 0.4) + (driftComp * 1.2) + (feeComp * 0.5);
            risk += (Math.random() - 0.5) * 2;
            setEri(Math.min(100, Math.max(0, risk)));

            // 6. Architecture tick
            setArchitecturalState(prev => (prev + 1) % 100);

        }, 1000); // 1-second updates for stability

        return () => clearInterval(interval);
    }, [congestionActive]);

    return {
        metrics,
        history,
        comparisonData,
        validatorData,
        eri,
        architecturalState
    };
};

export default useSimulation;
