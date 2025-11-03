import React, { useState, useEffect } from 'react';
import { ArrowsUpDownIcon } from './icons/ArrowsUpDownIcon';
import { InfinityIcon } from './icons/InfinityIcon';

const MetricDisplay: React.FC<{ label: string, value: string, subValue: string }> = ({ label, value, subValue }) => (
    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 text-center">
        <p className="text-xs uppercase text-gray-400 tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-cyan-400 font-mono">{value}</p>
        <p className="text-sm text-gray-500">{subValue}</p>
    </div>
);

export const CommodityStabilizationInterface: React.FC = () => {
    const [pegValue, setPegValue] = useState(1.000);
    const [volatility, setVolatility] = useState(0.02);
    const [liquidity, setLiquidity] = useState(42.7); // in millions
    const [isAutomated, setIsAutomated] = useState(true);

    useEffect(() => {
        if (!isAutomated) return;
        const interval = setInterval(() => {
            setPegValue(prev => Math.max(0.995, Math.min(1.005, prev + (Math.random() - 0.5) * 0.001)));
            setVolatility(prev => Math.max(0.01, Math.min(0.1, prev + (Math.random() - 0.5) * 0.005)));
            setLiquidity(prev => prev + (Math.random() - 0.45) * 0.1);
        }, 2000);
        return () => clearInterval(interval);
    }, [isAutomated]);

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-6">
            <h3 className="text-xl font-bold text-gray-100 flex items-center gap-3">
                <ArrowsUpDownIcon className="w-6 h-6 text-cyan-400" />
                Commodity Stabilization Interface
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricDisplay label="Peg Stability" value={`1.0000 : ${pegValue.toFixed(4)}`} subValue="USD : Ohmz" />
                <MetricDisplay label="Market Volatility" value={`${(volatility * 100).toFixed(2)}%`} subValue="24h Fluctuation" />
                <MetricDisplay label="Liquidity Pool" value={`$${liquidity.toFixed(2)}M`} subValue="Total Value Locked" />
            </div>

            <div className="pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-gray-300">Stabilization Protocol</h4>
                    <div className="flex items-center gap-3">
                        <span className={`text-sm font-semibold ${isAutomated ? 'text-cyan-400' : 'text-gray-500'}`}>
                            {isAutomated ? 'AUTOMATED' : 'MANUAL'}
                        </span>
                        <button
                            onClick={() => setIsAutomated(!isAutomated)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${isAutomated ? 'bg-cyan-600' : 'bg-gray-600'}`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isAutomated ? 'translate-x-5' : 'translate-x-0'}`}
                            />
                        </button>
                    </div>
                </div>
                 <div className={`mt-4 space-y-4 transition-opacity ${isAutomated ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                    <div>
                        <label htmlFor="peg-slider" className="block text-sm font-medium text-gray-400">Manual Peg Adjustment ({pegValue.toFixed(4)})</label>
                        <input
                            id="peg-slider"
                            type="range"
                            min="0.99"
                            max="1.01"
                            step="0.0001"
                            value={pegValue}
                            onChange={(e) => setPegValue(Number(e.target.value))}
                            disabled={isAutomated}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                    </div>
                     <div>
                        <button disabled={isAutomated} className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            <InfinityIcon className="w-5 h-5" />
                            Execute Rebalance (Simulated)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
