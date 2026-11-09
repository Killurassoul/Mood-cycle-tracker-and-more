export interface CommonSymptomPreset {
  id: string;
  label: string;
  category: string;
  defaultArticleId?: string;
  suggestedQuestions: string[];
}

export const COMMON_SYMPTOM_PRESETS: CommonSymptomPreset[] = [
  {
    id: 'late_period',
    label: 'Mes règles sont en retard',
    category: 'menstruation',
    defaultArticleId: 'menstruation-retard-regles',
    suggestedQuestions: [
      'De combien de jours est votre retard ?',
      'Avez-vous eu des rapports sexuels non protégés ce mois-ci ?',
      'Ressentez-vous une douleur aiguë unilatérale ?'
    ]
  },
  {
    id: 'brown_blood',
    label: 'Mon sang est marron ou très foncé',
    category: 'menstruation',
    defaultArticleId: 'menstruation-sang-marron',
    suggestedQuestions: [
      'Est-ce le premier ou le dernier jour de vos règles ?',
      'Le flux est-il très léger ou spotting ?',
      'Y a-t-il une mauvaise odeur inhabituelle ?'
    ]
  },
  {
    id: 'painful_periods',
    label: 'J’ai très mal pendant mes règles',
    category: 'pathologies',
    defaultArticleId: 'pathologies-endometriose',
    suggestedQuestions: [
      'Sur une échelle de 1 à 10, à quel niveau évaluez-vous la douleur ?',
      'Le paracétamol ou l’ibuprofène suffisent-ils à calmer la douleur ?',
      'La douleur vous empêche-t-elle de vous lever ou d’aller travailler ?'
    ]
  },
  {
    id: 'white_discharge',
    label: 'J’ai des pertes blanches abondantes',
    category: 'vaginal_health',
    defaultArticleId: 'sante-vaginale-pertes-mycoses',
    suggestedQuestions: [
      'Quelle est la texture : liquide, crémeuse, étirable ou comme du lait caillé ?',
      'Ressentez-vous des démangeaisons ou des brûlures ?',
      'Remarquez-vous une odeur forte (poisson fermenté) ?'
    ]
  },
  {
    id: 'itching',
    label: 'J’ai des démangeaisons intimes ou brûlures',
    category: 'vaginal_health',
    defaultArticleId: 'sante-vaginale-pertes-mycoses',
    suggestedQuestions: [
      'Depuis combien de jours cela dure-t-il ?',
      'Avez-vous changé de savon intime, de lessive ou pris des antibiotiques ?',
      'Avez-vous des rougeurs ou de petites lésions ?'
    ]
  },
  {
    id: 'pain_during_intercourse',
    label: 'J’ai mal pendant les rapports intimes',
    category: 'sexuality',
    defaultArticleId: 'sexualite-clitoris-plaisir',
    suggestedQuestions: [
      'La douleur est-elle à l’entrée du vagin ou profonde dans le bas-ventre ?',
      'La lubrification était-elle suffisante ?',
      'Avez-vous des saignements après le rapport ?'
    ]
  }
];

export type TriageUrgencyLevel = 'EMERGENCY' | 'CONSULTATION_RECOMMENDED' | 'PHYSIOLOGICAL_BENIGN';

export interface TriageResult {
  level: TriageUrgencyLevel;
  title: string;
  summary: string;
  detailedAnalysis: string;
  safetyInstructions: string[];
  recommendedActions: string[];
  emergencyContacts?: string[];
  suggestedArticleId?: string;
}

