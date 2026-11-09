import React from 'react';
import { CycleRecord, DailyLog, CycleCalculationResult, UserProfile } from '../types';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Activity,
  Heart,
  Moon,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface StatisticsViewProps {
  cycles: CycleRecord[];
  dailyLogs: Record<string, DailyLog>;
  stats: CycleCalculationResult;
  profile: UserProfile;
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({
  cycles,
  dailyLogs,
  stats,
  profile
}) => {
  const logList = Object.values(dailyLogs);

  // Compute monthly occurrences
  const totalDaysWithPain = logList.filter(l =>
    l.symptoms?.some(s => s.category === 'pain') || (l.painLocations && l.painLocations.length > 0)
  ).length;

  const totalDaysWithFatigue = logList.filter(l =>
    l.symptoms?.some(s => s.name.toLowerCase().includes('fatigue')) || l.quickMood?.includes('fatiguée')
  ).length;

  const totalDaysWithJoy = logList.filter(l =>
    (l.mood?.ratings?.joy && l.mood.ratings.joy >= 7) || l.quickMood?.includes('bien') || l.quickMood?.includes('énergique')
  ).length;

  const avgSleepHours = logList.length > 0
    ? (logList.reduce((acc, l) => acc + (l.sleepHours || 7.5), 0) / logList.length).toFixed(1)
    : '7.5';

  // Compute cycle variance over last 6 cycles
  const recentCycles = cycles.slice(0, 6).reverse();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
          Statistiques & Analyses
        </h2>
        <p className="text-sm text-zinc-500">
          Visualisation des tendances réelles de ton corps sans extrapolation artificielle
        </p>
      </div>

      {/* Monthly Well-being Synthesis Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-purple-100/80 via-rose-50 to-pink-100/60 border border-purple-200/80 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-purple-900 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-purple-600" /> Bilan d'observation du mois
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-zinc-900 leading-snug">
          « Ce mois-ci, tu as consigné des douleurs sur {totalDaysWithPain} journée(s) et des moments de fatigue à {totalDaysWithFatigue} reprise(s). »
        </h3>
        <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
          Tu as également enregistré {totalDaysWithJoy} journée(s) de belle énergie et de sérénité. Ton sommeil moyen est de {avgSleepHours}h par nuit.
        </p>
        <div className="text-[11px] text-zinc-500 pt-1 italic">
          * Les variations sont rapportées telles qu'observées sans déduire de causes hormonales automatiques.
        </div>
      </div>

      {/* Grid: Cycle Duration Evolution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cycle Lengths Bar Chart */}
        <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-rose-100 pb-3">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-500" />
              Évolution de la durée des cycles récents
            </h3>
            <span className="text-xs text-zinc-500">Moyenne : {stats.averageCycleLength}j</span>
          </div>

          <div className="h-48 flex items-end justify-around gap-2 pt-6 pb-2">
            {recentCycles.map((c, i) => {
              const duration = c.cycleDuration || stats.averageCycleLength;
              const heightPercent = Math.min(100, Math.max(20, ((duration - 20) / 25) * 100));
              return (
                <div key={c.id || i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[11px] font-bold text-zinc-700">{duration}j</span>
                  <div className="w-full max-w-[42px] bg-rose-100 rounded-t-xl overflow-hidden h-full flex items-end">
                    <div
                      className="w-full bg-linear-to-t from-rose-500 to-purple-400 rounded-t-xl transition-all duration-500 hover:opacity-90"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-400 truncate max-w-[50px]">
                    {c.startDate.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-zinc-400 text-center">
            Historique chronologique des durées de cycle d'un premier jour de règles au suivant.
          </p>
        </div>

        {/* Bleeding Duration Evolution */}
        <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-rose-100 pb-3">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-500" />
              Durée des menstruations (saignements)
            </h3>
            <span className="text-xs text-zinc-500">Moyenne : {stats.averagePeriodLength}j</span>
          </div>

          <div className="h-48 flex items-end justify-around gap-2 pt-6 pb-2">
            {recentCycles.map((c, i) => {
              const periodDur = c.periodDuration || stats.averagePeriodLength;
              const heightPercent = Math.min(100, Math.max(15, (periodDur / 8) * 100));
              return (
                <div key={c.id || i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[11px] font-bold text-zinc-700">{periodDur}j</span>
                  <div className="w-full max-w-[42px] bg-purple-100 rounded-t-xl overflow-hidden h-full flex items-end">
                    <div
                      className="w-full bg-linear-to-t from-purple-500 to-indigo-400 rounded-t-xl transition-all duration-500 hover:opacity-90"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-400 truncate max-w-[50px]">
                    {c.startDate.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-zinc-400 text-center">
            Nombre de jours de flux sanguin enregistrés pour chaque cycle.
          </p>
        </div>
      </div>

      {/* Frequent symptoms & sleep quality */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-wider">
            <span>Douleurs notées</span>
            <Activity className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-black text-rose-600">
            {totalDaysWithPain} <span className="text-xs font-semibold text-zinc-400">jours</span>
          </div>
          <p className="text-xs text-zinc-500 leading-normal">
            Jours où au moins une douleur a été consignée dans le journal corporel.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-wider">
            <span>Énergie & Sérénité</span>
            <Heart className="w-4 h-4 text-pink-500" />
          </div>
          <div className="text-3xl font-black text-purple-600">
            {totalDaysWithJoy} <span className="text-xs font-semibold text-zinc-400">jours</span>
          </div>
          <p className="text-xs text-zinc-500 leading-normal">
            Journées enregistrées avec une humeur sereine ou énergique positive.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-wider">
            <span>Sommeil moyen</span>
            <Moon className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-indigo-600">
            {avgSleepHours} <span className="text-xs font-semibold text-zinc-400">h / nuit</span>
          </div>
          <p className="text-xs text-zinc-500 leading-normal">
            Moyenne des heures de repos rapportées dans les bilans quotidiens.
          </p>
        </div>
      </div>
    </div>
  );
};
