import React from 'react';
import { GuardrailProposal } from '../services/types';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { ArrowDownIcon } from './icons/ArrowDownIcon';
import { ScaleIcon } from './icons/ScaleIcon';

interface ProposalCardProps {
  proposal: GuardrailProposal;
  onVote: (id: number, delta: number) => void;
  onAnalyze: (id: number) => void;
}

const roleStyles: { [key: string]: string } = {
  'W3C Member': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30',
  'Community Contributor': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/30',
  'AI Safety Researcher': 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-500/30',
};

export const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, onVote, onAnalyze }) => {

  const handleVote = (delta: number) => {
    onVote(proposal.id, delta);
  };
  
  const voteColor = proposal.votes > 0 ? 'text-green-500 dark:text-green-400' : proposal.votes < 0 ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400';

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 flex flex-col sm:flex-row gap-4 transition-shadow hover:shadow-lg animate-fade-in-right">
      <div className="flex flex-row sm:flex-col items-center justify-center sm:justify-start space-x-2 sm:space-x-0 sm:space-y-1 pt-1">
        <button onClick={() => handleVote(1)} className="p-1 rounded-full hover:bg-green-100 dark:hover:bg-green-900/50 text-gray-500 hover:text-green-600 transition-colors" aria-label="Upvote">
          <ArrowUpIcon className="w-6 h-6" />
        </button>
        <span className={`text-xl font-bold ${voteColor}`}>{proposal.votes}</span>
        <button onClick={() => handleVote(-1)} className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-gray-500 hover:text-red-600 transition-colors" aria-label="Downvote">
          <ArrowDownIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{proposal.title}</h4>
            <span className="text-xs font-medium text-cyan-700 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/30 px-2 py-1 rounded-full">{proposal.category}</span>
        </div>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Submitted by {proposal.submittedBy}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${roleStyles[proposal.userRole] || ''}`}>{proposal.userRole}</span>
        </div>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
          {proposal.description}
        </p>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button 
                onClick={() => onAnalyze(proposal.id)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-colors"
            >
                <ScaleIcon className="w-4 h-4" />
                Analyze Impact
            </button>
        </div>
      </div>
    </div>
  );
};