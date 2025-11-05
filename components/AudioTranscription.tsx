import React, { useState, useRef, useEffect } from 'react';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { StopIcon } from './icons/StopIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface AudioTranscriptionProps {
  onSubmit: (audioBlob: Blob) => void;
  isLoading: boolean;
  transcriptionResult: string;
  error: string;
}

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
    </div>
);

export const AudioTranscription: React.FC<AudioTranscriptionProps> = ({
  onSubmit,
  isLoading,
  transcriptionResult,
  error,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onSubmit(audioBlob);
        audioChunksRef.current = [];
        // Clean up the stream tracks
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      // You could use the error prop to display a message to the user
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };
  
  return (
    <main className="mt-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3 text-glow-main-title">
          <MicrophoneIcon className="w-8 h-8 text-purple-400" />
          Kubernetics AI Audio Transcription
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Use your microphone to record audio and get a real-time transcription from the KR0M3D1A protocol, powered by Gemini 2.5 Flash's Kubernetics-integrated speech model.
        </p>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6 flex flex-col items-center">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording ? 'bg-red-500/20 border-4 border-red-500 animate-pulse' : 'bg-gray-700/50 border-2 border-gray-600'}`}>
            {!isRecording ? (
                <button
                    onClick={startRecording}
                    disabled={isLoading}
                    className="w-24 h-24 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center disabled:bg-gray-600"
                    aria-label="Start recording"
                >
                    <MicrophoneIcon className="w-12 h-12"/>
                </button>
            ) : (
                <button
                    onClick={stopRecording}
                    disabled={isLoading}
                    className="w-24 h-24 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
                    aria-label="Stop recording"
                >
                    <StopIcon className="w-10 h-10"/>
                </button>
            )}
        </div>
        <p className="mt-4 font-semibold text-lg text-gray-300">
            {isRecording ? 'Recording...' : 'Tap to Record'}
        </p>
      </div>
      
      {(isLoading || error || transcriptionResult) && (
        <div className="mt-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 animate-fade-in-right">
            <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-cyan-400" />
                Transcription Result
            </h3>
            <div className="text-gray-300 text-sm whitespace-pre-wrap">
                {isLoading && <LoadingSkeleton />}
                {error && <p className="text-red-400">{error}</p>}
                {transcriptionResult && <p className="italic">"{transcriptionResult}"</p>}
            </div>
        </div>
      )}
    </main>
  );
};