

import React, { useState } from 'react';
import { WandIcon } from './icons/WandIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface ImageGenerationProps {
  onSubmit: (prompt: string, aspectRatio: string) => void;
  isLoading: boolean;
  generatedImage: string | null;
  error: string;
}

type AspectRatio = "1:1" | "4:3" | "3:4" | "16:9" | "9:16";

const ASPECT_RATIOS: AspectRatio[] = ["1:1", "4:3", "3:4", "16:9", "9:16"];

const LoadingSkeleton: React.FC<{aspectRatio: AspectRatio}> = ({aspectRatio}) => {
    const getAspectRatioClass = () => {
        switch(aspectRatio) {
            case "1:1": return "aspect-square";
            case "4:3": return "aspect-[4/3]";
            case "3:4": return "aspect-[3/4]";
            case "16:9": return "aspect-video";
            case "9:16": return "aspect-[9/16]";
            default: return "aspect-square";
        }
    }
    return (
        <div className={`w-full max-w-lg mx-auto bg-gray-700 rounded-lg animate-pulse ${getAspectRatioClass()}`}></div>
    );
};

export const ImageGeneration: React.FC<ImageGenerationProps> = ({
  onSubmit,
  isLoading,
  generatedImage,
  error,
}) => {
  const [prompt, setPrompt] = useState('A hyper-realistic photograph of a cybernetic owl with glowing neon eyes, perched on a branch in a futuristic city at night.');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt, aspectRatio);
    }
  };
  
  return (
    <main className="mt-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3 text-glow-main-title">
          <WandIcon className="w-8 h-8 text-purple-400" />
          Kubernetics AI Image Generation
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Use the KR0M3D1A protocol's creative core, powered by Gemini, to generate high-quality images from text descriptions through its Kubernetics image pipeline.
        </p>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="image-gen-prompt" className="block text-sm font-medium text-gray-300 mb-2">
                    Enter your creative prompt
                </label>
                <textarea
                    id="image-gen-prompt"
                    rows={3}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isLoading}
                    className="w-full p-3 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 placeholder-gray-500 text-gray-200"
                    placeholder="e.g., 'A majestic lion wearing a crown, painted in the style of Van Gogh'"
                />
            </div>
            
            <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Aspect Ratio
                </label>
                <div className="flex flex-wrap gap-3">
                    {ASPECT_RATIOS.map(ratio => {
                        const isSelected = aspectRatio === ratio;
                        return (
                            <button
                                key={ratio}
                                type="button"
                                onClick={() => setAspectRatio(ratio)}
                                disabled={isLoading}
                                className={`px-4 py-2 text-sm font-mono rounded-md transition-all duration-200 border transform focus:outline-none
                                    disabled:transform-none disabled:opacity-60 disabled:cursor-not-allowed
                                    ${isSelected
                                        ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-500/30'
                                        : `bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-cyan-500 hover:-translate-y-0.5
                                           focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800`
                                    }`
                                }
                            >
                                {ratio}
                            </button>
                        )
                    })}
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? 'Generating...' : 'Generate Image'}
            </button>
        </form>
      </div>
      
      {(isLoading || error || generatedImage) && (
        <div className="mt-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 animate-fade-in-right">
            <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-cyan-400" />
                Generated Output
            </h3>
            <div className="text-gray-300 text-sm whitespace-pre-wrap">
                {isLoading && <LoadingSkeleton aspectRatio={aspectRatio} />}
                {error && <p className="text-red-400">{error}</p>}
                {generatedImage && (
                    <div className="flex flex-col items-center gap-4">
                        <img 
                            src={`data:image/png;base64,${generatedImage}`} 
                            alt={prompt}
                            className="max-w-full max-h-[70vh] rounded-lg shadow-lg"
                        />
                        <a
                            href={`data:image/png;base64,${generatedImage}`}
                            download="generated-image.png"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                        >
                           <DownloadIcon className="w-5 h-5" />
                           Download Image
                        </a>
                    </div>
                )}
            </div>
        </div>
      )}
    </main>
  );
};