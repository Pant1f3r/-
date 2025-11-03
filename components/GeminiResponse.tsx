
import React from 'react';

interface GeminiResponseProps {
  response: string;
  isLoading: boolean;
  error: string;
}

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-3 animate-pulse">
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
  </div>
);

export const GeminiResponse: React.FC<GeminiResponseProps> = ({ response, isLoading, error }) => {
  const hasContent = response || error;
  
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-cyan-500 dark:text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
            <path d="M12 7c-2.757 0-5 2.243-5 5s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 8c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3z"></path>
        </svg>
        AI Model Response
      </h3>
      <div className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap flex-grow overflow-y-auto">
        {isLoading && <LoadingSkeleton />}
        {!isLoading && !hasContent && (
           <div className="text-gray-500 h-full flex items-center justify-center">
            <p>AI response will appear here.</p>
           </div>
        )}
        {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
        {response && <p>{response}</p>}
      </div>
    </div>
  );
};