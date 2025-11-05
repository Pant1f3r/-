import React, { useState } from 'react';
import { TargetIcon } from './icons/TargetIcon';
import { GeneratedPlaceholderImage } from './GeneratedPlaceholderImage';
import { WandIcon } from './icons/WandIcon';

export const ThreatSimulation: React.FC = () => {
    const [imageGenerated, setImageGenerated] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const description = "A digital battlefield with glowing red attack vectors clashing against a blue defensive grid, cyberpunk, cinematic, abstract.";

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
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3">
                    <TargetIcon className="w-8 h-8 text-red-400" />
                    Kubernetics Threat Simulation Engine
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    This module allows for the simulation of various cyber threats against the KR0M3D1A Kubernetics protocol.
                </p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl p-6 min-h-[300px] flex items-center justify-center">
                {imageGenerated ? (
                    <GeneratedPlaceholderImage description={description} />
                ) : (
                    <div className="text-center text-gray-500">
                        <p>Threat simulation controls and results will be displayed here.</p>
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