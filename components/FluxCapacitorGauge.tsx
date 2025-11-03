import React, { useState, useEffect } from 'react';

export const FluxCapacitorGauge: React.FC = () => {
    const [flux, setFlux] = useState(50); // Start at a neutral 50%

    useEffect(() => {
        // Simulate fluctuating market data
        const interval = setInterval(() => {
            setFlux(prev => {
                const change = (Math.random() - 0.5) * 20; // Fluctuate by up to +/- 10
                const newFlux = prev + change;
                return Math.max(0, Math.min(100, newFlux)); // Clamp between 0 and 100
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const percentage = flux / 100;
    // The gauge is a semi-circle, so we map 0-100 to -90 to 90 degrees
    const angle = percentage * 180 - 90; 
    const circumference = Math.PI * 45; // r=45
    // Correctly calculate the offset for a path that is already a semi-circle
    const strokeDashoffset = circumference * (1 - percentage);

    return (
        <div className="relative w-full h-full flex items-center justify-center">
             <svg viewBox="0 0 100 55" className="w-full h-auto">
                {/* Background arc */}
                <path
                    d="M 5 50 A 45 45 0 0 1 95 50"
                    fill="none"
                    stroke="currentColor"
                    className="text-gray-700"
                    strokeWidth="5"
                />
                {/* Fill arc */}
                <path
                    d="M 5 50 A 45 45 0 0 1 95 50"
                    fill="none"
                    stroke="url(#fluxGradient)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
                <defs>
                    <linearGradient id="fluxGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0891b2" /> {/* cyan-600 */}
                        <stop offset="50%" stopColor="#fde047" /> {/* yellow-300 */}
                        <stop offset="100%" stopColor="#ef4444" /> {/* red-500 */}
                    </linearGradient>
                </defs>
                {/* Needle */}
                <g style={{
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: '50px 50px',
                    transition: 'transform 0.5s ease-in-out'
                }}>
                     <path d="M50 50 L50 10" stroke="currentColor" strokeWidth="1.5" className="text-gray-300" />
                </g>
                <circle cx="50" cy="50" r="3" fill="currentColor" className="text-gray-300" />
            </svg>
        </div>
    );
};