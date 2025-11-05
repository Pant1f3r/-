import React, { useState } from 'react';
import * as geminiService from '../services/geminiService';
import { checkPrompt } from '../services/guardrailService';
import { CodeIcon } from './icons/CodeIcon';

const LANGUAGES = ['TypeScript', 'Python', 'Go', 'HTML/CSS'];

const LoadingSkeleton: React.FC = () => (
    <div className="bg-gray-900/70 p-4 rounded-md animate-pulse">
        <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6 ml-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 ml-4"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 ml-4"></div>
            <div className="h-4 bg-gray-700 rounded w-full"></div>
        </div>
    </div>
);

// A simple component to render code with basic formatting.
const CodeBlock: React.FC<{ code: string, language: string }> = ({ code, language }) => {
    // Basic cleaning of markdown fences for display
    const cleanedCode = code.replace(/```(typescript|python|go|html|css)?\n?/g, '').replace(/```\n?$/g, '');
    return (
        <pre className="bg-gray-900/70 p-4 rounded-md overflow-x-auto">
            <code className={`language-${language.toLowerCase()}`}>{cleanedCode}</code>
        </pre>
    );
};

export const FullStackIntegrator: React.FC = () => {
    const [prompt, setPrompt] = useState('Create a responsive login form component with validation.');
    const [language, setLanguage] = useState('TypeScript');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || !language) return;

        setIsLoading(true);
        setError('');
        setResult('');
        
        const guardrailCheck = checkPrompt(prompt);
        if (!guardrailCheck.isAllowed) {
            const category = Object.keys(guardrailCheck.matchedByCategory)[0];
            setError(`Prompt blocked by ${category} guardrail policy.`);
            setIsLoading(false);
            return;
        }

        try {
            const systemInstruction = `You are a world-class senior full-stack engineer. Generate clean, efficient, and well-documented code in ${language} for the following request. The code should be complete and ready to use. Wrap the code block in the appropriate markdown format (e.g., \`\`\`typescript).`;
            const fullPrompt = `Generate code for: ${prompt}`;
            
            const response = await geminiService.generateContent(fullPrompt, systemInstruction);
            setResult(response.text);

        } catch (err: any) {
            const errorMessage = err.message || 'An unexpected error occurred during code generation.';
            setError(errorMessage);
            console.error("Code Generation Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="mt-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3 text-glow-main-title">
                    <CodeIcon className="w-8 h-8 text-purple-400" />
                    Kubernetics Full-Stack Code Integrator
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Leverage the KR0M3D1A AI to generate production-ready code snippets. Describe your component or logic, select a language, and receive a complete implementation from the Kubernetics core.
                </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Select Language/Framework
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {LANGUAGES.map(lang => (
                                <button
                                    key={lang}
                                    type="button"
                                    onClick={() => setLanguage(lang)}
                                    disabled={isLoading}
                                    className={`px-4 py-2 text-sm font-mono rounded-md transition-all duration-200 border transform focus:outline-none ${language === lang ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'}`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="code-prompt" className="block text-sm font-medium text-gray-300 mb-2">
                            Describe what you want to build
                        </label>
                        <textarea
                            id="code-prompt"
                            rows={4}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={isLoading}
                            className="w-full p-3 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500"
                            placeholder="e.g., 'A reusable button component with loading and disabled states.'"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !prompt.trim()}
                        className="w-full flex justify-center items-center py-3 text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600"
                    >
                        {isLoading ? 'Generating Code...' : 'Generate Code'}
                    </button>
                </form>
            </div>

            {(isLoading || error || result) && (
                <div className="mt-6 bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-6 animate-fade-in-right">
                    <h3 className="text-lg font-semibold text-gray-200 mb-3">Generated Code:</h3>
                    <div className="text-gray-300">
                        {isLoading && <LoadingSkeleton />}
                        {error && <p className="text-red-400 font-mono bg-red-900/20 p-3 rounded-md">{error}</p>}
                        {result && <CodeBlock code={result} language={language} />}
                    </div>
                </div>
            )}
        </main>
    );
};