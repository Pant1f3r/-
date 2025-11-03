import React from 'react';

interface GuardrailBarChartProps {
    stats: { [key: string]: number };
}

export const GuardrailBarChart: React.FC<GuardrailBarChartProps> = ({ stats }) => {
    // Filter stats to show only categories that have been triggered.
    const filteredStats = (Object.entries(stats) as [string, number][]).filter(([, value]) => value > 0);

    if (filteredStats.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm font-mono">
                No blocked prompts recorded yet.
            </div>
        );
    }

    const svgWidth = 500;
    const svgHeight = 250;
    const margin = { top: 20, right: 20, bottom: 80, left: 40 };
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    const maxCount = Math.ceil(Math.max(...filteredStats.map(([, value]) => value), 1));
    
    const barWidth = chartWidth / filteredStats.length;
    const barPadding = 10;

    // Y-axis ticks
    const numTicks = 5;
    const tickValues = Array.from({ length: numTicks + 1 }, (_, i) => {
        const value = (maxCount / numTicks) * i;
        // Ensure ticks are integers, especially for low counts
        return Math.ceil(value);
    }).filter((v, i, a) => a.indexOf(v) === i); // Remove duplicate ticks if any

    return (
        <div className="w-full h-full flex items-center justify-center font-mono text-xs">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                    {/* Y-axis with ticks and grid lines */}
                    <g className="text-gray-400 dark:text-gray-500">
                        {tickValues.map((tick, i) => (
                            <g key={i} transform={`translate(0, ${chartHeight - (tick / maxCount) * chartHeight})`}>
                                <text x="-5" y="3" textAnchor="end" className="text-xs fill-current">
                                    {tick}
                                </text>
                                <line
                                    x1="0"
                                    x2={chartWidth}
                                    stroke="currentColor"
                                    strokeWidth="0.5"
                                    strokeDasharray="2,3"
                                    opacity="0.5"
                                />
                            </g>
                        ))}
                    </g>
                    
                    {/* Bars and X-axis labels */}
                    {filteredStats.map(([category, count], i) => {
                        const barHeight = count > 0 ? (count / maxCount) * chartHeight : 0;
                        const x = i * barWidth;
                        const y = chartHeight - barHeight;

                        return (
                            <g key={category}>
                                <rect
                                    x={x + barPadding / 2}
                                    y={y}
                                    width={barWidth - barPadding}
                                    height={barHeight}
                                    rx="2"
                                    className="fill-cyan-500/80 hover:fill-cyan-400 transition-colors bar-animated"
                                    style={{ animationDelay: `${i * 50}ms` }}
                                >
                                    <title>{`${category}: ${count} blocks`}</title>
                                </rect>
                                <text
                                    x={x + barWidth / 2}
                                    y={chartHeight + 10}
                                    textAnchor="end"
                                    transform={`rotate(-45, ${x + barWidth / 2}, ${chartHeight + 10})`}
                                    className="text-xs fill-current text-gray-500 dark:text-gray-400"
                                >
                                    {category}
                                </text>
                            </g>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
};