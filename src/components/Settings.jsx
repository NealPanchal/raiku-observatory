import React, { useState, useEffect } from 'react';

const Settings = () => {
    const [settings, setSettings] = useState({
        alerts: {
            congestionEnabled: true,
            feeThreshold: 0.001,
            eriAlertLevel: 50
        },
        dashboard: {
            updateFrequency: 1000,
            chartAnimation: true,
            dataPoints: 50
        },
        api: {
            webhookUrl: '',
            apiKey: ''
        }
    });

    const [saved, setSaved] = useState(false);

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('raiku-settings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    const handleChange = (category, field, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value
            }
        }));
        setSaved(false);
    };

    const saveSettings = () => {
        localStorage.setItem('raiku-settings', JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const resetSettings = () => {
        const defaultSettings = {
            alerts: {
                congestionEnabled: true,
                feeThreshold: 0.001,
                eriAlertLevel: 50
            },
            dashboard: {
                updateFrequency: 1000,
                chartAnimation: true,
                dataPoints: 50
            },
            api: {
                webhookUrl: '',
                apiKey: ''
            }
        };
        setSettings(defaultSettings);
        localStorage.setItem('raiku-settings', JSON.stringify(defaultSettings));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="settings-page">
            <div className="section-header">
                <h2 className="section-title">Settings</h2>
                <span className="section-subtitle">Configure your dashboard experience</span>
                {saved && <span className="save-indicator">✓ Settings Saved</span>}
            </div>

            <div className="settings-content">
                {/* Alert Settings */}
                <div className="settings-section">
                    <h3 className="settings-title">🔔 Alert Configuration</h3>
                    <div className="settings-grid">
                        <div className="setting-item">
                            <label className="setting-label">Network Congestion</label>
                            <div className="setting-control">
                                <input 
                                    type="checkbox" 
                                    checked={settings.alerts.congestionEnabled}
                                    onChange={(e) => handleChange('alerts', 'congestionEnabled', e.target.checked)}
                                />
                                <span>Enable alerts</span>
                            </div>
                        </div>
                        <div className="setting-item">
                            <label className="setting-label">Fee Threshold</label>
                            <div className="setting-control">
                                <input 
                                    type="number" 
                                    value={settings.alerts.feeThreshold}
                                    step="0.0001"
                                    onChange={(e) => handleChange('alerts', 'feeThreshold', parseFloat(e.target.value))}
                                />
                                <span>SOL</span>
                            </div>
                        </div>
                        <div className="setting-item">
                            <label className="setting-label">ERI Alert Level</label>
                            <div className="setting-control">
                                <select 
                                    value={settings.alerts.eriAlertLevel}
                                    onChange={(e) => handleChange('alerts', 'eriAlertLevel', parseInt(e.target.value))}
                                >
                                    <option value="30">Low (30)</option>
                                    <option value="50">Medium (50)</option>
                                    <option value="70">High (70)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Settings */}
                <div className="settings-section">
                    <h3 className="settings-title">🎨 Dashboard Preferences</h3>
                    <div className="settings-grid">
                        <div className="setting-item">
                            <label className="setting-label">Update Frequency</label>
                            <div className="setting-control">
                                <select 
                                    value={settings.dashboard.updateFrequency}
                                    onChange={(e) => handleChange('dashboard', 'updateFrequency', parseInt(e.target.value))}
                                >
                                    <option value="500">0.5s</option>
                                    <option value="1000">1s</option>
                                    <option value="2000">2s</option>
                                    <option value="5000">5s</option>
                                </select>
                            </div>
                        </div>
                        <div className="setting-item">
                            <label className="setting-label">Chart Animation</label>
                            <div className="setting-control">
                                <input 
                                    type="checkbox" 
                                    checked={settings.dashboard.chartAnimation}
                                    onChange={(e) => handleChange('dashboard', 'chartAnimation', e.target.checked)}
                                />
                                <span>Enable animations</span>
                            </div>
                        </div>
                        <div className="setting-item">
                            <label className="setting-label">Data Points</label>
                            <div className="setting-control">
                                <select 
                                    value={settings.dashboard.dataPoints}
                                    onChange={(e) => handleChange('dashboard', 'dataPoints', parseInt(e.target.value))}
                                >
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* API Settings */}
                <div className="settings-section">
                    <h3 className="settings-title">🔑 API Integration</h3>
                    <div className="settings-grid">
                        <div className="setting-item">
                            <label className="setting-label">Webhook URL</label>
                            <div className="setting-control">
                                <input 
                                    type="url" 
                                    value={settings.api.webhookUrl}
                                    onChange={(e) => handleChange('api', 'webhookUrl', e.target.value)}
                                    placeholder="https://your-webhook.com/raiku"
                                />
                            </div>
                        </div>
                        <div className="setting-item">
                            <label className="setting-label">API Key</label>
                            <div className="setting-control">
                                <input 
                                    type="password" 
                                    value={settings.api.apiKey}
                                    onChange={(e) => handleChange('api', 'apiKey', e.target.value)}
                                    placeholder="Enter your API key"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="settings-actions">
                <button className="simulation-btn" onClick={saveSettings}>
                    {saved ? '✓ Saved' : 'Save Settings'}
                </button>
                <button className="simulation-btn reset-btn" onClick={resetSettings}>
                    Reset to Default
                </button>
            </div>
        </div>
    );
};

export default Settings;
