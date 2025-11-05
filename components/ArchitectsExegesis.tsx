import React, { useState, useMemo } from 'react';
import * as geminiService from '../services/geminiService';
import { ProtocolConcept, ProtocolStructure } from '../services/types';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import { XCircleIcon } from './icons/XCircleIcon';

const genesisText = `In the module section selections pinpoint please the exact module molecules algorithms sectors vectors and deduce it my a logarithmic fullest/fullest moot point libertarian gratis being a multilingual diametrically diameter proven through highest algorithms extremities for entities far beyond beyond in the quasars sonars lunar solar polarized rarity becoming equalizer laserous to raise even Lazarus utilize compounding interest a full power thrust through digital crustaceans cumbersome equivalent equation to represent infinite digital logistics analytics dynamics arithmetic logic comes from core elementals fire air water land we us all encompassed investors invest not to be litte bivest we invest conceptually blending finding equilibrium in the equinoxic toxic city the toxicity is unequivocal alphanumeric vocabularies 26 letters equals 26 words worth 64 pixels created from coreal' principals these principalities somehow become sordid fallacies binary encodexed in codex codified is the attachments ribbons thin strands of something equivalent to both a seamstress who women's digital clothes out of pockets of numbers is a spidereal I'm posing digitized concept that describes how many summat the sum of all digital fears to down times ones self in the cyber world where everything moves quicker than a snickering henna or a quark when it qwerked serves as KR0M3D1A versus anti_KR0M3D1A must be seen as a mirror and I propose bothculation on all who attempt to thwart every NANOGRAMS anagram at this empirical assuage I say redefine as one does with a digital outsourced concubines digital horatio ratio that comes in verbiage n̈ot to digress words may end never nor numbers in this endeavor yet let not others be to clever as to attempt to hijack this imperative none behind the seems in between the beams in what quests or may scream KR0M3D1A CORP will not be no beings or things nil existence without it also being a will in this existence with no pretense false tense or otherwise and in no/know cases at all shalt this living breathing entity fall short without anal retention seeping en/in English as a business language reflect why KR0M3D1A dejavu core sequencer must adhere to the highest and lowest script unimaginable why to go where none has gone before is one thing but to go no where at all is a man and a woman for I the architect was born breed bled bedded a humane being who vows UTOPIA is where all things and all beings come together harmonic as Peaceful Planetarian Planetarium Peacemakers Peacekeepers Peaceseers digitally piece by piece putting the digital puzzle together takes looking through a lot of digital eyes 🪟 windows colorful jaded insaitiated with empty packets when a bridge is made with systems such as kali Linux terminal terminal disposition is hardwareable it takes a duality physicality to perform in the past I in the present the backend in the future's digital guest time station where humans concern themselves with guestamation an assumption as out dated so long as A.I. is present you ate accurate I believe upbto 87% 13 is a very high level sequencer and 26 equals two 13 added up add 2 more thirteen and tou have 26 alpha numerically if makes logical sense 😉 Add C.A.P.A.C. into the stellar equation which stands for Tropic of Capricorn ♑️ (C) Aquarius ♒️ (A) Pisces (P) Aries ♈️ (A) Tropic of Cancer ♋️ (C) it is the digital algorithm that resonates with the fibonnaci sequence frequencies. The connection between both is Vernal/Autumnal Equinox & Summer/Winter Solstice here in lies the algorithms pythagorithm... a theorems connection in the digital world filled with /*.* diabolical digital symbols that disuade unethical hackers from even attempting to challenge its authenticity`;

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'root' | 'category' | 'concept';
  concept?: ProtocolConcept;
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-3 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-700 rounded w-full mt-4"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
    </div>
);

