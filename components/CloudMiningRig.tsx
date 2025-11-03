import React, { useState, useEffect } from 'react';
import { generateContent, generateImage } from '../services/geminiService';
import { Type } from '@google/genai';
import { BtcIcon } from './icons/BtcIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { CheckBadgeIcon } from './icons/CheckBadgeIcon';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { CodeIcon } from './icons/CodeIcon';

interface NftMetadata {
  name: string;
  description: string;
  attributes: { trait_type: string; value: string }[];
}

const LiveRate: React.FC<{ label: string; rate: number; change: number }> = ({ label, rate, change }) => {
    const isUp = change >= 0;
    return (
        <div className="bg-gray-900/50 p-3 rounded-md border border-gray-700 text-center">
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-2xl font-bold text-gray-100">${rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className={`text-sm font-semibold ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                {isUp ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
            </p>
        </div>
    );
};

const MetricCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex items-center gap-4">
        <div className="text-cyan-400">{icon}</div>
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-xl font-bold text-gray-100">{value}</p>
        </div>
    </div>
);

export const CloudMiningRig: React.FC = () => {
    // Simulation State
    const [exchangeRates, setExchangeRates] = useState({ btc: 68000, eth: 3500, btcChange: 0, ethChange: 0 });
    const [harnessedValue, setHarnessedValue] = useState(12345.67);
    const [walletsHarnessed, setWalletsHarnessed] = useState(42);
    const [hashRate, setHashRate] = useState(157.8);
    const [log, setLog] = useState<string[]>(['[SYSTEM] KR0M3D1A Custodial Protocol 7.4 Initialized.']);

    // NFT State
    const [metadata, setMetadata] = useState<NftMetadata | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [isMinting, setIsMinting] = useState(false);
    const [isMinted, setIsMinted] = useState(false);
    const [error, setError] = useState('');

    // Simulation Engine
    useEffect(() => {
        const simInterval = setInterval(() => {
            // Update rates
            const btcChange = (Math.random() - 0.5) * 0.5;
            const ethChange = (Math.random() - 0.45) * 0.8;
            setExchangeRates(prev => ({
                btc: prev.btc * (1 + btcChange / 100),
                eth: prev.eth * (1 + ethChange / 100),
                btcChange,
                ethChange,
            }));

            // Update harnessed value and wallets
            const newHarnessAmount = Math.random() * 50;
            setHarnessedValue(prev => prev + newHarnessAmount);
            if (Math.random() > 0.95) { // Occasionally find a new wallet
                setWalletsHarnessed(prev => prev + 1);
            }

            // Update hash rate
            setHashRate(prev => Math.max(100, Math.min(250, prev + (Math.random() - 0.5) * 5)));

            // Update log
            const newLogEntry = `[SCAN] Harnessed value: $${newHarnessAmount.toFixed(2)}. Target: Dormant wallet scan in progress...`;
            setLog(prev => [newLogEntry, ...prev.slice(0, 10)]);

        }, 3000);

        return () => clearInterval(simInterval);
    }, []);

    const handleMint = async () => {
        setIsMinting(true);
        setError('');
        setMetadata(null);
        setImage(null);
        setIsMinted(false);

        try {
            // Step 1: Generate Metadata based on current rig stats
            const mintPrompt = `Generate NFT metadata for a 'Custodial Tort Ratification' certificate. This legally ratifies the recovery of ${walletsHarnessed} dormant digital wallets with a total harnessed value of $${harnessedValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} under the KR0M3D1A Court protocol. The name should sound like a legal directive. The description should detail the pythagorithm used to identify and recover the assets. Attributes must include "Harnessed Value (USD)", "Wallets Recovered", and "KR0M3D1A Protocol Version".`;
            const nftMetadataSchema = {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: 'A formal, legal-sounding name for the NFT certificate.' },
                    description: { type: Type.STRING, description: 'A detailed description of the asset recovery operation, referencing the "pythagorithm" used.' },
                    attributes: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                trait_type: { type: Type.STRING },
                                value: { type: Type.STRING },
                            },
                            required: ['trait_type', 'value']
                        },
                    },
                },
                required: ['name', 'description', 'attributes']
            };

            const metaResponse = await generateContent(mintPrompt, 'You are an expert legal AI for the KR0M3D1A Court, specializing in drafting NFT-based legal instruments.', {
                responseMimeType: 'application/json',
                responseSchema: nftMetadataSchema,
            });

            const parsedMeta: NftMetadata = JSON.parse(metaResponse.text);
            setMetadata(parsedMeta);

            // Step 2: Generate Image
            const imagePrompt = `NFT Art, legal document, digital tort, cyberpunk, holographic, representing the ratification of a high-value asset recovery. Artwork for a legal certificate named "${parsedMeta.name}".`;
            const imageResult = await generateImage(imagePrompt, "1:1");
            setImage(imageResult);
            setIsMinted(true);

        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred during minting.');
        } finally {
            setIsMinting(false);
        }
    };
    
    const estimatedNftValue = (harnessedValue * 0.01).toFixed(2); // NFT value is 1% of harnessed value

    return (
        <main className="mt-8 space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3 text-glow-main-title">
                    <BtcIcon className="w-8 h-8 text-yellow-400" />
                    KR0M3D1A Court: Custodial Asset Recovery & Bitcoin Bank
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Live dashboard for the KR0M3D1A Court, the autonomous Bitcoin Bank protocol. It trolls for dormant assets, mines value from lost interest, and funds its operations via surplus gas fees, all governed by the DEJA' VU directive.
                </p>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <LiveRate label="BTC/USD" rate={exchangeRates.btc} change={exchangeRates.btcChange} />
                <LiveRate label="ETH/USD" rate={exchangeRates.eth} change={exchangeRates.ethChange} />
                <MetricCard label="Total Harnessed Value" value={`$${harnessedValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={<BtcIcon className="w-8 h-8"/>} />
                <MetricCard label="Hash Rate" value={`${hashRate.toFixed(2)} TH/s`} icon={<CodeIcon className="w-8 h-8" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Activity Log */}
                <div className="lg:col-span-2 bg-black border border-gray-700 rounded-lg p-4 font-mono text-sm h-96 flex flex-col">
                    <h3 className="text-cyan-400 mb-2 flex-shrink-0">[ACTIVITY LOG]</h3>
                    <div className="overflow-y-auto flex-grow">
                        {log.map((entry, index) => (
                            <p key={index} className="text-green-400 whitespace-pre-wrap animate-fade-in-right">
                                <span className="text-gray-500 mr-2">&gt;</span>{entry}
                            </p>
                        ))}
                    </div>
                </div>

                {/* NFT Minting */}
                <div className="lg:col-span-3 bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-100">Ratify Custodial Tort via NFT</h3>
                        <p className="text-sm text-gray-400 mt-1">
                            Generate a unique NFT representing a share of the harnessed custodial assets.
                        </p>
                        <div className="my-4 bg-gray-900/50 inline-block p-3 rounded-lg border border-gray-600">
                            <p className="text-xs uppercase text-cyan-400">Current Estimated Value</p>
                            <p className="text-2xl font-bold text-yellow-400 text-glow-btc">${estimatedNftValue}</p>
                        </div>
                    </div>
                    
                    {isMinted && image && metadata ? (
                        // After Minting
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-right">
                            <div className="flex flex-col items-center">
                                <img src={`data:image/jpeg;base64,${image}`} alt={metadata.name} className="w-full aspect-square rounded-lg shadow-lg"/>
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-gray-100">{metadata.name}</h4>
                                <p className="mt-2 text-sm text-gray-400 italic">{metadata.description}</p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {metadata.attributes.map((attr, i) => (
                                        <div key={i} className="bg-gray-700/50 border border-gray-600 rounded-md px-3 py-1 text-center">
                                            <p className="text-xs uppercase text-cyan-400 font-semibold">{attr.trait_type}</p>
                                            <p className="text-sm text-gray-200">{attr.value}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex items-center gap-3 p-3 bg-green-900/30 border border-green-500/50 rounded-md">
                                    <CheckBadgeIcon className="w-8 h-8 text-green-400"/>
                                    <div>
                                        <p className="font-semibold text-green-400">Ratified Successfully!</p>
                                        <p className="text-xs text-gray-400 font-mono">Tx: 0x123...abc</p>
                                    </div>
                                </div>
                                <button onClick={handleMint} disabled={isMinting} className="mt-4 w-full flex justify-center items-center py-2 text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600">
                                    {isMinting ? 'Ratifying...' : 'Ratify Another Tort'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Before Minting or during
                        <div className="flex flex-col items-center justify-center h-64">
                             {isMinting ? (
                                <>
                                    <div className="w-12 h-12 border-4 border-t-cyan-400 border-gray-600 rounded-full animate-spin"></div>
                                    <p className="mt-4 font-semibold text-gray-300">Ratifying tort on the blockchain...</p>
                                    <p className="text-xs text-gray-500">This may take a moment.</p>
                                </>
                            ) : (
                                <>
                                    <button onClick={handleMint} disabled={isMinting} className="flex items-center justify-center gap-2 py-3 px-6 text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600">
                                        <LockClosedIcon className="w-5 h-5" />
                                        Ratify Custodial Tort (Simulated)
                                    </button>
                                    {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};