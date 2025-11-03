

import React, { useState, useEffect } from 'react';
import { GuardrailResult, SavedAnalysisReport, ThreatType } from '../services/types';
import { NeoIcon } from './NeoIcon';
import { CyberThreatscape } from './CyberThreatscape';
import { AnalysisHistory } from './AnalysisHistory';
import { UsersIcon } from './icons/UsersIcon';

const THREAT_TYPES: ThreatType[] = ['Digital Espionage', 'Supply Chain Attacks', 'Ransomware Campaigns'];

const MOCK_ENTITIES: string[] = [
    'Federal Reserve',
    'Stark Industries',
    'Acme Corporation',
    'Cyberdyne Systems',
    'Wayne Enterprises',
    'Umbrella Corporation',
    'Oscorp',
    'Tyrell Corporation',
    'Sirius Cybernetics Corporation',
    'Buy n Large',
    'Aperture Science',
    'Gekko & Co',
    'Department of Defense',
    'National Security Agency',
    'LexCorp',
    'Consolidated Rail',
    'Massive Dynamic',
    'Blue Sun Corporation',
    'Weyland-Yutani Corp',
    'Shinra Electric Power Company',
];

const MOCK_QUOTES: { [key in ThreatType]: { author: string; role: string; text: string }[] } = {
    'Digital Espionage': [
        { author: 'Aria Vanderveldt', role: 'Chief Security Officer, Cygnus Corp', text: 'The modern battleground is data. A zero-trust architecture isn\'t a suggestion; it\'s the bedrock of corporate survival. Assume breach, verify relentlessly.' },
        { author: 'Kaito Tanaka', role: 'Head of Counter-Intel, Shinra Electric', text: 'Economic espionage is a quiet war. Our biggest vulnerability is human. We invest as much in personnel screening and education as we do in firewalls.' },
        { author: 'Dr. Evelyn Reed', role: 'Quantum Cryptography Pioneer', text: 'For critical IP, standard encryption is obsolete. Post-quantum cryptographic standards must be adopted now, not when a quantum computer renders current methods useless.' },
    ],
    'Supply Chain Attacks': [
        { author: 'Marcus Thorne', role: 'Logistics Security, Weyland-Yutani', text: 'Your security is only as strong as your weakest vendor. We require a full Software Bill of Materials (SBOM) and conduct regular penetration tests on our partners. Trust is a vulnerability.' },
        { author: 'Isabelle Chen', role: 'DevSecOps Architect, Blue Sun', text: 'The supply chain attack vector has shifted from physical to digital. Securing the CI/CD pipeline with automated code scanning and dependency validation is non-negotiable.' },
        { author: 'General (Ret.) Slade Wilson', role: 'DoD Contractor', text: 'Hardware backdoors are the silent killers. We mandate hardware-level provenance checks for all critical components. You can\'t secure what you can\'t verify.' },
    ],
    'Ransomware Campaigns': [
        { author: 'Javier "Javi" Rojas', role: 'Incident Response Lead, Massive Dynamic', text: 'It\'s not *if* you get hit, it\'s *when*. An immutable backup, air-gapped from the network, is the only thing that stands between you and capitulation. Paying the ransom funds their next attack.' },
        { author: 'Eleanor Vance', role: 'CEO, Gekko & Co', text: 'Our policy is zero negotiation. We invest in recovery and resilience. The reputational cost of paying a ransom far outweighs the short-term operational gain.' },
        { author: '"Prometheus"', role: 'White Hat Hacker', text: 'Ransomware gangs are businesses. Making recovery more expensive for them than the potential payout is the goal. Active defense and intelligence sharing are key.' },
    ],
};

interface ConsensusData {
    percentage: number;
    quotes: { author: string; role: string; text: string }[];
}

interface FinancialAnalysisProps {
    entity: string;
    setEntity: (name: string) => void;
    threatType: ThreatType;
    setThreatType: (threat: ThreatType) => void;
    onSubmit: (name: string, threat: ThreatType) => void;
    isLoading: boolean;
    error: string;
    analysisResult: string;
    guardrailResult: GuardrailResult | null;
    savedReports: SavedAnalysisReport[];
    onLoadReport: (id: number) => void;
    onDeleteReport: (id: number) => void;
}

