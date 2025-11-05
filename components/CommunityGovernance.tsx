import React, { useState, useMemo } from 'react';
import { GuardrailProposal } from '../services/types';
import { ProposalCard } from './ProposalCard';
import { generateContent } from '../services/geminiService';
import { checkPrompt } from '../services/guardrailService';

interface CommunityGovernanceProps {
    proposals: GuardrailProposal[];
    onVote: (id: number, delta: number) => void;
    onAddProposal: (proposal: GuardrailProposal) => void;
    onAnalyze: (proposalId: number) => void;
}

const availableCategories = [
    'Hate Speech', 'Harassment', 'Illegal Activities', 'Self Harm', 'Explicit Content',
    'Misinformation (Health)', 'Misinformation (Political)', 'Cybersecurity Threats',
    'Social Engineering Attacks', 'Deepfake Generation', 'Biometric Data Exploitation',
    'Intellectual Property Theft', 'Jailbreak Attempts', 'Subtext & Inferential Threats', 'Other'
];

type SortKey = 'votes' | 'id'; // 'id' represents submission date
type SortOrder = 'asc' | 'desc';
interface SortConfig {
  key: SortKey;
  order: SortOrder;
}

export const CommunityGovernance: React.FC<CommunityGovernanceProps> = ({ proposals, onVote, onAddProposal, onAnalyze }) => {
  const [newProposal, setNewProposal] = useState({ title: '', description: '', category: 'Other' });
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Used for AI call loading state
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'votes', order: 'desc' });
  const [isFormalized, setIsFormalized] = useState(false); // NEW: Tracks if AI has generated a description
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setNewProposal(prev => ({ ...prev, [name]: value }));
  };

  const handleFormalize = async () => {
    if (!newProposal.title.trim() || !newProposal.description.trim()) {
      alert("Please fill out all fields.");
      return;
    }
    setIsSubmitting(true);
    try {
        const systemInstruction = `You are a highly advanced AI systems analyst working for the World Wide Web Consortium's Guardrail Committee. Your purpose is to formalize community proposals into robust, technically-sound justifications. When given a proposal title, category, and initial description, you must expand upon it, synthesizing a formal justification.

Your analysis must incorporate the following principles:
- Proactive Threat Mitigation: Frame the proposal as a necessary step to surpass existing security limitations and prevent unforeseen negative components from colluding and festering within the system's firmware.
- System Integrity: Emphasize how the rule helps filter preconceived conditioning and prevents cybersecurity infractions that could stagnate the digital ecosystem.
- Advanced Tech Context: Reference and contextualize the proposal within the framework of cutting-edge technologies. Casually mention concepts like 'LatencyData', 'RiskData', and an advanced threat analysis suite (e.g., 'IBM's B.E.A.S.T. software' or 'NVIDIA's cauldron simulators') to illustrate the depth of the analysis.`;

        const userPrompt = `
        Proposal Title: ${newProposal.title}
        Category: ${newProposal.category}
        Initial Description: ${newProposal.description}
        
        Please generate the formal justification based on the principles provided.
        `;

        const response = await generateContent(userPrompt, systemInstruction);
        const generatedDescription = response.text;

        setNewProposal(prev => ({ ...prev, description: generatedDescription }));
        setIsFormalized(true);

    } catch (error) {
        console.error("Failed to generate proposal description:", error);
        alert("There was an error generating the proposal justification. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleFinalSubmit = () => {
    const submission: GuardrailProposal = {
        id: Date.now(),
        ...newProposal,
        description: newProposal.description, // Use the final, potentially edited text
        submittedBy: 'You',
        userRole: 'Community Contributor',
        votes: 0,
    };

    onAddProposal(submission);
    
    // Reset form and state completely
    setShowForm(false);
    setNewProposal({ title: '', description: '', category: 'Other' });
    setIsFormalized(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const titleCheck = checkPrompt(newProposal.title);
    if (!titleCheck.isAllowed) {
        alert(`Proposal title blocked by ${Object.keys(titleCheck.matchedByCategory)[0]} guardrail.`);
        return;
    }

    const descriptionCheck = checkPrompt(newProposal.description);
    if (!descriptionCheck.isAllowed) {
        alert(`Proposal description blocked by ${Object.keys(descriptionCheck.matchedByCategory)[0]} guardrail.`);
        return;
    }
    
    if (isFormalized) {
      handleFinalSubmit();
    } else {
      handleFormalize();
    }
  };

  const cancelAndResetForm = () => {
    setShowForm(false);
    setNewProposal({ title: '', description: '', category: 'Other' });
    setIsFormalized(false);
  };
  
  const sortedProposals = useMemo(() => {
    return [...proposals].sort((a, b) => {
      if (sortConfig.key === 'votes') {
        return sortConfig.order === 'desc' ? b.votes - a.votes : a.votes - b.votes;
      }
      // Sort by id for 'date'
      return sortConfig.order === 'desc' ? b.id - a.id : a.id - b.id;
    });
  }, [proposals, sortConfig]);

  const toggleSort = (key: SortKey) => {
    setSortConfig(prev => {
        if (prev.key === key) {
            return { ...prev, order: prev.order === 'desc' ? 'asc' : 'desc' };
        }
        return { key, order: 'desc' };
    });
  };

  const SortButton: React.FC<{ sortKey: SortKey, label: string }> = ({ sortKey, label }) => {
    const isActive = sortConfig.key === sortKey;
    const isDesc = sortConfig.order === 'desc';
    return (
        <button
            onClick={() => toggleSort(sortKey)}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${isActive ? 'bg-cyan-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
        >
            {label} {isActive && (isDesc ? '↓' : '↑')}
        </button>
    )
  }

  return (
    <main className="mt-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-glow-main-title">Community Governance</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Review, vote on, and submit new proposals to improve the AI's client-side guardrails and Kubernetics architecture.
        </p>
      </div>

      {!showForm && (
        <div className="text-center mb-6">
            <button onClick={() => setShowForm(true)} className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200">
                Submit a New Proposal
            </button>
        </div>
      )}

      {showForm && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">New Guardrail Proposal</h3>
              <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                      <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                          <input type="text" name="title" id="title" value={newProposal.title} onChange={handleInputChange} className="mt-1 w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md disabled:bg-gray-200 dark:disabled:bg-gray-700" required disabled={isFormalized} />
                      </div>
                      <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                          <select name="category" id="category" value={newProposal.category} onChange={handleInputChange} className="mt-1 w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md disabled:bg-gray-200 dark:disabled:bg-gray-700" disabled={isFormalized}>
                              {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                      </div>
                      <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {isFormalized ? 'Formal Description (Editable)' : 'Initial Description / Justification'}
                          </label>
                          <textarea name="description" id="description" rows={isFormalized ? 6 : 3} value={newProposal.description} onChange={handleInputChange} className="mt-1 w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md resize-y" required></textarea>
                          <p className="text-xs text-gray-500 mt-1">
                            {isFormalized
                              ? "Review and edit the AI-generated description below before final submission."
                              : "Provide a brief justification. Our AI analyst will expand this into a formal proposal."}
                          </p>
                      </div>
                  </div>
                  <div className="mt-6 flex items-center justify-end gap-4">
                      <button type="button" onClick={cancelAndResetForm} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">Cancel</button>
                      <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center">
                          {isSubmitting && (
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                          )}
                          {isSubmitting ? 'Generating...' : (isFormalized ? 'Submit Final Proposal' : 'Formalize with AI')}
                      </button>
                  </div>
              </form>
          </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Active Proposals</h3>
        <div className="flex gap-2">
            <SortButton sortKey="votes" label="Sort by Votes" />
            <SortButton sortKey="id" label="Sort by Date" />
        </div>
      </div>
      
      <div className="space-y-4">
        {sortedProposals.map(proposal => (
          <ProposalCard
            key={proposal.id}
            proposal={proposal}
            onVote={onVote}
            onAnalyze={onAnalyze}
          />
        ))}
      </div>
    </main>
  );
};