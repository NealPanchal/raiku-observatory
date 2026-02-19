import React from 'react';

const Sidebar = ({ activeView, setActiveView }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'execution', label: 'Execution', icon: '⚡' },
        { id: 'consensus', label: 'Consensus', icon: '🧊' },
        { id: 'markets', label: 'Markets', icon: '📈' },
        { id: 'analytics', label: 'Analytics', icon: '📊' },
        { id: 'alerts', label: 'Alerts', icon: '🔔' },
        { id: 'settings', label: 'Settings', icon: '⚙️' }
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <img 
                    src="/logo.png" 
                    alt="RAIKU" 
                    style={{ 
                        height: '40px', 
                        width: 'auto',
                        marginBottom: '8px'
                    }} 
                />
                <div style={{ fontSize: '0.875rem', color: 'var(--color-muted)', letterSpacing: '1px' }}>
                    EXECUTION OBSERVATORY
                </div>
            </div>
            <ul className="nav-links">
                {menuItems.map(item => (
                    <li
                        key={item.id}
                        className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                        onClick={() => setActiveView(item.id)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {item.label}
                    </li>
                ))}
            </ul>

            <div className="sidebar-footer">
                <div className="status-indicator">
                    <div className="status-dot"></div>
                    ONLINE
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
