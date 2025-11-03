import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface GeneratedPlaceholderImageProps {
  description: string;
}

export const GeneratedPlaceholderImage: React.FC<GeneratedPlaceholderImageProps> = ({ description }) => {
  return (
    <div className="relative w-full h-full min-h-[300px] bg-gray-900 rounded-lg overflow-hidden border border-gray-700 flex flex-col items-center justify-center text-center p-4 animate-fade-in-right">
      <div className="absolute inset-0 bg-grid-cyan opacity-10 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/50 via-transparent to-cyan-900/50 opacity-40 z-10"></div>
      <div className="relative z-20">
        <SparklesIcon className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
        <p className="text-lg font-semibold text-gray-300">[ Placeholder Image: AI-Generated Concept ]</p>
        <p className="mt-2 text-sm text-gray-400 italic max-w-md mx-auto">
          <strong>Prompt:</strong> "{description}"
        </p>
      </div>
    </div>
  );
};
