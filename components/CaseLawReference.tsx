import React from 'react';
import { CitedPrecedent } from '../services/types';

interface CaseLawReferenceProps {
    caseLaw: CitedPrecedent;
}

export const CaseLawReference: React.FC<CaseLawReferenceProps> = ({ caseLaw }) => {
    return (
        <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900/50 animate-fade-in-right">
            <h5 className="font-semibold text-gray-800 dark:text-gray-200">{caseLaw.title}</h5>
            <p className="text-xs font-mono text-cyan-600 dark:text-cyan-400 mt-1">{caseLaw.citation}</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{caseLaw.summary}</p>
            {caseLaw.matchedKeywords.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700/50 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Relevance Tags:</span>
                    {caseLaw.matchedKeywords.map(kw => (
                        <span key={kw} className="text-xs font-mono bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 px-1.5 py-0.5 rounded">
                            {kw}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};