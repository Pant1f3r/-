import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../services/types';
import { RobotIcon } from './icons/RobotIcon';
import { UserIcon } from './icons/UserIcon';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';

interface ChatBotProps {
  history: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

const ChatMessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isModel = message.role === 'model';
  return (
    <div className={`flex items-start gap-3 ${isModel ? 'justify-start' : 'justify-end'}`}>
      {isModel && (
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50">
          <RobotIcon className="w-5 h-5 text-cyan-400" />
        </div>
      )}
      <div
        className={`max-w-md p-3 rounded-lg text-sm text-gray-200 ${
          isModel ? 'bg-gray-700/50' : 'bg-purple-600/50'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
       {!isModel && (
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/50">
          <UserIcon className="w-5 h-5 text-purple-400" />
        </div>
      )}
    </div>
  );
};

const TypingIndicator: React.FC = () => (
    <div className="flex items-start gap-3 justify-start">
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50">
          <RobotIcon className="w-5 h-5 text-cyan-400" />
        </div>
        <div className="max-w-md p-3 rounded-lg bg-gray-700/50 flex items-center space-x-1">
            <span className="text-gray-400 text-sm">Typing</span>
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
        </div>
    </div>
);


export const ChatBot: React.FC<ChatBotProps> = ({ history, isLoading, onSendMessage }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [history, isLoading]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
        handleSend();
    }
  };

  return (
    <main className="mt-8">
       <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3 text-glow-main-title">
                <RobotIcon className="w-8 h-8 text-cyan-500" />
                Kubernetics Lite Chat Assistant
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Engage in a direct conversation with the KR0M3D1A protocol's core Kubernetics AI, now powered by the `gemini-flash-lite-latest` model for rapid, low-latency responses.
            </p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-4 flex flex-col h-[70vh]">
            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                {history.map((msg, index) => (
                    <ChatMessageBubble key={index} message={msg} />
                ))}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="mt-4 border-t border-gray-700/50 pt-4">
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message here..."
                        disabled={isLoading}
                        className="w-full p-3 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 placeholder-gray-500 text-gray-200 disabled:opacity-50"
                        aria-label="Chat input"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-3 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                        aria-label="Send message"
                    >
                        <PaperAirplaneIcon className="w-6 h-6" />
                    </button>
                </div>
            </form>
        </div>
    </main>
  );
};