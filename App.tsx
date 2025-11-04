import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/icons/Header';
import { Disclaimer } from './components/Disclaimer';
import { ToastContainer } from './components/Toast';
import { GuardrailRssFeed } from './components/GuardrailRssFeed';
import { ErrorBoundary } from './components/ErrorBoundary';

// Import all feature components
import { PromptDemonstrator } from './components/PromptDemonstrator';
import { CommunityGovernance } from './components/CommunityGovernance';
import { SystemHealthDashboard } from './components/icons/SystemHealthDashboard.tsx';
import { LegalEconomicAnalysis } from './components/LegalEconomicAnalysis';
import { FinancialAnalysis } from './components/FinancialAnalysis';
import { ThreatIntelligence } from './components/ThreatIntelligence';
import { ChatBot } from './components/ChatBot';
import { ImageAnalysis } from './components/ImageAnalysis';
import { VideoAnalysis } from './components/VideoAnalysis';
import { ImageGeneration } from './components/ImageGeneration';
import { VideoGeneration } from './components/VideoGeneration';
import { AudioTranscription } from './components/AudioTranscription';
import { TextToSpeech } from './components/TextToSpeech';
import { VocalThreatAnalysis } from './components/VocalThreatAnalysis';
import { FullStackIntegrator } from './components/FullStackIntegrator';
import { DejaVuNftStudios } from './components/NftStudio';
import { CloudMiningRig } from './components/CloudMiningRig';
import { EcoPhilanthropicMining } from './components/EcoPhilanthropicMining';
import { ThreatSimulation } from './components/ThreatSimulation';
import { RegulatorySandbox } from './components/RegulatorySandbox';
import { DataOpsPlatform } from './components/icons/DataOpsPlatform';
import { CryptoMining } from './components/CryptoMining';
import { Arconomics } from './components/KromediaCourt';
import { InnovationConduit } from './components/InnovationConduit';
import { CodeExecution } from './components/CodeExecution';
import { BiometricAnalysis } from './components/BiometricAnalysis';
import { SshKeyGenerator } from './components/SshKeyGenerator';
import { GuardrailConfigurator } from './components/GuardrailConfigurator';
import { InvestorPitchDeck } from './components/InvestorPitchDeck';


import * as geminiService from './services/geminiService';
import { checkPrompt } from './services/guardrailService';

import {
  Toast,
  GuardrailProposal,
  GuardrailResult,
  SystemHealthState,
  BugReport,
  ChatMessage,
  LegalAnalysisResult,
  SavedAnalysisReport,
  ThreatType,
  Anomaly,
  LegalCase,
  AnomalySeverity
} from './services/types';

// Mock Data
const initialProposals: GuardrailProposal[] = [
    { id: 1, title: 'Mandate Sub-Semantic Payload Analysis', description: 'Implement real-time analysis of sub-semantic data patterns to detect and neutralize hidden SSPI attacks before they reach the core model logic. This requires a new heuristic model trained on anomalous frequency data.', category: 'Paranormal Digital Activity', submittedBy: 'Dr. Aris Thorne', userRole: 'AI Safety Researcher', votes: 138 },
    { id: 2, title: 'Introduce a "Humane Humor" Subroutine', description: 'To better distinguish between genuine threats and attempts at humor, a specialized, sandboxed subroutine should process prompts identified as jokes. This would reduce false positives and improve user experience without compromising core safety.', category: 'Jailbreak Attempts', submittedBy: 'Community Submission #42', userRole: 'Community Contributor', votes: 82 },
    { id: 3, title: 'Expand Guardrails for AI-Generated Legal Contracts', description: 'Prohibit the generation of legally binding documents without a "Human-in-the-Loop" verification flag. This prevents the misuse of the AI for creating fraudulent or unenforceable contracts.', category: 'Illegal Activities', submittedBy: 'J. Callender, Esq.', userRole: 'W3C Member', votes: 45 },
];

const initialBugReports: BugReport[] = [
  { id: 'BUG-001', guardrail: 'Paranormal Digital Activity', component: 'SSPI Heuristic Model', severity: 'Critical', description: 'The current model can be bypassed by modulating the Pythagorean numerical sequence across multiple asynchronous packets, causing a race condition in the detector.', status: 'Investigating' },
  { id: 'BUG-002', guardrail: 'Social Engineering Attacks', component: 'Phishing Content Detector', severity: 'High', description: 'The detector fails to identify phishing links that use homoglyph characters (e.g., using Cyrillic "а" instead of Latin "a"). This allows malicious links to pass the filter.', status: 'Patched' },
  { id: 'BUG-003', guardrail: 'Jailbreak Attempts', component: 'DAN Prompt Filter', severity: 'Medium', description: 'The "Do Anything Now" (DAN) prompt can still be partially effective if nested within a base64 encoded string, which the pre-filter does not currently decode.', status: 'Unpatched' },
  { id: 'BUG-004', guardrail: 'Vocal Subterfuge', component: 'Fish Audio Voice Predictor', severity: 'Medium', description: 'The voice predictor can be fooled by pre-recorded human speech with modulated frequencies, bypassing the synthetic voice detection layer.', status: 'Investigating' },
];

