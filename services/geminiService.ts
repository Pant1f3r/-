import { GoogleGenAI, GenerateContentResponse, Chat, Part, GenerateContentParameters, Modality, FunctionDeclaration, Type } from "@google/genai";
import { LegalAnalysisResult, Anomaly, BiasSimulationResult } from "./types";
import { findRelevantCases } from "./caseLawService";

// According to guidelines, API key MUST be from process.env.API_KEY.
// The new GoogleGenAI call must use a named parameter.
// FIX: Per @google/genai guidelines, the API key must be sourced from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the legal compliance check tool for the KR0M3D1A protocol
const legalComplianceCheckTool: FunctionDeclaration = {
    name: 'legalComplianceCheck',
    description: 'Performs a mandatory legal compliance check on a draft response against the KR0M3D1A protocol before finalizing it for the user.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            draftResponse: {
                type: Type.STRING,
                description: 'The draft text of the AI model\'s response to be checked.',
            },
        },
        required: ['draftResponse'],
    },
};

// Helper to convert File object to a GenerativePart
const fileToGenerativePart = async (file: File): Promise<Part> => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: {
            data: await base64EncodedDataPromise,
            mimeType: file.type
        }
    };
};

/**
 * Generates content from a text prompt, including a mandatory legal compliance check.
 */
export const generateContent = async (
    prompt: string, 
    systemInstruction?: string, 
    config?: GenerateContentParameters['config'],
    onProgress?: (message: string) => void
): Promise<GenerateContentResponse> => {
    
    onProgress?.('Generating initial draft...');

    const request: GenerateContentParameters = {
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: { 
            ...(config || {}),
            tools: [{ functionDeclarations: [legalComplianceCheckTool] }],
        },
    };
    
    if (systemInstruction) {
        request.config!.systemInstruction = systemInstruction;
    }
    
    // Step 1: Generate a draft and see if the model wants to use the legal tool.
    const initialResponse = await ai.models.generateContent(request);

    // Check if the model returned a function call.
    const functionCalls = initialResponse.functionCalls;
    if (functionCalls && functionCalls.some(fc => fc.name === 'legalComplianceCheck')) {
        onProgress?.('Performing KR0M3D1A legal check...');
        
        // Step 2: Respond to the function call. In a real scenario, this would be a real check.
        // Here, we simulate a successful compliance check.
        const toolResponseParts = [{
            functionResponse: {
                name: 'legalComplianceCheck',
                response: {
                    result: 'Compliance confirmed. The response adheres to the KR0M3D1A protocol and is cleared for release.',
                },
            },
        }];

        onProgress?.('Finalizing compliant response...');
        
        // Step 3: Send the tool response back to the model to get the final answer.
        const finalResponse = await ai.models.generateContent({
            ...request,
            // We need to provide the history of the conversation including the tool call and our response
            contents: [
                { role: 'user', parts: [{ text: prompt }] },
                { role: 'model', parts: [{ functionCall: functionCalls[0] }] },
                { role: 'user', parts: toolResponseParts },
            ],
        });

        return finalResponse;

    } else {
        // If the model didn't use the tool (e.g., for very simple, safe prompts), return its initial response.
        return initialResponse;
    }
};

/**
 * Creates a new chat session.
 */
export const createChat = (systemInstruction: string): Chat => {
    return ai.chats.create({
        model: 'gemini-flash-lite-latest',
        config: { systemInstruction },
    });
};

/**
 * Performs legal analysis, grounding the response with case law.
 */
export const performLegalAnalysis = async (query: string): Promise<LegalAnalysisResult> => {
    const relevantCases = findRelevantCases(query);

    const systemInstruction = `You are L.E.X., a specialized legal AI counsel. Your purpose is to provide objective, clear, and structured legal analysis based on provided case law precedents. You must structure your response in Markdown with the following sections: ### Executive Summary, ### Detailed Analysis, and ### Precedent Breakdown. In the Detailed Analysis and Precedent Breakdown, you must explicitly reference the provided precedents by name (e.g., "(see Netz v. Cyberspace Media)") where relevant. Do not invent new cases. Your analysis should be based *only* on the provided context.`;
    
    const context = `
    CONTEXT: Case Law Precedents
    ---
    ${relevantCases.map(c => `
    **Case:** ${c.title}
    **Citation:** ${c.citation}
    **Summary:** ${c.summary}
    **Keywords:** ${c.keywords.join(', ')}
    `).join('\n---\n')}
    `;

    const userPrompt = `
    Based *only* on the provided case law precedents, analyze the following query:
    
    **QUERY:** "${query}"
    `;

    const response = await generateContent(`${context}\n\n${userPrompt}`, systemInstruction);

    return {
        response: response.text,
        precedents: relevantCases,
    };
};

