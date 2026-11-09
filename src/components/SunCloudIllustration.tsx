import React from 'react';

interface SunCloudProps {
  className?: string;
  size?: number;
}

export const SunCloudIllustration: React.FC<SunCloudProps> = ({ className = '', size = 80 }) => {
  return (
    <div className={`relative inline-block select-none ${className}`} style={{ width: size, height: size * 0.75 }}>
      <svg
        viewBox="0 0 120 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <defs>
          <linearGradient id="sunGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="100%" stopColor="#FFA940" />
          </linearGradient>
          <linearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFCCD5" />
            <stop offset="100%" stopColor="#FFA6B9" />
          </linearGradient>
          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#FF6B8B" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Sun Behind Cloud */}
        <g transform="translate(18, -4)">
          {/* Sun Rays */}
          <g stroke="#FFD666" strokeWidth="3" strokeLinecap="round">
            <line x1="60" y1="12" x2="60" y2="4" />
            <line x1="78" y1="19" x2="84" y2="13" />
            <line x1="42" y1="19" x2="36" y2="13" />
            <line x1="86" y1="36" x2="94" y2="36" />
            <line x1="34" y1="36" x2="26" y2="36" />
          </g>

          {/* Sun Circle */}
          <circle cx="60" cy="36" r="22" fill="url(#sunGrad)" filter="url(#softShadow)" />

          {/* Sun Smiling Face */}
          <circle cx="53" cy="33" r="2.2" fill="#8C4A00" />
          <circle cx="67" cy="33" r="2.2" fill="#8C4A00" />
          <ellipse cx="50" cy="37" rx="2.5" ry="1.5" fill="#FF7875" opacity="0.6" />
          <ellipse cx="70" cy="37" rx="2.5" ry="1.5" fill="#FF7875" opacity="0.6" />
          {/* Gentle Smile */}
          <path d="M 56 39 Q 60 43 64 39" stroke="#8C4A00" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </g>

        {/* Fluffy Pink Cloud in Front */}
        <g filter="url(#softShadow)">
          {/* Cloud Puffs */}
          <path
            d="M 32 72 
               C 22 72 14 64 14 54 
               C 14 45 21 38 30 38 
               C 33 26 45 18 58 18 
               C 70 18 80 25 84 35 
               C 92 34 100 41 102 50 
               C 106 53 108 58 108 63 
               C 108 72 100 78 90 78 
               L 32 78 Z"
            fill="url(#cloudGrad)"
          />
          {/* Subtle Cloud Highlight */}
          <path
            d="M 32 42 C 34 32 44 24 56 24 C 64 24 72 28 76 35"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.5"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
};
