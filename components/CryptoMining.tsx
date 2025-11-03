import React, { useState, useEffect } from 'react';
import { CryptoNewsItem } from '../services/types';
import { fetchRandomNewsItem } from '../services/cryptoNewsService';
import { CustodialMandate } from './CustodialMandate';
import { FluxCapacitorGauge } from './FluxCapacitorGauge';
import { MetricDisplay } from './MetricDisplay';
import { RssIcon } from './icons/RssIcon';
import { CoinIcon } from './icons/CoinIcon';
import { StepsIcon } from './icons/StepsIcon';
import { DollarIcon } from './icons/DollarIcon';
import { ClockIcon } from './icons/ClockIcon';
import { ChartPieIcon } from './icons/ChartPieIcon';
import { CursorArrowRaysIcon } from './icons/CursorArrowRaysIcon';
import { AdjustmentsHorizontalIcon } from './icons/AdjustmentsHorizontalIcon';
import { BarsArrowUpIcon } from './icons/BarsArrowUpIcon';
import { ArrowPathIcon } from './icons/ArrowPathIcon';
import { ArrowsRightLeftIcon } from './icons/ArrowsRightLeftIcon';

const RatioTrendChart: React.FC<{ data: number[]; isUp: boolean }> = ({ data, isUp }) => {
    const svgWidth = 100;
    const svgHeight = 40;
    const margin = { top: 5, right: 5, bottom: 5, left: 5 };
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    if (data.length < 2) return null;

    const maxVal = Math.max(...data);
    const minVal = Math.min(...data);
    const range = maxVal - minVal === 0 ? 1 : maxVal - minVal;

    const getX = (i: number) => margin.left + (i / (data.length - 1)) * chartWidth;
    const getY = (d: number) => margin.top + chartHeight - ((d - minVal) / range) * chartHeight;

    const linePathData = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(2)},${getY(d).toFixed(2)}`).join(' ');
    
    const areaPathData = `${linePathData} L ${getX(data.length - 1)},${svgHeight - margin.bottom} L ${getX(0)},${svgHeight - margin.bottom} Z`;

    const color = isUp ? '#22c55e' : '#ef4444'; // green-500, red-500
    const gradientId = `ratioGradient-${isUp ? 'up' : 'down'}`;

    return (
        <svg key={data.join(',')} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full" preserveAspectRatio="none">
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path
                className="chart-line-animated"
                d={linePathData}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
            />
            <path
                className="chart-area-animated"
                d={areaPathData}
                fill={`url(#${gradientId})`}
            />
        </svg>
    )
};

const formatForMetricDisplay = (num: number) => {
    if (num === null || num === undefined) return { value: 0, unitPrefix: '' };

    const tiers = [
        { value: 1e18, symbol: 'E' },
        { value: 1e15, symbol: 'P' },
        { value: 1e12, symbol: 'T' },
        { value: 1e9, symbol: 'G' },
        { value: 1e6, symbol: 'M' },
        { value: 1e3, symbol: 'K' },
    ];
    
    const tier = tiers.find(t => num >= t.value);
    if (tier) {
        return { value: num / tier.value, unitPrefix: tier.symbol };
    }

    return { value: num, unitPrefix: '' };
};

