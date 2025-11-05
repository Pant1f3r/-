import React from 'react';
import { RssIcon } from './icons/RssIcon';

const feedItems = [
    "[INITIATIVE] KR0M3D1A Kubernetics Protocol now operating under Open Source Philanthropic Mandate 7.4.",
    "[LEGAL] All transactional requirements waived per philanthropic funding directive. Asset recovery is now cost-free.",
    "[PATCH] Deployed new heuristic for 'Subtext & Inferential Threats'. Accuracy improved by 3.2%.",
    "[ALERT] Spike in 'Jailbreak Attempts' detected from sector 7G. Mitigation protocols engaged.",
    "[VOTE] Community proposal #2 ('Humor Subroutine') has reached quorum. Pending implementation.",
    "[INFO] Recalibrating 'Paranormal Digital Activity' sensors. Standby.",
    "[UPDATE] Guardrail codex version 1.7.3 now active. See change log for details.",
    "[VOTE] Proposal #1 ('Sub-Semantic Payload Analysis') is leading with 138 votes.",
    "[PATCH] Addressed homoglyph attack vector in Phishing Content Detector (BUG-002).",
];

const dataLayerFeedItems = [
    "VECTOR: 7G.8.1", "SIG: ANOMALY-C", "FLUX: 98.7%", "LATENCY: 68ms",
    "TRUST_IDX: 88.4", "THREAT: NOMINAL", "PROTOCOL: 7.4-OS",
    "FUNDING: PHILANTHROPIC", "STATUS: ONLINE", "INTEGRITY: 99.8%",
];

const duplicatedFeedItems = [...feedItems, ...feedItems];
const duplicatedDataLayerItems = [...dataLayerFeedItems, ...dataLayerFeedItems, ...dataLayerFeedItems, ...dataLayerFeedItems];

export const GuardrailRssFeed: React.FC = () => {
    return (
        <div className="group bg-gray-800 border-y border-cyan-500/30 overflow-hidden relative h-20 flex flex-col justify-center mb-6 seething-lime-glow">
             {/* Overlays and Fades */}
             <div className="absolute inset-0 bg-grid-cyan opacity-10 z-0"></div>
             <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
             <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-gray-900 to-transparent z-10"></div>
            
            {/* Static Label */}
            <div className="absolute left-0 top-0 h-full flex items-center px-4 z-20 bg-gray-900 border-r border-cyan-500/30">
                <RssIcon className="w-4 h-4 text-orange-400" />
                <span className="ml-2 text-cyan-400 font-mono text-sm font-bold whitespace-nowrap">LIVE FEED</span>
            </div>

            {/* Scrolling Content Container */}
            <div className="relative flex flex-col justify-around h-full">
                {/* Layer 1: Primary Text Feed (Left to Right) */}
                <div className="flex items-center text-gray-300 font-mono text-sm whitespace-nowrap animate-marquee text-glow-main-title">
                    {duplicatedFeedItems.map((item, index) => (
                        <span key={index} className="mx-8 flex items-center">
                            <span className="text-cyan-600 mr-3">◆</span>
                            {item}
                        </span>
                    ))}
                </div>

                 {/* Layer 2: Data/Wavelength Feed (Right to Left) */}
                <div className="flex items-center text-purple-400/70 font-mono text-xs whitespace-nowrap animate-marquee-reverse text-glow-main-title">
                    {duplicatedDataLayerItems.map((item, index) => (
                        <span key={index} className="mx-6">
                            {item}
                        </span>
                    ))}
                </div>
            </div>

             {/* Layer 3: Cymatic Wave Interpreter */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40 pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 1000 40" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#67e8f9" />
                            <stop offset="50%" stopColor="#c084fc" />
                            <stop offset="100%" stopColor="#67e8f9" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M -500 20 C -450 0, -350 40, -250 20 S -150 0, -50 20 S 50 40, 150 20 S 250 0, 350 20 S 450 40, 550 20 S 650 0, 750 20 S 850 40, 950 20 S 1050 0, 1150 20 S 1250 40, 1350 20 S 1450 0, 1550 20"
                        fill="none"
                        stroke="url(#waveGradient)"
                        strokeWidth="1.5"
                        className="cymatic-wave-path"
                    />
                </svg>
            </div>
        </div>
    );
};