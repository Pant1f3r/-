import React, { useState } from 'react';
import { BeakerIcon } from './icons/BeakerIcon';
import { GeneratedPlaceholderImage } from './GeneratedPlaceholderImage';
import { WandIcon } from './icons/WandIcon';

export const InnovationConduit: React.FC = () => {
    const [imageGenerated, setImageGenerated] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const description = "An abstract, futuristic data pipeline with streams of light flowing through crystalline tubes, representing the flow of innovation and new technology. Purple and cyan color scheme.";
    
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
                    <BeakerIcon className="w-8 h-8 text-purple-400" />
                    Frontier Innovation Conduit
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    A dedicated pipeline for scaffolding and integrating next-generation infrastructure protocols. This module serves as a testbed for bleeding-edge technologies before their assimilation into the core KR0M3D1A framework.
                </p>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl p-6 min-h-[300px] flex items-center justify-center">
                {imageGenerated ? (
                    <GeneratedPlaceholderImage description={description} />
                ) : (
                    <div className="text-center text-gray-500">
                        <p>Interface for managing and deploying experimental infrastructure projects will be displayed here.</p>
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