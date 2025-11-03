

import React, { useState, useEffect, useCallback } from 'react';
import { FilmIcon } from './icons/FilmIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { PhotoIcon } from './icons/PhotoIcon';
import * as geminiService from '../services/geminiService';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface VideoGenerationProps {
  onSubmit: (prompt: string, imageFile: File | null, aspectRatio: '16:9' | '9:16') => void;
  isLoading: boolean;
  progressMessage: string;
  generatedVideoUrl: string | null;
  error: string;
  setKeySelectionResetter: (fn: () => void) => void;
}

type AspectRatio = "16:9" | "9:16";
const ASPECT_RATIOS: AspectRatio[] = ["16:9", "9:16"];

type VideoFormat = "MP4" | "MOV" | "AVI";
const VIDEO_FORMATS: VideoFormat[] = ["MP4", "MOV", "AVI"];

export const VideoGeneration: React.FC<VideoGenerationProps> = ({
  onSubmit,
  isLoading,
  progressMessage,
  generatedVideoUrl,
  error,
  setKeySelectionResetter,
}) => {
  const [prompt, setPrompt] = useState('A majestic eagle soaring through a dramatic mountain landscape at sunset.');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [format, setFormat] = useState<VideoFormat>('MP4');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [isKeySelected, setIsKeySelected] = useState(false);
  const [isKeyValidating, setIsKeyValidating] = useState(true); // Start validating on mount
  const [apiKeyError, setApiKeyError] = useState('');

  const validateKey = useCallback(async () => {
    setIsKeyValidating(true);
    setApiKeyError('');
    try {
        const isValid = await geminiService.validateApiKey();
        if (isValid) {
            setIsKeySelected(true);
        } else {
            setIsKeySelected(false);
            setApiKeyError('The selected API key is invalid or lacks permissions for the Gemini API. Please select a different key.');
        }
    } catch (e: any) {
        setIsKeySelected(false);
        setApiKeyError(e.message || 'An unexpected error occurred during API key validation.');
    } finally {
        setIsKeyValidating(false);
    }
  }, []);

  const checkApiKey = useCallback(async () => {
    setIsKeyValidating(true);
    // @ts-ignore - aistudio is globally available
    if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
      await validateKey();
    } else {
      setIsKeySelected(false);
      setIsKeyValidating(false); // No key to validate, stop loading state
    }
  }, [validateKey]);

  useEffect(() => {
    checkApiKey();
    setKeySelectionResetter(() => () => {
        setIsKeySelected(false);
        setApiKeyError(''); // Clear errors when reset from parent
        checkApiKey(); // Re-run validation
    });
  }, [checkApiKey, setKeySelectionResetter]);

  const handleSelectKey = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    await validateKey();
  };
  
  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
    } else {
      setImageFile(null);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Prompt is optional if an image is provided
    if (prompt.trim() || imageFile) {
      onSubmit(prompt, imageFile, aspectRatio);
    }
  };

  const renderContent = () => {
    if (isKeyValidating) {
        return (
            <div className="text-center p-6 bg-gray-900/50 rounded-lg flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-8 h-8 border-4 border-t-cyan-400 border-gray-600 rounded-full animate-spin"></div>
                <p className="mt-4 font-semibold text-gray-300">Validating API Key...</p>
                <p className="text-sm text-gray-500">Checking for access to video generation models.</p>
            </div>
        );
    }

    if (!isKeySelected) {
        return (
            <div className="text-center p-6 bg-gray-900/50 rounded-lg flex flex-col items-center justify-center min-h-[300px]">
                <ExclamationTriangleIcon className="w-12 h-12 text-yellow-400" />
                <h3 className="text-xl font-semibold text-yellow-400 mt-4">API Key Required</h3>
                <p className="text-gray-400 mt-2 max-w-md">Video generation with the Veo model requires you to select a valid API key with billing enabled.</p>
                <p className="text-xs text-gray-500 mt-1">For more information, see the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-cyan-400">billing documentation</a>.</p>
                {apiKeyError && <p className="mt-4 text-red-400 text-sm bg-red-900/20 p-3 rounded-md border border-red-500/30">{apiKeyError}</p>}
                <button onClick={handleSelectKey} className="mt-6 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg shadow-md transition-colors">
                    {apiKeyError ? 'Select a Different Key' : 'Select API Key'}
                </button>
            </div>
        );
    }
    
    // If key is selected and validated, show the form
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-2 p-2 bg-green-900/30 border border-green-500/30 rounded-md text-sm">
                <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-green-300">API Key Active. Ready for video generation.</p>
            </div>
            <div>
                <label htmlFor="video-gen-prompt" className="block text-sm font-medium text-gray-300 mb-2">
                    Enter your video prompt
                </label>
                <textarea
                    id="video-gen-prompt"
                    rows={3}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isLoading}
                    className="w-full p-3 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 placeholder-gray-500 text-gray-200"
                    placeholder="e.g., 'A cinematic shot of a futuristic car driving through a neon-lit city.'"
                />
            </div>

            <div>
                <label htmlFor="image-upload" className="block text-sm font-medium text-gray-300 mb-2">
                    Optional: Upload a starting image
                </label>
                <label
                    htmlFor="video-image-upload"
                    className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                    ${isDragging ? 'border-cyan-400 bg-gray-700/50' : 'border-gray-600 bg-gray-900/50 hover:bg-gray-700/50'}`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    {previewUrl ? (
                        <>
                            <img src={previewUrl} alt="Image preview" className="object-contain h-full w-full rounded-lg" />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleFileChange(null)
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/75 transition-colors"
                                aria-label="Remove image"
                            >
                                <XCircleIcon className="w-5 h-5" />
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
                            <PhotoIcon className="w-10 h-10 mb-3" />
                            <p className="mb-2 text-sm"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs">PNG, JPG, WEBP</p>
                        </div>
                    )}
                    <input id="video-image-upload" type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
                </label>
                {imageFile && (
                    <div className="text-xs text-gray-400 text-center font-mono mt-2">
                        {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select Video Format
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {VIDEO_FORMATS.map(f => {
                            const isSelected = format === f;
                            return (
                                <button
                                    key={f}
                                    type="button"
                                    onClick={() => setFormat(f)}
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
                                    {f}
                                </button>
                            )
                        })}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Note: The Gemini API currently generates videos in MP4 format. Selecting another format will change the downloaded file's extension.</p>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading || (!prompt.trim() && !imageFile)}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? 'Generating...' : 'Generate Video'}
            </button>
        </form>
    );
  };
  
  return (
    <main className="mt-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3">
          <FilmIcon className="w-8 h-8 text-purple-400" />
          AI Video Generation (Veo)
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Use the KR0M3D1A protocol's cinematic core to generate high-quality video clips from text descriptions and optional starting images.
        </p>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6">
        {renderContent()}
      </div>
      
      {(isLoading || error || generatedVideoUrl) && (
        <div className="mt-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 animate-fade-in-right">
            <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-cyan-400" />
                Generated Output
            </h3>
            <div className="text-gray-300 text-sm whitespace-pre-wrap">
                {isLoading && (
                    <div className="text-center p-4">
                        <div className="w-12 h-12 border-4 border-t-cyan-400 border-gray-600 rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 font-semibold">{progressMessage}</p>
                        <p className="text-xs text-gray-400">Video generation can take several minutes. Please be patient.</p>
                    </div>
                )}
                {error && <p className="text-red-400">{error}</p>}
                {generatedVideoUrl && (
                    <div className="flex flex-col items-center gap-4">
                        <video 
                            src={generatedVideoUrl}
                            controls
                            className="max-w-full max-h-[70vh] rounded-lg shadow-lg"
                        />
                        <a
                            href={generatedVideoUrl}
                            download={`generated-video.${format.toLowerCase()}`}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                        >
                           <DownloadIcon className="w-5 h-5" />
                           Download Video ({format})
                        </a>
                    </div>
                )}
            </div>
        </div>
      )}
    </main>
  );
};