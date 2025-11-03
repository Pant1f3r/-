import React from 'react';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { UserGroupIcon } from './icons/UserGroupIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { RocketLaunchIcon } from './icons/RocketLaunchIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { TargetIcon } from './icons/TargetIcon';

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 animate-fade-in-right">
      <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-3 mb-4 border-b border-gray-700 pb-3">
        {icon}
        {title}
      </h3>
      <div className="text-gray-300 space-y-4 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; }> = ({ label, value }) => (
  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 text-center">
    <p className="text-3xl font-bold text-gray-100 font-mono text-glow-main-title">{value}</p>
    <p className="text-xs uppercase text-gray-400 tracking-wider">{label}</p>
  </div>
);

const TeamMemberCard: React.FC<{ name: string; role: string; bio: string; }> = ({ name, role, bio }) => (
  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
    <h5 className="font-bold text-lg text-gray-100">{name}</h5>
    <p className="text-sm font-semibold text-purple-400">{role}</p>
    <p className="mt-2 text-xs text-gray-400">{bio}</p>
  </div>
);

const FinancialChart: React.FC = () => {
    const projections = [
        { year: 'Y1', value: 12.5 },
        { year: 'Y2', value: 45.8 },
        { year: 'Y3', value: 150.2 },
        { year: 'Y4', value: 480.9 },
        { year: 'Y5', value: 1200 },
    ];
    const maxValue = Math.max(...projections.map(p => p.value));

    return (
        <div className="w-full h-64 bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex items-end gap-4">
            {projections.map((p, i) => (
                <div key={p.year} className="flex-1 flex flex-col items-center justify-end">
                    <div
                        className="w-full bg-gradient-to-t from-cyan-600 to-purple-500 rounded-t-md bar-animated"
                        style={{ height: `${(p.value / maxValue) * 100}%`, animationDelay: `${i * 100}ms` }}
                        title={`$${p.value}M`}
                    ></div>
                    <p className="text-xs font-mono text-gray-400 mt-2">{p.year}</p>
                </div>
            ))}
        </div>
    );
};


