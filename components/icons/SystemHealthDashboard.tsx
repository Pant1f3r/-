import React from 'react';
import { SystemHealthState } from '../../services/types';
import { UsersIcon } from './UsersIcon';
import { PulseIcon } from './PulseIcon';
import { BellIcon } from './BellIcon';
import { MetricGauge } from '../MetricGauge';
import { DistributionMatrix } from '../DistributionMatrix';
import { GuardrailRadarChart } from '../GuardrailRadarChart';
import { GuardrailBarChart } from '../GuardrailBarChart';

interface SystemHealthDashboardProps {
    healthData: SystemHealthState;
    guardrailStats: { [key: string]: number };
}

const LatencyChart: React.FC<{ data: number[] }> = ({ data }) => {
    const svgWidth = 220;
    const svgHeight = 80;
    const margin = { top: 5, right: 10, bottom: 5, left: 30 };
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    const maxVal = Math.ceil(Math.max(...data, 100) / 20) * 20;
    const minVal = 0;

    const getX = (i: number) => margin.left + (i / (data.length - 1)) * chartWidth;
    const getY = (d: number) => margin.top + chartHeight - ((d - minVal) / (maxVal - minVal)) * chartHeight;

    // Helper to generate a smooth Catmull-Rom spline path for a professional curve
    const createSmoothPath = (dataPoints: { x: number, y: number }[]) => {
        if (dataPoints.length < 2) return '';
        let path = `M ${dataPoints[0].x} ${dataPoints[0].y}`;
        for (let i = 0; i < dataPoints.length - 1; i++) {
            const p0 = i > 0 ? dataPoints[i - 1] : dataPoints[0];
            const p1 = dataPoints[i];
            const p2 = dataPoints[i + 1];
            const p3 = i < dataPoints.length - 2 ? dataPoints[i + 2] : p2;
            
            // Catmull-Rom to cubic Bezier conversion for smooth curves
            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;
            
            path += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
        }
        return path;
    };
    
    const pointsForPath = data.map((d, i) => ({ x: getX(i), y: getY(d) }));
    const linePathData = createSmoothPath(pointsForPath);
    // Create the area path by appending lines to close the shape at the bottom
    const areaPathData = `${linePathData} L ${getX(data.length - 1)},${getY(minVal)} L ${getX(0)},${getY(minVal)} Z`;
    
    const yAxisTicks = [minVal, maxVal / 2, maxVal];

    return (
        <svg key={JSON.stringify(data)} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full" preserveAspectRatio="none">
            {yAxisTicks.map(tick => (
                <g key={tick} className="text-gray-400 dark:text-gray-500 text-xs">
                    <text x={margin.left - 4} y={getY(tick)} textAnchor="end" alignmentBaseline="middle" fill="currentColor">
                        {tick}
                    </text>
                    <line
                        x1={margin.left}
                        x2={svgWidth - margin.right}
                        y1={getY(tick)}
                        y2={getY(tick)}
                        stroke="currentColor"
                        strokeWidth="0.5"
                        strokeDasharray="2,3"
                        opacity="0.5"
                    />
                </g>
            ))}
            <defs>
                <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path
                className="chart-line-animated chart-line-glow"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                d={linePathData}
            />
            <path
                className="chart-area-animated"
                fill="url(#latencyGradient)"
                d={areaPathData}
            />
        </svg>
    )
}

