import React, { useRef, useEffect } from 'react';

const ArchitectureDiagram = ({ state }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const w = canvas.width = canvas.parentElement.clientWidth;
        const h = canvas.height = canvas.parentElement.clientHeight;
        const cy = h / 2;

        ctx.clearRect(0, 0, w, h);

        // Nodes
        const nodes = [
            { x: w * 0.2, label: 'FRONTEND' },
            { x: w * 0.5, label: 'METRICS ENGINE' },
            { x: w * 0.8, label: 'SOLANA RPC' }
        ];

        // Connections
        ctx.beginPath();
        ctx.strokeStyle = `rgba(192, 255, 56, 0.3)`;
        ctx.moveTo(nodes[0].x + 40, cy);
        ctx.lineTo(nodes[1].x - 40, cy);
        ctx.moveTo(nodes[1].x + 40, cy);
        ctx.lineTo(nodes[2].x - 40, cy);
        ctx.stroke();

        // Data Packets (using state for animation tick)
        const progress = (state * (w / 100)) % w;
        if (progress > nodes[0].x && progress < nodes[2].x) {
            ctx.fillStyle = '#C0FF38';
            ctx.fillRect(progress, cy - 2, 6, 6);
        }

        // Draw Nodes
        nodes.forEach(n => {
            ctx.strokeStyle = '#C0FF38';
            ctx.fillStyle = 'rgba(0,0,0,0.8)';
            ctx.lineWidth = 1;
            ctx.strokeRect(n.x - 40, cy - 15, 80, 30);
            ctx.fillRect(n.x - 40, cy - 15, 80, 30);

            ctx.fillStyle = '#fff';
            ctx.font = '10px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(n.label, n.x, cy);
        });

    }, [state]);

    return (
        <div className="glass-panel" style={{ flex: 0.8, display: 'flex', padding: 0 }}>
            <div style={{ position: 'absolute', top: 10, left: 15, zIndex: 10 }}>
                <span className="text-muted text-xs font-bold uppercase">EXECUTION PIPELINE</span>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
                <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
            </div>
        </div>
    );
};

export default ArchitectureDiagram;
