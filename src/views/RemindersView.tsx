import React, { useState } from 'react';
import { ReminderItem, UserProfile } from '../types';
import {
  Bell,
  EyeOff,
  Eye,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface RemindersViewProps {
  reminders: ReminderItem[];
  profile: UserProfile;
  onSaveReminders: (reminders: ReminderItem[]) => void;
  onToggleDiscreteMode: () => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  reminders,
  profile,
  onSaveReminders,
  onToggleDiscreteMode
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [discreetTitle, setDiscreetTitle] = useState<string>('');
  const [time, setTime] = useState<string>('09:00');
  const [type, setType] = useState<ReminderItem['type']>('custom');
  const [testNotificationAlert, setTestNotificationAlert] = useState<string | null>(null);

  const handleToggleReminder = (id: string) => {
    const updated = reminders.map(r => (r.id === id ? { ...r, enabled: !r.enabled } : r));
    onSaveReminders(updated);
  };

  const handleDeleteReminder = (id: string) => {
    onSaveReminders(reminders.filter(r => r.id !== id));
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: ReminderItem = {
      id: `rem-${Date.now()}`,
      title,
      discreetTitle: discreetTitle || 'Moment bien-être personnel',
      time,
      type,
      enabled: true
    };
    onSaveReminders([...reminders, newItem]);
    setShowAddModal(false);
    setTitle('');
    setDiscreetTitle('');
  };

  const handleSimulateNotification = (reminder: ReminderItem) => {
    const textToShow = profile.discreteMode ? reminder.discreetTitle : reminder.title;
    setTestNotificationAlert(textToShow);
    setTimeout(() => setTestNotificationAlert(null), 4500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
            Rappels & Notifications
          </h2>
          <p className="text-sm text-zinc-500">
            Alertes personnalisables et protection de la confidentialité sur ton écran de veille
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Ajouter un rappel
        </button>
      </div>

      {/* Simulated notification banner */}
      {testNotificationAlert && (
        <div className="p-4 rounded-2xl bg-linear-to-r from-rose-600 to-[#FF4370] text-white shadow-xl shadow-rose-300/40 flex items-center justify-between animate-in slide-in-from-top-4 border border-rose-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white text-[#FF4370] flex items-center justify-center font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-rose-100 font-bold uppercase tracking-wider block">
                Notification système • Mood
              </span>
              <span className="text-xs font-extrabold text-white">{testNotificationAlert}</span>
            </div>
          </div>
          <span className="text-[10px] text-white font-bold bg-white/20 px-2.5 py-1 rounded-full border border-white/30">
            Aperçu écran verrouillé
          </span>
        </div>
      )}

      {/* Discreet Mode Box */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-amber-50 to-rose-50 border border-amber-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-600" /> Confidentialité en public
          </div>
          <h3 className="text-base font-extrabold text-zinc-900">
            Mode Notifications Discrètes
          </h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Lorsque ce mode est activé, tes notifications ne mentionnent jamais explicitement tes règles, ta contraception ou ta santé intime. Elles affichent des messages neutres comme <em>« Moment bien-être »</em> ou <em>« Pause personnelle »</em>.
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleDiscreteMode}
          className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            profile.discreteMode
              ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-200'
              : 'bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-300'
          }`}
        >
          {profile.discreteMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{profile.discreteMode ? 'Mode discret activé' : 'Activer le mode discret'}</span>
        </button>
      </div>

      {/* Reminders list */}
      <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-zinc-900">
          Mes rappels enregistrés ({reminders.length})
        </h3>

        <div className="divide-y divide-zinc-100">
          {reminders.map(r => (
            <div
              key={r.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                    r.enabled ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-zinc-100 text-zinc-400'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${r.enabled ? 'text-zinc-900' : 'text-zinc-400'}`}>
                      {profile.discreteMode ? r.discreetTitle : r.title}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-400" /> {r.time}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 mt-1">
                    Texte discret : <em>« {r.discreetTitle} »</em>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleSimulateNotification(r)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold"
                  title="Simuler l'affichage sur votre écran"
                >
                  Tester l'alerte
                </button>

                {/* Toggle button */}
                <button
                  type="button"
                  onClick={() => handleToggleReminder(r.id)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    r.enabled ? 'bg-rose-500' : 'bg-zinc-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      r.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteReminder(r.id)}
                  className="text-zinc-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50"
                  title="Supprimer ce rappel"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/25 backdrop-blur-xs">
          <form
            onSubmit={handleAddReminder}
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-rose-100 space-y-4"
          >
            <h3 className="text-base font-bold text-zinc-900">Créer un nouveau rappel</h3>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Catégorie :</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs font-medium"
              >
                <option value="period">Prochaines règles estimées</option>
                <option value="pill">Prise de pilule contraceptive</option>
                <option value="hydration">Hydratation</option>
                <option value="medication">Autre médicament</option>
                <option value="appointment">Rendez-vous médical</option>
                <option value="daily_log">Bilan quotidien du soir</option>
                <option value="custom">Rappel personnalisé</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Texte du rappel (standard) :
              </label>
              <input
                type="text"
                required
                placeholder="Ex : Pense à prendre ta pilule"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Texte alternatif discret (pour les lieux publics) :
              </label>
              <input
                type="text"
                placeholder="Ex : Pause santé personnelle"
                value={discreetTitle}
                onChange={e => setDiscreetTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Heure de notification :
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs font-bold"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-md shadow-rose-200"
              >
                Enregistrer le rappel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
