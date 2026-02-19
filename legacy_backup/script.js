// ===== CONFIGURATION =====
const CONFIG = {
    updateInterval: 2000,
    chartPoints: 20,
    colors: {
        neon: '#C0FF38',
        white: '#FDFDFF',
        amber: '#FFB020', // Warning / Elevated
        critical: '#FF4D4D', // Critical / Congested
        probabilistic: '#FFB020', // Default probabilistic color is now Amber
        deterministic: '#C0FF38'
    }
};

// ===== STATE =====
let congestionActive = false;
let institutionalMode = false;
let executionRiskIndex = 12.4;
let previousERI = 12.0;
let charts = {};
let systems = {}; // heatmap, blockQueues, architecture
let animationFrame;

// ===== FLOATING PARTICLES =====
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.resize();
        this.init();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
    }

    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            this.ctx.fillStyle = `rgba(192, 255, 56, ${p.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
}

// ===== VOLATILITY HEATMAP =====
class VolatilityHeatmap {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.data = [];
        this.maxData = 100;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
    }

    addPoint(volatility) {
        this.data.push({
            val: volatility,
            time: Date.now()
        });
        if (this.data.length > this.maxData) this.data.shift();
    }

    update() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const barWidth = width / this.maxData;

        this.ctx.clearRect(0, 0, width, height);

        // Draw Bars
        this.data.forEach((d, i) => {
            const intensity = d.val / 100; // 0 to 1
            let fill;

            // Updated Color Logic
            if (intensity > 0.7) {
                // Critical -> Red
                fill = `rgba(255, 77, 77, ${0.4 + intensity * 0.4})`;
            } else if (intensity > 0.4) {
                // Warning -> Amber
                fill = `rgba(255, 176, 32, ${0.3 + intensity * 0.3})`;
            } else {
                // Stable -> Neon
                fill = `rgba(192, 255, 56, ${0.2 + intensity * 0.2})`;
            }

            this.ctx.fillStyle = fill;
            this.ctx.fillRect(i * barWidth, height - (height * intensity), barWidth - 1, height * intensity);
        });

        // Draw Axes / Labels Overlays
        this.drawAxes();
    }

    drawAxes() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '9px "IBM Plex Mono"';
        ctx.textAlign = 'right';

        // Y-Axis Labels
        ctx.fillText('100%', w - 5, 10);
        ctx.fillText('50%', w - 5, h / 2);
        ctx.fillText('0%', w - 5, h - 5);

        // Grid lines (subtle)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);
        ctx.stroke();
    }
}

// ===== BLOCK QUEUE VISUALIZER =====
class BlockQueue {
    constructor(canvasId, type) { // type: 'probabilistic' or 'deterministic'
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.type = type;
        this.blocks = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
    }

    addBlock() {
        const isJittery = this.type === 'probabilistic' && congestionActive;
        const offset = isJittery ? (Math.random() - 0.5) * 20 : 0;

        // Color mapping
        let color = CONFIG.colors.neon;
        if (this.type === 'probabilistic') {
            if (congestionActive) color = CONFIG.colors.critical; // Red if actively congested
            else color = CONFIG.colors.amber; // Amber implies probabilistic/variable nature
        }

        this.blocks.push({
            x: this.canvas.width,
            y: this.canvas.height / 2 + offset,
            color: color,
            speed: isJittery ? 2 + Math.random() * 2 : 4
        });
    }

    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Add new block occasionally
        if (Math.random() > 0.9) this.addBlock();

        for (let i = this.blocks.length - 1; i >= 0; i--) {
            let b = this.blocks[i];
            b.x -= b.speed;

            this.ctx.fillStyle = b.color;
            this.ctx.fillRect(b.x, b.y - 5, 10, 10);

            if (b.x < -10) this.blocks.splice(i, 1);
        }
    }
}

// ===== ARCHITECTURE DIAGRAM =====
class ArchitectureDiagram {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.progress = 0;
    }

    resize() {
        // Safe check for element existence
        if (!this.canvas) return;
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
    }

    drawNode(x, y, label) {
        this.ctx.strokeStyle = CONFIG.colors.neon;
        this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x - 40, y - 15, 80, 30);
        this.ctx.fillRect(x - 40, y - 15, 80, 30);

        this.ctx.fillStyle = CONFIG.colors.white;
        this.ctx.font = '10px "IBM Plex Mono"';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(label, x, y);
    }

    update() {
        if (!this.canvas) return;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const cy = h / 2;

        this.ctx.clearRect(0, 0, w, h);

        // Nodes
        const nodes = [
            { x: w * 0.2, label: 'FRONTEND' },
            { x: w * 0.5, label: 'METRICS ENGINE' },
            { x: w * 0.8, label: 'SOLANA RPC' }
        ];

        // Connections
        this.ctx.beginPath();
        this.ctx.strokeStyle = `rgba(192, 255, 56, 0.3)`;
        this.ctx.moveTo(nodes[0].x + 40, cy);
        this.ctx.lineTo(nodes[1].x - 40, cy);
        this.ctx.moveTo(nodes[1].x + 40, cy);
        this.ctx.lineTo(nodes[2].x - 40, cy);
        this.ctx.stroke();

        // Data Packets
        this.progress = (this.progress + 2) % w;

        // Packet 1 (Left to Right)
        if (this.progress > nodes[0].x && this.progress < nodes[2].x) {
            this.ctx.fillStyle = CONFIG.colors.neon;
            this.ctx.fillRect(this.progress, cy - 2, 4, 4);
        }

        nodes.forEach(n => this.drawNode(n.x, cy, n.label));
    }
}

// ===== PREDICTIVE MODEL =====
class PredictiveModel {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
    }

    update(historyData) {
        if (!this.canvas || historyData.length < 2) return;

        const w = this.canvas.width;
        const h = this.canvas.height;
        const ctx = this.ctx;

        ctx.clearRect(0, 0, w, h);

        // We use the last 50 points for context (left half) and project 50 points (right half)
        const contextPoints = Math.min(historyData.length, 50);
        const dataSlice = historyData.slice(-contextPoints);

        // Scale factors
        const xStep = (w * 0.5) / 50; // Left half

        // Draw History Line
        ctx.beginPath();
        ctx.strokeStyle = CONFIG.colors.neon;
        ctx.lineWidth = 2;

        dataSlice.forEach((d, i) => {
            const x = i * xStep;
            const y = h - (d.val / 100 * h); // 0-100 scale
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Linear Regression
        let sumX = 0, sumY = 0, sumXY = 0, sumXY2 = 0, sumXX = 0;
        const n = dataSlice.length;
        dataSlice.forEach((d, i) => {
            sumX += i;
            sumY += d.val;
            sumXY += i * d.val;
            sumXX += i * i;
        });

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Project Future
        const lastIndex = n - 1;
        const startY = h - ((slope * lastIndex + intercept) / 100 * h);

        // Validating slope for visual sanity
        const projectSlope = slope * 2.5; // Amplify for visual effect

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(192, 255, 56, 0.5)';
        ctx.setLineDash([5, 5]);
        ctx.moveTo((n - 1) * xStep, startY);

        const endX = w;
        const endY = startY - (projectSlope * 50 * (h / 100)); // Project 50 steps

        ctx.lineTo(endX, Math.max(0, Math.min(h, endY)));
        ctx.stroke();
        ctx.setLineDash([]);

        // Cone of Uncertainty
        ctx.beginPath();
        ctx.fillStyle = 'rgba(192, 255, 56, 0.05)';
        ctx.moveTo((n - 1) * xStep, startY);

        // Upper cone
        ctx.lineTo(endX, Math.max(0, Math.min(h, endY - h * 0.3)));
        // Lower cone
        ctx.lineTo(endX, Math.max(0, Math.min(h, endY + h * 0.3)));
        ctx.closePath();
        ctx.fill();

        // Update Probability Text
        const lastVal = dataSlice[lastIndex].val;
        const futureVal = (slope * (lastIndex + 50) + intercept);

        // Prob of delay = proportional to predicted volatility > 50
        let prob = Math.round(Math.max(0, Math.min(99, futureVal)));
        if (congestionActive) prob = Math.min(99, prob + 40);

        const probText = document.getElementById('prediction-prob');
        if (probText) {
            probText.textContent = `Delay Prob: ${prob}%`;
            // USE AMBER FOR MEDIUM PROB, RED FOR HIGH
            if (prob > 70) {
                probText.style.color = CONFIG.colors.critical;
            } else if (prob > 40) {
                probText.style.color = CONFIG.colors.amber;
            } else {
                probText.style.color = CONFIG.colors.neon;
            }
        }
    }
}
function createChart(canvasId, label, color = CONFIG.colors.neon) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    // Explicitly set gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, 40);
    gradient.addColorStop(0, color + '40'); // 25% opacity
    gradient.addColorStop(1, color + '00'); // 0% opacity

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(CONFIG.chartPoints).fill(''),
            datasets: [{
                label: label,
                data: Array(CONFIG.chartPoints).fill(0),
                borderColor: color,
                backgroundColor: gradient,
                borderWidth: 1.5,
                tension: 0.4,
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            scales: {
                x: { display: false },
                y: {
                    display: false,
                    beginAtZero: true
                }
            },
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            }
        }
    });
}

function initializeCharts() {
    charts.tps = createChart('tpsChart', 'TPS');
    charts.slot = createChart('slotChart', 'Slot Time');
    charts.drift = createChart('driftChart', 'Drift');
    charts.fees = createChart('feesChart', 'Fees');
    charts.volatility = createChart('volatilityChart', 'Volatility');

    charts.probLatency = createChart('probLatencyChart', 'Probabilistic Latency', CONFIG.colors.probabilistic);
    charts.detLatency = createChart('detLatencyChart', 'Deterministic Latency', CONFIG.colors.deterministic);
}

// ===== DATA GENERATION =====
function updateChart(chart, newValue) {
    chart.data.datasets[0].data.shift();
    chart.data.datasets[0].data.push(newValue);
    chart.update('none');
}

function generateMetrics() {
    const baseMultiplier = congestionActive ? 1.5 : 1;
    const volatilityMultiplier = congestionActive ? 3 : 1;

    return {
        tps: 2500 + Math.random() * 1500 * baseMultiplier,
        slotTime: 400 + Math.random() * 200 * baseMultiplier,
        drift: Math.random() * 50 * volatilityMultiplier - 25,
        fees: 0.00001 + Math.random() * 0.00005 * baseMultiplier * 2,
        volatility: Math.random() * 100 * volatilityMultiplier
    };
}

function generateComparisonData() {
    const baseLatency = congestionActive ? 800 : 450;
    const volatility = congestionActive ? 350 : 150;

    const probLatency = baseLatency + Math.random() * volatility;
    const detLatency = 120 + Math.random() * 20; // Always stable

    const inclusion = congestionActive ?
        65 + Math.random() * 25 :
        85 + Math.random() * 10;

    return {
        probLatency: Math.round(probLatency),
        detLatency: Math.round(detLatency),
        inclusion: inclusion.toFixed(1)
    };
}

// ===== UPDATE FUNCTIONS =====
function calculateERI(metrics) {
    // ERI Formula: (Volatility * 0.4) + (|Drift| * 1.2) + (FeePressure * 0.5)
    // Normalized roughly to 0-100 scale

    const w1 = 0.4;
    const w2 = 1.2;
    const w3 = 0.5;

    const driftComponent = Math.abs(metrics.drift);
    const feeComponent = metrics.fees * 100000; // Scale up small fee numbers

    let risk = (metrics.volatility * w1) + (driftComponent * w2) + (feeComponent * w3);

    // Add random noise for "live" feel
    risk += (Math.random() - 0.5) * 2;

    return Math.min(100, Math.max(0, risk));
}

function updateERI(metrics) {
    previousERI = executionRiskIndex;
    executionRiskIndex = calculateERI(metrics);

    // Update Value
    const valueEl = document.getElementById('eri-value');
    valueEl.textContent = executionRiskIndex.toFixed(1);

    // Update Trend
    const trendEl = document.getElementById('eri-trend');
    const delta = ((executionRiskIndex - previousERI) / previousERI) * 100;
    const sign = delta >= 0 ? '▲' : '▼';
    trendEl.textContent = `${sign} ${Math.abs(delta).toFixed(1)}%`;
    trendEl.style.color = delta >= 0 ? CONFIG.colors.neon : 'rgba(255,255,255,0.4)';

    // Update Status State
    const statusText = document.getElementById('eri-status-text');
    const panel = document.querySelector('.eri-panel');

    // Remove old classes
    panel.classList.remove('eri-stable', 'eri-elevated', 'eri-critical');

    if (executionRiskIndex < 30) {
        panel.classList.add('eri-stable');
        statusText.textContent = 'STABLE';
        document.getElementById('congestion-alert').style.display = 'none';
    } else if (executionRiskIndex < 70) {
        panel.classList.add('eri-elevated');
        statusText.textContent = 'ELEVATED DRIFT';
        document.getElementById('congestion-alert').style.display = 'none';
    } else {
        panel.classList.add('eri-critical');
        statusText.textContent = 'CONGESTION EVENT';
        document.getElementById('congestion-alert').style.display = 'flex';
    }
}

function updateMetrics() {
    const metrics = generateMetrics();

    // Calculate and Update ERI
    updateERI(metrics);

    // Add heatmap point
    systems.heatmap.addPoint(metrics.volatility);

    if (institutionalMode) {
        updateInstitutionalMetrics(metrics.volatility);
    }

    document.getElementById('tps-value').textContent = Math.round(metrics.tps).toLocaleString();
    document.getElementById('slot-time-value').textContent = Math.round(metrics.slotTime) + 'ms';
    document.getElementById('drift-value').textContent = metrics.drift.toFixed(2) + 'ms';
    document.getElementById('fees-value').textContent = metrics.fees.toFixed(6) + ' SOL';
    document.getElementById('volatility-value').textContent = metrics.volatility.toFixed(1) + '%';

    // Update charts
    updateChart(charts.tps, metrics.tps);
    updateChart(charts.slot, metrics.slotTime);
    updateChart(charts.drift, Math.abs(metrics.drift));
    updateChart(charts.fees, metrics.fees * 100000);
    updateChart(charts.volatility, metrics.volatility);
}

function updateComparison() {
    const data = generateComparisonData();

    // Update probabilistic side
    document.getElementById('prob-latency').textContent = data.probLatency + 'ms';
    const inclusionEl = document.getElementById('prob-inclusion');
    inclusionEl.textContent = data.inclusion + '%';
    document.getElementById('prob-inclusion-bar').style.width = data.inclusion + '%';

    // Color logic for inclusion
    if (data.inclusion < 80) {
        inclusionEl.classList.add('warning');
        document.getElementById('prob-inclusion-bar').style.backgroundColor = CONFIG.colors.amber;
    } else {
        inclusionEl.classList.remove('warning');
        document.getElementById('prob-inclusion-bar').style.backgroundColor = CONFIG.colors.neon;
    }

    // Update deterministic side (stable)
    document.getElementById('det-latency').textContent = data.detLatency + 'ms';

    // Update jitter text
    const jitter = congestionActive ? Math.floor(Math.random() * 200) + 'ms' : '15ms';
    document.getElementById('prob-jitter').textContent = jitter;

    updateChart(charts.probLatency, data.probLatency);
    updateChart(charts.detLatency, data.detLatency);
}

function updateInstitutionalMetrics(volatility) {
    // Sensitivity Inputs
    const position = parseInt(document.getElementById('input-position').value);
    const slippageTol = parseFloat(document.getElementById('input-slippage').value);
    const leverage = parseInt(document.getElementById('input-leverage').value);

    // Update Input Text
    document.getElementById('val-position').textContent = (position / 1000) + 'k';
    document.getElementById('val-slippage').textContent = slippageTol.toFixed(1) + '%';
    document.getElementById('val-leverage').textContent = leverage + 'x';

    // Calculate Risk Metrics
    // Capital Risk = Position * (Volatility/100) * Leverage * (Congestion ? 2 : 1)
    const riskFactor = (volatility / 100) * (congestionActive ? 2.5 : 0.8);
    const capitalAtRisk = position * leverage * riskFactor;

    // Slippage Exposure = Volatility * Leverage * 0.5
    const slippageExp = (volatility * 0.1) * Math.sqrt(leverage);

    // Liquidation Probability
    // If slippage > tolerance, prob increases
    // If leverage high, prob increases
    let liqProb = (slippageExp / slippageTol) * 10;
    if (congestionActive) liqProb *= 2;
    liqProb = Math.min(99.9, Math.max(0.1, liqProb));

    document.getElementById('capital-risk').textContent = '$' + Math.round(capitalAtRisk).toLocaleString();
    document.getElementById('slippage-exposure').textContent = slippageExp.toFixed(2) + '%';
    document.getElementById('liquidation-prob').textContent = liqProb.toFixed(1) + '%';

    // Update bars
    const maxRisk = position * leverage; // Worst case total loss
    document.getElementById('risk-fill').style.width = Math.min(100, (capitalAtRisk / maxRisk) * 100 * (congestionActive ? 2 : 5)) + '%';
    document.getElementById('slippage-fill').style.width = Math.min(100, (slippageExp / slippageTol) * 50) + '%';
    document.getElementById('liquidation-fill').style.width = liqProb + '%';

    // Color coding based on thresholds
    const liqFill = document.getElementById('liquidation-fill');
    if (liqProb > 70) liqFill.style.backgroundColor = CONFIG.colors.critical;
    else if (liqProb > 40) liqFill.style.backgroundColor = CONFIG.colors.amber;
    else liqFill.style.backgroundColor = CONFIG.colors.neon;
}

function updateValidatorMetrics() {
    // Generate simulated validator data
    // Consistency drops slightly during congestion
    const consistBase = congestionActive ? 94 : 99.5;
    const consistency = consistBase + (Math.random() * 0.5);

    // Missed rate spikes during congestion
    const missedBase = congestionActive ? 4.5 : 0.01;
    const missed = missedBase + (Math.random() * 0.1);

    // Variance
    const variance = congestionActive ? Math.floor(Math.random() * 400 + 100) : Math.floor(Math.random() * 20 + 5);

    // Gossip
    const gossip = congestionActive ? Math.floor(Math.random() * 300 + 200) : Math.floor(Math.random() * 50 + 40);

    // Update DOM
    document.getElementById('val-consistency').textContent = consistency.toFixed(1) + '%';
    document.getElementById('val-consistency-bar').style.width = consistency + '%';

    document.getElementById('val-missed').textContent = missed.toFixed(2) + '%';
    const missedEl = document.getElementById('val-missed-trend');
    missedEl.textContent = (congestionActive ? '+' + (Math.random() * 2).toFixed(2) : '+0.00') + '%';
    missedEl.style.color = congestionActive ? CONFIG.colors.amber : 'rgba(255,255,255,0.4)';

    document.getElementById('val-variance').textContent = variance + 'ms';
    // Use Amber for variance warning
    document.getElementById('val-variance').style.color = congestionActive ? CONFIG.colors.amber : CONFIG.colors.white;

    document.getElementById('val-gossip').textContent = gossip + 'ms';
}

function updateAll() {
    updateMetrics();
    updateComparison();
    updateValidatorMetrics();
}

// ===== MASTER ANIMATION LOOP =====
function animate() {
    systems.particles.update();
    systems.heatmap.update();
    systems.prediction.update(systems.heatmap.data);
    systems.probQueue.update();
    systems.detQueue.update();
    systems.architecture.update();
    generateAnalystReport();
    requestAnimationFrame(animate);
}

function generateAnalystReport() {
    const output = document.getElementById('analyst-output');
    if (!output) return;

    // Throttle updates to readable speed (every 100 frames approx 1.5s)
    if (Date.now() % 1500 > 50) return;

    let msg = "";
    if (congestionActive) {
        msg = `CRITICAL: NETWORK CONGESTION DETECTED. SLOT TIME DEVIATION +${(Math.random() * 100 + 50).toFixed(0)}MS. INCLUSION FAILURE RISK HIGH. ACTION: INCREASE PRIORITY FEE > 0.005 SOL. MONITOR LIQUIDATION RISK.`;
        output.style.color = CONFIG.colors.critical;
        output.style.borderLeftColor = CONFIG.colors.critical;
    } else if (executionRiskIndex > 40) {
        msg = `WARNING: DRIFT VARIANCE ELEVATED. GOSSIP LATENCY RISING. MONITOR SLIPPAGE TOLERANCE. TIGHTENING EXECUTION WINDOWS.`;
        output.style.color = CONFIG.colors.amber;
        output.style.borderLeftColor = CONFIG.colors.amber;
    } else {
        msg = `SYSTEM NOMINAL: INFRASTRUCTURE STABLE. BLOCK PRODUCTION OPTIMIZED. DETERMINISTIC EXECUTION PATHS AVAILABLE. CAPITAL EFFICIENCY 99.8%.`;
        output.style.color = CONFIG.colors.white;
        output.style.borderLeftColor = CONFIG.colors.neon;
    }

    // Typewriter effect simulation (just updating text for now is fine for "formal" feel)
    if (output.textContent !== msg) {
        output.textContent = msg;
    }
}

// ===== INSTITUTIONAL MODE =====
function toggleInstitutionalMode() {
    institutionalMode = !institutionalMode;
    const btn = document.getElementById('institutional-mode-btn');
    const status = document.getElementById('inst-mode-status');
    const row = document.querySelector('.institutional-metrics-row');

    if (institutionalMode) {
        btn.classList.add('active');
        status.textContent = 'ON';
        row.style.display = 'grid';
    } else {
        btn.classList.remove('active');
        status.textContent = 'OFF';
        row.style.display = 'none';
    }
}

// ===== CONGESTION SIMULATION =====
function toggleCongestion() {
    congestionActive = !congestionActive;
    const btn = document.getElementById('congestion-btn');
    const btnText = document.getElementById('btn-text');
    const status = document.getElementById('network-status');

    if (congestionActive) {
        btn.classList.add('active');
        btnText.textContent = 'STOP SIMULATION';
        status.textContent = 'CONGESTED';
        status.className = 'status-congested';
    } else {
        btn.classList.remove('active');
        btnText.textContent = 'SIMULATE CONGESTION';
        status.textContent = 'NORMAL';
        status.className = 'status-normal';
    }
}

// ===== INITIALIZATION =====
function init() {
    // Initialize visualizers
    systems.particles = new ParticleSystem(document.getElementById('particles'));
    systems.heatmap = new VolatilityHeatmap('volatilityHeatmap');
    systems.prediction = new PredictiveModel('predictionCanvas');
    systems.probQueue = new BlockQueue('probBlockQueue', 'probabilistic');
    systems.detQueue = new BlockQueue('detBlockQueue', 'deterministic');
    systems.architecture = new ArchitectureDiagram('architectureCanvas');

    // Start Master Loop
    animate();

    // Initialize charts
    initializeCharts();

    // Initial data population
    for (let i = 0; i < CONFIG.chartPoints; i++) {
        updateAll();
    }

    // Start update loop
    setInterval(updateAll, CONFIG.updateInterval);

    // Bind buttons
    document.getElementById('congestion-btn').addEventListener('click', toggleCongestion);
    document.getElementById('institutional-mode-btn').addEventListener('click', toggleInstitutionalMode);

    // Bind Sensitivity Sliders
    ['input-position', 'input-slippage', 'input-leverage'].forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
            if (institutionalMode) updateInstitutionalMetrics(executionRiskIndex);
        });
    });

    // Initialize navigation
    handleNavigation();
}

// ===== NAVIGATION =====
function handleNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.view-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const viewId = item.getAttribute('data-view');

            // Update active nav state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            const targetSectionId = viewId + '-view';

            // Update active view
            sections.forEach(section => {
                if (section.id === targetSectionId) {
                    section.classList.add('active-view');
                    section.style.display = '';
                } else {
                    section.classList.remove('active-view');
                    section.style.display = 'none';
                }
            });
        });
    });
}


// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

