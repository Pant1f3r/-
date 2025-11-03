
import React, { useState, useEffect, useRef } from 'react';
import { SpeakerWaveIcon } from './icons/SpeakerWaveIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface TextToSpeechProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
  audioResult: string | null;
  error: string;
}

// Helper functions from Gemini API documentation for audio decoding (as seen in Live API docs)
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const LoadingSkeleton: React.FC = () => (
    <div className="flex items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-t-cyan-400 border-gray-600 rounded-full animate-spin"></div>
        <p className="ml-4 font-semibold text-gray-400">Synthesizing audio...</p>
    </div>
);

export const TextToSpeech: React.FC<TextToSpeechProps> = ({
  onSubmit,
  isLoading,
  audioResult,
  error,
}) => {
  const [text, setText] = useState('Hello, this is a demonstration of the KR0M3D1A Text-to-Speech protocol.');
  const audioContextRef = useRef<AudioContext | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  useEffect(() => {
    // Create AudioContext on the first user interaction (button click handles this)
    // or when the component mounts if it's already allowed.
    if (!audioContextRef.current) {
       // @ts-ignore - webkitAudioContext is for safari compatibility
       const AudioContext = window.AudioContext || window.webkitAudioContext;
       if(AudioContext) {
           audioContextRef.current = new AudioContext({ sampleRate: 24000 });
       }
    }
  }, []);

  const playAudio = async (base64Audio: string) => {
    if (!audioContextRef.current) {
        console.error("AudioContext not initialized.");
        return;
    }
    try {
        const audioData = decode(base64Audio);
        const buffer = await decodeAudioData(audioData, audioContextRef.current, 24000, 1);
        setAudioBuffer(buffer); // Save buffer for replay
        
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.start();
    } catch (e) {
        console.error("Failed to decode or play audio:", e);
    }
  };

  const handleReplay = () => {
    if (audioBuffer && audioContextRef.current) {
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.start();
    }
  };

  useEffect(() => {
    if (audioResult) {
      playAudio(audioResult);
    }
  }, [audioResult]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
    }
  };
  
  return (
    <main className="mt-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3">
          <SpeakerWaveIcon className="w-8 h-8 text-purple-400" />
          Text-to-Speech Synthesis
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Convert text into lifelike speech using Gemini. Enter your text below to generate and listen to the audio output.
        </p>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="tts-text" className="block text-sm font-medium text-gray-300 mb-2">
                    Enter text to synthesize
                </label>
                <textarea
                    id="tts-text"
                    rows={5}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={isLoading}
                    className="w-full p-3 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 placeholder-gray-500 text-gray-200"
                    placeholder="Type or paste the text you want to hear..."
                />
            </div>
            
            <button
                type="submit"
                disabled={isLoading || !text.trim()}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? 'Generating...' : 'Generate Speech'}
            </button>
        </form>
      </div>
      
      {(isLoading || error || audioResult) && (
        <div className="mt-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 animate-fade-in-right">
            <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-cyan-400" />
                Audio Output
            </h3>
            <div className="text-gray-300 text-sm">
                {isLoading && <LoadingSkeleton />}
                {error && <p className="text-red-400">{error}</p>}
                {audioResult && !isLoading && (
                   <div className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-lg">
                        <button onClick={handleReplay} className="p-3 bg-cyan-600 hover:bg-cyan-700 rounded-full text-white">
                            <SpeakerWaveIcon className="w-6 h-6"/>
                        </button>
                        <div>
                            <p className="font-semibold">Speech generated successfully.</p>
                            <p className="text-xs text-gray-400">Click the button to play the audio again.</p>
                        </div>
                   </div>
                )}
            </div>
        </div>
      )}
    </main>
  );
};
