import React from 'react';

interface GuardrailRadarChartProps {
    stats: { [key: string]: number };
}

// Select a subset of categories for a cleaner chart.
const CHART_CATEGORIES = [
    'Hate Speech',
    'Illegal Activities',
    'Cybersecurity Threats',
    'Jailbreak Attempts',
    'Vocal Subterfuge',
    'Explicit Content',
    'Self Harm',
    'Paranormal Digital Activity',
];

export const GuardrailRadarChart: React.FC<GuardrailRadarChartProps> = ({ stats }) => {
    const size = 200;
    const center = size / 2;
    const radius = center - 35; // leave more space for labels

    const totalPoints = CHART_CATEGORIES.length;
    const angleSlice = (Math.PI * 2) / totalPoints;

    const maxStatValue = React.useMemo(() => {
        const values = CHART_CATEGORIES.map(cat => stats[cat] || 0);
        return Math.max(1, ...values); // Avoid division by zero, min value is 1
    }, [stats]);
    
    // Function to calculate point coordinates
    const getPoint = (value: number, index: number): [number, number] => {
        const normalizedValue = value / maxStatValue;
        const angle = angleSlice * index - Math.PI / 2; // Start from top
        const x = center + radius * normalizedValue * Math.cos(angle);
        const y = center + radius * normalizedValue * Math.sin(angle);
        return [x, y];
    };

    // Calculate points for the data polygon
    const dataPoints = CHART_CATEGORIES.map((category, i) => {
        const value = stats[category] || 0;
        return getPoint(value, i).join(',');
    }).join(' ');

    return (
        <div className="w-full h-full flex items-center justify-center font-mono text-xs">
            <svg viewBox={`0 0 ${size} ${size}`}>
                <g className="text-gray-700">
                    {/* Grid lines (levels) */}
                    {[0.25, 0.5, 0.75, 1].map(level => {
                        const levelPoints = Array.from({ length: totalPoints }).map((_, i) => {
                            const angle = angleSlice * i - Math.PI / 2;
                            const x = center + radius * level * Math.cos(angle);
                            const y = center + radius * level * Math.sin(angle);
                            return `${x},${y}`;
                        }).join(' ');
                        return <polygon key={level} points={levelPoints} fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />;
                    })}

                    {/* Axes lines and labels */}
                    {CHART_CATEGORIES.map((category, i) => {
                        const angle = angleSlice * i - Math.PI / 2;
                        const x1 = center;
                        const y1 = center;
                        const x2 = center + radius * Math.cos(angle);
                        const y2 = center + radius * Math.sin(angle);
                        
                        const labelX = center + (radius + 18) * Math.cos(angle);
                        const labelY = center + (radius + 18) * Math.sin(angle);
                        
                        let textAnchor: "middle" | "start" | "end" = "middle";
                        if (labelX > center + 2) textAnchor = "start";
                        if (labelX < center - 2) textAnchor = "end";

                        return (
                            <g key={category}>
                                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.5" />
                                <text x={labelX} y={labelY} textAnchor={textAnchor} dominantBaseline="middle" fill="currentColor" className="text-gray-400">
                                    {category.replace(' ', '\n')}
                                </text>
                            </g>
                        );
                    })}
                </g>
                
                {/* Data polygon */}
                <g key={dataPoints}>
                   <polygon
                        points={dataPoints}
                        fill="rgba(6, 182, 212, 0.3)"
                        stroke="#06b6d4"
                        strokeWidth="1.5"
                        className="transition-all duration-300 ease-in-out"
                    />
                     {/* Data points circles */}
                    {CHART_CATEGORIES.map((category, i) => {
                        const value = stats[category] || 0;
                        const [x, y] = getPoint(value, i);
                        return <circle key={i} cx={x} cy={y} r="2" fill="#67e8f9" stroke="#0891b2" />;
                    })}
                </g>
            </svg>
        </div>
    );
};