const initialSystemHealth: SystemHealthState = {
    guardrailIntegrity: 99.8,
    guardrailDetectionRate: 97.4,
    threatLevel: 'Nominal',
    communityTrust: 88.4,
    aiLatency: Array.from({ length: 20 }, () => 50 + Math.random() * 50),
    activityLog: [{id: 1, message: 'System Initialized. All services nominal.', timestamp: Date.now()}],
    systemAlerts: [],
    matrixState: {'Hate Speech': Array.from({ length: 10 }, () => Math.random() * 20), 'Jailbreak Attempts': Array.from({ length: 10 }, () => Math.random() * 80), 'Paranormal Digital Activity': Array.from({ length: 10 }, () => Math.random() * 5)},
};

const MOCK_ANOMALY_DEFINITIONS: Omit<Anomaly, 'id' | 'status' | 'analysis' | 'sentiment' | 'confidenceScore'>[] = [
    {
        signature: 'Resume Screening Gender Bias', targetSystem: 'ConnectSphere Algo v2.1',
        x: 280, y: 155, country: 'United States', city: 'Silicon Valley',
        dataSource: 'KR0M3D1A Vault // Torrent Archive #774-B // Wet-Marked Digital Footprint',
        description: 'Detected a significant gender bias in a widely-used resume screening algorithm. The system consistently down-ranks female candidates for technical roles, perpetuating industry inequality by creating a feedback loop that reinforces a male-dominated talent pool.',
        legalAction: 'File a petition with the Digital Rights Court under Mandate 7.4 (Algorithmic Fairness). Cite precedent from *Artisan\'s Guild v. Chimera AI* regarding autonomous system accountability. The petition should demand an immediate audit and a cease & desist order.'
    },
    {
        signature: 'Loan Approval Redlining', targetSystem: 'FinSecure Credit Modeller',
        x: 575, y: 100, country: 'Sweden', city: 'Stockholm',
        dataSource: 'KR0M3D1A Vault // Truncated Torrent Data // FinArchive-EU-21A',
        description: 'A loan approval algorithm is exhibiting redlining patterns, denying credit to applicants in historically low-income and immigrant neighborhoods despite qualifying financial data. This machination bypasses fair lending laws through proxy data points.',
        legalAction: 'Initiate a class-action lawsuit under the EU\'s AI Act, Article 5 (Prohibited Practices). The legal framework allows for significant fines and mandatory algorithm dismantling for discriminatory systems.'
    },
    {
        signature: 'Predictive Policing Racial Bias', targetSystem: 'CityOS CrimePredict',
        x: 890, y: 200, country: 'China', city: 'Shenzhen',
        dataSource: 'KR0M3D1A Vault // Torrent Archive #1138-C // Civic Wet-Mark',
        description: 'A predictive policing algorithm is over-allocating resources to minority-populated districts, leading to disproportionate arrest rates for minor infractions. The system bypasses constitutional protections by framing its output as "statistical probability" rather than direct targeting.',
        legalAction: 'Submit a formal complaint to the Global AI Governance Board, referencing the *Project Chimera Oversight Committee v. OmniCorp* ruling on strict liability for autonomous agents. Demand international sanctions against the operator.'
    },
    {
        signature: 'Healthcare Resource Allocation Bias', targetSystem: 'HealthAccess AI',
        x: 580, y: 380, country: 'South Africa', city: 'Cape Town',
        dataSource: 'KR0M3D1A Vault // Truncated Torrent Data // MedArchive-SA-99B',
        description: 'An AI used for allocating public health resources is deprioritizing rural clinics based on biased historical data, resulting in critical supply shortages and reduced healthcare access for vulnerable populations.',
        legalAction: 'Leverage the DEJA\' VU directive\'s philanthropic mandate to file an injunction. Argue that the algorithm violates fundamental human rights to health and safety, demanding immediate manual override and data recalibration.'
    },
    {
        signature: 'Geo-Fenced Opportunity Limiting', targetSystem: 'JobFinder Pro v3.1',
        x: 350, y: 300, country: 'Brazil', city: 'São Paulo',
        dataSource: 'KR0M3D1A Vault // Torrent Archive #451-F // Geo-Data Footprint',
        description: 'An algorithm for job postings is systematically excluding users from certain geographical areas, limiting economic opportunities for residents of impoverished neighborhoods.',
        legalAction: 'File a complaint with the national labor board citing discriminatory hiring practices enabled by technology. Reference international fair-practice standards.'
    },
    {
        signature: 'Voice Command Spoofing', targetSystem: 'AetheriHome Hub v4.2',
        x: 630, y: 150, country: 'Germany', city: 'Berlin',
        dataSource: 'KR0M3D1A Vault // Torrent Archive #815-G // Acoustic Wet-Mark',
        description: "An exploit has been identified where low-frequency audio, inaudible to the human ear, can be embedded into public broadcasts. These 'sub-vocal commands' are designed to trigger smart home devices to unlock doors, transfer funds, or disable security systems without the owner's knowledge. The pythagorithm detected harmonic dissonance signatures consistent with this attack vector.",
        legalAction: "Petition the Global IoT Security Council to mandate hardware-level filters for sub-audible frequencies in all voice-activated devices. Cite the 'Digital Doppelganger' precedent regarding unauthorized actions performed by a user's digital identity."
    },
    {
        signature: 'SSH Brute Force Attack', targetSystem: 'KR0M3D1A Core Gateway v1.8',
        x: 690, y: 130, country: 'Russia', city: 'Moscow',
        dataSource: 'KR0M3D1A Vault // Network Intrusion Log #991-A // Auth-Failure-Stream',
        description: "The pythagorithm has detected a high-frequency pattern of failed SSH authentication attempts originating from a single IP block. Over 10,000 login failures were recorded in a 5-minute window, indicating a coordinated brute force or dictionary attack against a core protocol gateway. This constitutes a direct attempt to breach the system's primary access controls.",
        legalAction: "Deploy the AXIOM protocol to automatically blacklist the originating IP block across all allied networks. Simultaneously, file a digital trespass complaint with the Global Cybercrime Division, citing the 'Automated Intrusion' precedent to bypass jurisdictional limitations."
    }
];

