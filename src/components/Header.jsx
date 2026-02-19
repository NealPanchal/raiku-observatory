import React from 'react';

const Header = () => {
    return (
        <header className="header-compact">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img 
                    src="/shorthand.png" 
                    alt="RAIKU" 
                    style={{ 
                        height: '36px', 
                        width: 'auto',
                        filter: 'drop-shadow(0 0 8px rgba(192, 255, 56, 0.4))',
                        marginRight: '12px'
                    }} 
                />
                <div>
                    <h1 className="title-compact">RAIKU EXECUTION OBSERVATORY</h1>
                    <div className="subtitle-compact">LIVE INFRASTRUCTURE MONITORING</div>
                </div>
            </div>

            {/* ERI Logic will be moved to Dashboard or lifted up context, keeping header simple for now */}
            <div className="text-neon" style={{ fontWeight: 'bold' }}>
                NET_ID: MAINNET-BETA
            </div>
        </header>
    );
};

export default Header;