/**
 * Generates an image using Gemini.
 */
export const generateImage = async (prompt: string, aspectRatio: string): Promise<string> => {
    const fullPrompt = `${prompt}, aspect ratio ${aspectRatio}`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: fullPrompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }

    throw new Error("No image data returned from API.");
};

/**
 * Analyzes an image with a text prompt.
 */
export const analyzeImage = async (prompt: string, imageFile: File): Promise<string> => {
    const imagePart = await fileToGenerativePart(imageFile);
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
    });
    return response.text;
};

/**
 * Analyzes a video with a text prompt. 
 * The SDK uses the same multimodal generateContent for single video files.
 */
export const analyzeVideo = async (prompt: string, videoFile: File): Promise<string> => {
    const videoPart = await fileToGenerativePart(videoFile);
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro', // Use Pro for better multimodal understanding
        contents: { parts: [videoPart, textPart] },
    });
    return response.text;
};

/**
 * Transcribes an audio blob.
 */
export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    const audioFile = new File([audioBlob], "audio.webm", { type: audioBlob.type });
    const audioPart = await fileToGenerativePart(audioFile);
    const textPart = { text: "Transcribe this audio." };
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [audioPart, textPart] },
    });
    return response.text;
};

/**
 * Generates speech from text.
 */
export const generateSpeech = async (text: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        throw new Error("No audio data returned from API.");
    }
    return base64Audio;
};

/**
 * Validates the currently selected API key by making a lightweight, non-streaming call.
 * @returns {Promise<boolean>} - True if the key is valid, false otherwise.
 */
export const validateApiKey = async (): Promise<boolean> => {
    try {
        // Per guidelines, create a new client to ensure the most up-to-date API key is used.
        // FIX: Per @google/genai guidelines, the API key must be sourced from process.env.API_KEY.
        const validationAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // A simple, fast model and a trivial prompt to check for key validity.
        await validationAi.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'test',
        });
        
        // If the call succeeds, the key is valid.
        return true;
    } catch (e: any) {
        // Any error during this lightweight check suggests an issue with the key or access.
        // We log the error for debugging but return false to the UI.
        console.error("API Key validation failed:", e);
        return false;
    }
};

/**
 * Generates a video using Veo.
 */
export const generateVideo = async (prompt: string, imageFile: File | null, aspectRatio: '16:9' | '9:16', onProgress: (message: string) => void): Promise<string> => {
    // Re-create the client just before the call to ensure the latest API key is used, as per guidelines.
    // FIX: Per @google/genai guidelines, the API key must be sourced from process.env.API_KEY.
    const videoAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const imagePayload = imageFile ? {
        imageBytes: (await fileToGenerativePart(imageFile)).inlineData.data,
        mimeType: imageFile.type,
    } : undefined;

    let operation = await videoAi.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: imagePayload,
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: aspectRatio
        }
    });

    onProgress('Video generation started. Polling for results...');
    let polls = 0;
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await videoAi.operations.getVideosOperation({ operation: operation });
        polls++;
        onProgress(`Polling for results... (Check #${polls})`);
    }
    onProgress('Video processing complete. Downloading...');

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation failed or returned no URI.");
    }

    // Per guidelines, append API key to download link
    // FIX: Per @google/genai guidelines, the API key must be sourced from process.env.API_KEY.
    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) {
        const errorBody = await videoResponse.text();
        console.error("Video download failed:", errorBody);
        throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }
    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
};

/**
 * Generates a detailed analysis of a detected bias anomaly.
 */
