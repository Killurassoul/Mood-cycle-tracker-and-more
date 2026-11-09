import React, { useState } from 'react';
import { UserProfile, ActiveTrackingMode } from '../types';
import { FloralBlooming3D } from './FloralBlooming3D';
import { Sparkles, Shield, Heart, ArrowRight, Check, Flower2, X } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: Partial<UserProfile>, lastPeriodDate?: string) => void;
  onClose?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  onClose
}) => {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [periodLength, setPeriodLength] = useState<number>(5);
  const [lastPeriodDate, setLastPeriodDate] = useState<string>('');
  const [activeMode, setActiveMode] = useState<ActiveTrackingMode>('cycle');
  const [discreteMode, setDiscreteMode] = useState<boolean>(false);

  if (!isOpen) return null;

  // Compute 3D bloom progress according to step (0.35 -> 0.6 -> 0.85 -> 1.0)
  const bloomProgress = step === 1 ? 0.35 : step === 2 ? 0.6 : step === 3 ? 0.85 : 1.0;

  const handleFinish = () => {
    onComplete(
      {
        name: name.trim() || 'Millie',
        cycleLength: cycleLength || 28,
        periodLength: periodLength || 5,
        activeMode,
        discreteMode,
        onboarded: true
      },
      lastPeriodDate || undefined
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-rose-950/20 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-linear-to-b from-[#FFF0F4] via-[#FFF5F8] to-[#FFEBF0] rounded-3xl shadow-2xl border-2 border-rose-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Optional close button if user opened it while already onboarded */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-rose-500 flex items-center justify-center shadow-xs transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Top 3D Floral Canvas Header */}
        <div className="relative w-full h-56 sm:h-64 bg-linear-to-b from-rose-100/60 via-pink-50/50 to-transparent flex items-center justify-center overflow-hidden shrink-0">
          <FloralBlooming3D bloomProgress={bloomProgress} className="h-full" />

          {/* Floating badge */}
          <div className="absolute top-3 left-4 px-3 py-1 rounded-full bg-white/80 backdrop-blur-xs border border-rose-200/80 text-[11px] font-extrabold text-[#FF5B84] shadow-2xs flex items-center gap-1.5 pointer-events-none">
            <Flower2 className="w-3.5 h-3.5 text-[#FF5B84]" />
            <span>Éclosion florale 3D • Étape {step}/4</span>
          </div>

          {/* Progress bar line */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-rose-200/60">
            <div
              className="h-full bg-linear-to-r from-[#FF7A9C] to-[#FF4370] transition-all duration-500 rounded-r-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Scrollable form body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5">
          {/* STEP 1: WELCOME & FLORAL PHILOSOPHY */}
          {step === 1 && (
            <div className="text-center space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#FF5B84]">
                Bienvenue dans ton jardin secret
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
                Mood — Éclosion & Bien-être
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-sm mx-auto">
                Tout comme chaque fleur s'épanouit à son propre rythme au fil des saisons, ton corps vit au rythme de ses cycles et de ses rituels.
              </p>

              <div className="p-4 rounded-2xl bg-white/90 border border-rose-200/80 text-left space-y-2 text-xs text-zinc-700 shadow-2xs mt-4">
                <div className="flex items-center gap-2 font-black text-rose-900">
                  <Shield className="w-4 h-4 text-[#FF5B84]" /> 100% Rose Clair & Confidentiel
                </div>
                <p className="text-[11px] text-zinc-500">
                  Aucun thème sombre austère : tout est doux, lumineux et rose poudré. Vos données restent exclusivement sur cet appareil.
                </p>
                <div className="flex items-center gap-2 font-black text-rose-900 pt-1">
                  <Sparkles className="w-4 h-4 text-purple-500" /> Rituels Glow & Santé Féminine
                </div>
                <p className="text-[11px] text-zinc-500">
                  Suis ton cycle menstruel, tes soins cutanés, ta silhouette corporelle et consulte l'encyclopédie médicale hors ligne.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: PRENOM & THEME */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-xs font-black uppercase tracking-wider text-[#FF5B84]">
                  Faisons connaissance
                </span>
                <h3 className="text-xl font-black text-zinc-900 mt-0.5">
                  Comment souhaites-tu qu'on t'appelle ?
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Ce prénom personnalisera ton espace d'accueil
                </p>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-zinc-700 mb-1">
                  Prénom ou pseudonyme :
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex : Millie, Camille, Sarah..."
                  className="w-full p-3.5 rounded-2xl border-2 border-rose-200 bg-white text-sm font-bold text-zinc-800 placeholder-zinc-400 focus:outline-hidden focus:border-[#FF5B84]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-zinc-700 mb-2">
                  Quel est ton objectif principal ?
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'cycle', label: 'Cycle menstruel & Glow cutané', desc: 'Comprendre mes phases et harmoniser mes soins' },
                    { id: 'fertility', label: 'Projet de fertilité / Conception', desc: 'Repérer ma fenêtre fertile et mon ovulation' },
                    { id: 'pregnancy', label: 'Accompagnement de grossesse', desc: 'Évolution et développement fœtal semaine par semaine' },
                    { id: 'postpartum', label: 'Post-partum & Récupération', desc: 'Prendre soin de son corps après l’accouchement' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveMode(item.id as ActiveTrackingMode)}
                      className={`w-full p-3.5 rounded-2xl text-left border-2 transition-all flex items-center justify-between ${
                        activeMode === item.id
                          ? 'border-[#FF5B84] bg-white text-rose-950 font-bold shadow-xs'
                          : 'border-rose-100 bg-white/70 hover:bg-white text-zinc-700'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-black">{item.label}</div>
                        <div className="text-[11px] text-zinc-400 font-medium">{item.desc}</div>
                      </div>
                      {activeMode === item.id && <Check className="w-4 h-4 text-[#FF5B84] stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CYCLE PARAMS */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-xs font-black uppercase tracking-wider text-[#FF5B84]">
                  Le tempo de ta fleur intérieure
                </span>
                <h3 className="text-xl font-black text-zinc-900 mt-0.5">
                  Paramètres de ton cycle
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Tu pourras affiner ces données à tout moment
                </p>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-zinc-700 mb-1">
                  Premier jour de tes dernières règles (facultatif) :
                </label>
                <input
                  type="date"
                  value={lastPeriodDate}
                  onChange={e => setLastPeriodDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-rose-200 bg-white text-xs font-semibold text-zinc-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 bg-white rounded-2xl border border-rose-200/80 shadow-2xs">
                  <label className="block text-xs font-extrabold text-zinc-800 mb-1">
                    Durée du cycle
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="20"
                      max="45"
                      value={cycleLength}
                      onChange={e => setCycleLength(parseInt(e.target.value) || 28)}
                      className="w-16 p-2 rounded-xl border border-rose-200 text-center font-black text-[#FF5B84] text-base"
                    />
                    <span className="text-xs text-zinc-500 font-bold">jours</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-1 block">Moyenne : 28j</span>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-rose-200/80 shadow-2xs">
                  <label className="block text-xs font-extrabold text-zinc-800 mb-1">
                    Durée des règles
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="2"
                      max="10"
                      value={periodLength}
                      onChange={e => setPeriodLength(parseInt(e.target.value) || 5)}
                      className="w-16 p-2 rounded-xl border border-rose-200 text-center font-black text-[#FF5B84] text-base"
                    />
                    <span className="text-xs text-zinc-500 font-bold">jours</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-1 block">Moyenne : 5j</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: FLOWER FULL BLOOM & CONFIRMATION */}
          {step === 4 && (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-[#FF5B84] flex items-center justify-center mx-auto shadow-xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-zinc-900 tracking-tight">
                Ta fleur est pleinement éclose !
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed max-w-sm mx-auto">
                Tout est prêt, <strong className="text-[#FF5B84]">{name || 'Millie'}</strong>. Ton carnet personnel t'attend dans une ambiance 100% rose clair réconfortante.
              </p>

              <div className="p-4 rounded-2xl bg-white border border-rose-200 text-left space-y-2 text-xs text-zinc-700">
                <div className="flex items-center gap-2 font-bold text-rose-900">
                  <Check className="w-4 h-4 text-emerald-500 stroke-[3]" /> Routine soins & glow prête
                </div>
                <div className="flex items-center gap-2 font-bold text-rose-900">
                  <Check className="w-4 h-4 text-emerald-500 stroke-[3]" /> Calculs de cycle personnalisés
                </div>
                <div className="flex items-center gap-2 font-bold text-rose-900">
                  <Check className="w-4 h-4 text-emerald-500 stroke-[3]" /> Encyclopédie médicale vérifiée hors connexion
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-5 sm:p-6 border-t border-rose-200 bg-white/80 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="text-xs text-zinc-500 hover:text-zinc-800 font-bold px-3 py-2"
            >
              Retour
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="text-xs text-zinc-400 hover:text-zinc-600 px-3 py-2 font-semibold"
            >
              Passer
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-6 py-3 rounded-2xl bg-[#FF6584] hover:bg-[#FF4E72] text-white text-xs font-black shadow-lg shadow-rose-300/60 transition-all flex items-center gap-2"
            >
              Continuer <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-3 rounded-2xl bg-linear-to-r from-[#FF7A9C] to-[#FF4370] text-white text-xs font-black shadow-lg shadow-rose-300/60 transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              Entrer dans Mood <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
