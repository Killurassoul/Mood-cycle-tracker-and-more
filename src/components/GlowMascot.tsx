import React from 'react';

interface GlowMascotProps {
  className?: string;
  size?: number;
  withFloatingHearts?: boolean;
}

export const GlowMascot: React.FC<GlowMascotProps> = ({
  className = '',
  size = 72,
  withFloatingHearts = true
}) => {
  return (
    <div className={`relative inline-block select-none ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <radialGradient id="mascotShine" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFF0F5" />
            <stop offset="25%" stopColor="#FFA6BE" />
            <stop offset="70%" stopColor="#FF6B93" />
            <stop offset="100%" stopColor="#F4436C" />
          </radialGradient>
          <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF3366" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FF3366" stopOpacity="0" />
          </radialGradient>
          <filter id="mascotGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#FF3366" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Floating tiny decorative hearts */}
        {withFloatingHearts && (
          <g>
            {/* Top Right Heart */}
            <path
              d="M 85 22 C 85 18 89 15 93 18 C 97 15 101 18 101 22 C 101 27 93 32 93 32 C 93 32 85 27 85 22 Z"
              fill="#FF6584"
              opacity="0.8"
              transform="scale(0.85) translate(10, -5)"
            />
            {/* Lower Right Outline Heart */}
            <path
              d="M 82 36 C 82 32 86 29 89 32 C 92 29 96 32 96 36 C 96 40 89 45 89 45 C 89 45 82 40 82 36 Z"
              stroke="#FF6584"
              strokeWidth="1.5"
              fill="none"
              opacity="0.7"
              transform="scale(0.7) translate(30, 10)"
            />
          </g>
        )}

        {/* Main Glossy Sphere */}
        <circle cx="50" cy="50" r="42" fill="url(#mascotShine)" filter="url(#mascotGlow)" />

        {/* 3D Top-Left Gloss Highlight */}
        <ellipse cx="34" cy="28" rx="14" ry="8" transform="rotate(-30 34 28)" fill="#FFFFFF" opacity="0.65" />
        <circle cx="24" cy="36" r="3.5" fill="#FFFFFF" opacity="0.5" />

        {/* Rosy Cheeks */}
        <circle cx="28" cy="56" r="8" fill="url(#blushGrad)" />
        <circle cx="72" cy="56" r="8" fill="url(#blushGrad)" />

        {/* Eyes (Happy Closed Arcs or Gentle Dots) */}
        <path
          d="M 33 46 Q 38 41 43 46"
          stroke="#7A1D36"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 57 46 Q 62 41 67 46"
          stroke="#7A1D36"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Smiling Mouth */}
        <path
          d="M 46 54 Q 50 59 54 54"
          stroke="#7A1D36"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
};
