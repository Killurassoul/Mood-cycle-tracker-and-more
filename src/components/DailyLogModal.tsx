import React, { useState } from 'react';
import {
  DailyLog,
  MenstrualFlow,
  PainZone,
  PhysicalSymptom,
  VaginalHealthLog
} from '../types';
import { BodySilhouette } from './BodySilhouette';
import { X, Check, Droplet, Heart, Shield, Activity, Sparkles, Moon, Coffee } from 'lucide-react';

interface DailyLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateStr: string;
  initialLog: DailyLog;
  onSave: (log: DailyLog) => void;
}

const FLOW_OPTIONS: Array<{ id: MenstrualFlow; label: string; desc: string }> = [
  { id: 'none', label: 'Aucun', desc: 'Pas de saignement' },
  { id: 'spotting', label: 'Spotting', desc: 'Quelques gouttes' },
  { id: 'light', label: 'Léger', desc: '1-2 serviettes/tampons par jour' },
  { id: 'medium', label: 'Moyen', desc: 'Flux régulier' },
  { id: 'heavy', label: 'Abondant', desc: 'Protection changée toutes les 2-3h' },
  { id: 'very_heavy', label: 'Très abondant', desc: 'Nécessite double protection' }
];

const COMMON_SYMPTOMS = [
  { id: 'cramps', name: 'Crampes menstruelles', category: 'pain' as const },
  { id: 'migraine', name: 'Migraine / Céphalée', category: 'pain' as const },
  { id: 'breast_tenderness', name: 'Sensibilité des seins', category: 'pain' as const },
  { id: 'lower_back_pain', name: 'Douleur bas du dos', category: 'pain' as const },
  { id: 'fatigue', name: 'Fatigue intense', category: 'physical' as const },
  { id: 'bloating', name: 'Ballonnements abdominaux', category: 'physical' as const },
  { id: 'nausea', name: 'Nausées', category: 'physical' as const },
  { id: 'acne', name: 'Acné hormonale', category: 'physical' as const },
  { id: 'dizziness', name: 'Vertiges / Étourdissements', category: 'physical' as const },
  { id: 'constipation', name: 'Constipation', category: 'digestive' as const },
  { id: 'diarrhea', name: 'Diarrhée prémenstruelle', category: 'digestive' as const }
];

