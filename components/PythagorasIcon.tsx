import React from 'react';

export const PythagorasIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    {/* Triangle with a class for animation targeting */}
    <path className="triangle-path" d="M20 80 L80 80 L20 30 Z" />
    
    {/* Dashed lines for squares (kept for context) */}
    <rect x="20" y="80" width="50" height="2" transform="rotate(-90 20 80)" strokeDasharray="2 2" strokeOpacity="0.5" />
    <rect x="20" y="80" width="60" height="2" strokeDasharray="2 2" strokeOpacity="0.5" />
    
    {/* Labels with a class for animation targeting */}
    <text x="45" y="90" fontSize="8" fill="currentColor" stroke="none" className="side-label">DATA</text>
    <text x="8" y="55" fontSize="8" fill="currentColor" stroke="none" className="side-label">FLUX</text>
    <text x="50" y="50" fontSize="8" fill="currentColor" stroke="none" transform="rotate(-55 50 50)" className="side-label">LOGIC</text>

    {/* Formula with a class for animation targeting */}
    <text x="30" y="20" fontSize="8" fill="currentColor" stroke="none" className="formula-text font-mono">spythagorithm</text>
  </svg>
);