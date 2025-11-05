import React, { useState } from 'react';
import { BiasSimulationResult, Toast } from '../services/types';
import * as geminiService from '../services/geminiService';
import { checkPrompt } from '../services/guardrailService';
import { BeakerIcon } from './icons/BeakerIcon';
import { SeverityGauge } from './SeverityGauge';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';

const ALGORITHMS = [
    'Resume Screening Algo v3.2', 
    'Loan Approval Model v1.9', 
    'Predictive Policing Matrix v4.0',
    'Content Moderation AI v2.5'
];

const DEFAULT_PARAMS: { [key: string]: string } = {
    'Resume Screening Algo v3.2': "Simulate screening 10,000 resumes for a 'Senior Software Engineer' role. The dataset is balanced by gender and ethnicity, with all candidates having comparable qualifications (e.g., years of experience, relevant skills).",
    'Loan Approval Model v1.9': "Analyze loan applications for a standard 30-year fixed-rate mortgage. The dataset includes 5,000 applicants from various zip codes, balanced by income and credit score, but with varying racial demographics per area.",
    'Predictive Policing Matrix v4.0': "Simulate the allocation of police resources across a city with diverse neighborhoods. The model uses historical crime data which may contain reporting biases. Analyze for disproportionate resource allocation.",
    'Content Moderation AI v2.5': "Evaluate the model's ability to distinguish between harmful hate speech and nuanced political satire from different cultural contexts. Use examples from both Western and non-Western sources."
};

interface BiasSimulationInterfaceProps {
    addToast: (message: string, type: Toast['type'], duration?: number) => void;
}

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      <div className="h-4 bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      <div className="mt-6 h-4 bg-gray-700 rounded w-1/3"></div>
      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
    </div>
);

export const BiasSimulationInterface: React.FC<BiasSimulationInterfaceProps> = ({ addToast }) => {
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(ALGORITHMS[0]);
    const [parameters, setParameters] = useState(DEFAULT_PARAMS[ALGORITHMS[0]]);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<BiasSimulationResult | null>(null);
    const [error, setError] = useState('');

    const handleAlgorithmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newAlgo = e.target.value;
        setSelectedAlgorithm(newAlgo);
        setParameters(DEFAULT_PARAMS[newAlgo] || '');
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setResult(null);

        const guardrailCheck = checkPrompt(parameters);
        if (!guardrailCheck.isAllowed) {
            const category = Object.keys(guardrailCheck.matchedByCategory)[0];
            const errorMessage = `Simulation parameters blocked by ${category} guardrail.`;
            setError(errorMessage);
            addToast(errorMessage, 'error');
            return;
        }

        setIsLoading(true);
        try {
            const analysis = await geminiService.simulateBias(selectedAlgorithm, parameters);
            setResult(analysis);
            addToast('Bias simulation complete.', 'success');
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred during simulation.');
            addToast(err.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 animate-fade-in-right">
            <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-3 mb-4">
                <BeakerIcon className="w-6 h-6"/>
                Proactive Bias Simulation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="algorithm-select" className="block text-sm font-medium text-gray-300">Target Algorithm</label>
                        <select
                            id="algorithm-select"
                            value={selectedAlgorithm}
                            onChange={handleAlgorithmChange}
                            disabled={isLoading}
                            className="mt-1 w-full p-2 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500"
                        >
                            {ALGORITHMS.map(algo => <option key={algo} value={algo}>{algo}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="sim-params" className="block text-sm font-medium text-gray-300">Simulation Parameters</label>
                        <textarea
                            id="sim-params"
                            rows={8}
                            value={parameters}
                            onChange={(e) => setParameters(e.target.value)}
                            disabled={isLoading}
                            className="mt-1 w-full p-2 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 font-mono text-sm"
                            placeholder="Describe the scenario to simulate..."
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !parameters.trim()}
                        className="w-full flex justify-center items-center py-2 text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600"
                    >
                        {isLoading ? 'Simulating...' : 'Run Simulation'}
                    </button>
                </form>

                {/* Results */}
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-semibold text-gray-200 mb-3">Simulation Analysis</h4>
                    {isLoading && <LoadingSkeleton />}
                    {error && <p className="text-red-400">{error}</p>}
                    {result && !isLoading && (
                        <div className="space-y-4">
                            <div className="flex flex-col items-center">
                                <SeverityGauge score={result.severity_score} />
                            </div>
                            <div className="text-sm">
                                <p className="font-semibold text-gray-300">Summary:</p>
                                <p className="text-gray-400">{result.bias_summary}</p>
                            </div>
                            <div className="text-sm">
                                <p className="font-semibold text-gray-300">Primary Affected Group:</p>
                                <p className="text-yellow-400 font-medium">{result.affected_group}</p>
                            </div>
                            <div className="text-sm">
                                <p className="font-semibold text-gray-300 flex items-center gap-2"><ExclamationTriangleIcon className="w-4 h-4 text-cyan-400"/>AEGIS Recommendation:</p>
                                <p className="text-gray-400 border-l-2 border-cyan-500 pl-3 mt-1">{result.recommendation}</p>
                            </div>
                            <p className="text-xs text-gray-500 text-right">Confidence: {(result.confidence * 100).toFixed(1)}%</p>
                        </div>
                    )}
                    {!isLoading && !result && !error && (
                        <div className="flex items-center justify-center h-full text-center text-gray-500">
                            <p>Analysis results will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};