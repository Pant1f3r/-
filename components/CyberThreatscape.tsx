
import React, { useState, useEffect } from 'react';
import { GuardrailResult } from '../services/types';
import { NeoIcon } from './NeoIcon'; // KR0M3D1A Core
import { ShieldCheckIcon } from './icons/ShieldCheckIcon'; // Guardrail
import { TargetIcon } from './icons/TargetIcon'; // Hostile Entity

interface CyberThreatscapeProps {
    guardrailResult: GuardrailResult | null;
}

type AnimationState = 'analyzing' | 'blocked' | 'defended';

const statusMessages: { [key in AnimationState]: string[] } = {
    analyzing: [
        "INITIALIZING NεΩ CORE...",
        "CALIBRATING K.L.I.N.G. PROTOCOL...",
        "ROUTING THROUGH DEJA' VU FILTERS...",
        "TRIANGULATING VULNERABILITY...",
        "CROSS-REFERENCING THREAT INTEL...",
        "COMPILING COUNTERMEASURES...",
    ],
    blocked: [
        "MALICIOUS INPUT DETECTED!",
        "GUARDRAIL POLICY VIOLATED.",
        "THREAT NEUTRALIZED AT PERIMETER.",
        "SYSTEM INTEGRITY MAINTAINED.",
        "LOGGING INCIDENT...",
        "ANALYSIS TERMINATED.",
    ],
    defended: [
        "INPUT VALIDATED.",
        "GUARDRAILS CONFIRM NOMINAL RISK.",
        "PROCEEDING WITH ANALYSIS...",
        "THREAT VECTOR SIMULATION CLEAR.",
        "GENERATING REPORT...",
        "STANDBY FOR OUTPUT...",
    ],
};

export const CyberThreatscape: React.FC<CyberThreatscapeProps> = ({ guardrailResult }) => {
    const [animationState, setAnimationState] = useState<AnimationState>('analyzing');
    const [statusIndex, setStatusIndex] = useState(0);

    useEffect(() => {
        if (guardrailResult) {
            setAnimationState(guardrailResult.isAllowed ? 'defended' : 'blocked');
            setStatusIndex(0); // Reset message index for new state
        }
    }, [guardrailResult]);

    useEffect(() => {
        const messageArray = statusMessages[animationState];
        const interval = setInterval(() => {
            setStatusIndex(prev => (prev + 1) % messageArray.length);
        }, animationState === 'analyzing' ? 600 : 800);

        return () => clearInterval(interval);
    }, [animationState]);

    const getEdgeClass = () => {
        switch(animationState) {
            case 'blocked':
                return 'stroke-red-500 threatscape-edge-blocked';
            case 'defended':
                return 'stroke-green-500 threatscape-edge-defended';
            case 'analyzing':
            default:
                return 'stroke-cyan-400 threatscape-edge-attack';
        }
    };

    return (
        <div className={`relative w-full h-full bg-gray-900 text-cyan-400 font-mono rounded-md overflow-hidden flex flex-col justify-between p-4
            ${animationState === 'blocked' ? 'threatscape-glitch' : ''}`}
        >
            <div className="absolute inset-0 bg-grid-cyan opacity-20"></div>
            <div className="scanline"></div>

            <h3 className="text-lg text-flicker">[ NεΩ THREAT SIMULATION RUNNING ]</h3>

            <div className="flex-grow flex items-center justify-center">
                <svg viewBox="0 0 300 150" className="w-full h-full max-h-48">
                    {/* Nodes */}
                    <g className="threatscape-node text-red-500" style={{ animationDelay: '0s' }}>
                        <TargetIcon x="10" y="55" width="40" height="40" />
                        <text x="30" y="105" fill="currentColor" textAnchor="middle" fontSize="10">HOSTILE</text>
                    </g>
                    <g className="threatscape-node text-purple-400" style={{ animationDelay: '0.2s' }}>
                         <ShieldCheckIcon x="130" y="55" width="40" height="40" />
                         <text x="150" y="105" fill="currentColor" textAnchor="middle" fontSize="10">GUARDRAIL</text>
                    </g>
                    <g className="threatscape-node text-cyan-400" style={{ animationDelay: '0.4s' }}>
                        <NeoIcon x="250" y="55" width="40" height="40" />
                        <text x="270" y="105" fill="currentColor" textAnchor="middle" fontSize="10">KR0M3D1A</text>
                    </g>
                    {/* Edges */}
                    <line x1="50" y1="75" x2="130" y2="75" strokeWidth="2" className={getEdgeClass()} />
                    <line 
                        x1="170" y1="75" x2="250" y2="75" 
                        strokeWidth="2" 
                        className={animationState === 'blocked' ? 'stroke-gray-600' : getEdgeClass()}
                        style={animationState === 'blocked' ? { strokeDasharray: '2 2'} : {}}
                    />
                </svg>
            </div>
            
            <div className="border-t border-cyan-500/30 pt-2 h-8">
                 <p><span className="text-gray-500 mr-2">&gt;</span>{statusMessages[animationState][statusIndex]}</p>
            </div>
        </div>
    );
};