export const DailyLogModal: React.FC<DailyLogModalProps> = ({
  isOpen,
  onClose,
  dateStr,
  initialLog,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'flow' | 'pain' | 'symptoms' | 'vaginal' | 'mood'>('flow');
  const [flow, setFlow] = useState<MenstrualFlow>(initialLog.flow || 'none');
  const [selectedZones, setSelectedZones] = useState<PainZone[]>(initialLog.painLocations || []);
  const [symptoms, setSymptoms] = useState<PhysicalSymptom[]>(initialLog.symptoms || []);
  const [painIntensity, setPainIntensity] = useState<number>(
    initialLog.symptoms.find(s => s.category === 'pain')?.intensity || 0
  );
  const [vaginalHealth, setVaginalHealth] = useState<VaginalHealthLog>(
    initialLog.vaginalHealth || {
      dischargeType: 'none',
      color: 'translucide',
      odor: 'none',
      itching: false,
      irritation: false,
      dryness: false
    }
  );
  const [waterGlasses, setWaterGlasses] = useState<number>(initialLog.waterGlasses || 0);
  const [sleepHours, setSleepHours] = useState<number>(initialLog.sleepHours || 7.5);
  const [notes, setNotes] = useState<string>(initialLog.generalNotes || '');
  const [freeJournal, setFreeJournal] = useState<string>(initialLog.mood?.freeJournal || '');

  if (!isOpen) return null;

  const toggleZone = (zone: PainZone) => {
    setSelectedZones(prev =>
      prev.includes(zone) ? prev.filter(z => z !== zone) : [...prev, zone]
    );
  };

  const toggleSymptom = (name: string, category: 'pain' | 'physical' | 'digestive' | 'vaginal') => {
    setSymptoms(prev => {
      const exists = prev.find(s => s.name === name);
      if (exists) {
        return prev.filter(s => s.name !== name);
      } else {
        return [
          ...prev,
          {
            id: `sym-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            category,
            name,
            intensity: 5
          }
        ];
      }
    });
  };

  const handleSave = () => {
    // If pain intensity > 0 and zones selected, ensure recorded
    let updatedSymptoms = [...symptoms];
    if (painIntensity > 0 && selectedZones.length > 0) {
      if (!updatedSymptoms.some(s => s.category === 'pain')) {
        updatedSymptoms.push({
          id: `pain-${Date.now()}`,
          category: 'pain',
          name: 'Douleur localisée',
          intensity: painIntensity,
          location: selectedZones[0]
        });
      }
    }

    const updatedLog: DailyLog = {
      ...initialLog,
      date: dateStr,
      flow,
      symptoms: updatedSymptoms,
      painLocations: selectedZones,
      vaginalHealth,
      waterGlasses,
      sleepHours,
      generalNotes: notes,
      mood: {
        primaryMood: initialLog.mood?.primaryMood || 'calm',
        ratings: initialLog.mood?.ratings || {
          joy: 7,
          sadness: 1,
          stress: 2,
          anxiety: 1,
          irritability: 1,
          motivation: 7,
          energy: 7,
          confidence: 7,
          mentalFatigue: 3,
          emotionalSensitivity: 3
        },
        freeJournal
      }
    };

    onSave(updatedLog);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-rose-950/25 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-100 bg-linear-to-r from-rose-50/60 to-purple-50/40">
          <div>
            <h3 className="text-lg font-bold text-zinc-800">
              Journal du {new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h3>
            <p className="text-xs text-zinc-500">
              Renseigne tes ressentis physiques et émotionnels en toute intimité
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-rose-100/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-zinc-100 px-4 pt-2 gap-1 bg-zinc-50/50">
          {[
            { id: 'flow', label: 'Flux', icon: Droplet },
            { id: 'pain', label: 'Silhouette & Douleurs', icon: Activity },
            { id: 'symptoms', label: 'Symptômes', icon: Sparkles },
            { id: 'vaginal', label: 'Santé intime', icon: Shield },
            { id: 'mood', label: 'Journal & Bien-être', icon: Heart }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                  active
                    ? 'border-rose-500 text-rose-600 bg-white shadow-2xs'
                    : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: FLOW */}
          {activeTab === 'flow' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-zinc-800">
                Intensité du flux menstruel aujourd’hui :
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {FLOW_OPTIONS.map(opt => {
                  const selected = flow === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setFlow(opt.id)}
                      className={`p-3.5 rounded-2xl text-left border transition-all ${
                        selected
                          ? 'border-rose-500 bg-rose-50/70 text-rose-900 shadow-xs ring-2 ring-rose-300/40'
                          : 'border-zinc-200 bg-white hover:border-rose-200 text-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">{opt.label}</span>
                        {selected && <Check className="w-4 h-4 text-rose-600" />}
                      </div>
                      <span className="text-xs text-zinc-400 mt-1 block">{opt.desc}</span>
                    </button>
                  );
                })}
              </div>

              {/* Water & Sleep Trackers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-4 border-t border-zinc-100">
                <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-sky-800 flex items-center gap-1.5">
                      <Coffee className="w-4 h-4 text-sky-600" /> Verres d'eau
                    </span>
                    <span className="text-sm font-bold text-sky-700">{waterGlasses} verres</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))}
                      className="w-8 h-8 rounded-full bg-white border border-sky-200 text-sky-800 font-bold hover:bg-sky-100"
                    >
                      -
                    </button>
                    <div className="flex-1 h-3 bg-sky-200/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (waterGlasses / 8) * 100)}%` }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setWaterGlasses(waterGlasses + 1)}
                      className="w-8 h-8 rounded-full bg-white border border-sky-200 text-sky-800 font-bold hover:bg-sky-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-800 flex items-center gap-1.5">
                      <Moon className="w-4 h-4 text-indigo-600" /> Sommeil
                    </span>
                    <span className="text-sm font-bold text-indigo-700">{sleepHours}h de nuit</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="12"
                    step="0.5"
                    value={sleepHours}
                    onChange={e => setSleepHours(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PAIN & SILHOUETTE */}
          {activeTab === 'pain' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-zinc-800 mb-1">
                  Intensité générale de la douleur (Échelle de 0 à 10) :
                </h4>
                <div className="flex items-center gap-4 bg-rose-50/40 p-4 rounded-2xl border border-rose-100">
                  <span className="text-2xl font-black text-rose-600 w-12 text-center">
                    {painIntensity}/10
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={painIntensity}
                    onChange={e => setPainIntensity(parseInt(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                  <span className="text-xs text-zinc-500 min-w-[70px]">
                    {painIntensity === 0 ? 'Aucune' : painIntensity <= 3 ? 'Légère' : painIntensity <= 6 ? 'Modérée' : 'Sévère'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-zinc-800 mb-2">
                  Silhouette anatomique interactive :
                </h4>
                <BodySilhouette selectedZones={selectedZones} onToggleZone={toggleZone} />
              </div>
            </div>
          )}

          {/* TAB 3: PHYSICAL SYMPTOMS */}
          {activeTab === 'symptoms' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-zinc-800">
                Symptômes physiques observés aujourd'hui :
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {COMMON_SYMPTOMS.map(sym => {
                  const active = symptoms.some(s => s.name === sym.name);
                  return (
                    <button
                      key={sym.id}
                      type="button"
                      onClick={() => toggleSymptom(sym.name, sym.category)}
                      className={`flex items-center justify-between p-3 rounded-2xl text-left border transition-all ${
                        active
                          ? 'border-purple-500 bg-purple-50/70 text-purple-900 font-semibold'
                          : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700'
                      }`}
                    >
                      <span className="text-xs">{sym.name}</span>
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center border text-[10px] ${
                          active ? 'bg-purple-600 border-purple-600 text-white' : 'border-zinc-300'
                        }`}
                      >
                        {active && '✓'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: VAGINAL HEALTH */}
          {activeTab === 'vaginal' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-bold text-zinc-800 mb-2">
                  Aspect de la glaire ou des pertes :
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'none', label: 'Sèche / Aucune' },
                    { id: 'egg_white', label: 'Blanc d’œuf (étirable)' },
                    { id: 'creamy', label: 'Crémeuse' },
                    { id: 'sticky', label: 'Collante / Pâteuse' },
                    { id: 'watery', label: 'Aqueuse / Fluide' },
                    { id: 'thick_white', label: 'Épaisse (lait caillé)' },
                    { id: 'yellow_green', label: 'Jaunâtre / Verdâtre' },
                    { id: 'brownish', label: 'Brunâtre' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setVaginalHealth({ ...vaginalHealth, dischargeType: item.id as any })}
                      className={`p-2.5 rounded-xl text-xs text-left border ${
                        vaginalHealth.dischargeType === item.id
                          ? 'bg-rose-500 text-white border-rose-600 font-semibold'
                          : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-zinc-800 mb-2">Inconforts vulvo-vaginaux :</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'itching', label: 'Démangeaisons' },
                    { key: 'irritation', label: 'Brûlures / Irritations' },
                    { key: 'dryness', label: 'Sécheresse vaginale' }
                  ].map(item => {
                    const active = (vaginalHealth as any)[item.key];
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setVaginalHealth({ ...vaginalHealth, [item.key]: !active })}
                        className={`px-3 py-2 rounded-xl text-xs font-medium border ${
                          active
                            ? 'bg-amber-500 text-white border-amber-600'
                            : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700'
                        }`}
                      >
                        {item.label} {active ? '✓' : '+'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FREE JOURNAL */}
          {activeTab === 'mood' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-zinc-800 mb-1">
                  Journal intime & pensées libres :
                </label>
                <p className="text-xs text-zinc-500 mb-2">
                  Exprime ce que tu ressens aujourd'hui sans limite de mots. Ce journal est crypté sur ton appareil.
                </p>
                <textarea
                  rows={6}
                  value={freeJournal}
                  onChange={e => setFreeJournal(e.target.value)}
                  placeholder="Écris tout ce qui te passe par la tête : tes joies, tes peines, tes réussites, tes doutes..."
                  className="w-full p-4 rounded-2xl border border-rose-200 focus:outline-hidden focus:ring-2 focus:ring-rose-400 text-sm text-zinc-800 bg-rose-50/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Notes pratiques (médicaments pris, sport, etc.) :
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Ex : Spasfon 80mg le matin, 45min de marche..."
                  className="w-full p-3 rounded-xl border border-zinc-200 text-xs text-zinc-800"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 bg-zinc-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-200 transition-colors"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-md shadow-rose-200 transition-all"
          >
            Enregistrer pour ce jour
          </button>
        </div>
      </div>
    </div>
  );
};