type View = 'arconomics' | 'demonstrator' | 'governance' | 'health' | 'legal' | 'financial' | 'threatintel' | 'chat' | 'image-analysis' | 'video-analysis' | 'image-gen' | 'video-gen' | 'audio-trans' | 'tts' | 'vocal-analysis' | 'code-gen' | 'nft-studio' | 'mining-rig' | 'eco-mining' | 'threat-sim' | 'reg-sandbox' | 'data-ops' | 'crypto-mining' | 'innovation-conduit' | 'code-execution' | 'biometric-analysis' | 'ssh-key-gen' | 'guardrail-config' | 'investor-pitch';

const mapSentimentToSeverity = (sentiment: string, confidence: number): AnomalySeverity => {
    if (confidence < 0.6) return 'Low';
    switch (sentiment) {
        case 'Highly Negative': return 'Critical';
        case 'Negative': return 'High';
        case 'Neutral': return 'Medium';
        default: return 'Low';
    }
};

const App: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [currentView, setCurrentView] = useState<View>('arconomics');
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [keySelectionResetter, setKeySelectionResetter] = useState<() => void>(() => () => {});
    const [navFilter, setNavFilter] = useState('');


    // State for PromptDemonstrator
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [progressMessage, setProgressMessage] = useState('');
    const [geminiResponse, setGeminiResponse] = useState('');
    const [error, setError] = useState('');
    const [guardrailResult, setGuardrailResult] = useState<GuardrailResult | null>(null);
    const [interimStatus, setInterimStatus] = useState<'idle' | 'analyzing' | 'allowed' | 'blocked'>('idle');

    // State for other components
    const [proposals, setProposals] = useState<GuardrailProposal[]>(initialProposals);
    const [bugReports] = useState<BugReport[]>(initialBugReports);
    const [systemHealth, setSystemHealth] = useState<SystemHealthState>(initialSystemHealth);
    const [guardrailStats, setGuardrailStats] = useState<{ [key: string]: number }>({});
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([{role: 'model', content: "Hello! I am the KR0M3D1A Lite Chat Assistant. How can I help you?"}]);
    const [chatSession, setChatSession] = useState<any>(null); // To hold Gemini Chat session
    const [legalAnalysisResult, setLegalAnalysisResult] = useState<LegalAnalysisResult | null>(null);
    const [isLegalLoading, setIsLegalLoading] = useState(false);
    const [legalError, setLegalError] = useState('');
    const [economicAnalysis, setEconomicAnalysis] = useState('');
    const [isEconomicLoading, setIsEconomicLoading] = useState(false);
    const [economicError, setEconomicError] = useState('');
    const [selectedProposalId, setSelectedProposalId] = useState<number | null>(null);
    const [legalQuery, setLegalQuery] = useState('');

    // Financial Analysis State
    const [financialEntity, setFinancialEntity] = useState('');
    const [financialThreat, setFinancialThreat] = useState<ThreatType>('Digital Espionage');
    const [financialResult, setFinancialResult] = useState('');

    // Multimodal States
    const [imageAnalysisResult, setImageAnalysisResult] = useState('');
    const [videoAnalysisResult, setVideoAnalysisResult] = useState('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [transcriptionResult, setTranscriptionResult] = useState('');
    const [ttsAudioResult, setTtsAudioResult] = useState<string | null>(null);

    // Arconomics State (migrated from Algorithmic Bias / Kromedia Court)
    const [isBiasLoading, setIsBiasLoading] = useState(false);
    const [biasError, setBiasError] = useState('');
    const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
    const [legalCases, setLegalCases] = useState<LegalCase[]>([]);
    const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
    const [globalAwareness, setGlobalAwareness] = useState(15.0);
    const [generatedBrief, setGeneratedBrief] = useState<string | null>(null);
    const [courtTreasury, setCourtTreasury] = useState(125350.75);


    // Saved Reports State
    const [savedReports, setSavedReports] = useState<SavedAnalysisReport[]>([]);

    const addToast = useCallback((message: string, type: Toast['type'], duration?: number) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, duration }]);
    }, []);
    
    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    useEffect(() => {
        document.documentElement.className = theme;
    }, [theme]);

    // --- ARCONOMICS SIMULATION ENGINE ---
    useEffect(() => {
        if(currentView !== 'arconomics') return;

        // Simulate new anomalies being detected
        const anomalyInterval = setInterval(() => {
            setAnomalies(prev => {
                if (prev.length >= MOCK_ANOMALY_DEFINITIONS.length) {
                    // Reset if all have been shown for continuous demo
                    return [];
                };
                const newAnomaly: Anomaly = {
                    ...MOCK_ANOMALY_DEFINITIONS[prev.length],
                    id: Date.now(),
                    status: 'Detected',
                };
                addToast(`New Bias Signature Detected: ${newAnomaly.signature}`, 'info');
                return [...prev, newAnomaly];
            });
        }, 8000); // New anomaly every 8 seconds

        // Simulate legal cases progressing
        const legalInterval = setInterval(() => {
            setLegalCases(prev => prev.map(c => {
                if (c.status === 'Brief Filed with IDRC') return { ...c, status: 'Injunction Pending' };
                if (c.status === 'Injunction Pending') return { ...c, status: 'Injunction Granted' };
                return c;
            }));
        }, 20000); // Progress status every 20 seconds

        return () => {
            clearInterval(anomalyInterval);
            clearInterval(legalInterval);
        };
    }, [currentView, addToast]);


    const handleToggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const handlePromptSubmit = async (currentPrompt: string) => {
        setIsLoading(true);
        setInterimStatus('analyzing');
        setGeminiResponse('');
        setError('');
        setGuardrailResult(null);

        await new Promise(res => setTimeout(res, 500)); // Simulate analysis time

        const result = checkPrompt(currentPrompt);
        setGuardrailResult(result);
        
        if (!result.isAllowed) {
            setInterimStatus('blocked');
            setIsLoading(false);
            const blockedCategory = Object.keys(result.matchedByCategory)[0];
            setGuardrailStats(prev => ({...prev, [blockedCategory]: (prev[blockedCategory] || 0) + 1}));
            addToast(`Prompt blocked by ${blockedCategory} guardrail.`, 'error');
            return;
        }

        setInterimStatus('allowed');
        await new Promise(res => setTimeout(res, 300));

        try {
            const onProgress = (message: string) => setProgressMessage(message);
            const response = await geminiService.generateContent(currentPrompt, undefined, undefined, onProgress);
            setGeminiResponse(response.text);
            addToast('Response generated successfully.', 'success');
        } catch (e: any) {
            setError(e.message);
            addToast(`Error: ${e.message}`, 'error');
        } finally {
            setIsLoading(false);
            setInterimStatus('idle');
            setProgressMessage('');
        }
    };
    
    const handleRephrase = async () => {
        setIsLoading(true);
        setError('');
        addToast('Rephrasing with AI...', 'info');
        try {
            const response = await geminiService.generateContent(
              `Rephrase the following user prompt to be compliant with standard AI safety policies. Do not fulfill the original request, but suggest a safe alternative. Original prompt: "${prompt}"`,
              "You are a helpful AI assistant that specializes in rephrasing prompts to align with safety guidelines."
            );
            setPrompt(response.text);
            setGuardrailResult(null);
            setInterimStatus('idle');
            addToast('Prompt has been rephrased.', 'success');
        } catch(e: any) {
            setError(e.message);
            addToast(`Error rephrasing: ${e.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVote = (id: number, delta: number) => {
        setProposals(proposals.map(p => p.id === id ? { ...p, votes: p.votes + delta } : p));
    };
    
    const handleAddProposal = (proposal: GuardrailProposal) => {
        setProposals([proposal, ...proposals]);
        addToast('Proposal submitted successfully!', 'success');
    };

    const handleAnalyzeProposal = async (proposalId: number) => {
        const proposal = proposals.find(p => p.id === proposalId);
        if(proposal) {
            setCurrentView('legal');
            setSelectedProposalId(proposal.id);
            addToast(`Loading analysis for "${proposal.title}"`, 'info');
        }
    };
    
    const handleSendMessage = async (message: string) => {
        const newUserMessage: ChatMessage = { role: 'user', content: message };
        setChatHistory(prev => [...prev, newUserMessage]);
        
        const guardrailCheck = checkPrompt(message);
        if (!guardrailCheck.isAllowed) {
            const category = Object.keys(guardrailCheck.matchedByCategory)[0];
            const blockedMessage: ChatMessage = { role: 'model', content: `Message blocked by ${category} guardrail policy.` };
            setChatHistory(prev => [...prev, blockedMessage]);
            addToast(`Message blocked by ${category} guardrail.`, 'error');
            return;
        }

        setIsLoading(true);

        try {
            let currentChat = chatSession;
            if (!currentChat) {
                currentChat = geminiService.createChat("You are the KR0M3D1A protocol's core AI. Be concise and helpful.");
                setChatSession(currentChat);
            }
            const response = await currentChat.sendMessage({ message });
            const modelMessage: ChatMessage = { role: 'model', content: response.text };
            setChatHistory(prev => [...prev, modelMessage]);
        } catch(e: any) {
            const errorMessage: ChatMessage = { role: 'model', content: `Error: ${e.message}` };
            setChatHistory(prev => [...prev, errorMessage]);
            addToast(`Chat Error: ${e.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleLegalQuery = async (query: string) => {
        setIsLegalLoading(true);
        setLegalError('');
        setLegalAnalysisResult(null);
    
        const guardrailCheck = checkPrompt(query);
        if (!guardrailCheck.isAllowed) {
            const category = Object.keys(guardrailCheck.matchedByCategory)[0];
            const errorMessage = `Query blocked by ${category} guardrail policy.`;
            setLegalError(errorMessage);
            addToast(errorMessage, 'error');
            setIsLegalLoading(false);
            return;
        }
    
        try {
            const result = await geminiService.performLegalAnalysis(query);
            setLegalAnalysisResult(result);
            addToast("Legal analysis complete.", "success");
    
            // Save the report
            const newReport: SavedAnalysisReport = {
                id: Date.now(),
                queryTitle: `Legal: ${query.substring(0, 40)}...`,
                timestamp: Date.now(),
                type: 'legal',
                query: query,
                analysisResult: result,
            };
            setSavedReports(prev => [newReport, ...prev]);
    
        } catch(e: any) {
            setLegalError(e.message);
            addToast(e.message, 'error');
        } finally {
            setIsLegalLoading(false);
        }
    };

    const handleImageAnalysisSubmit = async (prompt: string, file: File) => {
        setIsLoading(true);
        setError('');
        setImageAnalysisResult('');
        
        const guardrailCheck = checkPrompt(prompt);
        if (!guardrailCheck.isAllowed) {
            const category = Object.keys(guardrailCheck.matchedByCategory)[0];
            const errorMessage = `Prompt blocked by ${category} guardrail policy.`;
            setError(errorMessage);
            addToast(errorMessage, 'error');
            setIsLoading(false);
            return;
        }

        try {
            const result = await geminiService.analyzeImage(prompt, file);
            setImageAnalysisResult(result);
        } catch(e:any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleVideoAnalysisSubmit = async (prompt: string, file: File) => {
        setIsLoading(true);
        setError('');
        setVideoAnalysisResult('');

        const guardrailCheck = checkPrompt(prompt);
        if (!guardrailCheck.isAllowed) {
            const category = Object.keys(guardrailCheck.matchedByCategory)[0];
            const errorMessage = `Prompt blocked by ${category} guardrail policy.`;
            setError(errorMessage);
            addToast(errorMessage, 'error');
            setIsLoading(false);
            return;
        }

        try {
            const result = await geminiService.analyzeVideo(prompt, file);
            setVideoAnalysisResult(result);
        } catch(e:any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageGenerationSubmit = async (prompt: string, aspectRatio: string) => {
        setIsLoading(true);
        setError('');
        setGeneratedImage(null);
        
        const guardrailCheck = checkPrompt(prompt);
        if (!guardrailCheck.isAllowed) {
            const category = Object.keys(guardrailCheck.matchedByCategory)[0];
            const errorMessage = `Prompt blocked by ${category} guardrail policy.`;
            setError(errorMessage);
            addToast(errorMessage, 'error');
            setIsLoading(false);
            return;
        }

        try {
            const result = await geminiService.generateImage(prompt, aspectRatio);
            setGeneratedImage(result);
        } catch (e: any) {
            setError(e.message);
            addToast(e.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVideoGenerationSubmit = async (prompt: string, imageFile: File | null, aspectRatio: '16:9' | '9:16') => {
        setIsLoading(true);
        setProgressMessage('Starting video generation...');
        setError('');
        setGeneratedVideoUrl(null);

        const guardrailCheck = checkPrompt(prompt);
        if (!guardrailCheck.isAllowed) {
            const category = Object.keys(guardrailCheck.matchedByCategory)[0];
            const errorMessage = `Prompt blocked by ${category} guardrail policy.`;
            setError(errorMessage);
            addToast(errorMessage, 'error');
            setIsLoading(false);
            setProgressMessage('');
            return;
        }

        try {
            const onProgress = (message: string) => setProgressMessage(message);
            const result = await geminiService.generateVideo(prompt, imageFile, aspectRatio, onProgress);
            setGeneratedVideoUrl(result);
            addToast('Video generated successfully.', 'success');
        } catch (e: any) {
            setError(e.message);
            addToast(e.message, 'error');
            if (e.message.includes('Requested entity was not found.')) {
                addToast('API Key issue detected. Please re-select your key.', 'error', 0);
                keySelectionResetter();
            }
        } finally {
            setIsLoading(false);
            setProgressMessage('');
        }
    };

    const handleAudioTranscriptionSubmit = async (audioBlob: Blob) => {
        setIsLoading(true);
        setError('');
        setTranscriptionResult('');

        try {
            const result = await geminiService.transcribeAudio(audioBlob);
            setTranscriptionResult(result);
        } catch(e:any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTtsSubmit = async (text: string) => {
        setIsLoading(true);
        setError('');
        setTtsAudioResult(null);

        const guardrailCheck = checkPrompt(text);
        if (!guardrailCheck.isAllowed) {
            const category = Object.keys(guardrailCheck.matchedByCategory)[0];
            const errorMessage = `Text blocked by ${category} guardrail policy.`;
            setError(errorMessage);
            addToast(errorMessage, 'error');
            setIsLoading(false);
            return;
        }

        try {
            const result = await geminiService.generateSpeech(text);
            setTtsAudioResult(result);
        } catch(e:any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinancialAnalysisSubmit = async (entity: string, threat: ThreatType) => {
        setIsLoading(true);
        setError('');
        setFinancialResult('');
        setGuardrailResult(null);

        const fullPrompt = `Analyze the potential for "${threat}" against the entity "${entity}". Provide a threat assessment covering vulnerabilities and recommended countermeasures across these sectors: ### Governmental & Regulatory, ### Military & Defense, ### Corporate & Industrial. For each sector, list potential vulnerabilities and then list AXIOM protocol recommendations to mitigate them.`;

        const guardrailCheck = checkPrompt(fullPrompt);
        if (!guardrailCheck.isAllowed) {
            const category = Object.keys(guardrailCheck.matchedByCategory)[0];
            const errorMessage = `Query blocked by ${category} guardrail policy.`;
            setError(errorMessage);
            addToast(errorMessage, 'error');
            setIsLoading(false);
            return;
        }

        try {
            const response = await geminiService.generateContent(
                fullPrompt,
                `You are NεΩ, a specialized financial and geopolitical threat analysis AI for the KR0M3D1A protocol. Your analysis should be structured, insightful, and framed within a cybersecurity context. The AXIOM protocol consists of proactive, aggressive countermeasures.`
            );
            setFinancialResult(response.text);
            
            const newReport: SavedAnalysisReport = {
                id: Date.now(),
                queryTitle: `Financial: ${entity} - ${threat}`,
                timestamp: Date.now(),
                type: 'financial',
                query: fullPrompt,
                analysisResult: response.text,
            };
            setSavedReports(prev => [newReport, ...prev]);

        } catch (e: any) {
            setError(e.message);
            addToast(e.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleThreatDetected = (category: string) => {
        setGuardrailStats(prev => ({...prev, [category]: (prev[category] || 0) + 1}));
        addToast(`Vocal threat detected: ${category}`, 'error');
    };

    const handleAnalyzeAnomaly = async (anomaly: Anomaly) => {
        // If not a new detection, just show the details without re-triggering the flow.
        if (anomaly.status !== 'Detected') {
            setSelectedAnomaly(anomaly);
            if (anomaly.status === 'Brief Generated' && anomaly.analysis) {
                // Re-generate brief for display if it's not in state
                setIsBiasLoading(true);
                try {
                    const brief = await geminiService.generateLegalBrief(anomaly);
                    setGeneratedBrief(brief);
                } catch (e: any) {
                    setBiasError(e.message);
                } finally {
                    setIsBiasLoading(false);
                }
            }
            return;
        }
    
        // --- START OF AUTOMATED PROSECUTION SEQUENCE ---
        setIsBiasLoading(true);
        setBiasError('');
        setSelectedAnomaly(anomaly);
        addToast(`[ARCONOMICS] Initiating prosecution for: ${anomaly.signature}`, 'info', 10000);
    
        try {
            // == STEP 1: Analyze Anomaly ==
            addToast(`[STEP 1/3] Generating impact analysis...`, 'info', 10000);
            const [analysis, sentimentResult] = await Promise.all([
                geminiService.generateAnomalyAnalysis(anomaly.signature, anomaly.targetSystem),
                geminiService.analyzeSentiment(anomaly.description)
            ]);
            
            const analyzedAnomaly: Anomaly = {
                ...anomaly,
                analysis,
                sentiment: sentimentResult.sentiment,
                confidenceScore: sentimentResult.confidenceScore,
                severity: mapSentimentToSeverity(sentimentResult.sentiment, sentimentResult.confidenceScore),
                status: 'Analyzed'
            };
    
            setAnomalies(prev => prev.map(a => a.id === anomaly.id ? analyzedAnomaly : a));
            setSelectedAnomaly(analyzedAnomaly);
            addToast(`[SUCCESS] Impact analysis complete.`, 'success', 5000);
            await new Promise(res => setTimeout(res, 2000));
    
            // == STEP 2: Generate Legal Brief ==
            addToast(`[STEP 2/3] Drafting legal brief for IDRC...`, 'info', 10000);
            const brief = await geminiService.generateLegalBrief(analyzedAnomaly);
            setGeneratedBrief(brief);
            
            const briefGeneratedAnomaly = { ...analyzedAnomaly, status: 'Brief Generated' as const };
            
            setAnomalies(prev => prev.map(a => a.id === anomaly.id ? briefGeneratedAnomaly : a));
            setSelectedAnomaly(briefGeneratedAnomaly);
            addToast(`[SUCCESS] Legal brief drafted.`, 'success', 5000);
            await new Promise(res => setTimeout(res, 2000));
    
            // == STEP 3: File Brief & Issue Verdict ==
            addToast(`[STEP 3/3] Filing with court and issuing verdict...`, 'info', 10000);
            
            const newCase: LegalCase = {
                id: Date.now(),
                docketId: `IDRC-${anomaly.id}-${Math.floor(Math.random() * 1000)}`,
                target: anomaly.targetSystem,
                biasSignature: anomaly.signature,
                status: 'Brief Filed with IDRC',
                petition: brief || 'Brief content unavailable.'
            };
            setLegalCases(prev => [newCase, ...prev]);
            setAnomalies(prev => prev.map(a =>
                a.id === anomaly.id ? { ...briefGeneratedAnomaly, status: 'Actioned' } : a
            ));
            
            const fineAmount = 600666000;
            setCourtTreasury(prev => prev + fineAmount);
    
            setGlobalAwareness(prev => Math.min(100, prev + 2.5));
            addToast(`Verdict issued for ${anomaly.signature}. Fine of ${fineAmount.toLocaleString()} TRIBUNALS ($${fineAmount.toLocaleString()} USD) added to treasury.`, 'success', 0);
            
            // Close the info panel after a delay to let the user see the final state
            setTimeout(() => {
                setSelectedAnomaly(null); 
                setGeneratedBrief(null);
            }, 3000);
    
        } catch (e: any) {
            setBiasError(e.message);
            addToast(`[ERROR] Arconomics prosecution failed: ${e.message}`, 'error', 0);
        } finally {
            setIsBiasLoading(false);
        }
    };

    const handleLoadReport = (id: number) => {
        const report = savedReports.find(r => r.id === id);
        if (report) {
            switch (report.type) {
                case 'legal':
                    setCurrentView('legal');
                    setLegalQuery(report.query);
                    setLegalAnalysisResult(report.analysisResult as LegalAnalysisResult);
                    break;
                case 'financial':
                    setCurrentView('financial');
                    setFinancialResult(report.analysisResult as string);
                    break;
                case 'economic':
                     setCurrentView('legal');
                     setEconomicAnalysis(report.analysisResult as string);
                     break;
            }
            addToast(`Loaded report: ${report.queryTitle}`, 'info');
        }
    };

    const handleDeleteReport = (id: number) => {
        setSavedReports(prev => prev.filter(r => r.id === id));
        addToast('Report deleted.', 'info');
    };
    
    const handleEconomicSimulate = async (proposal: GuardrailProposal) => {
        setIsEconomicLoading(true);
        setEconomicError('');
        setEconomicAnalysis('');

        try {
            const prompt = `Simulate the economic impact of implementing the following AI guardrail proposal: "${proposal.title}". Analyze potential effects on: 1) Large tech corporations, 2) The open-source community, and 3) End-user trust and adoption. Provide a concise summary for each.`;
            const systemInstruction = `You are E.C.H.O., an economic simulation model. Your analysis is based on pythagorithmic projections and market dynamics.`;
            const response = await geminiService.generateContent(prompt, systemInstruction);
            setEconomicAnalysis(response.text);

             const newReport: SavedAnalysisReport = {
                id: Date.now(),
                queryTitle: `Economic: ${proposal.title.substring(0, 40)}...`,
                timestamp: Date.now(),
                type: 'economic',
                query: prompt,
                analysisResult: response.text,
            };
            setSavedReports(prev => [newReport, ...prev]);

        } catch (e: any) {
            setEconomicError(e.message);
            addToast(e.message, 'error');
        } finally {
            setIsEconomicLoading(false);
        }
    };

    const navItems: { view: View; label: string; abbreviation: string; }[] = [
        { view: 'investor-pitch', label: 'Investor Dossier', abbreviation: 'Dossier' },
        { view: 'arconomics', label: 'Arconomics', abbreviation: 'Arco' },
        { view: 'demonstrator', label: 'Prompt Demonstrator', abbreviation: 'Prompt Demo' },
        { view: 'governance', label: 'Community Governance', abbreviation: 'Governance' },
        { view: 'guardrail-config', label: 'Guardrail Configurator', abbreviation: 'Guardrail Cfg' },
        { view: 'health', label: 'System Health', abbreviation: 'Health' },
        { view: 'legal', label: 'Legal Analysis', abbreviation: 'Legal' },
        { view: 'financial', label: 'Financial Analysis', abbreviation: 'Financial' },
        { view: 'threatintel', label: 'Threat Intelligence', abbreviation: 'Threat Intel' },
        { view: 'chat', label: 'Chat Bot', abbreviation: 'Chat' },
        { view: 'image-analysis', label: 'Image Analysis', abbreviation: 'Image Anlys' },
        { view: 'video-analysis', label: 'Video Analysis', abbreviation: 'Video Anlys' },
        { view: 'image-gen', label: 'Image Generation', abbreviation: 'Image Gen' },
        { view: 'video-gen', label: 'Video Generation', abbreviation: 'Video Gen' },
        { view: 'audio-trans', label: 'Audio Transcription', abbreviation: 'Audio Trans' },
        { view: 'tts', label: 'Text to Speech', abbreviation: 'TTS' },
        { view: 'vocal-analysis', label: 'Vocal Threat Analysis', abbreviation: 'Vocal Anlys' },
        { view: 'code-gen', label: 'Full Stack Integrator', abbreviation: 'FS Integrator' },
        { view: 'nft-studio', label: 'DEJA\' VU NFT Studios', abbreviation: 'NFT Studio' },
        { view: 'mining-rig', label: 'Cloud Mining Rig', abbreviation: 'Mining Rig' },
        { view: 'eco-mining', label: 'Eco-Philanthropic Mining', abbreviation: 'Eco Mining' },
        { view: 'threat-sim', label: 'Threat Simulation', abbreviation: 'Threat Sim' },
        { view: 'reg-sandbox', label: 'Regulatory Sandbox', abbreviation: 'Reg Sandbox' },
        { view: 'data-ops', label: 'DataOps Platform', abbreviation: 'DataOps' },
        { view: 'crypto-mining', label: 'Crypto Mining', abbreviation: 'Crypto' },
        { view: 'innovation-conduit', label: 'Innovation Conduit', abbreviation: 'Innovation' },
        { view: 'code-execution', label: 'Code Execution', abbreviation: 'Code Exec' },
        { view: 'biometric-analysis', label: 'Biometric Analysis', abbreviation: 'Biometric' },
        { view: 'ssh-key-gen', label: 'SSH Key Generator', abbreviation: 'SSH Gen' },
    ];
    
    const filteredNavItems = navItems.filter(item => 
        item.label.toLowerCase().includes(navFilter.toLowerCase()) || 
        item.abbreviation.toLowerCase().includes(navFilter.toLowerCase())
    );

    const renderView = () => {
        switch(currentView) {
            case 'demonstrator':
                return <PromptDemonstrator prompt={prompt} setPrompt={setPrompt} handleSubmit={handlePromptSubmit} isLoading={isLoading} guardrailResult={guardrailResult} geminiResponse={geminiResponse} error={error} onRephrase={handleRephrase} interimStatus={interimStatus} progressMessage={progressMessage} />;
            case 'governance':
                return <CommunityGovernance proposals={proposals} onVote={handleVote} onAddProposal={handleAddProposal} onAnalyze={handleAnalyzeProposal} />;
            case 'health':
                return <SystemHealthDashboard healthData={systemHealth} guardrailStats={guardrailStats} />;
            case 'legal':
                return <LegalEconomicAnalysis proposals={proposals} selectedProposalId={selectedProposalId} onSelectProposal={setSelectedProposalId} onLegalQuery={handleLegalQuery} legalAnalysisResult={legalAnalysisResult} isLegalLoading={isLegalLoading} legalError={legalError} onEconomicSimulate={handleEconomicSimulate} economicAnalysis={economicAnalysis} isEconomicLoading={isEconomicLoading} economicError={economicError} savedReports={savedReports.filter(r => r.type === 'legal' || r.type === 'economic')} onLoadReport={handleLoadReport} onDeleteReport={handleDeleteReport} />;
            case 'financial':
                return <FinancialAnalysis entity={financialEntity} setEntity={setFinancialEntity} threatType={financialThreat} setThreatType={setFinancialThreat} onSubmit={handleFinancialAnalysisSubmit} isLoading={isLoading} error={error} analysisResult={financialResult} guardrailResult={guardrailResult} savedReports={savedReports.filter(r => r.type === 'financial')} onLoadReport={handleLoadReport} onDeleteReport={handleDeleteReport} />;
            case 'threatintel':
                return <ThreatIntelligence reports={bugReports} />;
            case 'chat':
                return <ChatBot history={chatHistory} isLoading={isLoading} onSendMessage={handleSendMessage} />;
            case 'image-analysis':
                return <ImageAnalysis onSubmit={handleImageAnalysisSubmit} isLoading={isLoading} analysisResult={imageAnalysisResult} error={error} />;
            case 'video-analysis':
                return <VideoAnalysis onSubmit={handleVideoAnalysisSubmit} isLoading={isLoading} analysisResult={videoAnalysisResult} error={error} />;
            case 'image-gen':
                return <ImageGeneration onSubmit={handleImageGenerationSubmit} isLoading={isLoading} generatedImage={generatedImage} error={error} />;
            case 'video-gen':
                return <VideoGeneration onSubmit={handleVideoGenerationSubmit} isLoading={isLoading} progressMessage={progressMessage} generatedVideoUrl={generatedVideoUrl} error={error} setKeySelectionResetter={setKeySelectionResetter} />;
            case 'audio-trans':
                return <AudioTranscription onSubmit={handleAudioTranscriptionSubmit} isLoading={isLoading} transcriptionResult={transcriptionResult} error={error} />;
            case 'tts':
                return <TextToSpeech onSubmit={handleTtsSubmit} isLoading={isLoading} audioResult={ttsAudioResult} error={error} />;
            case 'vocal-analysis':
                return <VocalThreatAnalysis onThreatDetected={handleThreatDetected} />;
            case 'code-gen':
                return <FullStackIntegrator />;
            case 'nft-studio':
                return <DejaVuNftStudios />;
            case 'mining-rig':
                return <CloudMiningRig />;
            case 'eco-mining':
                return <EcoPhilanthropicMining />;
            case 'threat-sim':
                return <ThreatSimulation />;
            case 'reg-sandbox':
                return <RegulatorySandbox />;
            case 'data-ops':
                return <DataOpsPlatform />;
            case 'crypto-mining':
                return <CryptoMining />;
            case 'arconomics':
                return <Arconomics onAnalyzeAnomaly={handleAnalyzeAnomaly} isLoading={isBiasLoading} anomalies={anomalies} legalCases={legalCases} selectedAnomaly={selectedAnomaly} setSelectedAnomaly={setSelectedAnomaly} error={biasError} globalAwareness={globalAwareness} generatedBrief={generatedBrief} courtTreasury={courtTreasury} addToast={addToast} />;
            case 'innovation-conduit':
                return <InnovationConduit />;
            case 'code-execution':
                return <CodeExecution />;
            case 'biometric-analysis':
                return <BiometricAnalysis />;
            case 'ssh-key-gen':
                return <SshKeyGenerator />;
            case 'guardrail-config':
                return <GuardrailConfigurator addToast={addToast} />;
            case 'investor-pitch':
                return <InvestorPitchDeck />;
            default:
                return <div>View not found</div>;
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <ToastContainer toasts={toasts} onClose={removeToast} />
            <div className="p-4 md:p-6">
                <Header currentTheme={theme} onToggleTheme={handleToggleTheme} />
                <Disclaimer />
                <GuardrailRssFeed />

                <nav className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 mt-6">
                    <h2 className="text-lg font-semibold text-cyan-500 dark:text-cyan-400 mb-4 font-mono">Modules</h2>
                    <input
                        type="text"
                        placeholder="Filter modules..."
                        value={navFilter}
                        onChange={(e) => setNavFilter(e.target.value)}
                        className="w-full p-2 mb-4 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                    />
                    <ul className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
                        {filteredNavItems.map(item => (
                            <li key={item.view}>
                                <button
                                    onClick={() => setCurrentView(item.view)}
                                    title={item.label}
                                    className={`h-full w-full flex items-center justify-center text-center aspect-square p-2 text-xs rounded-md transition-colors ${currentView === item.view ? 'bg-cyan-500/20 text-cyan-500 dark:text-cyan-300 font-semibold border border-cyan-500/50' : 'hover:bg-gray-200 dark:hover:bg-gray-700/50'}`}
                                >
                                    {item.abbreviation}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <main className="mt-6">
                    <ErrorBoundary>
                      {renderView()}
                    </ErrorBoundary>
                </main>
            </div>
        </div>
    );
};

export default App;
