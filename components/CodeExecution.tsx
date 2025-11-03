import React, { useState, useEffect, useRef } from 'react';
import { PlayIcon } from './icons/PlayIcon';
import { TerminalIcon } from './icons/TerminalIcon';

const defaultCode = `// KR0M3D1A Protocol Initialization Script
// Directive: DEJA_VU_7.4

const protocol = require('@krom3dia/core');
const vault = protocol.connectToVault('archive-zeta-9');

async function execute() {
    console.log('Initializing DEJA_VU directive...');
    await protocol.sleep(500);

    console.log('Authenticating with pythagorithm signature...');
    const isAuthenticated = await protocol.authenticate();
    if (!isAuthenticated) {
        console.error('CRITICAL: Authentication failed. Aborting.');
        return;
    }
    await protocol.sleep(1000);

    console.log('Scanning torrent archives for wet-marked footprints...');
    const footprints = await vault.scanForFootprints({ truncate: true });
    console.log(\`Found \${footprints.length} actionable signatures.\`);
    await protocol.sleep(1500);

    console.log('Executing custodial mandate on recovered assets...');
    const result = await protocol.executeMandate(footprints);
    console.log(\`SUCCESS: Mandate executed. \${result.value} harnessed.\`);
}

execute();
`;

export const CodeExecution: React.FC = () => {
    const [code, setCode] = useState(defaultCode);
    const [output, setOutput] = useState<string[]>([]);
    const [isExecuting, setIsExecuting] = useState(false);
    const intervalRef = useRef<number | null>(null);
    const outputRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output]);

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const handleExecute = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        
        setIsExecuting(true);
        
        const initialLogs = [
            'EXECUTION STARTED...',
            'Initializing DEJA_VU directive...',
            'Authenticating with pythagorithm signature...',
        ];
        setOutput(initialLogs);
        
        const addLog = (log: string) => {
            setOutput(prev => [...prev, log]);
        };

        const logSequence = [
            () => 'Scanning torrent archives for wet-marked footprints...',
            () => 'Found 1 actionable signature.',
            () => 'Executing custodial mandate on recovered asset...',
            () => `SUCCESS: Mandate executed. $${(Math.random() * 2000 + 1000).toFixed(2)} harnessed.`,
            () => 'Returning to scan...',
            () => 'Scanning torrent archives for wet-marked footprints...',
            () => 'No new actionable signatures found.',
            () => 'Waiting for next scan cycle...',
        ];
        
        let logIndex = 0;
        
        const intervalStartTime = 700 * initialLogs.length;

        setTimeout(() => {
            intervalRef.current = window.setInterval(() => {
                const getNextLog = logSequence[logIndex % logSequence.length];
                addLog(getNextLog());
                logIndex++;
            }, 1200);
        }, intervalStartTime);
    };

    return (
        <main className="mt-8 space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3 text-glow-main-title">
                    <TerminalIcon className="w-8 h-8 text-lime-400" />
                    DEJA' VU Execution Sandbox
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Execute scripts against the KR0M3D1A core protocol in a sandboxed environment. This interface allows for direct interaction with the file vault and execution of custodial mandates.
                </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6">
                    <label htmlFor="code-input" className="block text-sm font-medium text-gray-300 mb-2">
                        Script Editor
                    </label>
                    <textarea
                        id="code-input"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-96 p-3 bg-black/50 font-mono text-sm border border-gray-600 rounded-md focus:ring-2 focus:ring-lime-500 text-lime-300 resize-none"
                        spellCheck="false"
                    />
                    <button
                        onClick={handleExecute}
                        disabled={isExecuting || !code.trim()}
                        className="mt-4 w-full flex justify-center items-center py-3 text-base font-medium rounded-md text-white bg-lime-600 hover:bg-lime-700 disabled:bg-gray-600"
                    >
                        <PlayIcon className="w-5 h-5 mr-2" />
                        {isExecuting ? 'Executing...' : 'Run Script'}
                    </button>
                </div>
                
                <div className="bg-black border border-gray-700 rounded-lg shadow-2xl p-6 font-mono text-sm text-gray-300 h-[540px] flex flex-col">
                    <h3 className="text-lime-400 mb-3 flex-shrink-0">[EXECUTION LOG]</h3>
                    <div ref={outputRef} className="overflow-y-auto flex-grow">
                        {output.map((line, index) => (
                            <p key={index} className="whitespace-pre-wrap animate-fade-in-right">
                                <span className="text-gray-500 mr-2">&gt;</span>{line}
                            </p>
                        ))}
                        {isExecuting && <span className="w-2 h-4 bg-lime-400 animate-pulse ml-1"></span>}
                    </div>
                </div>
            </div>
        </main>
    );
};