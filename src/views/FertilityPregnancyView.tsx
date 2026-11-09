import React, { useState } from 'react';
import {
  UserProfile,
  CycleCalculationResult,
  DailyLog
} from '../types';
import { formatDate } from '../services/cycleCalculator';
import {
  Baby,
  Sparkles,
  Heart,
  Thermometer,
  Calendar,
  AlertCircle,
  Clock,
  ShieldCheck,
  Feather,
  CheckCircle2
} from 'lucide-react';

interface FertilityPregnancyViewProps {
  profile: UserProfile;
  stats: CycleCalculationResult;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

const PREGNANCY_WEEKS_SAMPLE = [
  { week: 4, sizeFruit: 'Graine de pavot (1 mm)', highlight: 'Nidation terminée, le cœur embryonnaire commence à se former.', exam: 'Test urinaire de confirmation' },
  { week: 8, sizeFruit: 'Framboise (1,6 cm)', highlight: 'Les doigts, les paupières et les membres se dessinent.', exam: 'Première consultation prénatale' },
  { week: 12, sizeFruit: 'Prune (5,4 cm)', highlight: 'Fin du 1er trimestre, les réflexes se mettent en place.', exam: 'Échographie du 1er trimestre (T1 - clarté nucale)' },
  { week: 16, sizeFruit: 'Avocat (11 cm)', highlight: 'Bébé bouge doucement, ses yeux perçoivent la lumière.', exam: 'Dépistage combiné trisomie 21' },
  { week: 20, sizeFruit: 'Banane (16 cm)', highlight: 'Les premiers coups de pied sont souvent perçus !', exam: 'Échographie morphologique (T2)' },
  { week: 24, sizeFruit: 'Épi de maïs (30 cm)', highlight: 'Bébé entend votre voix et réagit aux sons extérieurs.', exam: 'Test de dépistage diabète gestationnel (HGPO)' },
  { week: 28, sizeFruit: 'Aubergine (38 cm)', highlight: 'Début du 3e trimestre, bébé ouvre les yeux.', exam: 'Consultation du 7e mois' },
  { week: 32, sizeFruit: 'Chou chinois (42 cm)', highlight: 'Bébé prend du poids rapidement et peaufine ses poumons.', exam: 'Échographie de croissance (T3)' },
  { week: 37, sizeFruit: 'Melon (48 cm)', highlight: 'Bébé est considéré à terme. Il se positionne pour naître.', exam: 'Consultation anesthésique & prélèvement strepto B' },
  { week: 40, sizeFruit: 'Pastèque (51 cm)', highlight: 'Terme officiel : votre bébé est fin prêt à vous rencontrer !', exam: 'Surveillance rapprochée du terme' },
];

export const FertilityPregnancyView: React.FC<FertilityPregnancyViewProps> = ({
  profile,
  stats,
  onUpdateProfile
}) => {
  const [activeSubMode, setActiveSubMode] = useState<'fertility' | 'pregnancy' | 'postpartum'>(
    profile.activeMode === 'pregnancy' ? 'pregnancy' : profile.activeMode === 'postpartum' ? 'postpartum' : 'fertility'
  );

  // Conception tracker mock state
  const [basalTemp, setBasalTemp] = useState<number>(36.6);
  const [lhTest, setLhTest] = useState<'none' | 'negative' | 'positive'>('none');
  const [cervicalState, setCervicalState] = useState<string>('fertile');

  // Pregnancy mock state
  const [currentWeek, setCurrentWeek] = useState<number>(14);
  const [dueDate, setDueDate] = useState<string>('2027-05-15');

  // Postpartum mock state
  const [postpartumDays, setPostpartumDays] = useState<number>(21);
  const [lochiaColor, setLochiaColor] = useState<string>('rosées');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
            Fertilité, Grossesse & Post-Partum
          </h2>
          <p className="text-sm text-zinc-500">
            Un accompagnement scientifique et doux selon ton étape reproductive
          </p>
        </div>

        {/* Sub-modes selector */}
        <div className="flex items-center bg-white border border-rose-200 rounded-2xl p-1 shadow-2xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveSubMode('fertility')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubMode === 'fertility'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Mode Fertilité
          </button>
          <button
            type="button"
            onClick={() => setActiveSubMode('pregnancy')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubMode === 'pregnancy'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Mode Grossesse
          </button>
          <button
            type="button"
            onClick={() => setActiveSubMode('postpartum')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubMode === 'postpartum'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Mode Post-Partum
          </button>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Les estimations fournies ici sont purement éducatives et indicatives. Elles ne remplacent aucunement le suivi médical assuré par votre sage-femme ou votre médecin obstétricien.
        </p>
      </div>

      {/* SUB-MODE 1: FERTILITÉ & CONCEPTION */}
      {activeSubMode === 'fertility' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Fertile window card */}
            <div className="p-6 rounded-3xl bg-linear-to-b from-purple-50 to-white border border-purple-100 shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                Fenêtre fertile estimée
              </span>
              <div className="text-2xl font-black text-zinc-900">
                {stats.fertileWindowStart} → {stats.fertileWindowEnd}
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Période optimale d’environ 6 jours durant laquelle les spermatozoïdes peuvent survivre et rencontrer l’ovocyte.
              </p>
              <div className="pt-2 text-[11px] text-purple-900 font-semibold bg-purple-100/60 p-2.5 rounded-xl">
                Ovulation estimée au {stats.ovulationDate}
              </div>
            </div>

            {/* Basal body temp */}
            <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                  Température basale
                </span>
                <Thermometer className="w-4 h-4 text-rose-500" />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="35.5"
                  max="38.5"
                  step="0.05"
                  value={basalTemp}
                  onChange={e => setBasalTemp(parseFloat(e.target.value) || 36.6)}
                  className="w-24 p-2.5 rounded-xl border border-rose-200 text-lg font-black text-rose-700 text-center"
                />
                <span className="text-sm font-bold text-zinc-500">°C</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-normal">
                À prendre chaque matin au réveil avant de poser le pied par terre. Une hausse de 0,3 à 0,5°C signale le passage en phase lutéale.
              </p>
            </div>

            {/* LH Ovulation test */}
            <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                  Test d'ovulation (LH)
                </span>
                <Sparkles className="w-4 h-4 text-purple-500" />
              </div>

              <div className="flex flex-col gap-2">
                {[
                  { id: 'none', label: 'Non effectué' },
                  { id: 'negative', label: 'Négatif (Ligne pâle)' },
                  { id: 'positive', label: 'Positif (Pic de LH - Ovulation sous 24-36h)' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setLhTest(opt.id as any)}
                    className={`p-2 rounded-xl text-xs text-left border ${
                      lhTest === opt.id
                        ? 'bg-purple-600 text-white font-bold border-purple-700'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Advice card */}
          <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-zinc-900">
              Conseils scientifiques pour favoriser la conception :
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-zinc-700">
              <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100">
                <strong className="block text-purple-900 mb-1">Acide Folique (B9)</strong>
                Démarrez une supplémentation de 400 µg/j dès votre désir d’enfant pour prévenir les anomalies du tube neural.
              </div>
              <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100">
                <strong className="block text-rose-900 mb-1">Rythme des rapports</strong>
                Un rapport tous les 2 jours pendant la fenêtre fertile offre les meilleures chances statistiques sans stress de timing.
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100">
                <strong className="block text-amber-900 mb-1">Hygiène de vie à deux</strong>
                L’arrêt du tabac et de l’alcool chez les deux partenaires améliore significativement la qualité ovocytaire et spermatique.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODE 2: GROSSESSE (SEMAINE PAR SEMAINE) */}
      {activeSubMode === 'pregnancy' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-rose-500 to-purple-600 text-white shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-200">
                  Progression de grossesse
                </span>
                <h3 className="text-3xl font-black tracking-tight mt-1">
                  Semaine {currentWeek} de grossesse
                </h3>
                <p className="text-xs text-rose-100 mt-1">
                  Environ {currentWeek + 2} semaines d’aménorrhée (SA) • Trimestre {currentWeek <= 13 ? 1 : currentWeek <= 27 ? 2 : 3}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
                <span className="text-[10px] uppercase font-bold text-rose-200">Terme théorique</span>
                <div className="text-lg font-black text-white">{dueDate}</div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-rose-200 font-bold">
                <span>Semaine 1</span>
                <span>Semaine 40</span>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                value={currentWeek}
                onChange={e => setCurrentWeek(parseInt(e.target.value))}
                className="w-full accent-white"
              />
            </div>
          </div>

          {/* Week milestones */}
          <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-zinc-900">
              Repères clés du développement fœtal (Semaine par semaine) :
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PREGNANCY_WEEKS_SAMPLE.map(item => (
                <div
                  key={item.week}
                  className={`p-4 rounded-2xl border transition-all ${
                    currentWeek === item.week
                      ? 'bg-rose-50 border-rose-400 shadow-xs ring-1 ring-rose-400'
                      : 'bg-zinc-50/70 border-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-rose-700">
                      Semaine {item.week} ({item.week + 2} SA)
                    </span>
                    <span className="text-[11px] font-bold text-zinc-600 bg-white px-2 py-0.5 rounded-md border border-zinc-200">
                      🍇 {item.sizeFruit}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-700 mt-1 leading-relaxed">
                    {item.highlight}
                  </p>
                  <div className="mt-2 text-[10px] text-purple-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-purple-500" /> {item.exam}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODE 3: POST-PARTUM */}
      {activeSubMode === 'postpartum' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-indigo-50/60 border border-indigo-100 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  Le quatrième trimestre
                </span>
                <h3 className="text-2xl font-black text-zinc-900 mt-1">
                  Post-partum : Jour +{postpartumDays} après la naissance
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Accompagnement de l'involution utérine, cicatrisation et préservation mentale
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={postpartumDays}
                  onChange={e => setPostpartumDays(parseInt(e.target.value) || 1)}
                  className="w-20 p-2 rounded-xl border border-indigo-200 text-center font-bold text-indigo-800"
                />
                <span className="text-xs text-zinc-500">jours</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lochia tracking */}
            <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-zinc-900">
                Suivi des lochies (saignements post-accouchement) :
              </h4>
              <p className="text-xs text-zinc-500">
                Les lochies changent d’aspect au fil des semaines. Elles doivent diminuer progressivement.
              </p>

              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'rouges', label: 'Rouge vif (Jours 1 à 4)' },
                  { id: 'rosées', label: 'Rosées / Brunâtres (Semaines 2 à 3)' },
                  { id: 'jaunes', label: 'Jaunâtres / Claires (Semaines 4 à 6)' },
                  { id: 'terminées', label: 'Terminées' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setLochiaColor(opt.id)}
                    className={`px-3 py-2 rounded-xl text-xs border ${
                      lochiaColor === opt.id
                        ? 'bg-rose-500 text-white font-bold border-rose-600'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-[11px] text-red-900">
                <strong>Alerte Hémorragie tardive :</strong> Si les saignements redeviennent brutalement très abondants (plus de 2 serviettes saturées par heure) ou présentent une odeur nauséabonde avec de la fièvre, consultez les urgences sans attendre.
              </div>
            </div>

            {/* Emotional well-being / Postpartum depression screening */}
            <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-zinc-900">
                Santé émotionnelle & Prévention de la dépression post-partum :
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Le baby-blues dure quelques jours après la naissance. Si vous ressentez une tristesse profonde, un épuisement écrasant, ou une culpabilité persistante au-delà de 2 semaines, vous n’êtes pas seule.
              </p>
              <div className="p-3.5 rounded-xl bg-purple-50 text-purple-900 text-xs">
                La consultation postnatale obligatoire (à réaliser 6 à 8 semaines après l’accouchement) est un espace dédié pour en parler librement avec votre sage-femme ou médecin.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
