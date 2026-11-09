import React from 'react';
import { PainZone } from '../types';

interface BodySilhouetteProps {
  selectedZones: PainZone[];
  onToggleZone: (zone: PainZone) => void;
  className?: string;
}

interface ZoneMeta {
  id: PainZone;
  label: string;
  description: string;
  color: string;
}

const ZONES: ZoneMeta[] = [
  { id: 'head', label: 'Tête & Nuque', description: 'Migraines, céphalées, fatigue oculaire', color: '#D96574' },
  { id: 'breasts', label: 'Poitrine & Seins', description: 'Tension mammaire, sensibilité, mastodynie', color: '#E58B94' },
  { id: 'abdomen', label: 'Bas-Ventre', description: 'Crampes menstruelles, spasmes utérins', color: '#BA3D4E' },
  { id: 'pelvis', label: 'Bassin & Pelvis', description: 'Pincements ovulatoires, lourdeurs pelviennes', color: '#9C63CE' },
  { id: 'lower_back', label: 'Bas du dos', description: 'Lombalgies, tiraillements rénaux', color: '#7E43B3' },
  { id: 'legs', label: 'Jambes & Cuisses', description: 'Lourdeurs, rétention d’eau, crampes', color: '#C89EE6' }
];

export const BodySilhouette: React.FC<BodySilhouetteProps> = ({
  selectedZones,
  onToggleZone,
  className = ''
}) => {
  const isSelected = (zone: PainZone) => selectedZones.includes(zone);

  return (
    <div className={`flex flex-col md:flex-row items-center gap-6 p-4 rounded-3xl bg-linear-to-b from-rose-50/70 to-purple-50/40 border border-rose-100/80 shadow-xs ${className}`}>
      {/* SVG Interactive Silhouette */}
      <div className="relative w-56 h-88 shrink-0 flex items-center justify-center bg-white/70 rounded-2xl p-2 border border-rose-100">
        <svg viewBox="0 0 200 400" className="w-full h-full drop-shadow-sm select-none">
          <defs>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Neutral body background silhouette outline */}
          <g fill="#F5EBEB" stroke="#E3D1D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Silhouette contour silhouette */}
            {/* Head */}
            <path d="M 100 20 C 85 20 80 32 80 50 C 80 68 88 80 100 80 C 112 80 120 68 120 50 C 120 32 115 20 100 20 Z" />
            {/* Neck */}
            <path d="M 93 80 L 93 94 L 107 94 L 107 80 Z" />
            {/* Shoulders & Torso */}
            <path d="M 93 94 C 75 96 55 106 48 125 C 44 136 42 165 40 195 C 38 215 36 240 35 255 C 35 258 40 262 44 260 C 50 255 52 235 55 210 L 60 170 C 65 190 70 215 72 235 L 75 245 C 75 255 76 290 74 330 C 72 360 70 385 78 388 C 84 390 88 385 90 360 L 96 280 L 100 250 L 104 280 L 110 360 C 112 385 116 390 122 388 C 130 385 128 360 126 330 C 124 290 125 255 125 245 L 128 235 C 130 215 135 190 140 170 L 145 210 C 148 235 150 255 156 260 C 160 262 165 258 165 255 C 164 240 162 215 160 195 C 158 165 156 136 152 125 C 145 106 125 96 107 94 Z" />
          </g>

          {/* Interactive Clickable Zones */}
          {/* 1. Head Zone */}
          <g
            onClick={() => onToggleZone('head')}
            className="cursor-pointer transition-all duration-200"
          >
            <circle
              cx="100"
              cy="50"
              r="24"
              fill={isSelected('head') ? '#D96574' : 'rgba(217, 101, 116, 0.15)'}
              stroke="#D96574"
              strokeWidth={isSelected('head') ? '3' : '1.5'}
              strokeDasharray={isSelected('head') ? 'none' : '4 2'}
              className="hover:scale-105 origin-center transition-transform"
            />
            <text x="100" y="54" textAnchor="middle" fontSize="10" fontWeight="bold" fill={isSelected('head') ? '#ffffff' : '#BA3D4E'}>
              Tête
            </text>
          </g>

          {/* 2. Breasts Zone */}
          <g
            onClick={() => onToggleZone('breasts')}
            className="cursor-pointer transition-all duration-200"
          >
            <path
              d="M 72 135 C 72 122 88 122 88 135 C 88 148 72 148 72 135 Z"
              fill={isSelected('breasts') ? '#E58B94' : 'rgba(229, 139, 148, 0.2)'}
              stroke="#E58B94"
              strokeWidth={isSelected('breasts') ? '2.5' : '1.5'}
            />
            <path
              d="M 112 135 C 112 122 128 122 128 135 C 128 148 112 148 112 135 Z"
              fill={isSelected('breasts') ? '#E58B94' : 'rgba(229, 139, 148, 0.2)'}
              stroke="#E58B94"
              strokeWidth={isSelected('breasts') ? '2.5' : '1.5'}
            />
            <text x="100" y="138" textAnchor="middle" fontSize="9" fontWeight="bold" fill={isSelected('breasts') ? '#9B2C3B' : '#BA3D4E'}>
              Seins
            </text>
          </g>

          {/* 3. Abdomen (Bas-ventre) Zone */}
          <g
            onClick={() => onToggleZone('abdomen')}
            className="cursor-pointer transition-all duration-200"
          >
            <ellipse
              cx="100"
              cy="185"
              rx="26"
              ry="18"
              fill={isSelected('abdomen') ? '#BA3D4E' : 'rgba(186, 61, 78, 0.15)'}
              stroke="#BA3D4E"
              strokeWidth={isSelected('abdomen') ? '3' : '1.5'}
              strokeDasharray={isSelected('abdomen') ? 'none' : '3 2'}
              className="hover:scale-105 origin-center transition-transform"
            />
            <text x="100" y="189" textAnchor="middle" fontSize="10" fontWeight="bold" fill={isSelected('abdomen') ? '#ffffff' : '#BA3D4E'}>
              Ventre
            </text>
          </g>

          {/* 4. Pelvis Zone */}
          <g
            onClick={() => onToggleZone('pelvis')}
            className="cursor-pointer transition-all duration-200"
          >
            <path
              d="M 78 215 C 80 205 120 205 122 215 C 125 230 100 240 100 240 C 100 240 75 230 78 215 Z"
              fill={isSelected('pelvis') ? '#9C63CE' : 'rgba(156, 99, 206, 0.2)'}
              stroke="#9C63CE"
              strokeWidth={isSelected('pelvis') ? '3' : '1.5'}
              className="hover:scale-105 origin-center transition-transform"
            />
            <text x="100" y="224" textAnchor="middle" fontSize="9" fontWeight="bold" fill={isSelected('pelvis') ? '#ffffff' : '#7E43B3'}>
              Pelvis
            </text>
          </g>

          {/* 5. Lower Back Zone (Button indicator on side) */}
          <g
            onClick={() => onToggleZone('lower_back')}
            className="cursor-pointer transition-all duration-200"
          >
            <rect
              x="135"
              y="172"
              width="54"
              height="24"
              rx="12"
              fill={isSelected('lower_back') ? '#7E43B3' : '#F3E8F9'}
              stroke="#7E43B3"
              strokeWidth="1.5"
            />
            <text x="162" y="188" textAnchor="middle" fontSize="9" fontWeight="600" fill={isSelected('lower_back') ? '#ffffff' : '#7E43B3'}>
              Dos/Reins
            </text>
            <line x1="126" y1="184" x2="135" y2="184" stroke="#7E43B3" strokeWidth="1.5" strokeDasharray="2 2" />
          </g>

          {/* 6. Legs / Thighs Zone */}
          <g
            onClick={() => onToggleZone('legs')}
            className="cursor-pointer transition-all duration-200"
          >
            <path
              d="M 76 255 L 94 255 L 90 325 L 75 325 Z"
              fill={isSelected('legs') ? '#C89EE6' : 'rgba(200, 158, 230, 0.2)'}
              stroke="#9C63CE"
              strokeWidth={isSelected('legs') ? '2.5' : '1'}
            />
            <path
              d="M 106 255 L 124 255 L 125 325 L 110 325 Z"
              fill={isSelected('legs') ? '#C89EE6' : 'rgba(200, 158, 230, 0.2)'}
              stroke="#9C63CE"
              strokeWidth={isSelected('legs') ? '2.5' : '1'}
            />
            <text x="100" y="295" textAnchor="middle" fontSize="9" fontWeight="bold" fill={isSelected('legs') ? '#ffffff' : '#7E43B3'}>
              Jambes
            </text>
          </g>
        </svg>

        <span className="absolute bottom-2 text-[10px] text-zinc-400 font-medium tracking-wide">
          Touchez une zone pour la cibler
        </span>
      </div>

      {/* Interactive Zone Buttons with detailed descriptions */}
      <div className="flex-1 w-full space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900/70 mb-2">
          Localisations anatomiques ciblées :
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ZONES.map(z => {
            const active = isSelected(z.id);
            return (
              <button
                key={z.id}
                type="button"
                onClick={() => onToggleZone(z.id)}
                className={`flex items-start gap-3 p-3 text-left rounded-2xl transition-all duration-200 border ${
                  active
                    ? 'bg-rose-500 text-white border-rose-600 shadow-sm scale-[1.01]'
                    : 'bg-white/80 hover:bg-rose-50/50 text-zinc-700 border-rose-100 hover:border-rose-200'
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 mt-0.5 rounded-full shrink-0 border-2 transition-all ${
                    active ? 'bg-white border-white' : 'border-rose-300 bg-transparent'
                  }`}
                />
                <div className="min-w-0">
                  <div className={`text-sm font-semibold leading-snug ${active ? 'text-white' : 'text-zinc-800'}`}>
                    {z.label}
                  </div>
                  <div className={`text-xs mt-0.5 line-clamp-1 ${active ? 'text-rose-100' : 'text-zinc-500'}`}>
                    {z.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {selectedZones.length > 0 && (
          <div className="mt-3 p-2.5 bg-rose-100/60 rounded-xl text-xs text-rose-800 flex items-center justify-between">
            <span>
              <strong>{selectedZones.length}</strong> zone(s) sélectionnée(s)
            </span>
            <button
              type="button"
              onClick={() => selectedZones.forEach(z => onToggleZone(z))}
              className="text-rose-600 hover:text-rose-800 underline font-medium text-[11px]"
            >
              Tout désélectionner
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
