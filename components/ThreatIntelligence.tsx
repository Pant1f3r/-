import React from 'react';
import { BugReport } from '../services/types';
import { BugIcon } from './icons/BugIcon';

interface ThreatIntelligenceProps {
  reports: BugReport[];
}

const SeverityBadge: React.FC<{ severity: BugReport['severity'] }> = ({ severity }) => {
    const styles = {
        Critical: 'bg-red-600 text-red-100 border-red-500',
        High: 'bg-orange-600 text-orange-100 border-orange-500',
        Medium: 'bg-yellow-600 text-yellow-100 border-yellow-500',
        Low: 'bg-blue-600 text-blue-100 border-blue-500',
    };
    return (
        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${styles[severity] || styles['Medium']}`}>
            {severity}
        </span>
    );
};

const StatusBadge: React.FC<{ status: BugReport['status'] }> = ({ status }) => {
    const styles = {
        Unpatched: 'text-red-400',
        Investigating: 'text-yellow-400',
        Patched: 'text-green-400',
    };
     const icons = {
        Unpatched: '●',
        Investigating: '…',
        Patched: '✓',
    }
    return (
        <span className={`font-mono text-sm font-semibold flex items-center gap-2 ${styles[status]}`}>
            <span>{icons[status]}</span>
            {status}
        </span>
    );
};

export const ThreatIntelligence: React.FC<ThreatIntelligenceProps> = ({ reports }) => {
    return (
        <main className="mt-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3">
                    <BugIcon className="w-8 h-8 text-orange-500" />
                    Kubernetics Guardrail Codex: Identified Bugs
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    A live feed of identified system vulnerabilities and their current mitigation status, managed under the DEJA' VU protocol's proactive threat assessment mandate and its proprietary Kubernetics spythagorithm.
                </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-lg shadow-2xl p-4 md:p-6 space-y-4">
                {reports.map((report) => (
                    <div key={report.id} className="bg-gray-800/70 border border-gray-700 rounded-lg p-4 animate-fade-in-right transition-all hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-3">
                            <h3 className="text-lg font-semibold text-cyan-400 font-mono break-all">{report.guardrail}: <span className="text-gray-200">{report.component}</span></h3>
                            <SeverityBadge severity={report.severity} />
                        </div>
                        <p className="text-gray-300 text-sm mb-4">
                            {report.description}
                        </p>
                        <div className="flex justify-end items-center border-t border-gray-700 pt-3">
                           <StatusBadge status={report.status} />
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};