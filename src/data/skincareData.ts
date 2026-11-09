import { SkincareProduct, SkinProgressData, CyclePhase } from '../types';

export const DEFAULT_MORNING_ROUTINE: SkincareProduct[] = [
  {
    id: 'm-1',
    stepNumber: 1,
    category: 'Cleanser',
    name: 'Cetaphil Gentle Skin Cleanser',
    brand: 'Cetaphil',
    completed: true,
    timeOfDay: 'morning',
    tip: 'Nettoyage doux pour éliminer les impuretés nocturnes sans altérer le film hydrolipidique.'
  },
  {
    id: 'm-2',
    stepNumber: 2,
    category: 'Toner',
    name: 'Hadalabo Gokujyun Lotion',
    brand: 'Hada Labo',
    completed: true,
    timeOfDay: 'morning',
    tip: 'Hydratation intense aux acides hyaluroniques multiples pour repulper la peau.'
  },
  {
    id: 'm-3',
    stepNumber: 3,
    category: 'Serum',
    name: 'The Ordinary Niacinamide 10%',
    brand: 'The Ordinary',
    completed: true,
    timeOfDay: 'morning',
    tip: 'Régule le sébum et apaise les rougeurs cutanées en phase lutéale.'
  },
  {
    id: 'm-4',
    stepNumber: 4,
    category: 'Moisturizer',
    name: 'Illiyoon Ceramide Ato Cream',
    brand: 'Illiyoon',
    completed: true,
    timeOfDay: 'morning',
    tip: 'Céramides encapsulées pour sceller l’hydratation et fortifier la barrière protectrice.'
  },
  {
    id: 'm-5',
    stepNumber: 5,
    category: 'Sunscreen',
    name: 'Skin1004 Hyalu-Cica Water-Fit Sun',
    brand: 'Skin1004',
    completed: true,
    timeOfDay: 'morning',
    tip: 'Protection solaire SPF 50+ indispensable contre les taches pigmentaires et le vieillissement.'
  }
];

export const DEFAULT_NIGHT_ROUTINE: SkincareProduct[] = [
  {
    id: 'n-1',
    stepNumber: 1,
    category: 'Double Cleanser (Huile / Baume)',
    name: 'Beauty of Joseon Radiance Balm',
    brand: 'Beauty of Joseon',
    completed: true,
    timeOfDay: 'night',
    tip: 'Dissout le maquillage, le SPF et les impuretés liposolubles en douceur.'
  },
  {
    id: 'n-2',
    stepNumber: 2,
    category: 'Water Cleanser (Nettoyant moussant doux)',
    name: 'Cetaphil Gentle Skin Cleanser',
    brand: 'Cetaphil',
    completed: true,
    timeOfDay: 'night',
    tip: 'Deuxième étape du double nettoyage pour une peau parfaitement nette.'
  },
  {
    id: 'n-3',
    stepNumber: 3,
    category: 'Essence régénérante',
    name: 'Cosrx Advanced Snail 96 Mucin',
    brand: 'Cosrx',
    completed: false,
    timeOfDay: 'night',
    tip: 'Réparation cellulaire et apaisement des inflammations cutanées.'
  },
  {
    id: 'n-4',
    stepNumber: 4,
    category: 'Traitement ciblé',
    name: 'La Roche-Posay Pure Niacinamide 10',
    brand: 'La Roche-Posay',
    completed: false,
    timeOfDay: 'night',
    tip: 'Atténue l’hyperpigmentation et resserre les pores.'
  },
  {
    id: 'n-5',
    stepNumber: 5,
    category: 'Baume réparateur nuit',
    name: 'Illiyoon Ceramide Ato Concentrate',
    brand: 'Illiyoon',
    completed: false,
    timeOfDay: 'night',
    tip: 'Régénération nocturne optimale pendant le sommeil paradoxal.'
  }
];

export const DEFAULT_SKIN_PROGRESS: SkinProgressData = {
  score: 85,
  scoreFeedback: 'Great! Your skin is happy and healthy 💕',
  streakDays: 12,
  concerns: [
    { id: 'c-1', name: 'Acne', status: 'improving', improvementPercentage: 40 },
    { id: 'c-2', name: 'Dark Spots', status: 'improving', improvementPercentage: 20 },
    { id: 'c-3', name: 'Redness', status: 'improving', improvementPercentage: 15 }
  ],
  weeklyScores: [
    { day: 'Mon', score: 79 },
    { day: 'Tue', score: 81 },
    { day: 'Wed', score: 80 },
    { day: 'Thu', score: 83 },
    { day: 'Fri', score: 82 },
    { day: 'Sat', score: 84 },
    { day: 'Sun', score: 85 }
  ]
};

export const CYCLE_SKIN_TIPS: Record<CyclePhase, { title: string; tip: string; recommendedStep: string }> = {
  menstrual: {
    title: 'Phase Menstruelle (J1-J5) : Barrière sensible & Sécheresse',
    tip: 'Les œstrogènes sont au plus bas. Hydratation douce, céramides réconfortantes et pas d’exfoliation agressive.',
    recommendedStep: 'Illiyoon Ceramide Ato Cream'
  },
  follicular: {
    title: 'Phase Folliculaire (J6-J12) : Rebond de collagène & Éclat',
    tip: 'La montée des œstrogènes stimule l’élasticité. Le moment idéal pour la vitamine C et des soins illuminateurs.',
    recommendedStep: 'Sérum éclat & Peptides'
  },
  fertile: {
    title: 'Fenêtre Fertile & Ovulation (J13-J15) : Teint Lumineux Glow',
    tip: 'Pic d’œstrogènes ! La peau est au sommet de son éclat naturel. Privilégiez des textures légères aqueuses.',
    recommendedStep: 'Skin1004 Hyalu-Cica Water-Fit'
  },
  ovulation: {
    title: 'Jour d’ovulation (J14) : Pic de rayonnement',
    tip: 'Glow maximal ! Maintenez une bonne hydratation et protégez toujours du soleil avec un bon SPF.',
    recommendedStep: 'Hydratant fluide non comédogène'
  },
  luteal: {
    title: 'Phase Lutéale (J16-J28) : Sebum & Prévention boutons',
    tip: 'La progestérone augmente la production de sébum. Niacinamide, zinc et nettoyage soigné pour prévenir l’acné prémenstruelle.',
    recommendedStep: 'The Ordinary Niacinamide 10%'
  }
};
