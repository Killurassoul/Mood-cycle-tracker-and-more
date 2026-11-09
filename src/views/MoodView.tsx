import React, { useState } from 'react';
import { DailyLog, MoodLog } from '../types';
import { formatDate } from '../services/cycleCalculator';
import {
  Heart,
  Smile,
  Frown,
  Zap,
  Sparkles,
  BookOpen,
  Save,
  CheckCircle2,
  Calendar,
  Lock
} from 'lucide-react';

interface MoodViewProps {
  todayLog: DailyLog;
  allLogs: Record<string, DailyLog>;
  onSaveLog: (log: DailyLog) => void;
}

const EMOTION_ITEMS = [
  { key: 'joy', label: 'Joie & Sérénité', icon: Smile, color: 'text-amber-500' },
  { key: 'energy', label: 'Énergie & Vitalité', icon: Zap, color: 'text-purple-500' },
  { key: 'motivation', label: 'Motivation & Entrain', icon: Sparkles, color: 'text-rose-500' },
  { key: 'confidence', label: 'Confiance en soi', icon: Heart, color: 'text-pink-500' },
  { key: 'stress', label: 'Niveau de stress', icon: ActivityIcon, color: 'text-amber-600' },
  { key: 'anxiety', label: 'Anxiété / Inquiétude', icon: Frown, color: 'text-orange-500' },
  { key: 'irritability', label: 'Irritabilité / Agacement', icon: Frown, color: 'text-red-500' },
  { key: 'sadness', label: 'Tristesse / Mélancolie', icon: Frown, color: 'text-sky-500' },
  { key: 'mentalFatigue', label: 'Fatigue mentale / Charge', icon: Zap, color: 'text-indigo-500' },
  { key: 'emotionalSensitivity', label: 'Sensibilité émotionnelle', icon: Heart, color: 'text-fuchsia-500' }
];

function ActivityIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" {...props}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

export const MoodView: React.FC<MoodViewProps> = ({ todayLog, allLogs, onSaveLog }) => {
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const currentLog = allLogs[selectedDate] || {
    date: selectedDate,
    flow: 'none',
    symptoms: [],
    painLocations: [],
    waterGlasses: 0,
    sleepHours: 7.5
  };

  const initialRatings = currentLog.mood?.ratings || {
    joy: 7,
    sadness: 1,
    stress: 2,
    anxiety: 1,
    irritability: 1,
    motivation: 7,
    energy: 7,
    confidence: 7,
    mentalFatigue: 3,
    emotionalSensitivity: 4
  };

  const [ratings, setRatings] = useState<Record<string, number>>(initialRatings);
  const [freeJournal, setFreeJournal] = useState<string>(currentLog.mood?.freeJournal || '');
  const [savedBanner, setSavedBanner] = useState<boolean>(false);

  const handleRatingChange = (key: string, value: number) => {
    setRatings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const updatedMoodLog: MoodLog = {
      primaryMood: ratings.joy >= 7 ? 'joy' : ratings.stress >= 7 ? 'stress' : 'calm',
      ratings: ratings as any,
      freeJournal
    };

    const updatedDaily: DailyLog = {
      ...currentLog,
      date: selectedDate,
      mood: updatedMoodLog
    };

    onSaveLog(updatedDaily);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  // Past journal entries
  const pastEntries = Object.values(allLogs)
    .filter(l => l.mood?.freeJournal && l.mood.freeJournal.trim().length > 0)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
            Mon humeur & Journal intime
          </h2>
          <p className="text-sm text-zinc-500">
            Écoute bienveillante de tes émotions sans jugement ni réduction hormonale
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={e => {
              setSelectedDate(e.target.value);
              const target = allLogs[e.target.value];
              if (target?.mood?.ratings) setRatings(target.mood.ratings);
              if (target?.mood?.freeJournal) setFreeJournal(target.mood.freeJournal);
            }}
            className="p-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 bg-white shadow-2xs"
          />
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all"
          >
            <Save className="w-4 h-4" /> Enregistrer mon journal
          </button>
        </div>
      </div>

      {savedBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Tes ressentis et tes écrits ont été enregistrés avec soin.
        </div>
      )}

      {/* Philosophy banner */}
      <div className="p-4 rounded-2xl bg-linear-to-r from-purple-50 to-rose-50 border border-purple-100 flex items-start gap-3 text-xs text-zinc-700">
        <Heart className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Notre engagement d'écoute :</strong> Toutes tes émotions sont légitimes. Elles ne sont pas de simples « caprices hormonaux » : tes contextes de vie, ton repos, tes projets et ton entourage comptent tout autant.
        </p>
      </div>

      {/* Grid: Emotion ratings (left) and Free journal (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Emotion scales (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-rose-100 pb-3">
            <h3 className="text-base font-bold text-zinc-900">
              Jauges émotionnelles (0 à 10)
            </h3>
            <span className="text-xs text-zinc-400">Pour le {selectedDate}</span>
          </div>

          <div className="space-y-4">
            {EMOTION_ITEMS.map(item => {
              const val = (ratings as any)[item.key] ?? 5;
              const Icon = item.icon;
              return (
                <div key={item.key} className="space-y-1 bg-zinc-50/50 p-3 rounded-2xl border border-zinc-100">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-2 text-zinc-800">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                      {item.label}
                    </span>
                    <span className="text-xs font-extrabold text-rose-600 bg-white px-2 py-0.5 rounded-md border border-rose-200 shadow-2xs">
                      {val} / 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={val}
                    onChange={e => handleRatingChange(item.key, parseInt(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Free Journal & Past Notes (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-rose-500" />
                Journal libre
              </h3>
              <span className="flex items-center gap-1 text-[11px] text-zinc-400 font-medium">
                <Lock className="w-3 h-3 text-emerald-500" /> Strictement privé
              </span>
            </div>

            <p className="text-xs text-zinc-500">
              Dépose ici tout ce que tu ressens sans filtre, sans limite de taille.
            </p>

            <textarea
              rows={8}
              value={freeJournal}
              onChange={e => setFreeJournal(e.target.value)}
              placeholder="Que s’est-il passé aujourd’hui ? Quelles pensées occupent ton esprit ? Qu’aimerais-tu te dire avec douceur ?"
              className="w-full p-4 rounded-2xl border border-rose-200 bg-rose-50/20 text-xs text-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-rose-400 leading-relaxed"
            />

            <button
              type="button"
              onClick={handleSave}
              className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all"
            >
              Enregistrer ce texte
            </button>
          </div>

          {/* Past reflections stream */}
          <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Derniers écrits conservés ({pastEntries.length})
            </h4>

            {pastEntries.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {pastEntries.slice(0, 5).map(entry => (
                  <div
                    key={entry.date}
                    onClick={() => {
                      setSelectedDate(entry.date);
                      if (entry.mood?.ratings) setRatings(entry.mood.ratings);
                      if (entry.mood?.freeJournal) setFreeJournal(entry.mood.freeJournal);
                    }}
                    className="p-3.5 rounded-2xl bg-zinc-50 hover:bg-rose-50/50 border border-zinc-200/70 transition-all cursor-pointer text-left"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-rose-700 mb-1">
                      <span>{entry.date}</span>
                      <span className="text-[10px] text-zinc-400">Cliquer pour charger</span>
                    </div>
                    <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed">
                      {entry.mood?.freeJournal}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-400 italic">
                Aucun écrit libre enregistré pour l’instant. Tes pensées écrites apparaîtront ici.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
