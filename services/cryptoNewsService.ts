
import { CryptoNewsItem } from './types';

const headlines = [
    { category: 'Market', text: 'BTC breaks $100k resistance level amid institutional influx.' },
    { category: 'Regulation', text: 'US Senate proposes new bill for stablecoin regulation.' },
    { category: 'Security', text: 'Decentralized exchange "QuantumSwap" exploited for $50M.' },
    { category: 'Tech', text: 'New zero-knowledge proof implementation promises full on-chain privacy.' },
    { category: 'Market', text: 'Ethereum gas fees spike following popular NFT mint.' },
    { category: 'Security', text: 'Report: State-sponsored actors targeting crypto wallets with new malware.' },
    { category: 'Tech', text: 'Layer-2 solution "Velocity" announces mainnet launch, promising 100k TPS.'},
    { category: 'Regulation', text: 'European Central Bank publishes paper on Digital Euro prospects.'},
    { category: 'Market', text: 'Altcoin season in full swing as retail interest surges.'},
] as const;

const sources = ['CoinTelegraph', 'Decrypt', 'The Block', 'Reuters Crypto', 'WSJ Digital Assets', 'CryptoSlate'];

/**
 * Simulates fetching a new, random crypto news item.
 * @returns A new `CryptoNewsItem`.
 */
export const fetchRandomNewsItem = (): CryptoNewsItem => {
    const newHeadline = headlines[Math.floor(Math.random() * headlines.length)];
    const newSource = sources[Math.floor(Math.random() * sources.length)];

    return {
        id: Date.now(),
        headline: newHeadline.text,
        category: newHeadline.category,
        source: newSource,
    };
};