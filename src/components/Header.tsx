import React from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  Globe,
  Flower2
} from 'lucide-react';
import { AppLanguage, TextSize, UserProfile } from '../types';

interface HeaderProps {
  profile: UserProfile;
  lang: AppLanguage;
  onChangeLang: (lang: AppLanguage) => void;
  textSize: TextSize;
  onChangeTextSize: (size: TextSize) => void;
  onToggleDiscreteMode: () => void;
  onLockNow: () => void;
  onOpenProfile: () => void;
  onOpenFloralOnboarding: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  lang,
  onChangeLang,
  textSize,
  onChangeTextSize,
  onToggleDiscreteMode,
  onLockNow,
  onOpenProfile,
  onOpenFloralOnboarding
}) => {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8 py-3 bg-white/90 backdrop-blur-md border-b border-rose-200/70 transition-colors">
      {/* Left: Gentle greeting & reassurance */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 group text-left cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-linear-to-tr from-[#FF7A9C] to-[#FF4370] p-0.5 shadow-xs group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-black text-[#FF5B84]">
              {profile.name ? profile.name.charAt(0).toUpperCase() : 'M'}
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-extrabold text-zinc-900 flex items-center gap-1">
              <span>{profile.name || 'Mood'}</span>
            </div>
            <div className="text-[10px] text-zinc-400 font-medium">
              {profile.discreteMode ? 'Mode privé' : 'Santé & Éclat'}
            </div>
          </div>
        </button>
      </div>

      {/* Right Controls: 3D Floral Inscription, Discreet Mode, Font Scale, Language, Lock */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* 3D Floral Inscription CTA button */}
        <button
          type="button"
          onClick={onOpenFloralOnboarding}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-linear-to-r from-rose-100 to-pink-100 text-[#FF4370] hover:bg-rose-200 border border-rose-300/80 shadow-2xs transition-all hover:scale-105 active:scale-95"
          title="Ouvrir l'animation 3D florale d'inscription"
        >
          <Flower2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Fleurs 3D</span>
        </button>

        {/* Discreet Mode Toggle */}
        <button
          type="button"
          onClick={onToggleDiscreteMode}
          title={profile.discreteMode ? 'Désactiver le mode discret' : 'Activer le mode discret'}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            profile.discreteMode
              ? 'bg-amber-100 text-amber-800 border border-amber-300'
              : 'bg-rose-50 text-zinc-700 hover:bg-rose-100 border border-rose-200/80'
          }`}
        >
          {profile.discreteMode ? <EyeOff className="w-3.5 h-3.5 text-amber-600" /> : <Eye className="w-3.5 h-3.5 text-rose-500" />}
          <span className="hidden md:inline text-[11px]">
            {profile.discreteMode ? 'Discret ON' : 'Discret'}
          </span>
        </button>

        {/* Text size selector button */}
        <div className="hidden sm:flex items-center bg-rose-50 rounded-full p-0.5 border border-rose-200/80 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => onChangeTextSize('normal')}
            className={`px-2 py-1 rounded-full ${textSize === 'normal' ? 'bg-white shadow-2xs text-[#FF5B84]' : 'text-zinc-500'}`}
            title="Texte standard"
          >
            A
          </button>
          <button
            type="button"
            onClick={() => onChangeTextSize('large')}
            className={`px-2 py-1 rounded-full text-xs ${textSize === 'large' ? 'bg-white shadow-2xs text-[#FF5B84]' : 'text-zinc-500'}`}
            title="Texte grand"
          >
            A+
          </button>
        </div>

        {/* Language selector */}
        <div className="relative flex items-center">
          <select
            value={lang}
            onChange={e => onChangeLang(e.target.value as AppLanguage)}
            className="appearance-none bg-rose-50 text-zinc-700 text-xs font-bold pl-6 pr-3 py-1.5 rounded-full border border-rose-200/80 focus:outline-hidden cursor-pointer"
          >
            <option value="fr">FR</option>
            <option value="en">EN</option>
            <option value="wo">WO</option>
          </select>
          <Globe className="w-3.5 h-3.5 text-zinc-400 absolute left-2 pointer-events-none" />
        </div>

        {/* Quick lock button (if PIN enabled) */}
        {profile.isPinEnabled && (
          <button
            type="button"
            onClick={onLockNow}
            className="p-2 rounded-full bg-rose-50 text-[#FF5B84] hover:bg-rose-100 transition-colors border border-rose-200"
            title="Verrouiller l'application immédiatement"
          >
            <Lock className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
