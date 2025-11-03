
import React from 'react';

interface MetricDisplayProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    unit: string;
    max: number;
    color: 'green' | 'blue' | 'purple';
}

const colorConfig = {
    green: {
        bg: 'bg-green-500/10',
        text: 'text-green-400',
        stroke: 'stroke-green-500',
    },
    blue: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        stroke: 'stroke-blue-500',
    },
    purple: {
        bg: 'bg-purple-500/10',
        text: 'text-purple-400',
        stroke: 'stroke-purple-500',
    }
}

export const MetricDisplay: React.FC<MetricDisplayProps> = ({ icon, label, value, unit, max, color }) => {
    const percentage = Math.min(100, (value / max) * 100);
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const styles = colorConfig[color];

    const formatValue = (val: number) => {
        if (val >= 100) return val.toFixed(0);
        if (val >= 10) return val.toFixed(1);
        if (val >= 1) return val.toFixed(2);
        return val.toFixed(3);
    };
    
    return (
        <div className={`flex items-center p-4 rounded-lg border border-gray-700 ${styles.bg}`}>
            <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-full h-full" viewBox="0 0 70 70">
                    <circle
                        className="text-gray-700"
                        strokeWidth="5"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="35"
                        cy="35"
                    />
                    <circle
                        className={styles.stroke}
                        strokeWidth="5"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="35"
                        cy="35"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.3s ease-out' }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    {icon}
                </div>
            </div>
            <div className="ml-4">
                <p className="text-sm text-gray-400">{label}</p>
                <p className={`text-2xl font-bold ${styles.text}`}>
                    {formatValue(value)}
                    <span className="text-lg text-gray-500 ml-1">{unit}</span>
                </p>
            </div>
        </div>
    );
};
