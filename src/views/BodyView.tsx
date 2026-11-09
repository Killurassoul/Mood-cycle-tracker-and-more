import React, { useState } from 'react';
import {
  DailyLog,
  PainZone,
  PhysicalSymptom,
  VaginalHealthLog,
  MenstrualFlow
} from '../types';
import { BodySilhouette } from '../components/BodySilhouette';
import { formatDate } from '../services/cycleCalculator';
import {
  Activity,
  Heart,
  Droplet,
  Shield,
  Clock,
  Sparkles,
  Save,
  CheckCircle2,
  Trash2
} from 'lucide-react';

interface BodyViewProps {
  todayLog: DailyLog;
  allLogs: Record<string, DailyLog>;
  onSaveLog: (log: DailyLog) => void;
}

const PAIN_CATEGORIES = [
  { id: 'abdominal', name: 'Douleurs abdominales', defaultZone: 'abdomen' as PainZone },
  { id: 'cramps', name: 'Crampes menstruelles', defaultZone: 'abdomen' as PainZone },
  { id: 'pelvic', name: 'Douleurs pelviennes', defaultZone: 'pelvis' as PainZone },
  { id: 'lower_back', name: 'Douleurs lombaires (dos)', defaultZone: 'lower_back' as PainZone },
  { id: 'breast', name: 'Douleurs mammaires (seins)', defaultZone: 'breasts' as PainZone },
  { id: 'migraine', name: 'Migraines & Céphalées', defaultZone: 'head' as PainZone },
  { id: 'intercourse', name: 'Douleurs pendant les rapports', defaultZone: 'pelvis' as PainZone }
];

const PHYSICAL_SYMPTOMS = [
  'Fatigue',
  'Ballonnements',
  'Nausées',
  'Acné',
  'Constipation',
  'Diarrhée',
  'Vertiges',
  'Gonflements',
  'Sensibilité des seins'
];

