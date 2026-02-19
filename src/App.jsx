import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Particles from './components/Particles';
import { SettingsProvider } from './contexts/SettingsContext';

function App() {
    const [activeView, setActiveView] = useState('dashboard');
    const [simulationState, setSimulationState] = useState({
        congestion: false,
        institutional: false
    });

    return (
        <SettingsProvider>
            <div className="app-container">
                <div className="grid-background"></div>
                <Particles />

                <div className="dashboard-wrapper">
                    <Sidebar activeView={activeView} setActiveView={setActiveView} />

                    <main className="main-content">
                        <Header />

                        {activeView === 'dashboard' && (
                            <Dashboard simulationState={simulationState} setSimulationState={setSimulationState} />
                        )}

                        {activeView === 'settings' && (
                            <Settings />
                        )}

                        {activeView !== 'dashboard' && activeView !== 'settings' && (
                            <div className="glass-panel" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <h2 className="text-neon" style={{ fontSize: '2rem' }}>COMING SOON</h2>
                            </div>
                        )}
                    </main>
                </div>
                
                <div className="developer-credit">
                    <span>Developed by </span>
                    <a href="https://x.com/Oreganoflakess" target="_blank" rel="noopener noreferrer" className="developer-link">
                        0regan0flakes
                    </a>
                </div>
            </div>
        </SettingsProvider>
    );
}

export default App;
