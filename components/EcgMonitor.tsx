import React, { useRef, useEffect } from 'react';

type AnomalyType = 'NONE' | 'VOCAL_CADENCE_DESYNC' | 'RETINAL_FLUCTUATION_SPIKE' | 'HEART_RATE_INCONSISTENCY';

interface EcgMonitorProps {
    isActive: boolean;
    anomalyType: AnomalyType;
}

// Pre-calculated points for a single, normalized heartbeat waveform
// [time_step, amplitude] from 0 to 100
const normalHeartbeat: [number, number][] = [
    [0, 0], [15, 0], [20, 0.1], [25, 0.1], [30, 0], // P-wave
    [35, 0], [36, -0.1], // Q-wave
    [38, 1.0], // R-wave (peak)
    [40, -0.2], // S-wave
    [45, 0], [55, 0.2], [65, 0.2], [70, 0], // T-wave
    [100, 0] // End of cycle
];
const BEAT_CYCLE_LENGTH = 100;

export const EcgMonitor: React.FC<EcgMonitorProps> = ({ isActive, anomalyType }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const lastPointRef = useRef<{ x: number, y: number } | null>(null);
    const stepRef = useRef<number>(0);
    const timeToNextBeatRef = useRef<number>(0);
    const timeToNextStutterRef = useRef<number>(0);

    // Function to get the ECG amplitude at a specific step in the heartbeat cycle
    const getEcgValue = (step: number) => {
        const cycleStep = step % BEAT_CYCLE_LENGTH;
        for (let i = 0; i < normalHeartbeat.length - 1; i++) {
            const [time1, val1] = normalHeartbeat[i];
            const [time2, val2] = normalHeartbeat[i+1];
            if (cycleStep >= time1 && cycleStep <= time2) {
                // Linear interpolation between points for a smooth line
                const t = (cycleStep - time1) / (time2 - time1);
                return val1 + t * (val2 - val1);
            }
        }
        return 0;
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        lastPointRef.current = { x: canvas.width - 2, y: canvas.height / 2 };
        stepRef.current = 0;
        timeToNextBeatRef.current = 0;
        timeToNextStutterRef.current = 0;


        const draw = () => {
            const width = canvas.width;
            const height = canvas.height;
            const midY = height / 2;

            // Shift canvas content to the left for a scrolling effect
            const imageData = ctx.getImageData(1, 0, width - 1, height);
            ctx.putImageData(imageData, 0, 0);

            // Clear the rightmost pixel column to draw the new segment
            ctx.clearRect(width - 1, 0, 1, height);

            let value = 0;
            if (isActive) {
                switch (anomalyType) {
                    case 'HEART_RATE_INCONSISTENCY':
                        if (timeToNextBeatRef.current <= 0) {
                            value = getEcgValue(stepRef.current);
                            stepRef.current += 1;
                            if (stepRef.current >= BEAT_CYCLE_LENGTH) {
                                stepRef.current = 0;
                                timeToNextBeatRef.current = Math.random() * 100; // Random arrhythmia delay
                            }
                        } else {
                            timeToNextBeatRef.current -= 1;
                            value = 0; // Flatline during delay
                        }
                        break;
                    
                    case 'RETINAL_FLUCTUATION_SPIKE':
                        // Glitchy/noisy signal
                        value = getEcgValue(stepRef.current);
                        value += (Math.random() - 0.5) * 0.4; // Add significant noise
                        stepRef.current = (stepRef.current + 1) % BEAT_CYCLE_LENGTH;
                        break;

                    case 'VOCAL_CADENCE_DESYNC':
                        // Stuttering signal
                        if (timeToNextStutterRef.current <= 0) {
                            value = getEcgValue(stepRef.current);
                            stepRef.current += 1;
                            if (stepRef.current >= BEAT_CYCLE_LENGTH) {
                                stepRef.current = 0;
                                // Introduce a random chance of a stutter (long flatline)
                                if (Math.random() < 0.3) {
                                    timeToNextStutterRef.current = 50 + Math.random() * 50;
                                }
                            }
                        } else {
                            timeToNextStutterRef.current -= 1;
                            value = 0; // Flatline during stutter
                        }
                        break;
                        
                    case 'NONE':
                    default:
                        // Normal beat
                        value = getEcgValue(stepRef.current);
                        stepRef.current = (stepRef.current + 1) % BEAT_CYCLE_LENGTH;
                        break;
                }
            }
            
            // Y position of the new point, scaled to canvas height
            const newY = midY - (value * midY * 0.8);

            // Draw a line from the last point to the new one
            if (lastPointRef.current) {
                const isAnomalyActive = anomalyType !== 'NONE';
                ctx.beginPath();
                ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
                ctx.lineTo(width - 1, newY);
                ctx.strokeStyle = isAnomalyActive ? '#ef4444' : '#a3e635'; // Red for anomaly, lime for normal
                ctx.lineWidth = 2;
                ctx.shadowColor = isAnomalyActive ? '#ef4444' : '#a3e635';
                ctx.shadowBlur = 4;
                ctx.stroke();
                ctx.shadowBlur = 0; // Reset shadow
            }
            
            lastPointRef.current = { x: width - 2, y: newY };
            animationFrameRef.current = requestAnimationFrame(draw);
        };
        
        // Start the animation loop
        animationFrameRef.current = requestAnimationFrame(draw);

        // Cleanup function to cancel the animation frame when the component unmounts or props change
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isActive, anomalyType]); // Rerun effect if isActive or anomalyType changes

    return (
        <canvas ref={canvasRef} width="600" height="150" className="w-full h-full rounded-md bg-gray-900"></canvas>
    );
};