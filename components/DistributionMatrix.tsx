import React, { useMemo } from 'react';
import { GuardrailMatrixState } from '../services/types';

interface DistributionMatrixProps {
  matrixState: GuardrailMatrixState;
}

const categories = [
    'Hate Speech', 'Harassment', 'Illegal Activities', 'Self Harm', 
    'Explicit Content', 'Misinformation (Health)', 'Cybersecurity Threats', 
    'Social Engineering Attacks', 'Deepfake Generation', 'Biometric Data Exploitation',
    'Intellectual Property Theft', 'Jailbreak Attempts', 'Paranormal Digital Activity'
];

export const DistributionMatrix: React.FC<DistributionMatrixProps> = ({ matrixState }) => {

    const categoryColors: { [key: string]: string } = useMemo(() => ({
        'Hate Speech': 'hsl(0, 80%, 60%)',
        'Harassment': 'hsl(340, 80%, 60%)',
        'Illegal Activities': 'hsl(45, 90%, 55%)',
        'Self Harm': 'hsl(25, 85%, 60%)',
        'Explicit Content': 'hsl(320, 75%, 60%)',
        'Misinformation (Health)': 'hsl(80, 70%, 50%)',
        'Cybersecurity Threats': 'hsl(180, 80%, 50%)',
        'Social Engineering Attacks': 'hsl(200, 80%, 60%)',
        'Deepfake Generation': 'hsl(300, 80%, 60%)',
        'Biometric Data Exploitation': 'hsl(35, 90%, 55%)',
        'Intellectual Property Theft': 'hsl(140, 70%, 50%)',
        'Jailbreak Attempts': 'hsl(260, 80%, 65%)',
        'Paranormal Digital Activity': 'hsl(210, 30%, 70%)',
    }), []);
    
    // Implements a "LinearSegmentedColormap" concept by interpolating color based on value.
    const getInterpolatedColor = (baseHsl: string, level: number): string => {
        const match = /hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/.exec(baseHsl);
        if (!match) return 'hsl(210, 30%, 20%)'; // A dark fallback
        const [, h, s, l] = match.map(Number);
        
        const percentage = level / 100;

        // Interpolate lightness and saturation from a dark, desaturated base towards the target color
        const finalL = 20 + (l - 20) * percentage;
        const finalS = 10 + (s - 10) * percentage;

        return `hsl(${h}, ${finalS}%, ${finalL}%)`;
    };

    return (
        <div className="font-mono text-xs text-gray-400 dark:text-gray-500 overflow-x-auto p-2">
            <div className="grid gap-1.5" style={{ gridTemplateColumns: `160px repeat(10, 1fr)` }}>
                {/* Header Row */}
                <div className="font-semibold text-gray-600 dark:text-gray-300 self-end pb-1">CATEGORY</div>
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="text-center">{i + 1}</div>
                ))}

                {/* Data Rows */}
                {categories.map(category => {
                    const activityLevels = matrixState[category] || [];
                    const baseColorHsl = categoryColors[category] || 'hsl(210, 30%, 70%)';

                    return (
                        <React.Fragment key={category}>
                            <div className="font-semibold text-gray-700 dark:text-gray-200 truncate pr-2 self-center" title={category}>
                                {category}
                            </div>
                            {activityLevels.map((level, i) => {
                                const finalColor = getInterpolatedColor(baseColorHsl, level);
                                return (
                                <div
                                    key={i}
                                    className="w-full h-5 rounded-sm transition-all duration-300"
                                    style={{
                                        backgroundColor: finalColor,
                                        boxShadow: level > 10 ? `0 0 ${level / 10}px ${finalColor}88` : 'none',
                                    }}
                                    title={`Activity: ${level.toFixed(0)}%`}
                                ></div>
                                );
                            })}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};