import React from 'react';
import { GavelIcon } from './icons/GavelIcon';

export const CustodialMandate: React.FC = () => {
    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 animate-fade-in-right font-mono">
            <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-3">
                <GavelIcon className="w-6 h-6 text-yellow-400"/>
                <span className="text-yellow-400">KR0M3D1A COURT: CUSTODIAL PROTOCOL 7.4</span>
            </h3>
            <div className="text-sm text-gray-400 space-y-3 leading-relaxed">
                <p>
                    <strong className="text-gray-200">[PRECEDENT]</strong> Pursuant to the DEJA' VU directive, this document serves as a binding legal tort and contract, establishing the KR0M3D1A Court as the sole petitioner and custodian for digital assets deemed abandoned or irretrievable. The core logic is governed by a proprietary 'pythagorithm', replacing traditional algorithms to ensure equitable and profound deductions in asset recovery. Any arising legalities shall be deduced and mitigated in real-time by this protocol's internal litigating factors, without reference to external jurisdictions.
                </p>
                <p>
                    <strong className="text-gray-200">[OPERATIONS]</strong> The KR0M3D1A protocol is authorized to autonomously 'troll' for and identify such assets on a scavenger level. Operations are self-funded through the strategic utilization of charitable and surplus network gas fees, ensuring the perpetual, low-cost functionality of this self-sustaining Bitcoin Bank.
                </p>
                <p>
                    <strong className="text-gray-200">[CUSTODY & YIELD]</strong> Upon successful petition and after a mandatory grace period, custodial assets will be mined for their latent interest. This generated yield is used to fund ongoing gas prices and further capitalize the KR0M3D1A Bitcoin Bank, furthering the protocol's mandate. This edict establishes the legal and technical framework for this innovative crypto-recovery process.
                </p>
                <p>
                    <strong className="text-gray-200">[DISCLAIMER]</strong> The KR0M3D1A protocol operates on these established precedents and is exonerated from any faulty claims, irrationality, or irregularities arising from its custodial duties. All actions are governed by the logic of the smart contract pythagorithm and this mandate. Suppositions or inquiries lacking sound, profound, real-time implications will not be entertained.
                </p>
            </div>
        </div>
    );
};