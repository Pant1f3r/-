import React, { useState } from 'react';
import { NftIcon } from './icons/NftIcon';
import { generateContent, generateImage } from '../services/geminiService';
import { checkPrompt } from '../services/guardrailService';
import { SparklesIcon } from './icons/SparklesIcon';
import { CheckBadgeIcon } from './icons/CheckBadgeIcon';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { Type } from '@google/genai';

interface NftMetadata {
  name: string;
  description: string;
  attributes: { trait_type: string; value: string }[];
}

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 bg-gray-700 rounded w-1/4"></div>
      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
    </div>
);


export const DejaVuNftStudios: React.FC = () => {
    const [prompt, setPrompt] = useState('A swirling galaxy trapped inside a crystal, with data streams flowing around it');
    const [metadata, setMetadata] = useState<NftMetadata | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isMinted, setIsMinted] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        const guardrailCheck = checkPrompt(prompt);
        if (!guardrailCheck.isAllowed) {
            const category = Object.keys(guardrailCheck.matchedByCategory)[0];
            setError(`Prompt blocked by ${category} guardrail policy.`);
            return;
        }

        setIsLoading(true);
        setError('');
        setMetadata(null);
        setImage(null);
        setIsMinted(false);

        try {
            // Step 1: Generate Metadata using responseSchema for robust JSON output
            const nftMetadataSchema = {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: 'A cosmic and unique name for the NFT.' },
                    description: { type: Type.STRING, description: 'A detailed, evocative description of the NFT artwork and its connection to a "spythagorithm" that governs its existence.' },
                    attributes: {
                        type: Type.ARRAY,
                        description: 'A list of traits associated with the NFT.',
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                trait_type: { type: Type.STRING, description: 'The category of the trait (e.g., "Galaxy Class", "Data Stream Purity", "Spythagorithm Signature").' },
                                value: { type: Type.STRING, description: 'The specific value of the trait.' },
                            },
                            required: ['trait_type', 'value'],
                        },
                    },
                },
                required: ['name', 'description', 'attributes'],
            };

            const metaResponse = await generateContent(
                `Generate NFT metadata for the following concept: "${prompt}". The name should be cosmic. The description should detail its connection to a 'spythagorithm' that governs its existence. Attributes should include 'Galaxy Class', 'Data Stream Purity', and 'Spythagorithm Signature'.`,
                `You are an expert NFT creator for the DEJA' VU directive. Your task is to interpret cryptic concepts and generate metadata for unique, galactic-themed NFTs.`,
                {
                    responseMimeType: "application/json",
                    responseSchema: nftMetadataSchema,
                }
            );
            
            let parsedMeta: NftMetadata;
            try {
                // The response is guaranteed to be valid JSON by the API when using responseSchema.
                parsedMeta = JSON.parse(metaResponse.text);
                setMetadata(parsedMeta);
            } catch (e) {
                console.error("JSON parsing failed despite using responseSchema. Raw text:", metaResponse.text, e);
                throw new Error("Failed to parse AI-generated metadata. The response was not valid JSON.");
            }
            
            // Step 2: Generate Image
            const imagePrompt = `NFT Art, cosmic, ethereal, trending on artstation: ${parsedMeta.description}`;
            const imageResult = await generateImage(imagePrompt, "1:1");
            setImage(imageResult);

        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleMint = () => {
        // Simulate minting process
        setIsMinted(true);
    };

    return (
        <main className="mt-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3 text-glow-main-title">
                    <NftIcon className="w-8 h-8 text-purple-400" />
                    DEJA' VU NFT Genesis Studio
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Materialize cosmic and cryptologic concepts into unique digital assets. Under the DEJA' VU directive, this studio utilizes Google AI Studio to publish and produce galactic NFTs based on pre-intel spythagorithms, ensuring crypto-literacy and asset integrity.
                </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="nft-prompt" className="block text-sm font-medium text-gray-300 mb-2">
                            Describe your NFT concept
                        </label>
                        <textarea
                            id="nft-prompt"
                            rows={3}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={isLoading}
                            className="w-full p-3 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500"
                            placeholder="e.g., 'An ancient astronaut discovering a forgotten alien artifact.'"
                        />
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !prompt.trim()}
                        className="w-full flex justify-center items-center py-3 text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600"
                    >
                        {isLoading ? 'Generating...' : 'Generate NFT'}
                    </button>
                </div>
            </div>

            {(isLoading || error || image || metadata) && (
                <div className="mt-6 bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-6 animate-fade-in-right">
                    <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                        <SparklesIcon className="w-6 h-6 text-cyan-400" />
                        Generated NFT Preview
                    </h3>
                    <div className="text-gray-300">
                        {isLoading && <LoadingSkeleton />}
                        {error && <p className="text-red-400 font-mono bg-red-900/20 p-3 rounded-md">{error}</p>}
                        
                        {(image || metadata) && !isLoading && !error && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col items-center">
                                    {image ? (
                                        <img src={`data:image/jpeg;base64,${image}`} alt={metadata?.name || 'Generated NFT'} className="w-full aspect-square rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40"/>
                                    ) : (
                                        <div className="w-full aspect-square rounded-lg bg-gray-800 flex items-center justify-center animate-pulse">
                                            <SparklesIcon className="w-16 h-16 text-gray-600"/>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-2xl font-bold text-gray-100">{metadata?.name || 'Loading...'}</h4>
                                    <p className="mt-2 text-sm text-gray-400 italic">{metadata?.description || ''}</p>
                                    
                                    <div className="mt-4 space-y-2">
                                        <h5 className="font-semibold text-gray-300">Attributes:</h5>
                                        <div className="flex flex-wrap gap-2">
                                        {metadata?.attributes.map((attr, i) => (
                                            <div key={i} className="bg-gray-700/50 border border-gray-600 rounded-md px-3 py-1 text-center">
                                                <p className="text-xs uppercase text-cyan-400 font-semibold">{attr.trait_type}</p>
                                                <p className="text-sm text-gray-200">{attr.value}</p>
                                            </div>
                                        ))}
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                    {isMinted ? (
                                        <div className="flex items-center gap-3 p-3 bg-green-900/30 border border-green-500/50 rounded-md">
                                            <CheckBadgeIcon className="w-8 h-8 text-green-400"/>
                                            <div>
                                                <p className="font-semibold text-green-400">Published Successfully!</p>
                                                <p className="text-xs text-gray-400 font-mono">Registry ID: 0x123...abc</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={handleMint}
                                            disabled={!image || !metadata}
                                            className="w-full flex items-center justify-center gap-2 py-3 text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
                                        >
                                           <LockClosedIcon className="w-5 h-5" />
                                            Publish to DEJA' VU Registry (Simulated)
                                        </button>
                                    )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
};