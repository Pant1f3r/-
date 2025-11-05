import React from 'react';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { ArrowPathIcon } from './icons/ArrowPathIcon';

interface ThreatTickerProps {
    items: { id: number; message: string; type: 'new' | 're-evaluation' }[];
}

export const ThreatTicker: React.FC<ThreatTickerProps> = ({ items }) => {
    if (items.length === 0) {
        return null; // Don't render if empty
    }

    // Duplicate items for a seamless scrolling effect
    const duplicatedItems = [...items, ...items];

    return (
        <div className="bg-gray-900 border-y border-red-500/50 overflow-hidden relative h-8 flex items-center mb-6 neon-blink-border">
            {/* Fading gradients on the edges */}
            <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-gray-900 to-transparent z-10"></div>
            
            {/* Scrolling content */}
            <div className="flex items-center text-red-300 font-mono text-sm whitespace-nowrap animate-marquee">
                {duplicatedItems.map((item, index) => (
                    <span key={`${item.id}-${index}`} className="mx-8 flex items-center gap-2">
                        {item.type === 'new' ? 
                            <ExclamationTriangleIcon className="w-4 h-4 text-yellow-400" /> : 
                            <ArrowPathIcon className="w-4 h-4 text-cyan-400" />
                        }
                        {item.message}
                    </span>
                ))}
            </div>
        </div>
    );
};
