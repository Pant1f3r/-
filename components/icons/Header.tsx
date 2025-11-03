import React from 'react';
import { NeoIcon } from '../NeoIcon';
import { ThemeToggle } from '../ThemeToggle';
import { TitleHeader } from '../TitleHeader';

interface HeaderProps {
    currentTheme: 'light' | 'dark';
    onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTheme, onToggleTheme }) => {
  return (
    <header className="text-center relative">
      <div className="absolute top-0 right-0 z-10">
          <ThemeToggle theme={currentTheme} toggleTheme={onToggleTheme} />
      </div>
      <TitleHeader />
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <NeoIcon className="w-10 h-10 sm:w-12 sm:h-12 text-purple-500" />
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 break-words text-center">
          KR0M3D1A ©️®️™️ DEJA'VU {'{Digital-ARC}'}
        </h1>
      </div>
      <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-400">
        An advanced demonstrator for the KR0M3D1A protocol. Analyze digital threats using proprietary spythagorithms, test client-side guardrails, and participate in shaping AI safety rules under the DEJA' VU directive. Operating under an open-source license, funded by philanthropic directives.
      </p>
    </header>
  );
};