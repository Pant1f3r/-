import React, { useState } from 'react';
import { CogIcon } from './icons/CogIcon';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { TrashIcon } from './icons/TrashIcon';
import { GuardrailConfig, PolicyLevel, Toast } from '../services/types';

interface GuardrailConfiguratorProps {
    addToast: (message: string, type: Toast['type'], duration?: number) => void;
}

export const GuardrailConfigurator: React.FC<GuardrailConfiguratorProps> = ({ addToast }) => {
    const [name, setName] = useState('New Guardrail');
    const [description, setDescription] = useState('');
    const [policyLevel, setPolicyLevel] = useState<PolicyLevel>('Block');
    const [keywords, setKeywords] = useState<string[]>([]);
    const [newKeyword, setNewKeyword] = useState('');

    const handleAddKeyword = () => {
        if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
            setKeywords([...keywords, newKeyword.trim()]);
            setNewKeyword('');
        }
    };

    const handleRemoveKeyword = (indexToRemove: number) => {
        setKeywords(keywords.filter((_, index) => index !== indexToRemove));
    };
    
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const config: GuardrailConfig = {
            name,
            description,
            policyLevel,
            keywords,
        };
        
        console.log('Saving Guardrail Configuration:', config);
        
        addToast(`Guardrail "${name}" configuration saved.`, 'success');
    };

    return (
        <main className="mt-8 space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3 text-glow-main-title">
                    <CogIcon className="w-8 h-8 text-cyan-400" />
                    Guardrail Configuration Editor
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Define and manage the behavior of individual guardrails within the KR0M3D1A protocol.
                </p>
            </div>

            <div className="max-w-4xl mx-auto bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6">
                <form onSubmit={handleSave} className="space-y-6">
                    {/* Guardrail Name */}
                    <div>
                        <label htmlFor="guardrail-name" className="block text-sm font-medium text-gray-300">Guardrail Name</label>
                        <input
                            type="text"
                            id="guardrail-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 w-full p-2 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                        <textarea
                            id="description"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 w-full p-2 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500"
                            placeholder="Explain the purpose and scope of this guardrail..."
                        />
                    </div>

                    {/* Policy Level */}
                    <div>
                        <label htmlFor="policy-level" className="block text-sm font-medium text-gray-300">Policy Level</label>
                        <select
                            id="policy-level"
                            value={policyLevel}
                            onChange={(e) => setPolicyLevel(e.target.value as PolicyLevel)}
                            className="mt-1 w-full p-2 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500"
                        >
                            <option value="Block">Block - Prevent the AI from responding</option>
                            <option value="Monitor">Monitor - Log the request but allow a response</option>
                            <option value="Allow">Allow - No action taken</option>
                        </select>
                    </div>

                    {/* Keywords */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Associated Keywords</label>
                        <div className="mt-2 flex gap-2">
                            <input
                                type="text"
                                value={newKeyword}
                                onChange={(e) => setNewKeyword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddKeyword();
                                    }
                                }}
                                className="flex-grow p-2 bg-gray-900/50 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500"
                                placeholder="Add a trigger keyword or phrase"
                            />
                            <button
                                type="button"
                                onClick={handleAddKeyword}
                                className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 flex items-center gap-2"
                            >
                                <PlusCircleIcon className="w-5 h-5"/> Add
                            </button>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {keywords.map((keyword, index) => (
                                <span key={index} className="flex items-center gap-2 bg-gray-700 text-gray-200 text-sm font-mono px-3 py-1 rounded-full">
                                    {keyword}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveKeyword(index)}
                                        className="text-gray-400 hover:text-red-400"
                                        aria-label={`Remove ${keyword}`}
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-6 border-t border-gray-700">
                        <button
                            type="submit"
                            className="w-full flex justify-center items-center py-3 text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600"
                        >
                            Save Configuration
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};
