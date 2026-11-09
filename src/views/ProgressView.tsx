import React, { useState } from 'react';
import { SkinProgressData, SkinConcern } from '../types';
import { GlowMascot } from '../components/GlowMascot';
import {
  Calendar,
  Flame,
  Heart,
  TrendingDown,
  Sparkles,
  Edit2,
  Check,
  Plus
} from 'lucide-react';

interface ProgressViewProps {
  progressData: SkinProgressData;
  onUpdateProgress: (data: SkinProgressData) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ progressData, onUpdateProgress }) => {
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'year'>('week');
  const [showEditConcerns, setShowEditConcerns] = useState<boolean>(false);
  const [concerns, setConcerns] = useState<SkinConcern[]>(progressData.concerns);

  const handleUpdateConcernPercent = (id: string, delta: number) => {
    const updated = concerns.map(c =>
      c.id === id ? { ...c, improvementPercentage: Math.max(5, Math.min(100, c.improvementPercentage + delta)) } : c
    );
    setConcerns(updated);
    onUpdateProgress({ ...progressData, concerns: updated });
  };

  // Generate SVG curve points for the weekly scores
  const scores = progressData.weeklyScores;
  const minScore = 70;
  const maxScore = 90;
  const svgWidth = 280;
  const svgHeight = 70;

  const points = scores.map((pt, i) => {
    const x = 20 + (i / (scores.length - 1)) * (svgWidth - 40);
    const normalizedY = (pt.score - minScore) / (maxScore - minScore);
    const y = svgHeight - 15 - normalizedY * (svgHeight - 30);
    return { x, y, day: pt.day, score: pt.score };
  });

  const pathD = points.reduce((acc, curr, i) => {
    if (i === 0) return `M ${curr.x} ${curr.y}`;
    // Bezier curve smoothing
    const prev = points[i - 1];
    const cpX1 = prev.x + (curr.x - prev.x) / 2;
    const cpX2 = prev.x + (curr.x - prev.x) / 2;
    return `${acc} C ${cpX1} ${prev.y}, ${cpX2} ${curr.y}, ${curr.x} ${curr.y}`;
  }, '');

  return (
    <div className="space-y-6 max-w-xl mx-auto animate-in fade-in duration-300 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">
            My Progress
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Let's see your glow up! ✨
          </p>
        </div>

        <button
          type="button"
          className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200/60 text-[#FF6584] flex items-center justify-center shadow-2xs hover:bg-rose-100 transition-colors"
        >
          <Calendar className="w-5 h-5" />
        </button>
      </div>

      {/* Week / Month / Year Filter Pills (Matching screenshot) */}
      <div className="p-1 rounded-full bg-rose-100/60 flex items-center gap-1">
        <button
          type="button"
          onClick={() => setTimeFilter('week')}
          className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all text-center ${
            timeFilter === 'week'
              ? 'bg-[#FF6584] text-white shadow-md shadow-rose-300/60'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          Week
        </button>
        <button
          type="button"
          onClick={() => setTimeFilter('month')}
          className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all text-center ${
            timeFilter === 'month'
              ? 'bg-[#FF6584] text-white shadow-md shadow-rose-300/60'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          Month
        </button>
        <button
          type="button"
          onClick={() => setTimeFilter('year')}
          className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all text-center ${
            timeFilter === 'year'
              ? 'bg-[#FF6584] text-white shadow-md shadow-rose-300/60'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          Year
        </button>
      </div>

      {/* Skin Score Card (Matching screenshot) */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-zinc-800 block">
          Skin Score
        </span>

        <div className="p-5 rounded-3xl bg-linear-to-b from-rose-100/70 via-pink-50/80 to-white border border-rose-200/70 shadow-xs relative overflow-hidden">
          {/* Top part: Score & Mascot */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-5xl font-black text-[#FF5B84] tracking-tight">
                {progressData.score}
              </div>
              <div className="mt-1">
                <span className="text-xs font-extrabold text-zinc-900 block">
                  Great!
                </span>
                <span className="text-[11px] text-zinc-500 font-medium">
                  Your skin is happy and healthy 💕
                </span>
              </div>
            </div>

            {/* Glowing Mascot Character with floating hearts */}
            <div className="pr-1">
              <GlowMascot size={74} withFloatingHearts={true} />
            </div>
          </div>

          {/* Smooth curved chart (Mon to Sun) */}
          <div className="pt-2">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-20 overflow-visible">
              <path
                d={pathD}
                fill="none"
                stroke="#FF6584"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="drop-shadow-xs"
              />
              {/* Dots on line */}
              {points.map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r={i === points.length - 1 ? 5 : 3}
                  fill={i === points.length - 1 ? '#FF4370' : '#FFFFFF'}
                  stroke="#FF6584"
                  strokeWidth="2"
                />
              ))}
            </svg>

            {/* Days row below line */}
            <div className="flex justify-between items-center text-[11px] font-semibold text-zinc-400 px-1 pt-1">
              {scores.map((s, idx) => {
                const isSunday = idx === scores.length - 1;
                return (
                  <span
                    key={s.day}
                    className={`px-2 py-0.5 rounded-full transition-all ${
                      isSunday
                        ? 'bg-[#FF6584] text-white font-bold shadow-2xs'
                        : 'text-zinc-500'
                    }`}
                  >
                    {s.day}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Skin Concerns Section (Matching screenshot) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-800">
            Skin Concerns
          </span>
          <button
            type="button"
            onClick={() => setShowEditConcerns(!showEditConcerns)}
            className="text-xs text-[#FF6584] hover:text-[#FF4370] font-bold"
          >
            {showEditConcerns ? 'Done' : 'Edit'}
          </button>
        </div>

        <div className="space-y-2">
          {concerns.map(item => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-white border border-rose-100/80 shadow-2xs flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {/* Cute pastel pink circular icon */}
                <div className="w-8 h-8 rounded-full bg-rose-100/70 text-[#FF6584] flex items-center justify-center font-bold text-xs">
                  {item.name === 'Acne' ? '🌸' : item.name === 'Dark Spots' ? '✨' : '💖'}
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-900 block">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium">
                    Improving
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {showEditConcerns && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleUpdateConcernPercent(item.id, -5)}
                      className="w-5 h-5 rounded-md bg-zinc-100 text-zinc-600 font-bold flex items-center justify-center text-xs"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateConcernPercent(item.id, 5)}
                      className="w-5 h-5 rounded-md bg-zinc-100 text-zinc-600 font-bold flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                  </div>
                )}
                {/* Green badge: ↓ 40% */}
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-extrabold flex items-center gap-1">
                  ↓ {item.improvementPercentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Streak Section (Matching screenshot) */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-zinc-800 block">
          Streak
        </span>

        <div className="p-4 rounded-3xl bg-linear-to-r from-rose-100/80 via-pink-50 to-rose-100/60 border border-rose-200/70 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-rose-200/60 flex items-center justify-center text-lg">
              🔥
            </div>
            <div>
              <div className="text-xs font-black text-zinc-900">
                <span className="text-base text-[#FF5B84] mr-1">{progressData.streakDays}</span>
                days in a row!
              </div>
              <p className="text-[11px] text-zinc-500 font-medium mt-0.5">
                You're doing amazing 🔥
              </p>
            </div>
          </div>

          {/* Cute outlined heart sparkle */}
          <div className="w-10 h-10 rounded-full bg-white/70 border border-rose-200 flex items-center justify-center text-[#FF6584]">
            <Heart className="w-5 h-5 fill-rose-100 stroke-[#FF6584]" />
          </div>
        </div>
      </div>
    </div>
  );
};
