import React from 'react';
import { PromptInput } from './PromptInput';
import { GuardrailAnalysis } from './GuardrailAnalysis';
import { GeminiResponse } from './GeminiResponse';
import { GuardrailResult } from '../services/types';

interface PromptDemonstratorProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    handleSubmit: (currentPrompt: string) => void;
    isLoading: boolean;
    guardrailResult: GuardrailResult | null;
    geminiResponse: string;
    error: string;
    onRephrase: () => void;
    interimStatus: 'idle' | 'analyzing' | 'allowed' | 'blocked';
    progressMessage: string;
}

export const PromptDemonstrator: React.FC<PromptDemonstratorProps> = ({
    prompt,
    setPrompt,
    handleSubmit,
    isLoading,
    guardrailResult,
    geminiResponse,
    error,
    onRephrase,
    interimStatus,
    progressMessage,
}) => {
    return (
        <main className="mt-8">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl p-6">
                <PromptInput
                    prompt={prompt}
                    setPrompt={setPrompt}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    interimStatus={interimStatus}
                    progressMessage={progressMessage}
                />
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <GuardrailAnalysis result={guardrailResult} prompt={prompt} onRephrase={onRephrase} />
                <GeminiResponse response={geminiResponse} isLoading={isLoading} error={error} />
            </div>
        </main>
    );
};