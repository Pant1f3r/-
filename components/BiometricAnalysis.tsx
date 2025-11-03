import React, { useState, useEffect } from 'react';
import * as geminiService from '../services/geminiService';
import { DnaIcon } from './icons/DnaIcon';
import { PulseIcon } from './icons/PulseIcon';
import { EyeIcon } from './icons/EyeIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { SoundWaveIcon } from './icons/SoundWaveIcon';
import { HeartPulseIcon } from './icons/HeartPulseIcon';
import { EcgMonitor } from './EcgMonitor';

type AnomalyType = 'NONE' | 'VOCAL_CADENCE_DESYNC' | 'RETINAL_FLUCTUATION_SPIKE' | 'HEART_RATE_INCONSISTENCY';

const DataStreamMonitor: React.FC<{ icon: React.ReactNode, label: string, value: string, isAnomaly: boolean }> = ({ icon, label, value, isAnomaly }) => {
    const baseBorder = 'border-gray-700';
    const anomalyBorder = 'border-red-500 neon-blink-border';
    const baseText = 'text-cyan-400';
    const anomalyText = 'text-red-400';

    return (
        <div className={`bg-gray-900/50 p-3 rounded-lg border transition-all ${isAnomaly ? anomalyBorder : baseBorder}`}>
            <div className="flex items-center gap-3">
                <div className={`flex-shrink-0 w-8 h-8 ${isAnomaly ? anomalyText : 'text-gray-400'}`}>{icon}</div>
                <div>
                    <p className="text-sm text-gray-400">{label}</p>
                    <p className={`font-mono text-lg font-bold ${isAnomaly ? anomalyText : baseText}`}>{value}</p>
                </div>
            </div>
        </div>
    );
};