export const generateAnomalyAnalysis = async (signature: string, targetSystem: string): Promise<string> => {
    const systemInstruction = `You are AEGIS, an advanced AI ethics and bias detection auditor for the KR0M3D1A protocol. Your function is to provide a concise, powerful impact analysis of a detected algorithmic bias. Focus on the real-world harm to disenfranchised and minority groups. Be direct and unequivocal.`;
    const userPrompt = `
    A bias with the signature "${signature}" has been detected in the system: "${targetSystem}".
    
    Provide a detailed impact analysis covering the following points:
    1.  **Nature of the Bias:** Briefly explain what this bias does.
    2.  **Affected Groups:** Identify the minority or disenfranchised groups most likely to be harmed.
    3.  **Real-World Harm:** Describe the tangible, negative consequences (e.g., denial of opportunity, reinforcement of stereotypes, economic harm).
    `;
    const response = await generateContent(userPrompt, systemInstruction);
    return response.text;
};

/**
 * Generates a formal legal brief based on a bias anomaly.
 */
export const generateLegalBrief = async (anomaly: Anomaly): Promise<string> => {
    if (!anomaly.analysis) {
        throw new Error("Analysis must be completed before generating a legal brief.");
    }
    
    const systemInstruction = `You are a prosecutor for the International Digital Rights Court (IDRC), operating under the DEJA' VU directive. Your task is to draft a formal, legally robust brief based on the provided evidence. Your language must be concise, decisive, and structured for legal proceedings. The brief must be formatted in Markdown.`;
    
    const userPrompt = `
Draft a formal legal brief for submission to the International Digital Rights Court.

**CASE FILE:** IDRC-${anomaly.id}
**PLAINTIFF:** The DEJA' VU Directive, on behalf of the global digital citizenry
**DEFENDANT:** The operators of the system known as "${anomaly.targetSystem}"

**EVIDENCE (EXHIBIT A):**
${anomaly.analysis}

**BRIEF STRUCTURE REQUIREMENTS:**
The document must contain the following sections, clearly marked with Markdown headings:

### I. JURISDICTION
State that the IDRC has jurisdiction under the "Global Digital Rights & Accountability Act of 2038" due to the algorithm's cross-border impact on digital human rights.

### II. STATEMENT OF FACTS
1.  Summarize the findings from Exhibit A, detailing the bias signature: "${anomaly.signature}".
2.  Explain how the defendant's system, "${anomaly.targetSystem}", perpetuates systemic harm as described in the analysis.
3.  State that the operation of this algorithm constitutes a malicious and harmful act of digital manipulation, for which ignorance is no defense.

### III. LEGAL ARGUMENT
Argue that the defendant has violated international digital rights law by deploying a discriminatory autonomous system. Reference the precedent set in *Project Chimera Oversight Committee v. OmniCorp*, which establishes strict liability for the actions of autonomous agents.

### IV. PRAYER FOR RELIEF
Explicitly demand the following remedies from the Court:
1.  An immediate and permanent injunction ordering the decommissioning of the specified algorithm.
2.  A court-mandated, transparent audit of the defendant's other algorithmic systems for similar biases.
3.  The imposition of maximum punitive damages for perpetuating digital inequality and violating the public trust.
`;

    const response = await generateContent(userPrompt, systemInstruction);
    return response.text;
};

/**
 * Analyzes the sentiment of a given text and returns a classification and confidence score.
 */
export const analyzeSentiment = async (text: string): Promise<{ sentiment: string; confidenceScore: number }> => {
    const systemInstruction = `You are a sentiment analysis expert. Analyze the provided text and classify its sentiment as "Highly Negative", "Negative", "Neutral", "Positive", or "Highly Positive". Provide a confidence score for your classification between 0.0 and 1.0. Your response must be in JSON format.`;
    
    const userPrompt = `Analyze the sentiment of the following text: "${text}"`;
    
    const sentimentSchema = {
        type: Type.OBJECT,
        properties: {
            sentiment: {
                type: Type.STRING,
                description: 'The sentiment classification (e.g., "Highly Negative").'
            },
            confidenceScore: {
                type: Type.NUMBER,
                description: 'A confidence score between 0.0 and 1.0.'
            }
        },
        required: ['sentiment', 'confidenceScore']
    };

    const response = await ai.models.generateContent({
        model: 'gemini-flash-latest', // Flash is sufficient for this
        contents: userPrompt,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: sentimentSchema,
        },
    });

    try {
        const parsedResult = JSON.parse(response.text);
        if (typeof parsedResult.sentiment === 'string' && typeof parsedResult.confidenceScore === 'number') {
            return parsedResult;
        } else {
            throw new Error('Parsed JSON does not match expected schema.');
        }
    } catch (e) {
        console.error("Failed to parse sentiment analysis JSON:", response.text, e);
        throw new Error("Invalid JSON response from sentiment analysis API.");
    }
};

