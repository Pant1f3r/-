import React from 'react';

export const OhmzNftVisualizer: React.FC = () => {
    return (
        <div className="relative w-full aspect-square flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Gas Particles */}
                {Array.from({ length: 10 }).map((_, i) => (
                    <circle
                        key={i}
                        r="100"
                        cx="100"
                        cy="100"
                        fill="none"
                        className="stroke-purple-400 gas-particle"
                        strokeWidth="1"
                        style={{
                            transformOrigin: 'center',
                            transform: `rotate(${i * 36}deg)`,
                            animationDelay: `${i * 0.5}s`,
                        }}
                    />
                ))}
                
                {/* NEW: Perpetual Ether Ring */}
                <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="url(#perpetualGradient)"
                    strokeWidth="2.5"
                    className="perpetual-ring"
                />

                {/* Pulsing Core */}
                <circle cx="100" cy="100" r="60" fill="url(#coreGradient)" className="ohmz-core" />
                <defs>
                    <radialGradient id="coreGradient">
                        <stop offset="0%" stopColor="#67e8f9" />
                        <stop offset="100%" stopColor="#0891b2" />
                    </radialGradient>
                    <linearGradient id="perpetualGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#d8b4fe" />
                    </linearGradient>
                </defs>

                {/* Fractal Element */}
                <g className="fractal-element">
                    <path
                        d="M100 50 L143.3 75 L143.3 125 L100 150 L56.7 125 L56.7 75 Z"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="1.5"
                        opacity="0.8"
                    />
                     <path
                        d="M100 50 L121.65 62.5 L121.65 87.5 L100 100 L78.35 87.5 L78.35 62.5 Z"
                        fill="rgba(255,255,255,0.2)"
                        stroke="#fff"
                        strokeWidth="1"
                        opacity="0.6"
                    />
                </g>
            </svg>
        </div>
    );
};