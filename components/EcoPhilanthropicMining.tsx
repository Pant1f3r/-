import React from 'react';
import { OhmzNftVisualizer } from './OhmzNftVisualizer';
import { LegalMandate } from './LegalMandate';
import { CommodityStabilizationInterface } from './CommodityStabilizationInterface';
import { HeartIcon } from './icons/HeartIcon';
import { RecycleIcon } from './icons/RecycleIcon';
import { InfinityIcon } from './icons/InfinityIcon';

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, subtext: string }> = ({ icon, label, value, subtext }) => (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col items-center text-center">
        <div className="text-purple-400 mb-2">{icon}</div>
        <p className="text-xs uppercase text-gray-400 tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-gray-100 font-mono">{value}</p>
        <p className="text-sm text-gray-500">{subtext}</p>
    </div>
);

export const EcoPhilanthropicMining: React.FC = () => {
    return (
        <main className="mt-8 space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-glow-main-title">Eco-Philanthropic Kubernetics Mining Protocol</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Welcome to the core of the KR0M3D1A initiative: A self-sustaining, carbon-negative mining operation governed by the DEJA' VU directive. Here, surplus computational power is transmuted into "Ohmz Perpetual Ether"—a digital commodity funding global philanthropic efforts via Kubernetics.
                </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left side: Visualizer and Stats */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-center text-gray-200 mb-2">Ohmz Perpetual Ether</h3>
                        <OhmzNftVisualizer />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                        <StatCard icon={<RecycleIcon className="w-8 h-8"/>} label="Carbon Offset" value="215%" subtext="Net Negative Footprint" />
                        <StatCard icon={<HeartIcon className="w-8 h-8"/>} label="Philanthropic Yield" value="$1.2M" subtext="Distributed to Charities" />
                        <StatCard icon={<InfinityIcon className="w-8 h-8"/>} label="Perpetual Value" value="Stable" subtext="Pegged to Renewables" />
                    </div>
                </div>

                {/* Right side: Mandate and Interface */}
                <div className="lg:col-span-3 flex flex-col gap-8">
                    <LegalMandate />
                    <CommodityStabilizationInterface />
                </div>
            </div>
        </main>
    );
};