export const CryptoMining: React.FC = () => {
    const [newsFeed, setNewsFeed] = useState<CryptoNewsItem[]>([]);
    const [miningStats, setMiningStats] = useState({
        hashRate: 123.45 * 1e12, // In H/s
        efficiency: 98.7,
        uptime: 99.9,
        minedValue: 12345.67, // Increased to show formatting
        lastBlockTime: 8.5,
        feePool: 2.34,
        engagementYield: 0.123,
        miningDifficulty: 5.6e13,
    });
    const [marketData, setMarketData] = useState({
        ethBtcRatio: 0.0514,
        dailyChange: 0.15,
        ratioHistory: Array(20).fill(0.0514),
    });
    const [clickEffect, setClickEffect] = useState<{ amount: number; key: number } | null>(null);
    const [isManualControl, setIsManualControl] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        // Initial news feed
        setNewsFeed(Array.from({ length: 5 }, fetchRandomNewsItem));

        const newsInterval = setInterval(() => {
            setNewsFeed(prev => [fetchRandomNewsItem(), ...prev.slice(0, 4)]);
        }, 5000);

        // Simulate mining stats fluctuation
        const statsInterval = setInterval(() => {
            // Simulate ETH/BTC ratio fluctuation
            setMarketData(prev => {
                const tickChange = (Math.random() - 0.5) * 0.0005; // small random walk for ratio
                const newRatio = prev.ethBtcRatio + tickChange;
                const dailyChangeTick = (Math.random() - 0.5) * 0.2; // small change to daily %
                const newDailyChange = prev.dailyChange + dailyChangeTick;
                const clampedDailyChange = Math.max(-5, Math.min(5, newDailyChange)); // Clamp between -5% and +5%
                const newHistory = [...prev.ratioHistory, newRatio].slice(-20);
                return {
                    ethBtcRatio: newRatio,
                    dailyChange: clampedDailyChange,
                    ratioHistory: newHistory,
                };
            });
            
            setMiningStats(prev => {
                const newStats = {
                    ...prev,
                    efficiency: Math.max(95, Math.min(99.9, prev.efficiency + (Math.random() - 0.5) * 0.5)),
                    uptime: 99.9,
                    minedValue: prev.minedValue + Math.random() * 100, // Increased gain to show formatting changes
                    lastBlockTime: Math.max(1, prev.lastBlockTime + (Math.random() - 0.5) * 2),
                    feePool: prev.feePool + Math.random() * 0.01,
                    engagementYield: prev.engagementYield + Math.random() * 0.0001,
                };

                if (!isManualControl) {
                    const oldHashRate = prev.hashRate;
                    newStats.hashRate = Math.max(50e12, Math.min(300e12, prev.hashRate + (Math.random() - 0.5) * 10e12));
                    newStats.miningDifficulty = Math.max(1e13, prev.miningDifficulty + (newStats.hashRate - oldHashRate) * 0.1);
                }

                return newStats;
            });
        }, 2000);

        return () => {
            clearInterval(newsInterval);
            clearInterval(statsInterval);
        };
    }, [isManualControl]);
    
    const handleManualRefresh = () => {
        setIsRefreshing(true);
        // Simulate a quick fetch
        setTimeout(() => {
            setNewsFeed(prev => [fetchRandomNewsItem(), ...prev.slice(0, 4)]);
            setIsRefreshing(false);
        }, 300);
    };

    const handleEngagementClick = () => {
        const yieldAmount = Math.random() * 0.005;
        setMiningStats(prev => ({
            ...prev,
            engagementYield: prev.engagementYield + yieldAmount,
        }));
        setClickEffect({ amount: yieldAmount, key: Date.now() });
        setTimeout(() => setClickEffect(null), 1000);
    };

    const handleHashRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMiningStats(prev => ({ ...prev, hashRate: Number(e.target.value) }));
    };

    const handleDifficultyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMiningStats(prev => ({ ...prev, miningDifficulty: Number(e.target.value) }));
    };

    const getCategoryStyle = (category: CryptoNewsItem['category']) => {
        switch (category) {
            case 'Market': return { text: 'text-green-400', border: 'border-green-400' };
            case 'Regulation': return { text: 'text-yellow-400', border: 'border-yellow-400' };
            case 'Security': return { text: 'text-red-400', border: 'border-red-400' };
            case 'Tech': return { text: 'text-blue-400', border: 'border-blue-400' };
        }
    };

    const isRatioUp = marketData.dailyChange >= 0;
    
    const formattedHash = formatForMetricDisplay(miningStats.hashRate);
    const formattedMinedValue = formatForMetricDisplay(miningStats.minedValue);
    const estimatedNftValue = miningStats.minedValue * 0.01;

    return (
        <main className="mt-8 space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-glow-main-title">KR0M3D1A Crypto Custodial Operations</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Live dashboard monitoring the protocol's autonomous asset recovery and yield generation functions. This simulation operates under the DEJA' VU directive and features the Engagement Yield Protocol (EYP), where your interaction directly contributes to a diversified mining pool of all coin types, embodying the ClickBank idiom of value creation.
                </p>
            </div>

            <CustodialMandate />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* New ETH/BTC Ratio Display */}
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex items-center justify-between gap-4 animate-fade-in-right">
                        <div className="flex items-center gap-4">
                            <ArrowsRightLeftIcon className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-gray-400">ETH/BTC Exchange Rate</h4>
                                <p className="text-2xl font-bold text-gray-100 font-mono">{marketData.ethBtcRatio.toFixed(5)}</p>
                            </div>
                        </div>
                        <div className="w-24 h-10 flex-shrink-0">
                            <RatioTrendChart data={marketData.ratioHistory} isUp={isRatioUp} />
                        </div>
                        <div className={`text-lg font-semibold text-right flex-shrink-0 ${isRatioUp ? 'text-green-400' : 'text-red-400'}`}>
                            {isRatioUp ? '▲' : '▼'} {Math.abs(marketData.dailyChange).toFixed(2)}%
                            <p className="text-xs text-gray-500">24h Change</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="md:col-span-1 lg:col-span-2">
                            <MetricDisplay icon={<StepsIcon className="w-8 h-8"/>} label="Network Hash Rate" value={formattedHash.value} unit={`${formattedHash.unitPrefix}H/s`} max={300} color="green" />
                        </div>
                         <div className="md:col-span-1 lg:col-span-2">
                            <MetricDisplay icon={<BarsArrowUpIcon className="w-8 h-8"/>} label="Mining Difficulty" value={miningStats.miningDifficulty / 1e12} unit="T" max={100} color="purple" />
                        </div>
                         <div className="md:col-span-1 lg:col-span-2">
                             <MetricDisplay icon={<CoinIcon className="w-8 h-8"/>} label="Custodial Value Mined" value={formattedMinedValue.value} unit={`${formattedMinedValue.unitPrefix}BTC`} max={100} color="purple" />
                        </div>
                        <div className="md:col-span-1 lg:col-span-2">
                            <MetricDisplay icon={<DollarIcon className="w-8 h-8"/>} label="Estimated NFT Value" value={estimatedNftValue} unit="$" max={500} color="blue" />
                        </div>
                        <MetricDisplay icon={<ChartPieIcon className="w-8 h-8"/>} label="Operational Efficiency" value={miningStats.efficiency} unit="%" max={100} color="blue" />
                        <MetricDisplay icon={<DollarIcon className="w-8 h-8"/>} label="Gas Fee Pool" value={miningStats.feePool} unit="ETH" max={5} color="green" />
                        <MetricDisplay icon={<ClockIcon className="w-8 h-8"/>} label="Last Block Time" value={miningStats.lastBlockTime} unit="min" max={15} color="blue" />
                        <MetricDisplay icon={<CursorArrowRaysIcon className="w-8 h-8" />} label="Engagement Yield" value={miningStats.engagementYield} unit="ETH" max={1} color="purple" />
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col items-center">
                        <h4 className="font-semibold text-gray-400 mb-2">Market Flux Capacitor</h4>
                        <div className="w-full h-32">
                            <FluxCapacitorGauge />
                        </div>
                    </div>
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 h-80 flex flex-col">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold text-gray-400 flex items-center gap-2">
                                <RssIcon className="w-5 h-5" /> Live Intel Feed
                            </h4>
                            <button
                                onClick={handleManualRefresh}
                                disabled={isRefreshing}
                                className="p-1.5 text-gray-400 hover:text-cyan-400 rounded-full hover:bg-gray-700/50 transition-colors disabled:cursor-not-allowed"
                                title="Refresh Feed"
                            >
                                <ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                        <div className="overflow-y-auto pr-2 flex-grow">
                            {newsFeed.map((item, index) => {
                                const styles = getCategoryStyle(item.category);
                                return (
                                    <div key={item.id} className={`intel-item py-3 border-t border-gray-700/50 ${index === 0 ? 'border-t-0' : ''}`}>
                                        <div className={`pl-3 border-l-2 ${styles.border}`}>
                                            <p className="text-base text-gray-100 font-medium leading-relaxed">{item.headline}</p>
                                            <div className="flex justify-between items-center text-xs mt-2">
                                                <span className={`${styles.text} font-bold uppercase tracking-wider`}>{item.category}</span>
                                                <span className="text-gray-500">{item.source}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-100 flex items-center gap-3">
                        <AdjustmentsHorizontalIcon className="w-6 h-6 text-cyan-400" />
                        Manual Override Controls
                    </h3>
                    <div className="flex items-center gap-3">
                        <span className={`text-sm font-semibold ${isManualControl ? 'text-cyan-400' : 'text-gray-500'}`}>
                            {isManualControl ? 'MANUAL' : 'AUTO'}
                        </span>
                        <button
                            onClick={() => setIsManualControl(!isManualControl)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${isManualControl ? 'bg-cyan-600' : 'bg-gray-600'}`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isManualControl ? 'translate-x-5' : 'translate-x-0'}`}
                            />
                        </button>
                    </div>
                </div>
                
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700 transition-opacity ${isManualControl ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                    {/* Hash Rate Slider */}
                    <div>
                        <label htmlFor="hashrate-slider" className="block text-sm font-medium text-gray-300">Hash Rate ({`${formatForMetricDisplay(miningStats.hashRate).unitPrefix}H/s`})</label>
                        <div className="flex items-center gap-3 mt-1">
                            <input
                                id="hashrate-slider"
                                type="range"
                                min={50e12}
                                max={300e12}
                                step={1e12}
                                value={miningStats.hashRate}
                                onChange={handleHashRateChange}
                                disabled={!isManualControl}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            />
                            <span className="font-mono text-cyan-400 w-20 text-right">{formatForMetricDisplay(miningStats.hashRate).value}</span>
                        </div>
                    </div>
                    
                    {/* Mining Difficulty Slider */}
                    <div>
                        <label htmlFor="difficulty-slider" className="block text-sm font-medium text-gray-300">Mining Difficulty (T)</label>
                        <div className="flex items-center gap-3 mt-1">
                            <input
                                id="difficulty-slider"
                                type="range"
                                min="1e13" // 10T
                                max="1e14" // 100T
                                step="1e11" // 0.1T
                                value={miningStats.miningDifficulty}
                                onChange={handleDifficultyChange}
                                disabled={!isManualControl}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            />
                            <span className="font-mono text-cyan-400 w-20 text-right">{(miningStats.miningDifficulty / 1e12).toFixed(2)} T</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 text-center relative overflow-hidden">
                <h3 className="text-xl font-bold text-gray-100">Engagement Yield Protocol (EYP)</h3>
                <p className="text-sm text-gray-400 mt-1 max-w-xl mx-auto">
                    Inspired by the ClickBank idiom, your active engagement contributes to a diversified mining pool for all coins (stable, utility, etc.) and funds NFT asset creation. Click to contribute.
                </p>
                <div className="mt-4 relative inline-block">
                     <button 
                        onClick={handleEngagementClick}
                        className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg shadow-lg shadow-cyan-500/20 transform hover:scale-105 transition-all duration-200 flex items-center gap-3"
                    >
                        <CursorArrowRaysIcon className="w-6 h-6"/>
                        Engage Protocol
                    </button>
                    {clickEffect && (
                        <span key={clickEffect.key} className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full text-green-400 font-mono text-sm animate-fade-in-right opacity-0" style={{ animation: 'fade-out-up 1s ease-out' }}>
                            +{clickEffect.amount.toFixed(5)} ETH
                        </span>
                    )}
                </div>
                 <style>{`
                    @keyframes fade-out-up {
                        0% { opacity: 1; transform: translate(-50%, -100%); }
                        100% { opacity: 0; transform: translate(-50%, -200%); }
                    }
                `}</style>
            </div>
        </main>
    );
};