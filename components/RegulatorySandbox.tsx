import React, { useState } from 'react';
import { ShieldCheckmarkIcon } from './icons/ShieldCheckmarkIcon';
import { GeneratedPlaceholderImage } from './GeneratedPlaceholderImage';
import { WandIcon } from './icons/WandIcon';

export const RegulatorySandbox: React.FC = () => {
    const [imageGenerated, setImageGenerated] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const description = "An abstract representation of a secure digital sandbox, with glowing geometric shapes contained within a protective barrier. Represents a safe environment for testing AI guardrails.";

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setImageGenerated(true);
            setIsGenerating(false);
        }, 1500); // Simulate API call
    };

    return (
        <main className="mt-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3 text-glow-main-title">
                    <ShieldCheckmarkIcon className="w-8 h-8 text-green-400" />
                    Kubernetics Regulatory Sandbox
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    A controlled environment for testing and validating new guardrail proposals and AI safety protocols before they are deployed system-wide into the core Kubernetics.
                </p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl p-6 min-h-[300px] flex items-center justify-center">
                {imageGenerated ? (
                    <GeneratedPlaceholderImage description={description} />
                ) : (
                    <div className="text-center text-gray-500">
                        <p>Interface for deploying and testing experimental guardrails will be displayed here.</p>
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-700 disabled:bg-gray-600 transition-colors"
                        >
                            <WandIcon className="w-5 h-5" />
                            {isGenerating ? 'Generating...' : 'Generate Placeholder Image'}
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
};