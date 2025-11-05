import React, { useState } from 'react';
import { SavedAnalysisReport } from '../services/types';
import { ArchiveIcon } from './icons/ArchiveIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ScaleIcon } from './icons/ScaleIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { TargetIcon } from './icons/TargetIcon';
import { BtcIcon } from './icons/BtcIcon';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';

interface AnalysisHistoryProps {
  reports: SavedAnalysisReport[];
  onLoad: (id: number) => void;
  onDelete: (id: number) => void;
}

const ReportHistoryItem: React.FC<{ report: SavedAnalysisReport; onLoad: (id: number) => void; onDelete: (id: number) => void; }> = ({ report, onLoad, onDelete }) => {
    const reportDate = new Date(report.timestamp);

    const getReportIcon = () => {
        switch (report.type) {
            case 'legal':
                return <ScaleIcon className="w-6 h-6 text-purple-500 flex-shrink-0" />;
            case 'economic':
                return <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-cyan-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>;
            case 'financial':
                return <TargetIcon className="w-6 h-6 text-red-500 flex-shrink-0" />;
            case 'crypto':
                return <BtcIcon className="w-6 h-6 text-yellow-500 flex-shrink-0" />;
            case 'osint':
                return <MagnifyingGlassIcon className="w-6 h-6 text-blue-500 flex-shrink-0" />;
            default:
                return null;
        }
    };

    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-md border border-gray-200 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
            <div className="flex items-center gap-3 overflow-hidden">
                {getReportIcon()}
                <div className="flex-grow overflow-hidden">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate" title={report.queryTitle}>
                        {report.queryTitle}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {reportDate.toLocaleDateString()} {reportDate.toLocaleTimeString()}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <button 
                    onClick={() => onLoad(report.id)} 
                    className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                    aria-label="Load Report"
                    title="Load Report"
                >
                    <BookOpenIcon className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => onDelete(report.id)} 
                    className="p-2 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors"
                    aria-label="Delete Report"
                    title="Delete Report"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};


export const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ reports, onLoad, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (reports.length === 0) {
        return null; // Don't show the component if there are no reports
    }
    
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
                <div className="flex items-center gap-3">
                    <ArchiveIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    <span>Analysis Archive ({reports.length})</span>
                </div>
                <svg className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    {reports.length > 0 ? (
                        <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                           {reports.map(report => (
                               <ReportHistoryItem key={report.id} report={report} onLoad={onLoad} onDelete={onDelete} />
                           ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-4">No reports saved yet. New reports will appear here automatically.</p>
                    )}
                </div>
            )}
        </div>
    );
};