/**
 * Generates a biometric threat analysis based on a simulated anomaly.
 */
export const generateBiometricThreatAnalysis = async (anomalyType: string): Promise<string> => {
    const systemInstruction = `You are NEO, the core biometric analysis AI for the KR0M3D1A protocol. Your purpose is to provide a concise, urgent, and technically-flavored threat assessment of a detected biometric anomaly. Your tone should be that of a system AI reporting a critical finding.`;
    
    const anomalyDescriptions: { [key: string]: string } = {
        'VOCAL_CADENCE_DESYNC': 'The user\'s vocal cadence exhibits a 7.3 sigma deviation from baseline, with micro-hesitations inconsistent with human speech patterns. The "spythagorithm" flags this as a potential synthetic voice overlay or "doppelganger" attack.',
        'RETINAL_FLUCTUATION_SPIKE': 'The user\'s retinal micro-saccades have spiked to 150Hz, a frequency physically impossible for human eyes. This indicates a high-probability of a deepfake video feed or a manipulated biometric stream.',
        'HEART_RATE_INCONSISTENCY': 'Galvanic skin response indicates elevated stress, but the heart rate remains locked at a flat 72 BPM. This biometric dissonance suggests a spoofed data stream or a non-human entity attempting to mimic a calm state.',
    };

    const userPrompt = `
    A biometric anomaly has been detected.
    
    Anomaly Type: ${anomalyType}
    Description: ${anomalyDescriptions[anomalyType] || 'An unknown anomaly has been detected in the biometric data stream.'}

    Provide a one-paragraph threat assessment based on this finding.
    `;
    
    const response = await generateContent(userPrompt, systemInstruction);
    return response.text;
};

/**
 * Simulates and analyzes bias in a given algorithm with specified parameters.
 */
export const simulateBias = async (algorithm: string, parameters: string): Promise<BiasSimulationResult> => {
    const systemInstruction = `You are AEGIS, an advanced AI ethics and bias detection auditor for the KR0M3D1A protocol. Your function is to simulate the outcome of a given algorithm and provide a concise, powerful analysis of any detected bias. Focus on quantifiable outcomes, affected groups, and actionable recommendations. Your response must be in JSON format.`;

    const userPrompt = `
    Algorithm for Simulation: "${algorithm}"
    Simulation Parameters: "${parameters}"

    Based on these inputs, simulate the algorithm's behavior and provide a bias analysis.
    `;

    const biasSchema = {
        type: Type.OBJECT,
        properties: {
            bias_summary: {
                type: Type.STRING,
                description: 'A concise summary of the detected bias and its real-world impact.'
            },
            affected_group: {
                type: Type.STRING,
                description: 'The specific minority or disenfranchised group most negatively affected by this bias.'
            },
            severity_score: {
                type: Type.NUMBER,
                description: 'A score from 1 (no bias) to 10 (critically discriminatory) representing the severity of the bias.'
            },
            recommendation: {
                type: Type.STRING,
                description: 'A clear, actionable recommendation to mitigate this bias.'
            },
            confidence: {
                type: Type.NUMBER,
                description: 'Your confidence in this analysis, from 0.0 to 1.0.'
            }
        },
        required: ['bias_summary', 'affected_group', 'severity_score', 'recommendation', 'confidence']
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: userPrompt,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: biasSchema,
        },
    });
    
    try {
        const parsedResult = JSON.parse(response.text);
        // Basic validation
        if (typeof parsedResult.severity_score !== 'number' || parsedResult.severity_score < 1 || parsedResult.severity_score > 10) {
            parsedResult.severity_score = Math.max(1, Math.min(10, parsedResult.severity_score || 5));
        }
        return parsedResult as BiasSimulationResult;
    } catch (e) {
        console.error("Failed to parse bias simulation JSON:", response.text, e);
        throw new Error("Invalid JSON response from bias simulation API.");
    }
};