import React from 'react';

type ColorConfig = {
    from: string;
    to: string;
    text: string;
};

interface MetricGaugeProps {
  title: string;
  value: number;
  unit: string;
  color: 'green' | 'orange' | 'blue' | 'purple' | ColorConfig;
}

const predefinedColorConfig = {
    green: {
        from: '#10B981', // green-500
        to: '#6EE7B7',   // green-300
        text: 'text-green-500 dark:text-green-400'
    },
    orange: {
        from: '#F97316', // orange-500
        to: '#FDBA74',   // orange-300
        text: 'text-orange-500 dark:text-orange-400'
    },
    blue: {
        from: '#3B82F6', // blue-500
        to: '#93C5FD',   // blue-300
        text: 'text-blue-500 dark:text-blue-400'
    },
    purple: {
        from: '#8B5CF6', // purple-500
        to: '#C4B5FD',   // purple-300,
        text: 'text-purple-500 dark:text-purple-400'
    }
}

export const MetricGauge: React.FC<MetricGaugeProps> = ({ title, value, unit, color }) => {
    const config: ColorConfig = typeof color === 'string' ? predefinedColorConfig[color] : color;
    
    const percentage = value / 100;
    const angle = percentage * 180 - 90;
    const circumference = Math.PI * 45;
    const strokeDashoffset = circumference * (1 - (percentage / 2));

    const gradientId = `gradient-${title.replace(/\s+/g, '-')}`;

    return (
        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col items-center justify-between h-full">
            <h4 className="font-semibold text-gray-600 dark:text-gray-400">{title}</h4>
            <div className="relative w-40 h-20 overflow-hidden">
                <svg viewBox="0 0 100 50" className="w-full h-full">
                    <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={config.from} />
                            <stop offset="100%" stopColor={config.to} />
                        </linearGradient>
                    </defs>
                    <path
                        d="M 5 50 A 45 45 0 0 1 95 50"
                        fill="none"
                        stroke="currentColor"
                        className="text-gray-200 dark:text-gray-700"
                        strokeWidth="10"
                    />
                    <path
                        d="M 5 50 A 45 45 0 0 1 95 50"
                        fill="none"
                        stroke={`url(#${gradientId})`}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                    />
                </svg>
                {/* Needle */}
                <div
                    className="absolute bottom-0 left-1/2 w-0.5 h-[3.75rem] bg-gray-600 dark:bg-gray-300 rounded-full origin-bottom"
                    style={{ transform: `translateX(-50%) rotate(${angle}deg)`, transition: 'transform 0.5s ease-out' }}
                ></div>
                <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-gray-600 dark:bg-gray-300 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
            </div>
            <p className={`text-4xl font-bold ${config.text}`}>
                {value.toFixed(1)}<span className="text-2xl">{unit}</span>
            </p>
        </div>
    );
};