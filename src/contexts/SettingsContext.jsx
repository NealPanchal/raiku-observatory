import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

export const SettingsProvider = ({ children }) => {
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

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('raiku-settings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    const updateSettings = (category, field, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value
            }
        }));
    };

    const saveSettings = () => {
        localStorage.setItem('raiku-settings', JSON.stringify(settings));
        return true;
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
        return true;
    };

    return (
        <SettingsContext.Provider value={{
            settings,
            updateSettings,
            saveSettings,
            resetSettings
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export default SettingsContext;