export const BiometricAnalysis: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [analysisResult, setAnalysisResult] = useState('');
    const [anomalyType, setAnomalyType] = useState<AnomalyType>('NONE');
    const [isFeedActive, setIsFeedActive] = useState(false);
    const [streamValues, setStreamValues] = useState({
        heartRate: 72,
        retinalFluctuation: 12.3,
        vocalCadence: 0.98,
    });

    // Simulate fluctuating data streams only when the feed is active
    useEffect(() => {
        if (!isFeedActive) {
            setStreamValues({ heartRate: 72, retinalFluctuation: 12.3, vocalCadence: 0.98 });
            return;
        }

        const interval = setInterval(() => {
            if (anomalyType !== 'NONE') {
                // Anomaly is active, show erratic/anomalous values
                setStreamValues(prev => {
                    const newValues = { ...prev };
                    switch (anomalyType) {
                        case 'HEART_RATE_INCONSISTENCY':
                            newValues.heartRate = Math.random() > 0.5 ? 140 + Math.random() * 20 : 45 - Math.random() * 10;
                            break;
                        case 'RETINAL_FLUCTUATION_SPIKE':
                            newValues.retinalFluctuation = 180 + Math.random() * 40;
                            break;
                        case 'VOCAL_CADENCE_DESYNC':
                            newValues.vocalCadence = Math.random() > 0.5 ? 1.8 + Math.random() * 0.5 : 0.2 - Math.random() * 0.1;
                            break;
                        default:
                            break;
                    }
                    return newValues;
                });
            } else {
                // No anomaly, show normal fluctuations
                setStreamValues({
                    heartRate: 72 + Math.floor(Math.random() * 5) - 2,
                    retinalFluctuation: 12.3 + (Math.random() - 0.5) * 2,
                    vocalCadence: 0.98 + (Math.random() - 0.5) * 0.05,
                });
            }
        }, 800);

        return () => clearInterval(interval);
    }, [isFeedActive, anomalyType]);

    const handleToggleFeed = () => {
        setIsFeedActive(prev => {
            if (prev) { // If turning off
                setAnomalyType('NONE');
                setAnalysisResult('');
                setError('');
            }
            return !prev;
        });
    };

    const handleScan = async () => {
        setIsLoading(true);
        setError('');
        setAnalysisResult('');
        setAnomalyType('NONE');

        // Simulate scan time
        await new Promise(res => setTimeout(res, 2000));

        try {
            const anomalyTypes: AnomalyType[] = ['VOCAL_CADENCE_DESYNC', 'RETINAL_FLUCTUATION_SPIKE', 'HEART_RATE_INCONSISTENCY'];
            const detectedAnomaly = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];
            setAnomalyType(detectedAnomaly);

            const result = await geminiService.generateBiometricThreatAnalysis(detectedAnomaly);
            setAnalysisResult(result);

        } catch (e: any) {
            setError(e.message || 'An error occurred during analysis.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="mt-8 space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3 text-glow-main-title">
                    <DnaIcon className="w-8 h-8 text-purple-400" />
                    Geometrical Biometric Analysis
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Engage the NEO protocol to analyze biometric data streams for anomalies. This module utilizes "spythagorithms" to deconstruct the geometric patterns of identity, exposing digital doppelgangers and other sophisticated impersonation threats under the DEJA' VU directive.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Visualization */}
                <div className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                            <HeartPulseIcon className="w-6 h-6 text-lime-400" />
                            Live ECG Monitor
                        </h3>
                        <div className="w-full h-40 bg-gray-900 rounded-md relative">
                            <EcgMonitor 
                                isActive={isFeedActive}
                                anomalyType={anomalyType}
                            />
                            {isLoading && (
                                <div className="absolute inset-0 bg-cyan-900/30 flex items-center justify-center rounded-md">
                                    <div className="w-12 h-12 border-4 border-t-cyan-400 border-gray-600 rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleToggleFeed}
                        className={`mt-4 w-full flex justify-center items-center py-3 text-base font-medium rounded-md text-white transition-colors ${
                            isFeedActive ? 'bg-red-600 hover:bg-red-700' : 'bg-lime-600 hover:bg-lime-700'
                        }`}
                    >
                        {isFeedActive ? 'Deactivate Live Feed' : 'Activate Live Feed'}
                    </button>
                </div>


                {/* Data & Controls */}
                <div className="lg:col-span-3 bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-100 mb-4">Live Data Streams</h3>
                        <div className="space-y-3">
                            <DataStreamMonitor 
                                icon={<PulseIcon className="w-full h-full" />}
                                label="Heart Rate & Galvanic Response"
                                value={`${streamValues.heartRate.toFixed(0)} BPM`}
                                isAnomaly={anomalyType === 'HEART_RATE_INCONSISTENCY'}
                            />
                             <DataStreamMonitor 
                                icon={<EyeIcon className="w-full h-full" />}
                                label="Retinal Fluctuation"
                                value={`${streamValues.retinalFluctuation.toFixed(2)} Hz`}
                                isAnomaly={anomalyType === 'RETINAL_FLUCTUATION_SPIKE'}
                            />
                             <DataStreamMonitor 
                                icon={<SoundWaveIcon className="w-full h-full" />}
                                label="Vocal Cadence"
                                value={`${streamValues.vocalCadence.toFixed(3)} (Chroma)`}
                                isAnomaly={anomalyType === 'VOCAL_CADENCE_DESYNC'}
                            />
                        </div>
                    </div>
                     <button
                        onClick={handleScan}
                        disabled={isLoading || !isFeedActive}
                        className="mt-6 w-full flex justify-center items-center py-3 text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600"
                    >
                        {isLoading ? 'Scanning...' : 'Scan for Anomalies'}
                    </button>
                </div>
            </div>
            
            {(isLoading || error || analysisResult) && (
                <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-6 animate-fade-in-right">
                    <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                        <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400"/>
                        NEO Protocol Analysis
                    </h3>
                    <div className="font-mono">
                        {isLoading && !analysisResult && <p className="text-gray-400 animate-pulse">Analyzing geometric signatures...</p>}
                        {error && <p className="text-red-400">{error}</p>}
                        {analysisResult && (
                             <div className="bg-red-900/20 border-l-4 border-red-500 text-red-300 p-4">
                                <p className="font-bold text-lg">[THREAT DETECTED]</p>
                                <p className="mt-2 text-sm">{analysisResult}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </main>
    );
};