import React, { useState, useEffect } from 'react';
import { KeyIcon } from './icons/KeyIcon';
import { ClipboardDocumentIcon } from './icons/ClipboardDocumentIcon';
import { ArrowDownTrayIcon } from './icons/ArrowDownTrayIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

export const SshKeyGenerator: React.FC = () => {
    // Form State
    const [keyType, setKeyType] = useState<'ED25519' | 'RSA'>('ED25519');
    const [bitLength, setBitLength] = useState<number>(4096);
    const [comment, setComment] = useState('KR0M3D1A-Directive-Key');
    const [permissions, setPermissions] = useState<'600' | '644'>('600');
    const [errors, setErrors] = useState<{ bitLength?: string }>({});

    // Component State
    const [publicKey, setPublicKey] = useState<string | null>(null);
    const [privateKeyContent, setPrivateKeyContent] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [validationResult, setValidationResult] = useState<{ valid: boolean; message: string } | null>(null);

    // Helper to convert ArrayBuffer to a URL-safe Base64 string
    const bufferToBase64 = (buffer: ArrayBuffer): string => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        bytes.forEach((byte) => binary += String.fromCharCode(byte));
        return window.btoa(binary)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    };
    
    const runValidation = (pubKey: string, privKey: string, perms: string, type: 'ED25519' | 'RSA') => {
        setIsValidating(true);
        setTimeout(() => {
            let isValid = true;
            let message = '';

            if (!pubKey.startsWith(`ssh-${type.toLowerCase()}`)) {
                 isValid = false;
                 message = 'Public key format is invalid. Key type does not match expected format.';
            } else if (!privKey.includes('-----BEGIN OPENSSH PRIVATE KEY-----') || !privKey.includes('-----END OPENSSH PRIVATE KEY-----')) {
                isValid = false;
                message = 'Private key is malformed. Missing standard PEM headers.';
            } else if (perms === '644') {
                isValid = false;
                message = 'Permissions are insecure. Private key is world-readable (644). Standard SSH clients will reject this key.';
            } else {
                isValid = true;
                message = 'Validation passed. Key format and permissions are compliant with common SSH client standards.';
            }
            
            setValidationResult({ valid: isValid, message });
            setIsValidating(false);
        }, 1000);
    };

    const handleGenerate = (e?: React.FormEvent) => {
        e?.preventDefault();
        
        // Reset states
        setIsGenerating(true);
        setPublicKey(null);
        setPrivateKeyContent(null);
        setCopySuccess(false);
        setValidationResult(null);
        setErrors({});

        // Form validation
        const newErrors: { bitLength?: string } = {};
        if (keyType === 'RSA' && (isNaN(bitLength) || bitLength < 2048)) {
            newErrors.bitLength = 'For security, RSA bit length must be at least 2048.';
        }
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length > 0) {
            setIsGenerating(false);
            return;
        }

        // Generation simulation
        setTimeout(() => {
            const finalComment = comment.trim() || 'KROM3DIA-Directive-Key';
            let newPublicKey = '';
            let newPrivateKey = '';
            
            const randomBytes = new Uint8Array(256);
            window.crypto.getRandomValues(randomBytes);
            const secureRandomString = bufferToBase64(randomBytes.buffer);

            if (keyType === 'ED25519') {
                newPublicKey = `ssh-ed25519-SIMULATED AAAAC3NzaC1lZDI1NTE5AAAAI${secureRandomString} ${finalComment}`;
                newPrivateKey = `### WARNING: DEMONSTRATION KEY - NOT SECURE ###\n\n-----BEGIN OPENSSH PRIVATE KEY-----\n${btoa(`ED25519_SIMULATED_KEY_${secureRandomString}`)}\n-----END OPENSSH PRIVATE KEY-----\n\n### WARNING: DO NOT USE THIS KEY FOR ANY REAL APPLICATION ###`;
            } else { // RSA
                newPublicKey = `ssh-rsa-SIMULATED AAAAB3NzaC1yc2EAAAADAQABAAACAQD${secureRandomString} ${finalComment}`;
                newPrivateKey = `### WARNING: DEMONSTRATION KEY - NOT SECURE ###\n\n-----BEGIN OPENSSH PRIVATE KEY-----\n${btoa(`RSA_SIMULATED_KEY_B${bitLength}_${secureRandomString}`)}\n-----END OPENSSH PRIVATE KEY-----\n\n### WARNING: DO NOT USE THIS KEY FOR ANY REAL APPLICATION ###`;
            }

            setPublicKey(newPublicKey);
            setPrivateKeyContent(newPrivateKey);
            setIsGenerating(false);

            // Trigger validation
            runValidation(newPublicKey, newPrivateKey, permissions, keyType);

        }, 1500);
    };

    useEffect(() => {
        handleGenerate();
    }, []);


    const handleCopy = () => {
        if (!publicKey) return;
        navigator.clipboard.writeText(publicKey).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    const handleDownload = () => {
        if (!privateKeyContent) return;
        const blob = new Blob([privateKeyContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = keyType === 'RSA' ? 'krom3dia_id_rsa_SIMULATED' : 'krom3dia_id_ed25519_SIMULATED';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <main className="mt-8 space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3">
                    <KeyIcon className="w-8 h-8 text-yellow-400" />
                    Secure Access Key Generator
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Generate a new SSH key pair for secure, encrypted access to KR0M3D1A protocol systems and sandboxed environments.
                </p>
            </div>
            
             <div className="bg-red-900/30 border-l-4 border-red-500 text-red-200 p-4 rounded-md animate-fade-in-right" role="alert">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-lg font-bold text-red-300">SECURITY WARNING: DEMONSTRATION ONLY</h3>
                        <div className="mt-2 text-sm text-red-200">
                            <p>
                                This component is a **simulation** for demonstrative purposes. The keys generated here are **NOT cryptographically secure** and provide no real-world security.
                            </p>
                            <p className="font-bold mt-2">
                                DO NOT use these keys for any real application, server, or service.
                            </p>
                            <p className="mt-2">
                                For genuine SSH keys, use a standard, trusted tool like <code className="bg-black/30 px-1.5 py-0.5 rounded-md font-mono">ssh-keygen</code> on your local machine.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6">
                <form onSubmit={handleGenerate} className="space-y-6 max-w-2xl mx-auto">
                    <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">Key Parameters</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="key-type" className="block text-sm font-medium text-gray-300">Key Type</label>
                            <select
                                id="key-type"
                                value={keyType}
                                onChange={(e) => setKeyType(e.target.value as 'ED25519' | 'RSA')}
                                disabled={isGenerating}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-900/50 border-gray-600 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md"
                            >
                                <option>ED25519</option>
                                <option>RSA</option>
                            </select>
                        </div>
                        {keyType === 'RSA' && (
                             <div className="animate-fade-in-right">
                                <label htmlFor="bit-length" className="block text-sm font-medium text-gray-300">Bit Length</label>
                                <select
                                    id="bit-length"
                                    value={bitLength}
                                    onChange={(e) => setBitLength(parseInt(e.target.value, 10))}
                                    disabled={isGenerating}
                                    className={`mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-900/50 border-gray-600 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md`}
                                >
                                    <option value={2048}>2048</option>
                                    <option value={3072}>3072</option>
                                    <option value={4096}>4096 (Recommended)</option>
                                </select>
                                {errors.bitLength && <p className="mt-1 text-xs text-red-400">{errors.bitLength}</p>}
                            </div>
                        )}
                    </div>
                     <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-300">Comment (Optional)</label>
                        <input
                            type="text"
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={isGenerating}
                            placeholder="e.g., your-email@example.com"
                            className="mt-1 block w-full pl-3 pr-3 py-2 text-base bg-gray-900/50 border-gray-600 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Private Key Permissions</label>
                        <fieldset className="mt-2">
                            <legend className="sr-only">Private Key Permissions</legend>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                    <input
                                        id="perm-600"
                                        name="permissions"
                                        type="radio"
                                        value="600"
                                        checked={permissions === '600'}
                                        onChange={() => setPermissions('600')}
                                        disabled={isGenerating}
                                        className="h-4 w-4 text-cyan-600 bg-gray-700 border-gray-500 focus:ring-cyan-500"
                                    />
                                    <label htmlFor="perm-600" className="ml-2 block text-sm text-gray-300">
                                        600 <span className="text-gray-400">(Secure - Recommended)</span>
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="perm-644"
                                        name="permissions"
                                        type="radio"
                                        value="644"
                                        checked={permissions === '644'}
                                        onChange={() => setPermissions('644')}
                                        disabled={isGenerating}
                                        className="h-4 w-4 text-cyan-600 bg-gray-700 border-gray-500 focus:ring-cyan-500"
                                    />
                                    <label htmlFor="perm-644" className="ml-2 block text-sm text-gray-300">
                                        644 <span className="text-gray-400">(Permissive)</span>
                                    </label>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isGenerating}
                        className="w-full flex justify-center items-center py-3 text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600"
                    >
                        {isGenerating ? (
                            <div className="w-5 h-5 border-2 border-t-white border-gray-400 rounded-full animate-spin mr-2"></div>
                        ) : (
                            <KeyIcon className="w-5 h-5 mr-2" />
                        )}
                        {isGenerating ? 'Generating Simulated Keys...' : 'Generate Demo Key Pair'}
                    </button>
                    {isGenerating && (
                        <p className="text-sm text-yellow-400 text-center animate-pulse">Establishing quantum-resistant cryptographic parameters...</p>
                    )}
                </form>
            </div>
            
            {(isValidating || validationResult) && (
                <div className="mt-6 animate-fade-in-right max-w-4xl mx-auto">
                    <h3 className="text-lg font-semibold text-gray-200 mb-2">Key Validation</h3>
                    {isValidating ? (
                         <div className="text-center p-4 bg-gray-900/50 rounded-md border border-gray-700">
                            <div className="flex items-center justify-center text-cyan-400">
                                <div className="w-5 h-5 border-2 border-t-cyan-400 border-gray-600 rounded-full animate-spin mr-2"></div>
                                <span>Validating key pair against SSH client standards...</span>
                            </div>
                        </div>
                    ) : validationResult && (
                        <div className={`p-4 rounded-md flex items-start gap-3 ${validationResult.valid ? 'bg-green-900/30 border-green-500/50' : 'bg-red-900/30 border-red-500/50'} border`}>
                            <div className="flex-shrink-0 mt-0.5">
                                {validationResult.valid ? <CheckCircleIcon className="w-6 h-6 text-green-400"/> : <ExclamationTriangleIcon className="w-6 h-6 text-red-400"/>}
                            </div>
                            <div>
                                <h4 className={`font-bold ${validationResult.valid ? 'text-green-300' : 'text-red-300'}`}>
                                    {validationResult.valid ? 'Validation Successful' : 'Validation Failed'}
                                </h4>
                                <p className={`text-sm ${validationResult.valid ? 'text-gray-300' : 'text-red-200'}`}>{validationResult.message}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {publicKey && privateKeyContent && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-right">
                        {/* Public Key */}
                        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-200 mb-3">Simulated Public Key</h3>
                            <p className="text-xs text-gray-400 mb-2">This is an example of what a real public key looks like.</p>
                            <textarea
                                readOnly
                                value={publicKey || ''}
                                className="w-full h-32 p-3 bg-black/50 font-mono text-sm border border-gray-600 rounded-md resize-none text-gray-300"
                            />
                            <button
                                onClick={handleCopy}
                                className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700"
                            >
                                <ClipboardDocumentIcon className="w-5 h-5" />
                                {copySuccess ? 'Copied!' : 'Copy Public Key'}
                            </button>
                        </div>
                        {/* Private Key */}
                        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-red-400 mb-3">Simulated Private Key</h3>
                             <p className="text-xs text-red-400 mb-2">
                                <strong>Security Warning:</strong> This is a fake key for demonstration. A real private key must be kept secret.
                            </p>
                            <textarea
                                readOnly
                                value={"-----BEGIN OPENSSH PRIVATE KEY-----\n... (Simulated private content is hidden) ...\n... (Click 'Download' to see the full demo file) ...\n-----END OPENSSH PRIVATE KEY-----"}
                                className="w-full h-32 p-3 bg-black/50 font-mono text-sm border border-gray-600 rounded-md resize-none text-gray-400"
                            />
                            <button
                                onClick={handleDownload}
                                className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                            >
                                <ArrowDownTrayIcon className="w-5 h-5" />
                                Download Simulated Private Key
                            </button>
                        </div>
                    </div>
                    {/* Security Advisory */}
                    <div className="bg-yellow-900/20 border-l-4 border-yellow-500 text-yellow-200 p-4 rounded-md animate-fade-in-right">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-lg font-bold text-yellow-300">Actionable Security Instructions for REAL Keys</h3>
                                <div className="mt-2 text-sm text-yellow-200 space-y-4">
                                    <p className="font-bold text-base">When you generate a REAL key using <code className="bg-black/30 px-1 rounded">ssh-keygen</code>, you must protect your private key.</p>
                                    <ul className="list-disc pl-5 space-y-3">
                                        <li>
                                            <strong>Secure Storage:</strong> Store the private key file in a dedicated, access-restricted directory like <code className="bg-black/30 px-1 rounded">~/.ssh/</code> on Linux/macOS. For maximum security, use a password manager or a hardware security key (e.g., YubiKey).
                                        </li>
                                        <li>
                                            <strong>Set Permissions:</strong> You MUST restrict file permissions to prevent other users on your system from reading the key. Use this command in your terminal for your REAL key:
                                            <pre className="bg-black/50 p-2 rounded-md mt-1 text-white font-mono text-xs"><code>chmod {permissions} /path/to/your/real_private_key</code></pre>
                                        </li>
                                        <li>
                                            <strong>Permission Details:</strong> The selected permission <strong>({permissions})</strong> is critical.
                                            <ul className="list-['-_'] pl-5 mt-1 text-xs">
                                                <li><code className="bg-black/30 px-1 rounded">600</code>: Only the file owner can read and write. This is <strong>required by most SSH clients</strong> for private keys.</li>
                                                <li><code className="bg-black/30 px-1 rounded">644</code>: The owner can read/write, while others can only read. This is <strong>highly insecure</strong> for a private key.</li>
                                            </ul>
                                        </li>
                                        <li><strong>Usage:</strong> When using SSH, you can specify this key with the <code className="bg-black/30 px-1 rounded">-i</code> flag, for example: <code className="bg-black/30 px-1 rounded">ssh -i ~/.ssh/id_ed25519 user@host</code>.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </main>
    );
};