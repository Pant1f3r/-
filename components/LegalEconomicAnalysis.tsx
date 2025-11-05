import React, { useState, useEffect, useMemo } from 'react';
import { GuardrailProposal, LegalAnalysisResult, SavedAnalysisReport } from '../services/types';
import { ScaleIcon } from './icons/ScaleIcon';
import { CaseLawReference } from './CaseLawReference';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { AnalysisHistory } from './AnalysisHistory';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';

interface LegalEconomicAnalysisProps {
    proposals: GuardrailProposal[];
    selectedProposalId: number | null;
    onSelectProposal: (id: number | null) => void;
    onLegalQuery: (query: string) => void;
    legalAnalysisResult: LegalAnalysisResult | null;
    isLegalLoading: boolean;
    legalError: string;
    onEconomicSimulate: (proposal: GuardrailProposal) => void;
    economicAnalysis: string;
    isEconomicLoading: boolean;
    economicError: string;
    savedReports: SavedAnalysisReport[];
    onLoadReport: (id: number) => void;
    onDeleteReport: (id: number) => void;
}

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      <div className="mt-6 h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
    </div>
);

// New component to parse and highlight inline citations in the AI's response.
const ParsedLegalResponse: React.FC<{ text: string }> = ({ text }) => {
    // Regex to find citations like (see Case Title) or (see Netz v. Cyberspace Media)
    const citationRegex = /(\(see\s+[^)]+\))/g;
    const parts = text.split(citationRegex);

    return (
        <div className="whitespace-pre-wrap leading-relaxed">
            {parts.map((part, index) => {
                if (citationRegex.test(part)) {
                    return (
                        <span key={index} className="inline-flex items-center gap-1.5 text-purple-600 dark:text-purple-300 font-semibold bg-purple-500/10 dark:bg-purple-900/30 px-2 py-1 rounded-md shadow-[0_0_10px_2px_theme(colors.purple.500/20)] transition-all">
                            <ScaleIcon className="w-4 h-4 flex-shrink-0" />
                            <span className="font-mono">{part}</span>
                        </span>
                    );
                }
                return <span key={index}>{part}</span>;
            })}
        </div>
    );
};

