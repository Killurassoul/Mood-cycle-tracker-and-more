import React, { useState } from 'react';
import {
  CycleRecord,
  DailyLog,
  CycleCalculationResult,
  UserProfile,
  MenstrualFlow
} from '../types';
import { formatDate, parseDate, addDays, daysBetween } from '../services/cycleCalculator';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  AlertCircle,
  Calendar as CalendarIcon,
  Clock,
  TrendingUp,
  Droplet
} from 'lucide-react';
import { FloralGarden3D } from '../components/FloralGarden3D';

interface CycleViewProps {
  cycles: CycleRecord[];
  dailyLogs: Record<string, DailyLog>;
  stats: CycleCalculationResult;
  profile: UserProfile;
  onSaveCycle: (cycle: CycleRecord) => void;
  onDeleteCycle: (id: string) => void;
  onOpenLogModalForDate: (dateStr: string) => void;
}

export const CycleView: React.FC<CycleViewProps> = ({
  cycles,
  dailyLogs,
  stats,
  profile,
  onSaveCycle,
  onDeleteCycle,
  onOpenLogModalForDate
}) => {
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const [showAddCycleModal, setShowAddCycleModal] = useState<boolean>(false);
  const [newCycleStart, setNewCycleStart] = useState<string>(formatDate(new Date()));
  const [newCycleDuration, setNewCycleDuration] = useState<number>(5);
  const [newCycleFlow, setNewCycleFlow] = useState<MenstrualFlow>('medium');
  const [newCycleNotes, setNewCycleNotes] = useState<string>('');

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const handleCreateCycle = (e: React.FormEvent) => {
    e.preventDefault();
    const newCycle: CycleRecord = {
      id: `cycle-${Date.now()}`,
      startDate: newCycleStart,
      endDate: formatDate(addDays(parseDate(newCycleStart), newCycleDuration - 1)),
      periodDuration: newCycleDuration,
      flowIntensity: newCycleFlow,
      notes: newCycleNotes
    };
    onSaveCycle(newCycle);
    setShowAddCycleModal(false);
  };

  // Calendar matrix calculation
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Monday = 0

  const todayStr = formatDate(new Date());

  // Function to classify any given date string
  const getDateClassification = (dateStr: string) => {
    const isRecordedPeriod = cycles.some(c => {
      const start = c.startDate;
      const end = c.endDate || formatDate(addDays(parseDate(c.startDate), (c.periodDuration || 5) - 1));
      return dateStr >= start && dateStr <= end;
    });

    const isPredictedPeriod =
      dateStr >= stats.nextPeriodDate &&
      dateStr <= formatDate(addDays(parseDate(stats.nextPeriodDate), stats.averagePeriodLength - 1));

    const isOvulation = dateStr === stats.ovulationDate;

    const isFertile =
      dateStr >= stats.fertileWindowStart &&
      dateStr <= stats.fertileWindowEnd;

    const hasLog = Boolean(
      dailyLogs[dateStr] &&
      (dailyLogs[dateStr].symptoms?.length > 0 ||
        dailyLogs[dateStr].mood?.freeJournal ||
        dailyLogs[dateStr].quickMood ||
        dailyLogs[dateStr].painLocations?.length > 0)
    );

    return {
      isRecordedPeriod,
      isPredictedPeriod,
      isOvulation,
      isFertile,
      hasLog
    };
  };

  const monthName = currentMonthDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
            Mon cycle menstruel
          </h2>
          <p className="text-sm text-zinc-500">
            Suivi chronologique, prévisions personnalisées et détection des variations
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddCycleModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Ajouter un cycle / Début de règles
        </button>
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Avertissement important sur les prédictions :</p>
          <p className="text-amber-800/90 mt-0.5 leading-relaxed">
            L'ovulation et la fertilité estimées par les algorithmes ne sont JAMAIS des certitudes médicales. Les prévisions de ce calendrier ne constituent en aucun cas une méthode contraceptive fiable.
          </p>
        </div>
      </div>

      {/* Interactive 3D Floral Garden widget */}
      <FloralGarden3D
        stats={stats}
        onOpenLogModal={() => onOpenLogModalForDate(formatDate(new Date()))}
        onQuickLogPeriodStart={() => setShowAddCycleModal(true)}
      />

      {/* Stats summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-rose-100 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Durée moyenne cycle</span>
            <CalendarIcon className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-zinc-900">
            {stats.averageCycleLength} <span className="text-sm font-medium text-zinc-400">jours</span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">Basé sur {cycles.length} cycles observés</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-rose-100 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Durée moyenne règles</span>
            <Droplet className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-zinc-900">
            {stats.averagePeriodLength} <span className="text-sm font-medium text-zinc-400">jours</span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">Saignements menstruels habituels</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-rose-100 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Régularité générale</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-base font-extrabold text-zinc-900">
            {stats.isIrregular ? (
              <span className="text-amber-600">Cycle variable (±4j)</span>
            ) : (
              <span className="text-emerald-600">Cycle régulier (±2j)</span>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-1">Stabilité des intervalles</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-rose-100 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Prochaines règles</span>
            <Clock className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-base font-extrabold text-zinc-900">
            {stats.nextPeriodDate ? new Date(stats.nextPeriodDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '—'}
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            {stats.isDelayed ? `Retard de ${stats.daysDelayed}j` : `Dans env. ${stats.daysUntilNextPeriod} jours`}
          </p>
        </div>
      </div>

      {/* Interactive Monthly Calendar */}
      <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-xs">
        {/* Calendar Nav */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-rose-100">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-zinc-900 capitalize">
              {monthName}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 rounded-xl text-zinc-500 hover:text-zinc-800 hover:bg-rose-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentMonthDate(new Date())}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50"
            >
              Aujourd’hui
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 rounded-xl text-zinc-500 hover:text-zinc-800 hover:bg-rose-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-zinc-400 uppercase">
          <span>Lun</span>
          <span>Mar</span>
          <span>Mer</span>
          <span>Jeu</span>
          <span>Ven</span>
          <span>Sam</span>
          <span>Dim</span>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {/* Empty days before month starts */}
          {Array.from({ length: startingDayOfWeek }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-16 sm:h-20 rounded-2xl bg-zinc-50/30" />
          ))}

          {/* Days in month */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateObj = new Date(year, month, dayNum);
            const dateStr = formatDate(dateObj);
            const info = getDateClassification(dateStr);
            const isToday = dateStr === todayStr;

            return (
              <div
                key={dateStr}
                onClick={() => onOpenLogModalForDate(dateStr)}
                className={`h-16 sm:h-20 rounded-2xl p-1.5 sm:p-2 border transition-all cursor-pointer flex flex-col justify-between group ${
                  info.isRecordedPeriod
                    ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                    : info.isPredictedPeriod
                    ? 'bg-rose-50 text-rose-900 border-dashed border-rose-300'
                    : info.isOvulation
                    ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                    : info.isFertile
                    ? 'bg-purple-100/70 text-purple-950 border-purple-200'
                    : 'bg-white hover:bg-rose-50/40 text-zinc-700 border-zinc-100 hover:border-rose-200'
                } ${isToday ? 'ring-2 ring-rose-500 ring-offset-2' : ''}`}
                title={`Cliquer pour consigner la journée du ${dayNum}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${info.isRecordedPeriod || info.isOvulation ? 'text-white' : 'text-zinc-800'}`}>
                    {dayNum}
                  </span>
                  {isToday && (
                    <span className="text-[9px] font-bold px-1 rounded-sm bg-white/30">
                      Tey
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 justify-end">
                  {info.hasLog && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        info.isRecordedPeriod || info.isOvulation ? 'bg-white' : 'bg-rose-500'
                      }`}
                      title="Journal complété"
                    />
                  )}
                  {info.isOvulation && (
                    <span className="text-[9px] font-bold tracking-tight">OVUL</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-rose-100/80 text-xs text-zinc-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-rose-500" />
            <span>Règles enregistrées</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-rose-50 border border-dashed border-rose-300" />
            <span>Règles estimées</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-purple-600" />
            <span>Ovulation estimée</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-purple-100 border border-purple-200" />
            <span>Fenêtre de fertilité</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Symptômes ou humeur notés</span>
          </div>
        </div>
      </div>

      {/* History Table of past cycles */}
      <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-zinc-900">
          Historique des cycles précédents
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-700">
            <thead className="bg-rose-50/60 text-rose-900 uppercase font-bold text-[10px] tracking-wider border-b border-rose-100">
              <tr>
                <th className="p-3 rounded-l-xl">Date de début</th>
                <th className="p-3">Fin des règles</th>
                <th className="p-3">Durée règles</th>
                <th className="p-3">Durée totale cycle</th>
                <th className="p-3">Flux</th>
                <th className="p-3">Notes</th>
                <th className="p-3 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {cycles.map(c => (
                <tr key={c.id} className="hover:bg-rose-50/30 transition-colors">
                  <td className="p-3 font-semibold text-zinc-900">{c.startDate}</td>
                  <td className="p-3 text-zinc-500">{c.endDate || '—'}</td>
                  <td className="p-3">{c.periodDuration ? `${c.periodDuration} jours` : '—'}</td>
                  <td className="p-3 font-medium text-rose-700">{c.cycleDuration ? `${c.cycleDuration} jours` : '—'}</td>
                  <td className="p-3 capitalize">{c.flowIntensity || 'Moyen'}</td>
                  <td className="p-3 text-zinc-500 truncate max-w-[200px]">{c.notes || '—'}</td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => onDeleteCycle(c.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                      title="Supprimer ce cycle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Cycle Modal */}
      {showAddCycleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/25 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleCreateCycle}
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-rose-100 space-y-4"
          >
            <h3 className="text-base font-bold text-zinc-900">
              Enregistrer un cycle ou début de règles
            </h3>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Premier jour des règles :
              </label>
              <input
                type="date"
                required
                value={newCycleStart}
                onChange={e => setNewCycleStart(e.target.value)}
                className="w-full p-3 rounded-xl border border-zinc-200 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Durée des saignements (jours) :
              </label>
              <input
                type="number"
                min="1"
                max="12"
                required
                value={newCycleDuration}
                onChange={e => setNewCycleDuration(parseInt(e.target.value) || 5)}
                className="w-full p-3 rounded-xl border border-zinc-200 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Intensité du flux menstruel :
              </label>
              <select
                value={newCycleFlow}
                onChange={e => setNewCycleFlow(e.target.value as MenstrualFlow)}
                className="w-full p-3 rounded-xl border border-zinc-200 text-xs font-medium"
              >
                <option value="light">Léger</option>
                <option value="medium">Moyen</option>
                <option value="heavy">Abondant</option>
                <option value="very_heavy">Très abondant</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Notes personnelles (facultatif) :
              </label>
              <input
                type="text"
                value={newCycleNotes}
                onChange={e => setNewCycleNotes(e.target.value)}
                placeholder="Ex : Douleurs légères jour 1..."
                className="w-full p-3 rounded-xl border border-zinc-200 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setShowAddCycleModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-md shadow-rose-200"
              >
                Enregistrer le cycle
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
