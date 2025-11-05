import React from 'react';
import { OsintResult, SavedAnalysisReport } from '../services/types';
import { ChipIcon } from './icons/ChipIcon';
import { AnalysisHistory } from './AnalysisHistory';
import { LinkIcon } from './icons/LinkIcon';

interface OsintAsicIntegratorProps {
    target: string;
    setTarget: (target: string) => void;
    onSubmit: (target: string) => void;
    isLoading: boolean;
    result: OsintResult | null;
    error: string;
    savedReports: SavedAnalysisReport[];
    onLoadReport: (id: number) => void;
    onDeleteReport: (id: number) => void;
}

const LoadingAnimation: React.FC = () => (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-900/50 rounded-lg border border-gray-700">
        <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full animate-ping"></div>
            <ChipIcon className="w-24 h-24 text-cyan-400 animate-pulse" />
        </div>
        <p className="mt-4 font-mono text-cyan-300">ASIC-7 SCANNING...</p>
        <p className="text-sm text-gray-500">Querying global open-source intelligence networks...</p>
    </div>
);

const ResultParser: React.FC<{ text: string }> = ({ text }) => {
    const sections = text.split('### ').filter(s => s.trim());

    return (
        <div className="space-y-6">
            {sections.map((section, index) => {
                const lines = section.split('\n').filter(l => l.trim());
                if (lines.length === 0) return null;

                const title = lines.shift()?.trim();
                const content = lines.map(line => line.trim().replace(/^(\* |- )/, '').trim());

                return (
                    <div key={index} className="p-4 border border-gray-700 rounded-lg bg-gray-900/50">
                        <h3 className="text-xl font-bold text-cyan-400 mb-3">{title}</h3>
                        <ul className="space-y-2 list-disc list-inside text-gray-300">
                            {content.map((item, itemIndex) => (
                                <li key={itemIndex}>{item}</li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
};


export const OsintAsicIntegrator: React.FC<OsintAsicIntegratorProps> = ({
    target,
    setTarget,
    onSubmit,
    isLoading,
    result,
    error,
    savedReports,
    onLoadReport,
    onDeleteReport,
}) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(target);
    };

    return (
        <main className="mt-8 space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3 text-glow-main-title">
                    <ChipIcon className="w-8 h-8 text-blue-400"/>
                    OSINT ASIC Integrator
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Deploy the KR0M3D1A protocol's dedicated Open-Source Intelligence ASIC to gather and analyze public data on any given target. This module utilizes Gemini with Google Search grounding for real-time information retrieval.
                </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6">
                <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
                    <div>
                        <label htmlFor="osint-target" className="block text-sm font-medium text-gray-300 mb-2">
                            Enter Target for Intelligence Scan
                        </label>
                        <input
                            id="osint-target"
                            type="text"
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            disabled={isLoading}
                            className="w-full p-3 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 placeholder-gray-500 font-mono"
                            placeholder="e.g., Cyberdyne Systems, kromedia.com, @kromedia_protocol"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !target.trim()}
                        className="w-full flex justify-center items-center px-6 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
                    >
                        {isLoading ? 'Scanning...' : 'Launch ASIC Scan'}
                    </button>
                </form>
            </div>

            <AnalysisHistory
                reports={savedReports}
                onLoad={onLoadReport}
                onDelete={onDeleteReport}
            />

            <div className="mt-6">
                {isLoading ? (
                    <LoadingAnimation />
                ) : error ? (
                    <div className="bg-red-900/20 border-l-4 border-red-500 text-red-300 p-4" role="alert">
                        <p className="font-bold">Scan Failed</p>
                        <p>{error}</p>
                    </div>
                ) : result && (
                    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 animate-fade-in-right space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-100 mb-4">Intelligence Dossier: {target}</h2>
                            <ResultParser text={result.analysis} />
                        </div>

                        {result.sources.length > 0 && (
                            <div className="pt-6 border-t border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-200 mb-3">Data Sources</h3>
                                <div className="space-y-2">
                                    {result.sources.map((source, index) => (
                                        <a
                                            key={index}
                                            href={source.uri}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-md border border-gray-700/50 hover:bg-gray-700/50 transition-colors"
                                        >
                                            <LinkIcon className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm text-blue-300 font-semibold">{source.title}</p>
                                                <p className="text-xs text-gray-500 truncate">{source.uri}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
};