export const BodyView: React.FC<BodyViewProps> = ({ todayLog, allLogs, onSaveLog }) => {
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const currentLog = allLogs[selectedDate] || {
    date: selectedDate,
    flow: 'none',
    symptoms: [],
    painLocations: [],
    waterGlasses: 0,
    sleepHours: 7.5
  };

  const [selectedZones, setSelectedZones] = useState<PainZone[]>(currentLog.painLocations || []);
  const [symptoms, setSymptoms] = useState<PhysicalSymptom[]>(currentLog.symptoms || []);
  const [flow, setFlow] = useState<MenstrualFlow>(currentLog.flow || 'none');
  const [vaginalHealth, setVaginalHealth] = useState<VaginalHealthLog>(
    currentLog.vaginalHealth || {
      dischargeType: 'none',
      color: 'translucide',
      odor: 'none',
      itching: false,
      irritation: false,
      dryness: false
    }
  );
  const [activePainType, setActivePainType] = useState<string>('cramps');
  const [painIntensity, setPainIntensity] = useState<number>(5);
  const [painDurationHours, setPainDurationHours] = useState<number>(2);
  const [painNotes, setPainNotes] = useState<string>('');
  const [savedBanner, setSavedBanner] = useState<boolean>(false);

  const toggleZone = (zone: PainZone) => {
    setSelectedZones(prev =>
      prev.includes(zone) ? prev.filter(z => z !== zone) : [...prev, zone]
    );
  };

  const handleAddPain = () => {
    const painDef = PAIN_CATEGORIES.find(p => p.id === activePainType);
    const newSymptom: PhysicalSymptom = {
      id: `pain-${Date.now()}`,
      category: 'pain',
      name: painDef?.name || 'Douleur',
      intensity: painIntensity,
      durationHours: painDurationHours,
      location: painDef?.defaultZone || selectedZones[0] || 'abdomen',
      notes: painNotes
    };

    setSymptoms(prev => [...prev, newSymptom]);
    if (painDef && !selectedZones.includes(painDef.defaultZone)) {
      setSelectedZones(prev => [...prev, painDef.defaultZone]);
    }
    setPainNotes('');
  };

  const handleTogglePhysicalSymptom = (name: string) => {
    const exists = symptoms.find(s => s.name === name);
    if (exists) {
      setSymptoms(prev => prev.filter(s => s.name !== name));
    } else {
      setSymptoms(prev => [
        ...prev,
        {
          id: `sym-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          category: 'physical',
          name,
          intensity: 5
        }
      ]);
    }
  };

  const handleDeleteSymptom = (id: string) => {
    setSymptoms(prev => prev.filter(s => s.id !== id));
  };

  const handleSaveAll = () => {
    const updatedLog: DailyLog = {
      ...currentLog,
      date: selectedDate,
      flow,
      symptoms,
      painLocations: selectedZones,
      vaginalHealth
    };
    onSaveLog(updatedLog);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title & Date switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
            Mon corps & Suivi physique
          </h2>
          <p className="text-sm text-zinc-500">
            Silhouette corporelle interactive, intensité des douleurs et santé intime
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="p-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 bg-white shadow-2xs"
          />
          <button
            type="button"
            onClick={handleSaveAll}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all"
          >
            <Save className="w-4 h-4" /> Enregistrer le bilan
          </button>
        </div>
      </div>

      {savedBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Toutes tes sensations physiques ont été enregistrées avec succès sur cet appareil.
        </div>
      )}

      {/* 1. Silhouette Anatomique Interactive */}
      <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-500" />
            Silhouette corporelle : cartographie de tes sensations
          </h3>
          <span className="text-xs text-zinc-400">Touche la silhouette pour cibler la zone</span>
        </div>

        <BodySilhouette selectedZones={selectedZones} onToggleZone={toggleZone} />
      </div>

      {/* 2. Douleurs & Formulaire détaillé (1 à 10) */}
      <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500" />
          Enregistrer une douleur spécifique
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Type de douleur :
              </label>
              <select
                value={activePainType}
                onChange={e => setActivePainType(e.target.value)}
                className="w-full p-3 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-800"
              >
                {PAIN_CATEGORIES.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-zinc-700">
                  Intensité de la douleur :
                </label>
                <span className="text-xs font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                  {painIntensity} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={painIntensity}
                onChange={e => setPainIntensity(parseInt(e.target.value))}
                className="w-full accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 mt-0.5">
                <span>1 - Très discrète</span>
                <span>5 - Modérée</span>
                <span>10 - Invalidante</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Durée estimée :
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0.5"
                    max="48"
                    step="0.5"
                    value={painDurationHours}
                    onChange={e => setPainDurationHours(parseFloat(e.target.value) || 1)}
                    className="w-20 p-2.5 rounded-xl border border-zinc-200 text-xs text-center font-bold"
                  />
                  <span className="text-xs text-zinc-500">heures</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Notes personnelles :
                </label>
                <input
                  type="text"
                  placeholder="Ex : Calmée par bouillotte..."
                  value={painNotes}
                  onChange={e => setPainNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddPain}
              className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all"
            >
              + Ajouter cette douleur au journal
            </button>
          </div>

          {/* List of currently recorded pains/symptoms for selected date */}
          <div className="bg-zinc-50/60 p-4 rounded-2xl border border-zinc-200/70 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600 mb-3">
                Douleurs enregistrées pour le {selectedDate} :
              </h4>
              {symptoms.filter(s => s.category === 'pain').length > 0 ? (
                <div className="space-y-2">
                  {symptoms.filter(s => s.category === 'pain').map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white border border-rose-100 shadow-2xs"
                    >
                      <div>
                        <span className="text-xs font-bold text-zinc-800">{item.name}</span>
                        <div className="text-[11px] text-zinc-400 mt-0.5">
                          Zone : {item.location || 'Bassin'} • Durée : {item.durationHours || 2}h
                          {item.notes ? ` • Note : ${item.notes}` : ''}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-md">
                          {item.intensity}/10
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteSymptom(item.id)}
                          className="text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-400 italic">
                  Aucune douleur enregistrée à cette date.
                </p>
              )}
            </div>
            <p className="text-[10px] text-zinc-400 mt-4">
              Ces données alimenteront automatiquement votre rapport médical PDF.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Symptômes physiques généraux */}
      <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Symptômes physiques courants
        </h3>
        <p className="text-xs text-zinc-500">
          Coche les manifestations physiques ressenties aujourd'hui :
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {PHYSICAL_SYMPTOMS.map(sym => {
            const isChecked = symptoms.some(s => s.name === sym);
            return (
              <button
                key={sym}
                type="button"
                onClick={() => handleTogglePhysicalSymptom(sym)}
                className={`p-3 rounded-2xl text-left border transition-all flex items-center justify-between text-xs font-medium ${
                  isChecked
                    ? 'border-purple-500 bg-purple-50 text-purple-900 font-bold shadow-2xs'
                    : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700'
                }`}
              >
                <span>{sym}</span>
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                    isChecked ? 'bg-purple-600 border-purple-600 text-white' : 'border-zinc-300'
                  }`}
                >
                  {isChecked && '✓'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Santé vaginale & Pertes */}
      <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-pink-500" />
          Santé vaginale & Pertes intimes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-2">
                Texture & Aspect des pertes :
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'none', label: 'Sèche / Pas de pertes' },
                  { id: 'egg_white', label: 'Blanc d’œuf (étirable / fertile)' },
                  { id: 'creamy', label: 'Crémeuse / Lait doux' },
                  { id: 'sticky', label: 'Collante / Pâteuse' },
                  { id: 'watery', label: 'Fluide / Aqueuse' },
                  { id: 'thick_white', label: 'Caillebottée (aspect yaourt)' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setVaginalHealth({ ...vaginalHealth, dischargeType: item.id as any })}
                    className={`p-2.5 rounded-xl text-xs text-left border ${
                      vaginalHealth.dischargeType === item.id
                        ? 'bg-rose-500 text-white border-rose-600 font-bold'
                        : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-2">
                Odeur observée :
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'none', label: 'Inodore' },
                  { id: 'normal', label: 'Habituelle (légèrement acidulée)' },
                  { id: 'metallic', label: 'Métallique (fin de règles)' },
                  { id: 'fishy', label: 'Forte / Poissonnière (consulter)' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setVaginalHealth({ ...vaginalHealth, odor: item.id as any })}
                    className={`px-3 py-1.5 rounded-xl text-xs border ${
                      vaginalHealth.odor === item.id
                        ? 'bg-purple-600 text-white border-purple-700 font-bold'
                        : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-rose-50/40 p-5 rounded-2xl border border-rose-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900">
              Signaux de vigilance & Confort vulvaire :
            </h4>
            <div className="space-y-2">
              {[
                { key: 'itching', label: 'Démangeaisons vulvaires', desc: 'Sensation de grattage intime' },
                { key: 'irritation', label: 'Brûlures ou irritations', desc: 'Notamment après miction ou eau' },
                { key: 'dryness', label: 'Sécheresse intime', desc: 'Tiraillements ou manque de confort' }
              ].map(item => {
                const checked = (vaginalHealth as any)[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setVaginalHealth({ ...vaginalHealth, [item.key]: !checked })}
                    className={`w-full p-3 rounded-xl text-left border flex items-center justify-between transition-all ${
                      checked
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className={`text-[10px] ${checked ? 'text-amber-100' : 'text-zinc-400'}`}>
                        {item.desc}
                      </div>
                    </div>
                    <span className="text-sm font-bold">{checked ? '✓' : '+'}</span>
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-zinc-500 leading-normal">
              Rappel : Ne lavez jamais l'intérieur du vagin. L'auto-nettoyage vaginal est préservé par les lactobacilles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