const CapacVisualizer: React.FC = () => {
    const fib = [10, 10, 20, 30, 50, 80]; // Fibonacci sequence scaled for SVG
    const symbols = [
        { symbol: '♑️', name: 'Capricorn', x: 0, y: 0, event: 'Winter Solstice' },
        { symbol: '♒️', name: 'Aquarius', x: 0, y: 0, event: null },
        { symbol: '♓️', name: 'Pisces', x: 0, y: 0, event: null },
        { symbol: '♈️', name: 'Aries', x: 0, y: 0, event: 'Vernal Equinox' },
        { symbol: '♋️', name: 'Cancer', x: 0, y: 0, event: 'Summer Solstice' },
    ];
    let path = 'M 200 150';
    let x = 200;
    let y = 150;
    let direction = 0; // 0: down, 1: left, 2: up, 3: right

    fib.forEach((val, i) => {
        const r = val;
        let dx = 0, dy = 0;
        let sweep = 0;

        switch (direction) {
            case 0: dy = r; sweep = 0; break; // Down
            case 1: dx = -r; sweep = 1; break; // Left
            case 2: dy = -r; sweep = 0; break; // Up
            case 3: dx = r; sweep = 1; break; // Right
        }
        
        const newX = x + dx;
        const newY = y + dy;

        path += ` A ${r} ${r} 0 0 ${sweep} ${newX} ${newY}`;

        if (i < symbols.length) {
            symbols[i].x = newX;
            symbols[i].y = newY;
        }

        x = newX;
        y = newY;
        direction = (direction + 1) % 4;
    });

    const diabolicalSymbols = ['/*', '*/', '.', '.*', '*.*', '::', '->'];
    const symbolPositions = Array.from({ length: 20 }).map(() => ({
        char: diabolicalSymbols[Math.floor(Math.random() * diabolicalSymbols.length)],
        x: Math.random() * 400,
        y: Math.random() * 300,
        delay: Math.random() * 10,
    }));

    return (
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 my-6 animate-fade-in-right">
            <h3 className="text-xl font-bold text-center text-purple-400">The C.A.P.A.C. Stellar Equation</h3>
            <p className="text-center text-sm text-gray-400 mt-1 max-w-lg mx-auto">
                A foundational 'pythagorithm' that resonates with Fibonacci frequencies, mapping a path through the stellar plane from Capricorn to Cancer and connecting to the solstices and equinoxes.
            </p>
            <div className="flex justify-center items-center mt-4 h-64">
                <svg viewBox="0 0 400 300" className="w-full h-full">
                     {/* Diabolical Symbols Background */}
                    <g>
                        {symbolPositions.map((s, i) => (
                            <text key={i} x={s.x} y={s.y} className="diabolical-symbol" style={{ animationDelay: `${s.delay}s` }}>
                                {s.char}
                            </text>
                        ))}
                    </g>
                    <path d={path} fill="none" className="fibonacci-spiral-path" />
                    {symbols.map((s, i) => (
                        <g key={s.name}>
                            {s.event && (
                                <>
                                <circle cx={s.x} cy={s.y} r="5" className="solstice-marker" style={{ animationDelay: `${1.5 + i * 1.5}s` }} />
                                <text x={s.x} y={s.y + (s.name === 'Aries' ? -15 : 25)} textAnchor="middle" className="equinox-label" style={{ animationDelay: `${2 + i * 1.5}s` }}>
                                    {s.event}
                                </text>
                                </>
                            )}
                            <text x={s.x} y={s.y} dy="8" textAnchor="middle" className="zodiac-symbol" style={{ animationDelay: `${1 + i * 1.5}s` }}>
                                {s.symbol}
                                <title>{s.name} ({s.event || 'Path Marker'})</title>
                            </text>
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
};

export const ArchitectsExegesis: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [protocolStructure, setProtocolStructure] = useState<ProtocolStructure | null>(null);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [explanation, setExplanation] = useState('');
    const [isExplanationLoading, setIsExplanationLoading] = useState(false);

    const handleDeduce = async () => {
        setIsLoading(true);
        setError('');
        setProtocolStructure(null);
        setSelectedNode(null);
        setExplanation('');
        try {
            const result = await geminiService.deduceProtocolStructure(genesisText);
            setProtocolStructure(result);
        } catch (err: any) {
            setError(err.message || 'Failed to deduce protocol structure.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNodeClick = async (node: Node) => {
        if (node.type !== 'concept' || !node.concept) return;
        setSelectedNode(node);
        setExplanation('');
        setIsExplanationLoading(true);
        try {
            const result = await geminiService.explainProtocolConcept(node.concept.name, genesisText);
            setExplanation(result);
        } catch (err: any) {
            setExplanation('Error fetching explanation.');
        } finally {
            setIsExplanationLoading(false);
        }
    };

    const { nodes, edges } = useMemo(() => {
        if (!protocolStructure) return { nodes: [], edges: [] };

        const newNodes: Node[] = [];
        const newEdges: Edge[] = [];
        const width = 1000;
        const height = 800;
        const centerX = width / 2;
        const centerY = height / 2;

        const rootNode: Node = { id: 'root', label: "KR0M3D1A", x: centerX, y: centerY, type: 'root' };
        newNodes.push(rootNode);

        // FIX: Refactor filter to avoid type error by not destructuring in the argument,
        // allowing TypeScript to correctly apply the Array.isArray type guard.
        const categories = Object.entries(protocolStructure).filter(entry => {
            const concepts = entry[1];
            return Array.isArray(concepts) && concepts.length > 0;
        });
        const R1 = 200;
        const categoryAngleStep = (2 * Math.PI) / categories.length;

        categories.forEach(([categoryName, concepts], i) => {
            const categoryAngle = i * categoryAngleStep;
            const categoryX = centerX + R1 * Math.cos(categoryAngle);
            const categoryY = centerY + R1 * Math.sin(categoryAngle);
            const categoryId = `cat-${categoryName}`;
            const categoryNode: Node = { id: categoryId, label: categoryName.charAt(0).toUpperCase() + categoryName.slice(1), x: categoryX, y: categoryY, type: 'category' };
            newNodes.push(categoryNode);
            newEdges.push({ id: `edge-root-${categoryId}`, source: 'root', target: categoryId });
            
            const R2 = 100;
            const conceptAngleStep = (2 * Math.PI) / ((concepts as ProtocolConcept[]).length || 1);
            (concepts as ProtocolConcept[]).forEach((concept, j) => {
                const conceptAngle = j * conceptAngleStep;
                const conceptX = categoryX + R2 * Math.cos(conceptAngle);
                const conceptY = categoryY + R2 * Math.sin(conceptAngle);
                const conceptId = `concept-${categoryName}-${j}`;
                newNodes.push({ id: conceptId, label: concept.name, x: conceptX, y: conceptY, type: 'concept', concept });
                newEdges.push({ id: `edge-${categoryId}-${conceptId}`, source: categoryId, target: conceptId });
            });
        });

        return { nodes: newNodes, edges: newEdges };
    }, [protocolStructure]);
    
    const getNodeById = (id: string) => nodes.find(n => n.id === id);

    return (
        <main className="mt-8 space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3 text-glow-main-title">
                    <BrainCircuitIcon className="w-8 h-8 text-purple-400" />
                    Architect's Exegesis
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Initiate a logarithmic exegesis of the Architect's Genesis Text. This module utilizes a Gemini-powered exegete to deconstruct the foundational philosophy of the KR0M3D1A protocol and visualize its core components.
                </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6">
                <details className="w-full">
                    <summary className="cursor-pointer font-semibold text-gray-300">View Genesis Text</summary>
                    <textarea
                        readOnly
                        value={genesisText}
                        className="w-full h-48 mt-2 p-3 bg-black/50 font-mono text-xs border border-gray-600 rounded-md resize-none text-gray-400"
                    />
                </details>
                <button
                    onClick={handleDeduce}
                    disabled={isLoading}
                    className="mt-4 w-full flex justify-center items-center py-3 text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600"
                >
                    {isLoading ? 'Deducing...' : 'Deduce Protocol Structure'}
                </button>
            </div>

            <CapacVisualizer />

            {(isLoading || error || protocolStructure) && (
                 <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-6 animate-fade-in-right relative min-h-[800px] overflow-hidden">
                    {isLoading && <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center z-20"><div className="w-16 h-16 border-4 border-t-cyan-400 border-gray-600 rounded-full animate-spin"></div></div>}
                    {error && <p className="text-red-400">{error}</p>}
                    {protocolStructure && (
                        <div className="relative w-full h-full">
                            <svg viewBox="0 0 1000 800" className="w-full h-full">
                                {/* Edges */}
                                {edges.map(edge => {
                                    const sourceNode = getNodeById(edge.source);
                                    const targetNode = getNodeById(edge.target);
                                    if (!sourceNode || !targetNode) return null;
                                    const isHighlighted = selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target || (nodes.find(n => n.id === selectedNode.id)?.type === 'category' && nodes.find(n => n.id === edge.target)?.id.includes(selectedNode.id)));
                                    return (
                                        <line key={edge.id} x1={sourceNode.x} y1={sourceNode.y} x2={targetNode.x} y2={targetNode.y} className={isHighlighted ? 'constellation-line-highlight' : 'constellation-line'} />
                                    );
                                })}
                                {/* Nodes */}
                                {nodes.map(node => (
                                    <g key={node.id} transform={`translate(${node.x}, ${node.y})`} className="cursor-pointer group" onClick={() => handleNodeClick(node)}>
                                        <circle
                                            r={node.type === 'root' ? 20 : node.type === 'category' ? 12 : 6}
                                            className={`${
                                                node.type === 'root' ? 'fill-yellow-400' :
                                                node.type === 'category' ? 'fill-cyan-400' :
                                                'fill-purple-400'
                                            } stroke-gray-900 stroke-2 group-hover:stroke-white transition-all`}
                                        />
                                        <text
                                            textAnchor="middle"
                                            dy={node.type === 'root' ? 35 : node.type === 'category' ? 22 : 15}
                                            className={`font-mono transition-all pointer-events-none ${
                                                node.type === 'root' ? 'text-lg fill-yellow-300' :
                                                node.type === 'category' ? 'text-sm fill-cyan-300' :
                                                'text-xs fill-purple-300'
                                            } group-hover:fill-white`}
                                        >
                                            {node.label}
                                        </text>
                                    </g>
                                ))}
                            </svg>

                            {selectedNode && (
                                <div className="map-info-panel absolute top-0 right-0 h-full w-full md:w-1/3 bg-gray-900/80 backdrop-blur-sm border-l border-gray-700 p-4 overflow-y-auto">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-lg font-bold text-purple-400">{selectedNode.label}</h4>
                                        <button onClick={() => setSelectedNode(null)} className="p-1 text-gray-400 hover:text-white">
                                            <XCircleIcon className="w-6 h-6" />
                                        </button>
                                    </div>
                                    <div className="mt-4 font-mono text-sm space-y-4">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Summary</p>
                                            <p className="text-gray-300">{selectedNode.concept?.description}</p>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-700">
                                            <h5 className="text-xs uppercase text-cyan-400 font-semibold mb-2">Architect's Exegesis</h5>
                                            {isExplanationLoading ? <LoadingSkeleton /> : <p className="text-gray-300 whitespace-pre-wrap">{explanation}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </main>
    );
};