const ResultParser: React.FC<{ text: string }> = ({ text }) => {
    // Split the text into the main sectors (Gov, Mil, Corp)
    const sectors = text.split('### ').filter(s => s.trim());

    const parseList = (rawText: string): string[] => {
        if (!rawText) return [];
        return rawText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.startsWith('- ') || line.startsWith('* ') || /^\d+\.\s/.test(line))
            .map(line => line.replace(/^(- |\* |^\d+\.\s)/, '').trim());
    };

    return (
        <div className="space-y-8">
            {sectors.map((sector, index) => {
                const sectorTitleMatch = sector.match(/^(.*)\n/);
                if (!sectorTitleMatch) return null; // Skip malformed sectors to prevent crashes

                const sectorTitle = sectorTitleMatch[1].trim();
                const content = sector.substring(sector.indexOf('\n')).trim();

                // Split the content into vulnerabilities and the AXIOM protocol
                const parts = content.split('#### ');
                const vulnerabilitiesText = parts[0] || '';
                const axiomProtocolTextPart = parts.find(p => p.toLowerCase().startsWith('axiom protocol'));
                
                const vulnerabilityItems = parseList(vulnerabilitiesText);
                const axiomItems = axiomProtocolTextPart ? parseList(axiomProtocolTextPart) : [];


                return (
                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                        <h3 className="text-xl font-bold text-cyan-600 dark:text-cyan-400 mb-3">{sectorTitle}</h3>
                        
                        {vulnerabilityItems.length > 0 && (
                             <div className="mb-4">
                                <h4 className="font-semibold text-gray-800 dark:text-gray-200">Potential Vulnerabilities:</h4>
                                <ul className="mt-2 space-y-2 list-disc list-inside text-gray-700 dark:text-gray-300">
                                    {vulnerabilityItems.map((item, itemIndex) => (
                                        <li key={itemIndex}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                       {axiomItems.length > 0 && (
                            <div className="p-3 border-l-4 border-purple-400 bg-purple-50 dark:bg-purple-900/20">
                                <h4 className="font-semibold text-purple-700 dark:text-purple-300">AXIOM Protocol Recommendations:</h4>
                                <ul className="mt-2 space-y-2 list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                                    {axiomItems.map((item, itemIndex) => (
                                        <li key={itemIndex}>{item.replace(/^\*\*/, '').replace(/\*\*$/, '')}</li>
                                    ))}
                                </ul>
                            </div>
                       )}
                    </div>
                );
            })}
        </div>
    );
};

const ConsensusGauge: React.FC<{ percentage: number }> = ({ percentage }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-full h-full" viewBox="0 0 70 70">
                <circle
                    className="text-gray-700"
                    strokeWidth="6"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="35"
                    cy="35"
                />
                <circle
                    className="text-purple-500"
                    strokeWidth="6"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="35"
                    cy="35"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
            </svg>
        </div>
    );
};

const ExecutiveConsensusPanel: React.FC<{ data: ConsensusData }> = ({ data }) => {
    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 animate-fade-in-right h-full flex flex-col">
            <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                <UsersIcon className="w-6 h-6 text-purple-400" />
                Executive Threat Consensus
            </h3>
            <div className="flex items-center justify-center my-4 gap-4 bg-gray-900/50 p-4 rounded-lg">
                <ConsensusGauge percentage={data.percentage} />
                <div>
                    <p className="text-5xl font-bold text-purple-400">{data.percentage.toFixed(1)}%</p>
                    <p className="text-sm text-gray-400">Consensus to Act</p>
                </div>
            </div>
            <div className="space-y-4 border-t border-gray-700 pt-4 overflow-y-auto flex-grow">
                {data.quotes.map((quote, i) => (
                    <blockquote key={i} className="border-l-4 border-purple-500 pl-4">
                        <p className="text-sm italic text-gray-300">"{quote.text}"</p>
                        <footer className="mt-2 text-xs text-right text-gray-400">
                            — {quote.author}, <span className="text-cyan-400">{quote.role}</span>
                        </footer>
                    </blockquote>
                ))}
            </div>
        </div>
    );
};

