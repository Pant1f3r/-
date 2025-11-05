import React, { useState, useCallback, useEffect } from 'react';
import { PhotoIcon } from './icons/PhotoIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface ImageAnalysisProps {
  onSubmit: (prompt: string, file: File) => void;
  isLoading: boolean;
  analysisResult: string;
  error: string;
}

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
    </div>
);

export const ImageAnalysis: React.FC<ImageAnalysisProps> = ({
  onSubmit,
  isLoading,
  analysisResult,
  error,
}) => {
  const [prompt, setPrompt] = useState('What is in this picture?');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
    } else {
      setImageFile(null);
      // Optional: Add a toast notification for invalid file type
    }
  };
  
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile]);

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageFile && prompt.trim()) {
      onSubmit(prompt, imageFile);
    }
  };
  
  return (
    <main className="mt-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3 text-glow-main-title">
          <PhotoIcon className="w-8 h-8 text-purple-400" />
          Kubernetics Multimodal Image Analysis
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Upload an image and use the KR0M3D1A AI to analyze its content. Ask questions, get descriptions, and explore the power of multimodal Kubernetics AI.
        </p>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left side: Uploader and Preview */}
          <div className="flex flex-col gap-4">
            <label
              htmlFor="image-upload"
              className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                ${isDragging ? 'border-cyan-400 bg-gray-700/50' : 'border-gray-600 bg-gray-900/50 hover:bg-gray-700/50'}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Image preview" className="object-contain h-full w-full rounded-lg" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
                    <PhotoIcon className="w-10 h-10 mb-3" />
                    <p className="mb-2 text-sm"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs">PNG, JPG, GIF, WEBP</p>
                </div>
              )}
               <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
            </label>
            {imageFile && (
                <div className="text-xs text-gray-400 text-center font-mono">
                    {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)
                </div>
            )}
          </div>

          {/* Right side: Prompt and Submit */}
          <form onSubmit={handleSubmit} className="flex flex-col">
             <div>
                <label htmlFor="image-prompt" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Question or Command
                </label>
                <textarea
                    id="image-prompt"
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isLoading}
                    className="w-full p-3 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 placeholder-gray-500 text-gray-200"
                    placeholder="e.g., 'Describe this scene', 'What is the main subject?', 'Write a story based on this image.'"
                />
            </div>
            <button
                type="submit"
                disabled={isLoading || !imageFile || !prompt.trim()}
                className="mt-4 w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Image'}
            </button>
          </form>
        </div>
      </div>
      
      {(isLoading || error || analysisResult) && (
        <div className="mt-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 animate-fade-in-right">
            <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-cyan-400" />
                Analysis Result
            </h3>
            <div className="text-gray-300 text-sm whitespace-pre-wrap">
                {isLoading && <LoadingSkeleton />}
                {error && <p className="text-red-400">{error}</p>}
                {analysisResult && <p>{analysisResult}</p>}
            </div>
        </div>
      )}
    </main>
  );
};