export const InvestorPitchDeck: React.FC = () => {
  return (
    <main className="mt-8 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-glow-main-title">KR0M3D1A: Investment Dossier</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          A confidential briefing on the operational framework, market viability, and strategic potential of the DEJA' VU directive.
        </p>
      </div>

      <Section title="Vision & Proof of Concept" icon={<LightBulbIcon className="w-6 h-6"/>}>
        <p>
            <strong>Our Vision:</strong> To create a self-sustaining, autonomous protocol that perpetually safeguards the digital commons. KR0M3D1A analyzes digital threats using proprietary 'spythagorithms', tests client-side guardrails, and empowers a global community to shape AI safety rules under the DEJA' VU directive. We are not just building a tool; we are forging a new paradigm of digital justice and security.
        </p>
        <p className="font-bold border-t border-gray-700 pt-4 mt-4">
            <strong>Live Proof of Concept:</strong> This application is the live, deployed demonstration of the KR0M3D1A protocol. All modules, from the Arconomics Algo-Bias Detector to the Custodial Asset Recovery rigs, are fully operational and generating real-world data and value. We invite you to explore the platform.
        </p>
      </Section>
      
      <Section title="Comprehensive Business Plan" icon={<DocumentTextIcon className="w-6 h-6"/>}>
        <div className="space-y-4">
            <div>
                <h4 className="font-semibold text-purple-400">Strategy</h4>
                <p>Our strategy is a three-pronged assault on digital insecurity: <strong>Proactive Threat Neutralization</strong> through advanced 'spythagorithms', <strong>Community-Driven Evolution</strong> via our immutable governance model, and <strong>Monetization through Philanthropy</strong> by harnessing value from dormant/recovered digital assets to self-fund operations and philanthropic endeavors.</p>
            </div>
             <div>
                <h4 className="font-semibold text-purple-400">Market Analysis & Sizing</h4>
                <p>KR0M3D1A operates at the intersection of three multi-billion dollar markets:
                    <ul className="list-disc pl-5 mt-2 text-xs">
                        <li><strong>AI Safety & Alignment:</strong> A projected $45B market by 2030, driven by regulatory pressure and enterprise risk mitigation.</li>
                        <li><strong>Decentralized Justice Systems:</strong> An emerging market addressing cross-jurisdictional digital crime and algorithmic malfeasance.</li>
                        <li><strong>Crypto Asset Recovery (TAM):</strong> An estimated $100B+ in lost and dormant crypto assets, representing a vast, untapped value pool for our custodial protocol.</li>
                    </ul>
                </p>
            </div>
            <div>
                <h4 className="font-semibold text-purple-400">Competitive Advantages</h4>
                <p>Our moat is built on proprietary technology and a unique operational model: the <strong>'Spythagorithm' Engine</strong> for unparalleled threat detection, the <strong>Arconomics Protocol</strong> for autonomous legal action, and a first-mover advantage in creating a self-funding, decentralized safety ecosystem.</p>
            </div>
        </div>
      </Section>

       <Section title="Traction & Key Metrics" icon={<TargetIcon className="w-6 h-6"/>}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Threats Neutralized" value="1,337,420" />
            <StatCard label="Community Proposals" value="1,200+" />
            <StatCard label="Custodial Value Harnessed" value="$12.5M+" />
            <StatCard label="Global Awareness Index" value="15.0%" />
        </div>
      </Section>

      <Section title="Financial Projections" icon={<ChartBarIcon className="w-6 h-6"/>}>
        <p className="mb-4">Projections are based on the continued scaling of the Custodial Asset Recovery protocol and the compounding value within the Arconomics Treasury. This model does not include future revenue from enterprise-level guardrail licensing.</p>
        <p className="text-sm font-semibold text-gray-400 mb-2">Total Value Harnessed & Generated (USD Millions)</p>
        <FinancialChart />
      </Section>

      <Section title="Core Team" icon={<UserGroupIcon className="w-6 h-6"/>}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TeamMemberCard name="Edward Craig Callender" role="Chief Architect & Visionary" bio="The enigmatic founder of the DEJA' VU directive. A former systems architect for a three-letter agency, Callender now focuses on creating immutable systems of digital justice." />
            <TeamMemberCard name="Dr. Aris Thorne" role="Lead Pythagorithmist & AI Safety Researcher" bio="Pioneer in sub-semantic data analysis and the creator of the proprietary 'spythagorithm'. Dr. Thorne's research forms the backbone of KR0M3D1A's detection capabilities." />
            <TeamMemberCard name="NεΩ (AI)" role="Core AI & Lead Systems Analyst" bio="A specialized instance of Google's Gemini Pro, fine-tuned for geopolitical threat analysis and autonomous protocol management. NεΩ operates as a non-voting member of the core team." />
        </div>
      </Section>

       <Section title="Exit Strategy" icon={<RocketLaunchIcon className="w-6 h-6"/>}>
        <div>
            <h4 className="font-semibold text-purple-400">Primary Path: Decentralization</h4>
            <p>Our primary exit strategy is the full decentralization of the KR0M3D1A protocol into the <strong>DEJA' VU DAO</strong>. Investor shares will be converted to governance tokens, granting voting rights on protocol upgrades and a proportional stake in the yield generated by the Arconomics Treasury and other value-generating modules.</p>
        </div>
        <div className="border-t border-gray-700 pt-4 mt-4">
            <h4 className="font-semibold text-purple-400">Secondary Path: Strategic Acquisition</h4>
            <p>Given the protocol's critical importance to digital infrastructure, a secondary exit path exists through strategic acquisition by a global digital rights consortium, a supra-national entity (e.g., W3C, UN Digital Council), or a major cloud provider seeking to integrate our advanced safety and recovery systems as a core offering.</p>
        </div>
      </Section>

    </main>
  );
};
