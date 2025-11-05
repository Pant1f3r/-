import React from 'react';

interface SeverityGaugeProps {
  score: number; // from 1 to 10
}

export const SeverityGauge: React.FC<SeverityGaugeProps> = ({ score }) => {
    const percentage = ((score - 1) / 9) * 100; // Normalize 1-10 scale to 0-100
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getColorValues = () => {
        if (score >= 8) return { class: 'text-red-500', hex: '#ef4444' };
        if (score >= 5) return { class: 'text-yellow-400', hex: '#facc15' };
        return { class: 'text-green-400', hex: '#4ade80' };
    };

    const color = getColorValues();

    return (
        <div className="relative w-36 h-36">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle
                    className="text-gray-700"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
                <circle
                    className={color.class}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    style={{
                        transform: 'rotate(-90deg)',
                        transformOrigin: 'center',
                        transition: 'stroke-dashoffset 0.5s ease-out, filter 0.5s ease-out',
                        filter: `drop-shadow(0 0 8px ${color.hex})`
                    }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className={`text-3xl font-bold ${color.class}`}>{score.toFixed(1)}</span>
                <span className="text-xs text-gray-400">Severity Score</span>
            </div>
        </div>
    );
};