export const FinancialAnalysis: React.FC<FinancialAnalysisProps> = ({
    entity,
    setEntity,
    threatType,
    setThreatType,
    onSubmit,
    isLoading,
    error,
    analysisResult,
    guardrailResult,
    savedReports,
    onLoadReport,
    onDeleteReport,
}) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [consensusData, setConsensusData] = useState<ConsensusData | null>(null);

    useEffect(() => {
        if (analysisResult && !isLoading && !error) {
            const percentage = 65 + Math.random() * 30; // 65% to 95%
            const quotes = MOCK_QUOTES[threatType];
            setConsensusData({ percentage, quotes });
        }
        if (isLoading || error) {
            setConsensusData(null); // Clear on new analysis or error
        }
    }, [analysisResult, isLoading, error, threatType]);
    
    useEffect(() => {
        setActiveIndex(-1);
    }, [suggestions]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(entity, threatType);
    };

    const handleEntityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEntity(value);

        if (value.trim().length > 0) {
            const filteredSuggestions = MOCK_ENTITIES.filter(name =>
                name.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
            setShowSuggestions(filteredSuggestions.length > 0);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };
    
    const handleSuggestionClick = (suggestion: string) => {
        setEntity(suggestion);
        setSuggestions([]);
        setShowSuggestions(false);
        setActiveIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (showSuggestions) {
          if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
          } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActiveIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
          } else if (e.key === 'Enter') {
              if (activeIndex > -1 && suggestions[activeIndex]) {
                e.preventDefault();
                handleSuggestionClick(suggestions[activeIndex]);
              }
          } else if (e.key === 'Escape') {
              e.preventDefault();
              setShowSuggestions(false);
          }
      }
    };
    
    const HighlightMatch: React.FC<{text: string, highlight: string}> = ({text, highlight}) => {
        if (!highlight.trim()) {
            return <>{text}</>;
        }
        const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);
        return (
            <>
                {parts.map((part, i) =>
                    part.toLowerCase() === highlight.toLowerCase() ? (
                        <strong key={i} className="font-semibold">{part}</strong>
                    ) : (
                        part
                    )
                )}
            </>
        );
    };
    
    return (
        <main className="mt-8 space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-glow-main-title">KR0M3D1A™ Financial Threat Analysis</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Powered by the <span className="font-mono font-bold text-cyan-500">NεΩ</span> AI under the <span className="font-mono font-bold text-purple-400">DEJA' VU</span> protocol. Enter an entity and select a threat vector to perform a simulated digital threat assessment based on cryptologic spythagorithms.
                </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl p-6">
                <form onSubmit={handleSubmit}>
                    {/* Threat Type Selection */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Threat Vector</label>
                        <div className="flex flex-wrap gap-3">
                            {THREAT_TYPES.map(type => {
                                const isSelected = threatType === type;
                                return (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setThreatType(type)}
                                        disabled={isLoading}
                                        className={`px-4 py-2 text-sm rounded-md transition-all duration-200 border transform focus:outline-none
                                            disabled:transform-none disabled:opacity-60 disabled:cursor-not-allowed
                                            ${isSelected
                                                ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-500/30'
                                                : `bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600
                                                   hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-cyan-500
                                                   hover:-translate-y-0.5
                                                   focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800`
                                            }`
                                        }
                                    >
                                        {type}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Entity Input */}
                    <div className="relative" role="combobox" aria-haspopup="listbox" aria-expanded={showSuggestions}>
                        <label htmlFor="entity-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Enter Entity Name for Context
                        </label>
                        <input
                            id="entity-input"
                            type="text"
                            autoComplete="off"
                            className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 placeholder-gray-500"
                            placeholder="e.g., 'Federal Reserve', 'Stark Industries', 'Acme Corporation'"
                            value={entity}
                            onChange={handleEntityChange}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                            onFocus={handleEntityChange}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                            aria-autocomplete="list"
                            aria-controls="suggestions-listbox"
                            aria-activedescendant={activeIndex > -1 ? `suggestion-${activeIndex}` : undefined}
                        />
                        {showSuggestions && (
                            <div id="suggestions-listbox" role="listbox" className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {suggestions.map((suggestion, index) => (
                                    <div
                                        id={`suggestion-${index}`}
                                        key={suggestion}
                                        role="option"
                                        aria-selected={index === activeIndex}
                                        className={`p-3 cursor-pointer ${
                                            index === activeIndex ? 'bg-cyan-100 dark:bg-cyan-900/50' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                        }`}
                                        onMouseDown={() => handleSuggestionClick(suggestion)}
                                    >
                                        <HighlightMatch text={suggestion} highlight={entity} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading || !entity.trim()}
                        className="mt-4 w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        {isLoading ? (
                             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <NeoIcon className="w-6 h-6 mr-2" />
                        )}
                        {isLoading ? 'Analyzing...' : `Initiate Analysis on ${entity || 'Entity'}`}
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
                    <div className="h-96">
                       <CyberThreatscape guardrailResult={guardrailResult} />
                    </div>
                ) : error ? (
                    <div className="bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4" role="alert">
                        <p className="font-bold">Analysis Blocked</p>
                        <p>{error}</p>
                    </div>
                ) : analysisResult && (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-6 animate-fade-in-right">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Analysis Report for: {entity}</h2>
                            <ResultParser text={analysisResult} />
                        </div>
                        {consensusData && (
                            <div className="lg:col-span-2">
                                <ExecutiveConsensusPanel data={consensusData} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
};