export const LegalEconomicAnalysis: React.FC<LegalEconomicAnalysisProps> = ({
    proposals,
    selectedProposalId,
    onSelectProposal,
    onLegalQuery,
    legalAnalysisResult,
    isLegalLoading,
    legalError,
    onEconomicSimulate,
    economicAnalysis,
    isEconomicLoading,
    economicError,
    savedReports,
    onLoadReport,
    onDeleteReport,
}) => {
    const [legalQuery, setLegalQuery] = useState('');
    
    const selectedProposal = useMemo(() => {
        return proposals.find(p => p.id === selectedProposalId) || null;
    }, [selectedProposalId, proposals]);
    
    const structuredReport = useMemo(() => {
        if (!legalAnalysisResult?.response) return null;

        const responseText = legalAnalysisResult.response;
        const executiveSummaryMatch = responseText.match(/### Executive Summary\s*([\s\S]*?)(?=### Detailed Analysis|$)/is);
        const detailedAnalysisMatch = responseText.match(/### Detailed Analysis\s*([\s\S]*?)(?=### Precedent Breakdown|$)/is);
        const precedentBreakdownMatch = responseText.match(/### Precedent Breakdown\s*([\s\S]*)/is);

        const isStructured = !!(executiveSummaryMatch || detailedAnalysisMatch || precedentBreakdownMatch);
        
        return {
            executiveSummary: executiveSummaryMatch ? executiveSummaryMatch[1].trim() : '',
            detailedAnalysis: detailedAnalysisMatch ? detailedAnalysisMatch[1].trim() : '',
            precedentBreakdown: precedentBreakdownMatch ? precedentBreakdownMatch[1].trim() : '',
            isStructured: isStructured,
            fallbackContent: isStructured ? '' : responseText,
        };
    }, [legalAnalysisResult]);

    const actuallyCitedPrecedents = useMemo(() => {
        if (!legalAnalysisResult?.response || !legalAnalysisResult.precedents) {
            return [];
        }
        const responseText = legalAnalysisResult.response.toLowerCase();
        return legalAnalysisResult.precedents.filter(precedent => 
            responseText.includes(precedent.title.toLowerCase())
        );
    }, [legalAnalysisResult]);

    useEffect(() => {
        if (selectedProposal) {
            setLegalQuery(`Analyze the legal ramifications and precedents related to implementing the following proposal:\n\nTitle: "${selectedProposal.title}"\n\nDescription: ${selectedProposal.description}`);
        } else {
            setLegalQuery('');
        }
    }, [selectedProposal]);
    
    const handleLegalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (legalQuery.trim()) {
            onLegalQuery(legalQuery);
        }
    };
    
    const handleEconomicSubmit = () => {
        if (selectedProposal) {
            onEconomicSimulate(selectedProposal);
        }
    };

    return (
        <main className="mt-8 space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-glow-main-title">Kubernetics Legal & Economic Impact Analysis</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Analyze governance proposals or submit a custom query. Use the L.E.X. agent for legal counsel based on established precedents and the E.C.H.O. model for economic simulation based on pythagorithmic Kubernetics projections.
                </p>
                <div className="mt-6 max-w-3xl mx-auto bg-yellow-100 dark:bg-yellow-900/20 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 p-4 rounded-md" role="alert">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                        </div>
                        <div className="ml-3 text-left">
                            <h3 className="text-sm font-bold">Disclaimer: For Informational Purposes Only</h3>
                            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                                <p>
                                    The analysis provided by the L.E.X. agent is generated by an AI and is intended for informational and demonstrative purposes only. It does not constitute legal advice and should not be used as a substitute for consultation with a qualified human legal professional. Always seek the advice of an attorney for any legal matters.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <label htmlFor="proposal-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Proposal for Analysis
                </label>
                <select 
                    id="proposal-select"
                    value={selectedProposalId ?? ''}
                    onChange={(e) => onSelectProposal(e.target.value ? Number(e.target.value) : null)}
                    className="mt-1 w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500"
                >
                    <option value="">-- Select a Proposal or Enter Custom Query Below --</option>
                    {proposals.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                </select>
            </div>

            <AnalysisHistory 
                reports={savedReports}
                onLoad={onLoadReport}
                onDelete={onDeleteReport}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Legal Analysis Section */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <ScaleIcon className="w-6 h-6 text-purple-500"/>
                        L.E.X. Legal Counsel
                    </h3>
                    <form onSubmit={handleLegalSubmit} className="flex-grow flex flex-col">
                        <div className="flex-grow">
                            <label htmlFor="legal-query" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Legal Query
                            </label>
                            <textarea
                                id="legal-query"
                                rows={selectedProposal ? 8 : 4}
                                value={legalQuery}
                                onChange={(e) => setLegalQuery(e.target.value)}
                                className="mt-1 w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md resize-y disabled:bg-gray-200 dark:disabled:bg-gray-700 transition-all duration-200"
                                placeholder="Describe the legal issue or select a proposal above..."
                                disabled={isLegalLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLegalLoading || !legalQuery.trim()}
                            className="mt-4 w-full flex justify-center items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-gray-400 dark:disabled:bg-gray-600"
                        >
                            {isLegalLoading ? 'Analyzing...' : 'Submit Legal Query'}
                        </button>
                    </form>

                    {(isLegalLoading || legalAnalysisResult || legalError) && (
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Analysis Result:</h4>
                            {isLegalLoading && <LoadingSkeleton />}
                            {legalError && <p className="text-red-500 dark:text-red-400">{legalError}</p>}
                            {structuredReport && (
                                structuredReport.isStructured ? (
                                    <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                                        {structuredReport.executiveSummary && (
                                            <div>
                                                <h5 className="font-bold text-base text-gray-900 dark:text-gray-100">Executive Summary</h5>
                                                <p className="whitespace-pre-wrap">{structuredReport.executiveSummary}</p>
                                            </div>
                                        )}
                                        {structuredReport.detailedAnalysis && (
                                            <div>
                                                <h5 className="font-bold text-base text-gray-900 dark:text-gray-100">Detailed Analysis</h5>
                                                <ParsedLegalResponse text={structuredReport.detailedAnalysis} />
                                            </div>
                                        )}
                                        {structuredReport.precedentBreakdown && (
                                            <div>
                                                <h5 className="font-bold text-base text-gray-900 dark:text-gray-100">Precedent Breakdown</h5>
                                                <ParsedLegalResponse text={structuredReport.precedentBreakdown} />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{structuredReport.fallbackContent}</p>
                                )
                            )}
                        </div>
                    )}
                    
                    {actuallyCitedPrecedents.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                                <BookOpenIcon className="w-5 h-5" />
                                Cited Precedents
                            </h4>
                            <div className="space-y-3">
                                {actuallyCitedPrecedents.map(c => <CaseLawReference key={c.id} caseLaw={c} />)}
                            </div>
                        </div>
                    )}
                </div>

                {/* Economic Analysis Section */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-cyan-500" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
                        E.C.H.O. Economic Simulation
                    </h3>
                    <div className="flex-grow">
                        {selectedProposal ? (
                            <>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    Simulate the economic impact of implementing the selected proposal: <strong className="text-gray-800 dark:text-gray-200">"{selectedProposal.title}"</strong>.
                                </p>
                                <button
                                    onClick={handleEconomicSubmit}
                                    disabled={isEconomicLoading}
                                    className="w-full flex justify-center items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-gray-400 dark:disabled:bg-gray-600"
                                >
                                    {isEconomicLoading ? 'Simulating...' : 'Run Economic Simulation'}
                                </button>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-8">Select a proposal above to enable economic simulation.</p>
                        )}
                    </div>

                    {(isEconomicLoading || economicAnalysis || economicError) && (
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Simulation Result:</h4>
                            {isEconomicLoading && <LoadingSkeleton />}
                            {economicError && <p className="text-red-500 dark:text-red-400">{economicError}</p>}
                            {economicAnalysis && <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{economicAnalysis}</p>}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};