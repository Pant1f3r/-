
import React from 'react';
import { GlobeIcon } from './icons/GlobeIcon';

export const JurisdictionalHeatmap: React.FC = () => {
    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-400 mb-2 flex items-center gap-2"><GlobeIcon className="w-5 h-5" /> Jurisdictional Heatmap</h3>
            <div className="w-full h-64 flex items-center justify-center text-gray-500">
                <p>Heatmap component placeholder.</p>
            </div>
        </div>
    );
};
