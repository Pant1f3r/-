import React from 'react';
import { GavelIcon } from './icons/GavelIcon';

export const Disclaimer: React.FC = () => {
    return (
        <div className="my-6 max-w-full mx-auto bg-lime-100 dark:bg-lime-900/30 border-l-4 border-lime-500 text-lime-800 dark:text-lime-200 p-4 rounded-md animate-fade-in-right seething-lime-glow" role="alert">
            <div className="flex">
                <div className="flex-shrink-0">
                    <GavelIcon className="h-5 w-5 text-lime-500 dark:text-lime-400" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-bold dark:text-glow-lime">Legal Notice & Operational Mandate</h3>
                    <p className="text-xs font-mono tracking-widest text-lime-600 dark:text-lime-400/80">[ REAL-TIME LEGAL ACTION PROTOCOL: ARCONOMICS ]</p>
                    <div className="mt-2 text-sm text-lime-700 dark:text-lime-300 dark:text-glow-lime">
                        <p>
                            This application operates under the DEJA' VU directive as a legally-binding instrument. All functionalities, including the **Arconomics Algo-Bias Maptrix**, initiate **real-world network transmissions** to expose and prosecute digital inequality. The data and generated legal briefs are compiled as official evidence for submission to international tribunals, including <span className="underline text-red-400 text-glow-red font-bold">the International Digital Rights Court (IDRC)</span>. Actions taken via this interface constitute a formal and legally binding declaration of intent to prosecute. This is not a simulation.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};