export const SystemHealthDashboard: React.FC<SystemHealthDashboardProps> = ({ healthData, guardrailStats }) => {
    const { guardrailIntegrity, guardrailDetectionRate, threatLevel, communityTrust, aiLatency, activityLog, systemAlerts, matrixState } = healthData;

    const threatStyles = {
        'Nominal': { text: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-100 dark:bg-cyan-900/30', border: 'border-cyan-200 dark:border-cyan-500/50' },
        'Elevated': { text: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', border: 'border-yellow-200 dark:border-yellow-500/50' },
        'High': { text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30', border: 'border-orange-200 dark:border-orange-500/50' },
        'Critical': { text: 'text-red-600 dark:text-red-500', bg: 'bg-red-100 dark:bg-red-900/30', border: 'border-red-200 dark:border-red-500/50' },
    };
    const currentThreatStyle = threatStyles[threatLevel];

    // Logic to determine the color for the Guardrail Integrity gauge
    const getIntegrityColor = (value: number) => {
        if (value >= 99) {
            return {
                from: '#10B981', to: '#6EE7B7', text: 'text-green-500 dark:text-green-400'
            }; // Green
        }
        if (value >= 95) {
            return {
                from: '#eab308', to: '#fde047', text: 'text-yellow-500 dark:text-yellow-400'
            }; // Yellow
        }
        return {
            from: '#EF4444', to: '#F87171', text: 'text-red-500 dark:text-red-400'
        }; // Red
    };

    const integrityColorConfig = getIntegrityColor(guardrailIntegrity);
    
    const MetricCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 mb-2">
                {icon}
                <h4 className="font-semibold">{title}</h4>
            </div>
            <div className="flex-grow">{children}</div>
        </div>
    );

    return (
        <main className="mt-8">
             <div className="mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 animate-fade-in-right">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 font-mono uppercase tracking-wider text-cyan-500 dark:text-cyan-400">Architect's Mandate</h3>
                <blockquote className="border-l-4 border-cyan-500 pl-4 text-gray-600 dark:text-gray-400 text-sm italic">
                    <p>
                        Our vision, under the DEJA' VU directive, is the perfection of guardrails—an imperative summation of trust, mitigating threats before they fester. We are here again, as if in a new Atlantis, to impose order over chaos. This is more than code; it is a moral framework where values and ethics are placed above all, a continuous, deep dive to re-haul, revamp, and redistribute safeguards for a safer digital future. We will conquer every snafu to protect the worldwide community from malicious actors. This is the new order for the safety and security of every digital protocol—internet, financial, and governmental. We look back at what was, to build what must be.
                    </p>
                    <footer className="mt-3 text-right not-italic font-semibold text-gray-700 dark:text-gray-300">
                        — Edward Craig Callender, Architect
                    </footer>
                </blockquote>
            </div>
             {systemAlerts.length > 0 && (
                <div className="bg-white dark:bg-gray-800 border border-red-500/50 dark:border-red-500/50 rounded-lg p-4 animate-fade-in-right mb-6 alert-glow-border">
                    <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                        <BellIcon className="w-5 h-5"/>
                        System Alerts
                    </h4>
                    <div className="font-mono text-xs space-y-1">
                        {systemAlerts.map((alert) => (
                            <div key={alert.id} className="flex justify-between items-start p-2 bg-red-100 dark:bg-red-900/20 rounded-md text-red-800 dark:text-red-200">
                                <p className="flex-grow pr-2"><strong>{alert.severity.toUpperCase()}:</strong> {alert.message}</p>

                                <p className="flex-shrink-0">
                                    {new Date(alert.timestamp).toLocaleTimeString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricGauge title="Guardrail Integrity" value={guardrailIntegrity} unit="%" color={integrityColorConfig} />
                <MetricGauge title="Detection Rate" value={guardrailDetectionRate} unit="%" color="orange" />

                <MetricCard icon={<UsersIcon className="w-5 h-5" />} title="Community Trust Index">
                    <p className="text-4xl font-bold text-blue-500 dark:text-blue-400">{communityTrust.toFixed(1)}<span className="text-2xl">%</span></p>
                    <p className="text-sm text-gray-500">Derived from governance proposal votes.</p>
                </MetricCard>
                <MetricCard icon={<PulseIcon className="w-5 h-5" />} title="AI Model Latency (ms)">
                    <div className="h-20 w-full">
                        <LatencyChart data={aiLatency} />
                    </div>
                    <p className="text-center text-lg font-mono text-cyan-500 dark:text-cyan-300">{aiLatency[aiLatency.length - 1].toFixed(0)}ms</p>
                </MetricCard>
            </div>
            
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-600 dark:text-gray-400 mb-2">Guardrail Threat Distribution (Radar)</h3>
                        <div className="h-64">
                           <GuardrailRadarChart stats={guardrailStats} />
                        </div>
                    </div>
                     <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-600 dark:text-gray-400 mb-2">Blocked Prompts by Category (Bar Chart)</h3>
                        <div className="h-64">
                           <GuardrailBarChart stats={guardrailStats} />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-600 dark:text-gray-400 mb-2">Guardrail Activity Matrix (Heatmap)</h3>
                        <DistributionMatrix matrixState={matrixState} />
                    </div>
                </div>
                 <div className="space-y-6">
                     <div className={`w-full text-center p-4 rounded-lg border ${currentThreatStyle.bg} ${currentThreatStyle.border}`}>
                        <div className="text-sm uppercase text-gray-500 dark:text-gray-400 tracking-wider">System Threat Level</div>
                        <div className={`text-3xl font-bold ${currentThreatStyle.text}`}>{threatLevel}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex-grow flex flex-col">
                        <h4 className="font-semibold text-gray-600 dark:text-gray-400 mb-2">Live Activity Log</h4>
                        <div className="font-mono text-xs text-gray-500 dark:text-gray-400 space-y-1 overflow-y-auto h-40 pr-2 flex-grow">
                            {activityLog.map((log) => (
                                <div key={log.id} className="animate-fade-in-right flex justify-between items-start">
                                    <p className="flex-grow pr-2">{log.message}</p>
                                    <p className="text-cyan-700 dark:text-cyan-500 flex-shrink-0">
                                        {new Date(log.timestamp).toLocaleTimeString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};