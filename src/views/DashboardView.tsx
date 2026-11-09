import React, { useState } from 'react';
import {
  UserProfile,
  DailyLog,
  CycleCalculationResult,
  ReminderItem,
  SkincareProduct
} from '../types';
import { SunCloudIllustration } from '../components/SunCloudIllustration';
import { GlowMascot } from '../components/GlowMascot';
import { ProductThumbnail } from '../components/ProductThumbnails';
import { FloralGarden3D } from '../components/FloralGarden3D';
import { NavTabId } from '../components/Navbar';
import {
  Bell,
  Sun,
  Moon,
  ChevronRight,
  Heart,
  Droplet,
  Sparkles,
  Calendar,
  Activity,
  BookOpen,
  HelpCircle,
  PlusCircle,
  CheckCircle2
} from 'lucide-react';

interface DashboardViewProps {
  profile: UserProfile;
  stats: CycleCalculationResult;
  todayLog: DailyLog;
  reminders: ReminderItem[];
  morningRoutine: SkincareProduct[];
  nightRoutine: SkincareProduct[];
  onOpenLogModal: () => void;
  onSelectTab: (tab: NavTabId) => void;
  onQuickMoodSelect: (mood: string) => void;
  onQuickLogPeriodStart: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  stats,
  todayLog,
  reminders,
  morningRoutine,
  nightRoutine,
  onOpenLogModal,
  onSelectTab,
  onQuickMoodSelect,
  onQuickLogPeriodStart
}) => {
  const [activeTipIndex, setActiveTipIndex] = useState<number>(0);
  const [showCycleDetails, setShowCycleDetails] = useState<boolean>(true);

  const TIPS = [
    { text: "Don't forget sunscreen! It's the best anti-aging product ✨", sub: "Protection UV essentielle" },
    { text: "Hydrate ton corps avec au moins 1,5L d'eau pour booster ton glow naturel 💧", sub: "Élasticité & microbiote" },
    { text: "En phase lutéale, la niacinamide aide à prévenir les imperfections hormonales 🌸", sub: "Soin synchronisé au cycle" }
  ];

  const QUICK_MOODS = [
    { label: 'Je me sens bien', emoji: '🌸', color: 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200' },
    { label: 'Je suis fatiguée', emoji: '🌙', color: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-indigo-200' },
    { label: 'J’ai des douleurs', emoji: '🩹', color: 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200' },
    { label: 'Je suis stressée', emoji: '🌪️', color: 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200' },
    { label: 'Je me sens énergique', emoji: '✨', color: 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200' },
  ];

  return (
    <div className="space-y-6 max-w-xl mx-auto animate-in fade-in duration-300 pb-12">
      {/* 1. Header with Name & Cute Sun-Cloud Illustration (Exact visual layout from image) */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xl sm:text-2xl font-black text-zinc-900 block tracking-tight">
            Good morning,
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#FF5B84] block tracking-tight">
            {profile.name || 'Millie!'}
          </span>
          <span className="text-xs text-zinc-400 font-medium flex items-center gap-1 mt-0.5">
            Glow a little today <span className="text-amber-400">✨</span>
          </span>
        </div>

        {/* Adorable Smiling Sun + Fluffy Pink Cloud */}
        <SunCloudIllustration size={92} />
      </div>

      {/* 2. Hero Card: "Today's Skin Mood" / Glow & Cycle Card (Matching screenshot) */}
      <div className="relative overflow-hidden p-6 rounded-3xl bg-linear-to-r from-[#FF98B1] via-[#FF6E91] to-[#FF5479] text-white shadow-lg shadow-rose-200/60">
        <div className="flex items-center gap-4">
          {/* Glowing character avatar bubble on the left */}
          <div className="shrink-0 drop-shadow-md">
            <GlowMascot size={72} withFloatingHearts={false} />
          </div>

          <div className="space-y-1 min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-100/90 block">
              Today's Skin & Glow Mood
            </span>
            <h3 className="text-base sm:text-lg font-black tracking-tight leading-snug">
              Looking good!
            </h3>
            <p className="text-xs text-rose-50 leading-relaxed font-medium">
              Keep it up, your skin loves the care 💕
            </p>
          </div>
        </div>

        {/* White pill button: "Record Skin →" */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onOpenLogModal}
            className="px-5 py-2.5 rounded-full bg-white hover:bg-rose-50 text-[#FF5B84] text-xs font-black shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
          >
            <span>Record Skin</span>
            <span className="text-sm">→</span>
          </button>
        </div>
      </div>

      {/* 3. Daily Routine Section (Matching screenshot) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-zinc-900 tracking-tight">
            Daily Routine
          </h3>
          <button
            type="button"
            onClick={() => onSelectTab('routine')}
            className="text-xs text-[#FF5B84] hover:text-[#FF4370] font-bold"
          >
            Edit
          </button>
        </div>

        {/* Morning Routine Card */}
        <div
          onClick={() => onSelectTab('routine')}
          className="p-4 rounded-3xl bg-linear-to-r from-amber-50/70 via-rose-50/40 to-white border border-rose-100/80 hover:border-rose-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100/70 text-amber-500 flex items-center justify-center">
              <Sun className="w-5 h-5 fill-amber-100" />
            </div>
            <div>
              <span className="text-xs font-black text-zinc-900 block">Morning</span>
              <span className="text-[11px] text-zinc-400 font-medium">{morningRoutine.length} steps</span>
            </div>
          </div>

          {/* Product thumbnails preview */}
          <div className="flex items-center gap-1.5">
            {morningRoutine.slice(0, 3).map((item, idx) => (
              <ProductThumbnail key={idx} category={item.category} size={32} />
            ))}
          </div>

          <div className="w-7 h-7 rounded-full bg-rose-50 text-[#FF5B84] flex items-center justify-center group-hover:translate-x-1 transition-transform">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Night Routine Card */}
        <div
          onClick={() => onSelectTab('routine')}
          className="p-4 rounded-3xl bg-linear-to-r from-purple-50/70 via-pink-50/30 to-white border border-rose-100/80 hover:border-rose-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100/70 text-purple-600 flex items-center justify-center">
              <Moon className="w-5 h-5 fill-purple-100" />
            </div>
            <div>
              <span className="text-xs font-black text-zinc-900 block">Night</span>
              <span className="text-[11px] text-zinc-400 font-medium">{nightRoutine.length} steps</span>
            </div>
          </div>

          {/* Product thumbnails preview */}
          <div className="flex items-center gap-1.5">
            {nightRoutine.slice(0, 3).map((item, idx) => (
              <ProductThumbnail key={idx} category={item.category} size={32} />
            ))}
          </div>

          <div className="w-7 h-7 rounded-full bg-rose-50 text-[#FF5B84] flex items-center justify-center group-hover:translate-x-1 transition-transform">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 4. "Today's Tip" Card with carousel dots (Matching screenshot) */}
      <div className="space-y-3">
        <span className="text-xs font-extrabold text-zinc-900 block tracking-tight">
          Today's Tip
        </span>

        <div className="p-4 rounded-3xl bg-rose-50/80 border border-rose-200/70 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-white text-[#FF6584] flex items-center justify-center shrink-0 shadow-2xs">
            <Heart className="w-5 h-5 stroke-[#FF6584]" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-zinc-800 leading-snug">
              {TIPS[activeTipIndex].text}
            </p>
            <span className="text-[10px] text-rose-500 font-medium mt-0.5 block">
              {TIPS[activeTipIndex].sub}
            </span>
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center items-center gap-1.5 pt-1">
          {TIPS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveTipIndex(i)}
              className={`h-2 rounded-full transition-all ${
                activeTipIndex === i ? 'w-6 bg-[#FF6584]' : 'w-2 bg-rose-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 5. Interactive 3D Floral Garden Widget (Cycle & Hormone Sync) */}
      <FloralGarden3D
        stats={stats}
        onOpenLogModal={onOpenLogModal}
        onQuickLogPeriodStart={onQuickLogPeriodStart}
        className="w-full"
      />

      {/* Quick Feeling check-in */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-rose-100 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-zinc-900">
            Comment te sens-tu aujourd'hui ?
          </span>
          <span className="text-[11px] text-zinc-400 font-medium">Humeur & Énergie</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_MOODS.map(m => {
            const selected = todayLog.quickMood === m.label;
            return (
              <button
                key={m.label}
                type="button"
                onClick={() => onQuickMoodSelect(m.label)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  selected
                    ? 'bg-[#FF6584] text-white border-[#FF6584] shadow-xs scale-105'
                    : 'bg-rose-50/50 hover:bg-rose-50 text-zinc-700 border-rose-100'
                }`}
              >
                <span>{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Quick feature tiles */}
      <div className="grid grid-cols-4 gap-2.5">
        {[
          { label: 'Symptômes', icon: Activity, tab: 'body' as NavTabId, bg: 'bg-rose-50 text-rose-600' },
          { label: 'Calendrier', icon: Calendar, tab: 'cycle' as NavTabId, bg: 'bg-purple-50 text-purple-600' },
          { label: 'Conseillère', icon: HelpCircle, tab: 'normality' as NavTabId, bg: 'bg-amber-50 text-amber-600' },
          { label: 'Articles', icon: BookOpen, tab: 'encyclopedia' as NavTabId, bg: 'bg-sky-50 text-sky-600' },
        ].map(tile => {
          const Icon = tile.icon;
          return (
            <button
              key={tile.label}
              type="button"
              onClick={() => onSelectTab(tile.tab)}
              className="p-3 rounded-2xl bg-white border border-rose-100 hover:border-rose-300 shadow-2xs hover:shadow-xs transition-all flex flex-col items-center text-center group"
            >
              <div className={`p-2 rounded-xl mb-1.5 group-hover:scale-110 transition-transform ${tile.bg}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-zinc-800">{tile.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
