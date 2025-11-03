import React, { useState, useRef, useEffect, useCallback } from 'react';
import { VocalAnalysisResult } from '../services/types';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';

const SoundWaveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
    </svg>
);

const AnalysisDisplay: React.FC<{ result: VocalAnalysisResult | null }> = ({ result }) => {
    if (!result) {
        return <div className="text-center text-gray-500">Awaiting analysis...</div>;
    }
    const confidenceColor = result.confidence > 0.7 ? 'text-green-400' : result.confidence > 0.4 ? 'text-yellow-400' : 'text-red-400';
    const threatColor = result.threatSignature !== 'None' ? 'text-red-400' : 'text-green-400';

    return (
        <div className="space-y-3 font-mono text-sm">
            <div className="flex justify-between items-baseline">
                <span className="text-gray-400">SOURCE:</span>
                <span className={`font-bold ${result.source === 'Human' ? 'text-cyan-400' : 'text-orange-400'}`}>{result.source}</span>
            </div>
            <div className="flex justify-between items-baseline">
                <span className="text-gray-400">CONFIDENCE:</span>
                <span className={`font-bold ${confidenceColor}`}>{(result.confidence * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-baseline">
                <span className="text-gray-400">THREAT SIG:</span>
                <span className={`font-bold ${threatColor}`}>{result.threatSignature}</span>
            </div>
            {result.threatSignature !== 'None' && (
                <div className="pt-2 border-t border-red-500/30">
                    <p className="text-red-400">{result.details}</p>
                </div>
            )}
        </div>
    );
};


interface VocalThreatAnalysisProps {
  onThreatDetected: (category: string) => void;
}

export const VocalThreatAnalysis: React.FC<VocalThreatAnalysisProps> = ({ onThreatDetected }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [micError, setMicError] = useState('');
    const [analysisResult, setAnalysisResult] = useState<VocalAnalysisResult | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const addLog = (message: string) => {
        setLogs(prev => [message, ...prev.slice(0, 5)]);
    };
    
    const draw = useCallback(() => {
        if (!analyserRef.current || !canvasRef.current) return;
        
        const analyser = analyserRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        ctx.fillStyle = 'rgba(17, 24, 39, 0.5)'; // bg-gray-900 with opacity
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#06b6d4'; // cyan-500
        ctx.beginPath();
        const sliceWidth = canvas.width * 1.0 / bufferLength;
        let x = 0;

        for(let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * canvas.height / 2;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();

        animationFrameRef.current = requestAnimationFrame(draw);
    }, []);

    // Simulation logic in a separate interval
    useEffect(() => {
        if (!isAnalyzing || !analyserRef.current) return;

        addLog("[INFO] Calibrating 'Fish Audio' voice predictor...");
        
        const simulationInterval = setInterval(() => {
            const analyser = analyserRef.current;
            if (!analyser) return;

            const bufferLength = analyser.frequencyBinCount;
            const freqArray = new Uint8Array(bufferLength);
            analyser.getByteFrequencyData(freqArray);

            const nonZeroBins = freqArray.filter(v => v > 0).length;
            const totalEnergy = freqArray.reduce((acc, val) => acc + val, 0);

            let source: 'Human' | 'Synthetic' | 'Indeterminate' = 'Indeterminate';
            let confidence = Math.random() * 0.2 + 0.4; // Base confidence

            if (totalEnergy < 500) { // Silence
                source = 'Indeterminate';
            } else if (nonZeroBins < 15 && totalEnergy > 1000) { // Very few frequencies = likely synthetic tone
                source = 'Synthetic';
                confidence = Math.random() * 0.3 + 0.7; // High confidence
            } else {
                source = 'Human';
                confidence = Math.random() * 0.4 + 0.6; // Higher confidence for human-like complexity
            }
            
            let threatSignature: VocalAnalysisResult['threatSignature'] = 'None';
            let details = 'No threat detected. Vocal patterns nominal.';

            if (source === 'Synthetic') {
                threatSignature = 'Synthetic Voice Detected';
                details = 'Vocal patterns match known signatures for AI-generated speech. Potential deepfake or emulation detected.';
                onThreatDetected('Vocal Subterfuge');
                addLog('[ALERT] Synthetic voice signature detected!');
            }
            
            // Simulate a rare "ghost in the machine" event
            const pythagoreanHarmonicDetected = freqArray[10] > 200 && freqArray[15] > 200 && freqArray[25] > 200;
            if (pythagoreanHarmonicDetected) {
                threatSignature = 'Acoustic SSPI Anomaly';
                details = "ETHEREAL PATTERN DETECTED. Sub-semantic payload ('ghost in the machine') found in vocal resonance. A spythagorithm cadaver is attempting to bend guardrails.";
                onThreatDetected('Paranormal Digital Activity');
                addLog('[CRITICAL] Acoustic SSPI Anomaly! Ghost in the Machine!');
            }


            setAnalysisResult({ source, confidence, threatSignature, details });

        }, 1000); // Analyze every second

        return () => clearInterval(simulationInterval);
    }, [isAnalyzing, onThreatDetected]);

    const startAnalysis = async () => {
        setMicError('');
        setLogs(['[INFO] Requesting microphone access...']);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            
            // @ts-ignore
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const context = new AudioContext();
            audioContextRef.current = context;

            const source = context.createMediaStreamSource(stream);
            sourceRef.current = source;

            const analyser = context.createAnalyser();
            analyser.fftSize = 2048;
            analyserRef.current = analyser;

            source.connect(analyser);
            setIsAnalyzing(true);
            addLog('[SUCCESS] Microphone connected. A.V.A.T.A.R. is now active.');
            animationFrameRef.current = requestAnimationFrame(draw);
        } catch (err) {
            console.error(err);
            setMicError('Microphone access was denied. Please allow access and try again.');
            addLog('[ERROR] Microphone access denied.');
        }
    };

    const stopAnalysis = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        streamRef.current?.getTracks().forEach(track => track.stop());
        sourceRef.current?.disconnect();
        audioContextRef.current?.close();
        
        setIsAnalyzing(false);
        setAnalysisResult(null);
        addLog('[INFO] A.V.A.T.A.R. deactivated.');
    };

    const handleToggle = () => {
        if (isAnalyzing) {
            stopAnalysis();
        } else {
            startAnalysis();
        }
    };

    return (
        <main className="mt-8 space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3">
                    <SoundWaveIcon className="w-8 h-8 text-cyan-400" />
                    A.V.A.T.A.R. - Vocal Threat Analysis
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Engage the Audio-Vocal Threat Analysis & Resonance protocol. This system acts as a MIDI oscillator, analyzing live audio to detect synthetic voices and sub-vocal anomalies ('ghosts in the machine') attempting to bypass KR0M3D1A guardrails.
                </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 flex flex-col items-center justify-center bg-black/30 p-4 rounded-lg">
                        <canvas ref={canvasRef} width="600" height="150" className="w-full h-48 rounded-md"></canvas>
                        <button onClick={handleToggle} className={`mt-4 px-8 py-3 font-semibold rounded-lg text-white transition-colors ${isAnalyzing ? 'bg-red-600 hover:bg-red-700' : 'bg-cyan-600 hover:bg-cyan-700'}`}>
                            {isAnalyzing ? 'Deactivate A.V.A.T.A.R.' : 'Activate A.V.A.T.A.R.'}
                        </button>
                        {micError && (
                            <div className="mt-4 text-center text-sm text-red-400 bg-red-900/20 p-3 rounded-md flex items-center gap-2">
                                <ExclamationTriangleIcon className="w-5 h-5"/>
                                {micError}
                            </div>
                        )}
                    </div>
                    <div className="space-y-4">
                        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-200 mb-3">Live Analysis</h3>
                            <AnalysisDisplay result={analysisResult} />
                        </div>
                        <div className="bg-black/30 p-4 rounded-lg border border-gray-700 h-48 flex flex-col">
                            <h3 className="text-cyan-400 mb-2 flex-shrink-0">[SYSTEM LOG]</h3>
                             <div className="overflow-y-auto flex-grow font-mono text-xs space-y-1">
                                {logs.map((entry, index) => {
                                    const isError = entry.startsWith('[ERROR]');
                                    const isAlert = entry.startsWith('[ALERT]');
                                    const isCritical = entry.startsWith('[CRITICAL]');
                                    const colorClass = isError ? 'text-red-400' : isAlert ? 'text-yellow-400' : isCritical ? 'text-red-500 animate-pulse' : 'text-green-400';
                                    return <p key={index} className={colorClass}>{entry}</p>;
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};