import React from 'react';
import { GavelIcon } from './icons/GavelIcon';

export const LegalMandate: React.FC = () => {
    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 animate-fade-in-right font-mono">
            <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-3">
                <GavelIcon className="w-6 h-6 text-yellow-400"/>
                <span className="text-yellow-400">DEJA' VU DIRECTIVE: PHILANTHROPIC MANDATE 8.1</span>
            </h3>
            <div className="text-sm text-gray-400 space-y-3 leading-relaxed">
                <p>
                    <strong className="text-gray-200">[SCOPE]</strong> This mandate establishes the "Ohmz Perpetual Ether" as a philanthropic digital commodity. All Ether generated through the KR0M3D1A Eco-Mining protocol is hereby designated as a public good, with its value perpetually pegged to a basket of renewable energy credits and carbon offset certificates.
                </p>
                <p>
                    <strong className="text-gray-200">[MECHANISM]</strong> The protocol utilizes surplus computational cycles from philanthropic partners to mine Ether with a net-negative carbon footprint. A proprietary 'spythagorithm' dynamically allocates resources to maximize yield while ensuring energy consumption is offset by a factor of 2x through real-time renewable energy purchases.
                </p>
                <p>
                    <strong className="text-gray-200">[DISTRIBUTION]</strong> All generated Ohmz Ether is held in a decentralized autonomous trust. The value generated is algorithmically distributed to verified environmental and educational charities, with a full, immutable audit trail published on-chain.
                </p>
                <p>
                    <strong className="text-gray-200">[GOVERNANCE]</strong> The protocol operates under the oversight of the DEJA' VU directive. Any deviation from this philanthropic mandate will trigger an automatic system halt and asset liquidation to the designated beneficiaries. This mandate is irrevocable and enforced by the core logic of the smart contract.
                </p>
            </div>
        </div>
    );
};