export function evaluateSymptomTriage(answers: {
  symptomKey: string;
  durationDays: number;
  intensity: number; // 1-10
  isRecurrent: boolean;
  cyclePhase: string;
  hasFever: boolean;
  hasSevereSharpPain: boolean;
  hasDizzinessOrFainting: boolean;
  hasHeavyHemorrhage: boolean;
  isPregnancyPossible: boolean;
  hasAbnormalSmell: boolean;
  notes?: string;
}): TriageResult {
  // CRITICAL EMERGENCY CRITERIA:
  // 1. Suspected ectopic pregnancy: possible pregnancy + severe sharp pain or fainting
  if (answers.isPregnancyPossible && (answers.hasSevereSharpPain || answers.hasDizzinessOrFainting)) {
    return {
      level: 'EMERGENCY',
      title: 'Alerte Urgence Médicale Immédiate : Suspicion de Grossesse Extra-Utérine',
      summary: 'La combinaison d’un retard de règles / possibilité de grossesse avec une douleur aiguë vive unilatérale ou des vertiges exige un contrôle médical immédiat.',
      detailedAnalysis: 'Une douleur pelvienne violente chez une femme en âge de procréer avec un potentiel retard de règles peut signaler une grossesse extra-utérine (GEU) ou une torsion ovarienne. Ne prenez pas d’anti-inflammatoires seuls et ne retardez pas la consultation.',
      safetyInstructions: [
        'Ne restez pas seule si possible.',
        'Ne mangez ni ne buvez pas en attendant (au cas où une prise en charge chirurgicale urgente serait nécessaire).',
        'Contactez immédiatement le SAMU (15 en France, 112 en Europe) ou faites-vous accompagner aux urgences gynécologiques.'
      ],
      recommendedActions: [
        'Appeler le 15 ou le 112 sans attendre.',
        'Se rendre au service des urgences le plus proche.'
      ],
      emergencyContacts: ['SAMU / Urgences Médicales : 15 (France)', 'Numéro d’urgence européen : 112', 'SOS Médecins : 3624']
    };
  }

  // 2. Severe hemorrhage: saturating pads rapidly
  if (answers.hasHeavyHemorrhage || (answers.intensity >= 9 && answers.hasDizzinessOrFainting)) {
    return {
      level: 'EMERGENCY',
      title: 'Alerte Urgence : Hémorragie ou Douleur Pelvienne Critique',
      summary: 'Un saignement très abondant saturant plus de 2 serviettes grand format par heure ou un malaise nécessite une prise en charge hospitalière rapide.',
      detailedAnalysis: 'Une perte sanguine massive ou une douleur entraînant un malaise vagal sévère peut entraîner une anémie aiguë ou être le signe d’une complication pelvienne grave.',
      safetyInstructions: [
        'Allongez-vous les jambes légèrement surélevées pour favoriser le retour veineux.',
        'Faites appel à un proche ou composez le 15 / 112.',
        'Conservez les protections utilisées si besoin pour aider les soignants à évaluer le volume.'
      ],
      recommendedActions: [
        'Se rendre immédiatement aux urgences gynécologiques.'
      ],
      emergencyContacts: ['SAMU : 15', 'Numéro européen : 112']
    };
  }

  // 3. Fever with pelvic pain or foul odor (Pelvic Inflammatory Disease / Endometritis)
  if (answers.hasFever && (answers.intensity >= 5 || answers.hasAbnormalSmell)) {
    return {
      level: 'CONSULTATION_RECOMMENDED',
      title: 'Consultation Médicale Rapide Recommandée (sous 24h)',
      summary: 'L’association d’une fièvre et de douleurs pelviennes ou de pertes malodorantes évoque une potentielle infection gynécologique haute.',
      detailedAnalysis: 'Une infection utérine ou tubaire (salpingite, endométrite) nécessite un diagnostic clinique et éventuellement un traitement antibiotique ciblé prescrit par un médecin.',
      safetyInstructions: [
        'Prenez votre température de façon régulière.',
        'Évitez l’automédication par anti-inflammatoires (ibuprofène) sans avis médical préalable si une infection est suspectée.',
        'Prenez rendez-vous avec votre médecin généraliste, sage-femme ou gynécologue dans la journée.'
      ],
      recommendedActions: [
        'Contacter un cabinet médical ou une permanence de soins (SOS Médecins).',
        'Réaliser un prélèvement vaginal et un bilan sanguin prescrits.'
      ],
      emergencyContacts: ['SOS Médecins : 3624']
    };
  }

  // 4. Chronic severe pain or prolonged symptoms
  if (answers.intensity >= 7 || answers.durationDays >= 14 || (answers.isRecurrent && answers.intensity >= 6)) {
    return {
      level: 'CONSULTATION_RECOMMENDED',
      title: 'Consultation Recommandée : Douleur ou Symptôme Récurrent',
      summary: 'Ces douleurs intenses ou ces symptômes récurrents ne doivent pas être banalisés et justifient un bilan spécialisé.',
      detailedAnalysis: 'Des douleurs de règles qui résistent aux antalgiques usuels ou qui impactent vos activités quotidiennes peuvent être le signe d’une endométriose, d’un fibrome ou d’une adénomyose. Il existe des solutions thérapeutiques efficaces.',
      safetyInstructions: [
        'Ne minimisez pas ce que vous ressentez : souffrir n’est pas une fatalité.',
        'Consignez l’historique précis dans Mood pour étayer votre consultation.'
      ],
      recommendedActions: [
        'Prendre rendez-vous avec un(e) gynécologue ou une sage-femme.',
        'Exporter votre rapport médical PDF depuis l’espace « Mon dossier santé » de Mood.'
      ],
      suggestedArticleId: answers.symptomKey === 'painful_periods' ? 'pathologies-endometriose' : undefined
    };
  }

  // 5. Physiological / Common benign situation
  return {
    level: 'PHYSIOLOGICAL_BENIGN',
    title: 'Situation Fréquente et Rassurante',
    summary: 'D’après vos réponses, vos observations correspondent à des variations physiologiques courantes de l’organisme féminin.',
    detailedAnalysis: 'De légères variations de couleur, un retard isolé de quelques jours ou de légères crampes en milieu ou fin de cycle sont très habituels et reflètent les ajustements normaux de votre équilibre hormonal.',
    safetyInstructions: [
      'Poursuivez votre écoute corporelle bienveillante sans inquiétude excessive.',
      'Si le symptôme persiste plus d’une semaine ou s’intensifie, refaites une évaluation.'
    ],
    recommendedActions: [
      'Consulter l’article documentaire dédié dans l’encyclopédie Mood.',
      'S’accorder du repos, bien s’hydrater et appliquer une bouillotte tiède si besoin.'
    ],
    suggestedArticleId:
      answers.symptomKey === 'brown_blood' ? 'menstruation-sang-marron' :
      answers.symptomKey === 'late_period' ? 'menstruation-retard-regles' :
      answers.symptomKey === 'white_discharge' ? 'sante-vaginale-pertes-mycoses' :
      undefined
  };
}
