

import React, { useState, useEffect } from 'react';
import { CodeIcon } from './icons/CodeIcon';
import { ServerStackIcon } from './icons/ServerStackIcon';
import { ClockIcon } from './icons/ClockIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { ArrowsRightLeftIcon } from './icons/ArrowsRightLeftIcon';

// Mock data for the component
const mockPipelines = [
    { id: 1, name: 'Guardrail Intel Feed Ingestion', status: 'Running', lastRun: 'Just now' },
    { id: 2, name: 'Anomaly Detection Triangulation', status: 'Running', lastRun: '2m ago' },
    { id: 3, name: 'Legal Brief Cross-Referencing', status: 'Degraded', lastRun: '1m ago' },
    { id: 4, name: 'Economic Simulation Datamart', status: 'Failed', lastRun: '1h ago' },
    { id: 5, name: 'Philanthropic Yield Distribution', status: 'Running', lastRun: '5m ago' },
];

const mockInitialLogs = [
    '[SUCCESS] Job 742: Guardrail Intel Feed Ingestion completed in 1.2s.',
    '[INFO] Starting Job 743: Anomaly Detection Triangulation.',
    '[WARNING] Job 741: Legal Brief Cross-Referencing has a latency of 3.5s (threshold: 2.0s).',
    '[SUCCESS] Job 740: Philanthropic Yield Distribution completed.',
    '[ERROR] Job 739: Economic Simulation Datamart failed. Reason: Timeout connecting to source API.',
];

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex items-center gap-4">
        <div className="text-cyan-400">{icon}</div>
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-xl font-bold text-gray-100">{value}</p>
        </div>
    </div>
);

const PipelineStatus: React.FC<{ status: 'Running' | 'Degraded' | 'Failed' }> = ({ status }) => {
    const styles = {
        Running: { bg: 'bg-green-500/20', text: 'text-green-400', icon: '●' },
        Degraded: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: '▲' },
        Failed: { bg: 'bg-red-500/20', text: 'text-red-400', icon: '■' },
    };
    const style = styles[status];
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-md ${style.bg} ${style.text} flex items-center gap-1.5`}>
            {style.icon} {status}
        </span>
    );
};

export const DataOpsPlatform: React.FC = () => {
    const [logs, setLogs] = useState(mockInitialLogs);
    const [stats, setStats] = useState({
        dataProcessed: 1.2, // TB
        latency: 125, // ms
        errorRate: 0.02, // %
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                dataProcessed: prev.dataProcessed + 0.01,
                latency: Math.max(80, prev.latency + (Math.random() - 0.5) * 10),
                errorRate: Math.max(0.01, Math.min(0.1, prev.errorRate + (Math.random() - 0.5) * 0.005)),
            }));

            const newLogEntry = Math.random() > 0.1 
                ? `[SUCCESS] Job ${Math.floor(744 + Math.random()*10)} completed.`
                : `[WARNING] Latency detected in pipeline ${mockPipelines[Math.floor(Math.random()*mockPipelines.length)].name}.`;
            
            setLogs(prev => [newLogEntry, ...prev.slice(0, 10)]);

        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const activePipelines = mockPipelines.filter(p => p.status === 'Running').length;
    const totalPipelines = mockPipelines.length;

    return (
        <main className="mt-8 space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3 text-glow-main-title">
                    <CodeIcon className="w-8 h-8 text-cyan-400" />
                    Data Operations Platform
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Monitor and manage data pipelines, ETL jobs, and system integrations for the KR0M3D1A protocol.
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<ServerStackIcon className="w-8 h-8"/>} label="Data Processed (24h)" value={`${stats.dataProcessed.toFixed(2)} TB`} />
                <StatCard icon={<ClockIcon className="w-8 h-8"/>} label="Avg. Pipeline Latency" value={`${stats.latency.toFixed(0)} ms`} />
                <StatCard icon={<ExclamationTriangleIcon className="w-8 h-8"/>} label="Job Error Rate" value={`${stats.errorRate.toFixed(3)}%`} />
                <StatCard icon={<ArrowsRightLeftIcon className="w-8 h-8"/>} label="Active Pipelines" value={`${activePipelines} / ${totalPipelines}`} />
            </div>

            {/* Pipelines and Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">Pipeline Status</h3>
                    <div className="space-y-3">
                        {mockPipelines.map(pipeline => (
                            <div key={pipeline.id} className="bg-gray-900/50 p-3 rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-300">{pipeline.name}</p>
                                    <p className="text-xs text-gray-500">Last run: {pipeline.lastRun}</p>
                                </div>
                                <PipelineStatus status={pipeline.status as any} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-2 bg-black border border-gray-700 rounded-lg p-4 font-mono text-sm h-[350px] flex flex-col">
                    <h3 className="text-cyan-400 mb-2 flex-shrink-0">[LIVE JOB LOG]</h3>
                    <div className="overflow-y-auto flex-grow">
                        {logs.map((entry, index) => {
                            const isError = entry.startsWith('[ERROR]');
                            const isWarning = entry.startsWith('[WARNING]');
                            const colorClass = isError ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-green-400';
                            return (
                                <p key={index} className={`whitespace-pre-wrap animate-fade-in-right ${colorClass}`}>
                                    <span className="text-gray-500 mr-2">&gt;</span>{entry}
                                </p>
                            );
                        })}
                    </div>
                </div>
            </div>
        </main>
    );
};