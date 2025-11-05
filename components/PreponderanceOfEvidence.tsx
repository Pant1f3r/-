import React from 'react';
import { GavelIcon } from './icons/GavelIcon';
import { DocumentCheckIcon } from './icons/DocumentCheckIcon';

interface EvidenceCase {
    signature: string;
    count: number;
}

interface PreponderanceOfEvidenceProps {
    evidenceCases: EvidenceCase[];
}

const StagedProgressBar: React.FC<{ count: number }> = ({ count }) => {
    const MAX_COUNT = 10000000;
    const stages = [
        { name: 'Initial Filing', threshold: 10000 },
        { name: 'Evidence Compilation', threshold: 1000000 },
        { name: 'Final Review', threshold: 5000000 },
        { name: 'Verdict Imminent', threshold: MAX_COUNT },
    ];

    const currentStageIndex = stages.findIndex(s => count < s.threshold);
    
    return (
        <div className="w-full">
            <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                <span>10k Hits</span>
                <span>10M Hits</span>
            </div>
            <div className="relative w-full bg-gray-700 rounded-full h-4">
                {/* Stage markers */}
                {stages.map((stage, i) => {
                    const left = ((stage.threshold / MAX_COUNT) * 100);
                    if (stage.threshold === MAX_COUNT) return null; // Don't draw a line at the very end
                    return (
                        <div key={i} className="absolute top-0 h-full w-px bg-gray-500" style={{ left: `${left}%` }}></div>
                    );
                })}
                {/* Progress fill */}
                <div 
                    className="h-full bg-gradient-to-r from-yellow-500 to-red-500 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${(count / MAX_COUNT) * 100}%` }}
                ></div>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
                {stages.map((stage, i) => {
                     const isCompleted = count >= stage.threshold;
                     const isActive = i === currentStageIndex;
                    return (
                        <span key={i} className={`font-semibold ${isCompleted ? 'text-green-400' : isActive ? 'text-yellow-400 animate-pulse' : 'text-gray-600'}`}>
                            {stage.name}
                        </span>
                    )
                })}
            </div>
        </div>
    );
};


export const PreponderanceOfEvidence: React.FC<PreponderanceOfEvidenceProps> = ({ evidenceCases }) => {
    
    return (
        <main className="mt-8 space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3 text-glow-main-title">
                    <GavelIcon className="w-8 h-8 text-yellow-400" />
                    KR0M3D1A Court: Preponderance of Evidence
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Cases escalated by the Arconomics protocol. Evidence is automatically compiled as re-evaluation counts increase. Upon reaching the 10,000,000 hit threshold, a verdict is issued, and sanctions are executed by the Digitalocutioner protocol.
                </p>
            </div>

            <div className="max-w-6xl mx-auto bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6">
                <h3 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-3">
                    <DocumentCheckIcon className="w-6 h-6 text-cyan-400"/>
                    Active Evidence Docket
                </h3>

                {evidenceCases.length > 0 ? (
                    <div className="space-y-6">
                        {evidenceCases.map(caseItem => (
                            <div key={caseItem.signature} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-lg font-semibold text-cyan-400 truncate pr-4" title={caseItem.signature}>{caseItem.signature}</h4>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-xs text-gray-400">Re-evaluations</p>
                                        <p className="font-mono text-xl font-bold text-red-400">{caseItem.count.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <StagedProgressBar count={caseItem.count} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-center text-gray-500">
                        <p>The evidence docket is currently clear.</p>
                        <p className="text-sm">Cases exceeding 10,000 re-evaluations in the Arconomics module will appear here.</p>
                    </div>
                )}
            </div>

        </main>
    );
};
