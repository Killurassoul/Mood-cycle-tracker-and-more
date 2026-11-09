import { MedicalArticle } from '../types';

export interface CategoryMetadata {
  id: string;
  name: string;
  description: string;
  iconName: string;
  color: string;
}

export const ENCYCLOPEDIA_CATEGORIES: CategoryMetadata[] = [
  { id: 'menstruation', name: 'Menstruations', description: 'Comprendre les règles, flux, cycles et saignements', iconName: 'Droplet', color: 'bg-rose-100 text-rose-700' },
  { id: 'ovulation', name: 'Ovulation', description: 'Glaire cervicale, signes fertiles et libération ovocytaire', iconName: 'Sparkles', color: 'bg-purple-100 text-purple-700' },
  { id: 'hormones', name: 'Hormones', description: 'Œstrogènes, progestérone, LH, FSH et leurs équilibres', iconName: 'Activity', color: 'bg-fuchsia-100 text-fuchsia-700' },
  { id: 'vaginal_health', name: 'Santé vaginale', description: 'Microbiote, pertes, hygiène intime et flore protectrice', iconName: 'Shield', color: 'bg-pink-100 text-pink-700' },
  { id: 'sexuality', name: 'Sexualité', description: 'Anatomie, clitoris, désir, lubrification et consentement', iconName: 'Heart', color: 'bg-rose-100 text-rose-800' },
  { id: 'contraception', name: 'Contraception', description: 'Pilule, DIU, implant, préservatif et choix adaptés', iconName: 'CheckCircle', color: 'bg-amber-100 text-amber-800' },
  { id: 'pathologies', name: 'Troubles gynécologiques', description: 'Endométriose, SOPK, adénomyose, fibromes et SPM', iconName: 'AlertCircle', color: 'bg-red-100 text-red-700' },
  { id: 'fertility', name: 'Fertilité', description: 'Conception, fenêtre optimale et bilans médicaux', iconName: 'Smile', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'pregnancy', name: 'Grossesse', description: 'Trimestres, développement fœtal et consultations', iconName: 'Baby', color: 'bg-sky-100 text-sky-700' },
  { id: 'postpartum', name: 'Post-partum', description: 'Lochies, récupération, allaitement et soutien mental', iconName: 'Feather', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'menopause', name: 'Ménopause', description: 'Périménopause, bouffées de chaleur et transitions', iconName: 'Sun', color: 'bg-orange-100 text-orange-700' },
  { id: 'wellness', name: 'Bien-être & Hygiène de vie', description: 'Sommeil, alimentation, activité physique et stress', iconName: 'Coffee', color: 'bg-teal-100 text-teal-700' },
];

export const MEDICAL_ARTICLES: MedicalArticle[] = [
  // 1. Menstruations - Sang marron
  {
    id: 'menstruation-sang-marron',
    categoryId: 'menstruation',
    categoryName: 'Menstruations',
    subCategory: 'Couleur et aspect du flux',
    title: 'Pourquoi mes règles sont-elles marron ou foncées ?',
    readTimeMinutes: 4,
    intro: 'La présence de sang marron ou brun en début ou fin de règles est un phénomène biologique très courant, généralement lié à l’oxydation naturelle du sang au contact de l’air.',
    detailedExplanation: 'Le sang menstruel est composé de muqueuse utérine (endomètre), de cellules épithéliales et de sang capillaire. Lorsqu’un flux sanguin s’écoule lentement, l’hémoglobine présente dans les globules rouges entre en contact prolongé avec l’oxygène. Cette réaction biochimique d’oxydation modifie la pigmentation du fer, transformant le rouge vif en une teinte marron foncé, bistre ou presque noire. Cela survient fréquemment lors des premiers jours où le col s’ouvre doucement, ou dans les derniers jours lorsque l’utérus achève son nettoyage.',
    whyItHappens: [
      'Écoulement ralenti du sang permettant l’oxydation de l’hémoglobine.',
      'Résidus de l’endomètre évacués en toute fin de cycle.',
      'Saignement d’implantation (spotting précoce lors d’une nidation éventuelle).',
      'Modification hormonale passagère ou début d’une nouvelle contraception progestative.'
    ],
    associatedSymptoms: [
      'Léger spotting sans douleur.',
      'Crampes menstruelles légères et habituelles.',
      'Flux peu abondant nécessitant une simple protection légère.'
    ],
    whatIsUsual: 'Observer des pertes marron 1 à 2 jours avant l’arrivée franche du flux ou pendant 1 à 3 jours après la fin des règles abondantes est tout à fait physiologique.',
    whatMeritsConsultation: [
      'Pertes marron constantes en dehors de toute période menstruelle (plus de 7 jours consécutifs).',
      'Pertes brunes accompagnées d’odeur désagréable ou de brûlures.',
      'Apparition soudaine après des rapports sexuels répétés.',
      'Pertes marron chez une femme ménopausée depuis plus d’un an.'
    ],
    urgentRedFlags: [
      'Douleur pelvienne aiguë et unilatérale avec retard de règles (suspicion de grossesse extra-utérine).',
      'Fièvre supérieure à 38,5 °C associée à des pertes malodorantes.',
      'Malaise, vertiges sévères ou pâleur extrême.'
    ],
    generalAdvice: [
      'Privilégier des protections douces non parfumées (culottes menstruelles, serviettes en coton bio).',
      'Noter la date et la durée de ces pertes dans votre application Mood.',
      'Éviter les douches vaginales internes qui altèrent le microbiote protecteur.'
    ],
    faq: [
      {
        question: 'Le sang marron est-il du « vieux sang » ?',
        answer: 'Oui, dans le sens biologique : il s’agit de sang qui a pris plus de temps à franchir le col utérin et le vagin, ce qui a laissé le temps au fer de s’oxyder.'
      },
      {
        question: 'Est-ce un signe de grossesse ?',
        answer: 'Parfois, une légère perte rosée ou marron survient 7 à 10 jours après l’ovulation lors de la nidation. Seul un test urinaire ou sanguin après la date présumée des règles peut le confirmer.'
      }
    ],
    medicalSources: [
      { name: 'INSERM', description: 'Dossier Physiologie de la reproduction et cycle menstruel' },
      { name: 'ACOG (American College of Obstetricians and Gynecologists)', description: 'Abnormal Uterine Bleeding Clinical Guidelines' },
      { name: 'Ameli (Assurance Maladie)', description: 'Saignements anormaux et règles irrégulières' }
    ]
  },

  // 1. Menstruations - Retard de règles
  {
    id: 'menstruation-retard-regles',
    categoryId: 'menstruation',
    categoryName: 'Menstruations',
    subCategory: 'Régularité du cycle',
    title: 'Retard de règles : quelles peuvent être les causes ?',
    readTimeMinutes: 5,
    intro: 'Un décalage de quelques jours dans l’apparition des règles est fréquent. Si la grossesse est la première éventualité à vérifier en cas de rapports, d’autres facteurs biologiques et environnementaux jouent un rôle déterminant.',
    detailedExplanation: 'Le cycle menstruel est piloté par l’axe hypothalamo-hypophyso-ovarien. Cet axe neuro-endocrinien est particulièrement sensible aux variations de l’organisme. L’ovulation n’a pas toujours lieu au 14e jour précis : un pic de stress, un voyage, un choc affectif ou une privation de sommeil peuvent retarder la libération de l’ovocyte par l’ovaire, retardant mécaniquement l’arrivée des règles 14 jours plus tard.',
    whyItHappens: [
      'Grossesse débutante suite à une fécondation.',
      'Stress aigu ou chronique activant l’hormone cortisol, qui inhibe la sécrétion de GnRH.',
      'Variation pondérale brutale, régime restrictif ou exercice physique intense.',
      'Arrêt ou modification d’une contraception hormonale.',
      'Trouble endocrinien sous-jacent (hypothyroïdie, hyperprolactinémie, SOPK).'
    ],
    associatedSymptoms: [
      'Tension mammaire.',
      'Petits tiraillements dans le bas du ventre.',
      'Sautes d’humeur ou fatigue accrue.'
    ],
    whatIsUsual: 'Un décalage de 3 à 5 jours par rapport à la date théorique est considéré comme une variation normale chez la plupart des femmes en bonne santé.',
    whatMeritsConsultation: [
      'Absence de règles (aménorrhée) depuis plus de 3 mois consécutifs hors grossesse confirmée négative.',
      'Cycles qui deviennent anarchiques avec des intervalles de plus de 45 jours.',
      'Arrêt brutal des règles suite à une perte de poids notable.'
    ],
    urgentRedFlags: [
      'Douleur vive, déchirante, d’un seul côté du bas-ventre avec test de grossesse positif ou doute (urgence chirurgicale : grossesse extra-utérine).',
      'Évanouissement, hypotension brutale.'
    ],
    generalAdvice: [
      'Réaliser un test de grossesse urinaire dès le premier jour de retard présumé avec les premières urines du matin.',
      'Maintenir un rythme de sommeil régulier et s’accorder des moments de détente.',
      'Consigner vos cycles sur l’application pour objectiver la régularité sur 6 mois.'
    ],
    faq: [
      {
        question: 'À partir de quand parle-t-on de retard ?',
        answer: 'Médicalement, on commence à parler de retard au-delà de 5 à 7 jours après la date prévisionnelle maximale de votre cycle le plus long des derniers mois.'
      },
      {
        question: 'Le stress peut-il vraiment bloquer les règles ?',
        answer: 'Absolument. Le cortisol et la CRH peuvent bloquer temporairement la pulsation de GnRH au niveau du cerveau, empêchant l’ovulation d’avoir lieu à temps.'
      }
    ],
    medicalSources: [
      { name: 'OMS (Organisation Mondiale de la Santé)', description: 'Standards de santé reproductive' },
      { name: 'Collège National des Gynécologues et Obstétriciens Français (CNGOF)', description: 'Recommandations sur les aménorrhées secondaires' },
      { name: 'NHS (National Health Service)', description: 'Missed or late periods overview' }
    ]
  },

  // 2. Ovulation - Signes et glaire cervicale
  {
    id: 'ovulation-signes-glaire',
    categoryId: 'ovulation',
    categoryName: 'Ovulation',
    subCategory: 'Signes fertiles',
    title: 'Comprendre l’ovulation et observer sa glaire cervicale',
    readTimeMinutes: 5,
    intro: 'L’ovulation est le moment clé du cycle où un follicule ovarien mature libère un ovocyte. La glaire cervicale produite par le col utérin change d’aspect sous l’effet des œstrogènes pour faciliter le passage des spermatozoïdes.',
    detailedExplanation: 'Sous l’effet de la montée progressive des œstrogènes en phase folliculaire, les cryptes du col de l’utérus sécrètent une substance filante, limpide et fluide. Au pic de fertilité, cette glaire cervicale prend une consistance semblable à du blanc d’œuf cru : transparente, très étirable entre deux doigts sans se rompre, et riche en eau. Dès que l’ovulation a eu lieu, la progestérone prend le relais et rend la glaire dense, opaque et collante, créant une barrière protectrice.',
    whyItHappens: [
      'Pic d’œstrogènes précédant la décharge de LH (hormone lutéinisante).',
      'Action des cryptes cervicales adaptant le pH pour nourrir et guider les spermatozoïdes.',
      'Libération mécanique de l’ovocyte par rupture du follicule ovarien.'
    ],
    associatedSymptoms: [
      'Sensation d’humidité accrue à la vulve.',
      'Légère douleur ou pincement d’un côté du bassin (Mittelschmerz).',
      'Hausse de la libido.',
      'Léger saignement ovulatoire discret (quelques gouttes rosées).'
    ],
    whatIsUsual: 'Observer une glaire étirable et fluide pendant 2 à 4 jours au milieu du cycle est le reflet d’un fonctionnement ovarien sain.',
    whatMeritsConsultation: [
      'Absence complète de glaire ou de signes ovulatoires sur plusieurs cycles chez une femme désirant concevoir.',
      'Pertes ressemblant à du lait caillé avec démangeaisons intenses (évocateur de mycose, non d’ovulation).'
    ],
    urgentRedFlags: [
      'Douleur pelvienne insoutenable empêchant la marche (peut signaler une torsion d’annexe ou la rupture hémorragique d’un gros kyste).'
    ],
    generalAdvice: [
      'Essuyez la vulve d’avant en arrière avec du papier toilette avant d’uriner pour observer la texture.',
      'Ne confondez pas la glaire cervicale avec les sécrétions d’excitation sexuelle ou le liquide séminal résiduel.'
    ],
    faq: [
      {
        question: 'Combien de temps l’ovocyte survit-il ?',
        answer: 'L’ovocyte a une durée de vie d’environ 12 à 24 heures. Cependant, les spermatozoïdes peuvent survivre jusqu’à 5 jours dans une glaire de bonne qualité, ce qui ouvre la fenêtre fertile avant l’ovulation.'
      }
    ],
    medicalSources: [
      { name: 'INSERM', description: 'Biologie de la reproduction humaine' },
      { name: 'ACOG', description: 'Fertility Awareness-Based Methods of Family Planning' }
    ]
  },

  // 3. Hormones - Équilibre Œstrogènes & Progestérone
  {
    id: 'hormones-oestrogenes-progesterone',
    categoryId: 'hormones',
    categoryName: 'Hormones',
    subCategory: 'Régulation endocrinienne',
    title: 'Œstrogènes et progestérone : la danse des deux hormones reines',
    readTimeMinutes: 6,
    intro: 'Le bien-être féminin repose sur une alternance harmonieuse entre les œstrogènes en première partie de cycle et la progestérone en seconde partie.',
    detailedExplanation: 'Durant la phase folliculaire, les ovaires sécrètent principalement l’œstradiol (le plus puissant des œstrogènes). Il épaissit la muqueuse utérine, améliore l’hydratation cutanée, stimule l’énergie et favorise la dopamine et la sérotonine. Après l’ovulation, le follicule vidé se transforme en corps jaune et produit massivement de la progestérone. Cette hormone apaise le système nerveux grâce à son métabolite allopregnanolone qui agit sur les récepteurs GABA, prépare l’utérus à une éventuelle nidation et élève légèrement la température corporelle.',
    whyItHappens: [
      'Synchronisation neuro-endocrinienne entre le cerveau (hypothalamus/hypophyse) et les ovaires.',
      'Rétrocontrôles positif et négatif orchestrant le cycle menstruel mensuel.'
    ],
    associatedSymptoms: [
      'Sensibilité émotionnelle variable selon la phase.',
      'Rétention d’eau ou tension des seins en fin de phase lutéale si la progestérone est insuffisante.',
      'Modifications de la température basale (hausse de 0,3 à 0,5 °C après ovulation).'
    ],
    whatIsUsual: 'Ressentir un regain d’énergie en début de cycle puis un désir de calme et de repos les jours précédant les règles est une variation biologique naturelle.',
    whatMeritsConsultation: [
      'Syndrome prémenstruel sévère (SPM) ou trouble dysphorique prémenstruel (TDPM) handicapant la vie quotidienne.',
      'Cycles anovulatoires fréquents ou saignements intermenstruels continus.'
    ],
    urgentRedFlags: [
      'Idées noires intenses ou détresse psychologique aiguë durant la semaine prémenstruelle.'
    ],
    generalAdvice: [
      'Soutenir le foie (responsable de la dégradation des œstrogènes) par une hydratation abondante et des fibres alimentaires.',
      'Apporter du magnésium et de la vitamine B6 pour favoriser la synthèse de la progestérone.'
    ],
    faq: [
      {
        question: 'Qu’appelle-t-on la « dominance œstrogénique » ?',
        answer: 'C’est un déséquilibre où le niveau d’œstrogènes est trop élevé par rapport à une progestérone insuffisante (souvent en cas de cycle sans ovulation ou en périménopause), provoquant seins douloureux et irritabilité.'
      }
    ],
    medicalSources: [
      { name: 'Endocrine Society', description: 'Female Reproductive Endocrinology Guidelines' },
      { name: 'INSERM', description: 'Hormones stéroïdes et cerveau' }
    ]
  },

  // 4. Santé vaginale - Pertes blanches & mycoses
  {
    id: 'sante-vaginale-pertes-mycoses',
    categoryId: 'vaginal_health',
    categoryName: 'Santé vaginale',
    subCategory: 'Microbiote et flore de Döderlein',
    title: 'Pertes blanches, odeurs et démangeaisons : distinguer le normal de l’infection',
    readTimeMinutes: 5,
    intro: 'Le vagin possède un système d’auto-nettoyage sophistiqué composé de bactéries bénéfiques (les bacilles de Döderlein). Comprendre ses sécrétions permet de protéger son équilibre.',
    detailedExplanation: 'Un vagin en bonne santé est colonisé à plus de 90 % par des lactobacilles qui produisent de l’acide lactique, maintenant un pH acide protecteur (entre 3,8 et 4,5). Les sécrétions quotidiennes évacuent les cellules mortes. Ces leucorrhées physiologiques sont blanches ou translucides, inodores ou à l’odeur légèrement acidulée. Lorsqu’un déséquilibre survient (prise d’antibiotiques, stress, savon agressif), des levures (Candida albicans) ou des bactéries anaérobies (Gardnerella vaginalis) peuvent proliférer.',
    whyItHappens: [
      'Auto-nettoyage vaginal quotidien naturel.',
      'Mycose vaginale (prolifération de champignons microscopiques).',
      'Vaginose bactérienne (raréfaction des lactobacilles et prolifération de germes anaérobies).',
      'Irritation mécanique ou allergie de contact (lessive, sous-vêtements synthétiques).'
    ],
    associatedSymptoms: [
      'Pertes ressemblant à du yaourt ou lait caillé (typique de la mycose).',
      'Odeur de poisson fermenté augmentant après les rapports ou l’eau (typique de la vaginose).',
      'Démangeaisons, picotements ou rougeurs à la vulve.'
    ],
    whatIsUsual: 'Avoir des sécrétions blanches crémeuses sans démangeaisons ni odeur incommodante sur ses sous-vêtements est totalement normal.',
    whatMeritsConsultation: [
      'Démangeaisons intenses persistantes plus de 48 heures.',
      'Pertes verdâtres, jaunâtres et mousseuses.',
      'Brûlures urinaires associées aux pertes.',
      'Épisodes récidivants (plus de 3 à 4 fois par an).'
    ],
    urgentRedFlags: [
      'Pertes associées à une forte fièvre, frissons et violentes douleurs abdominales.',
      'Ulcérations ou cloques douloureuses sur la vulve (nécessite d’éliminer un herpès génital).'
    ],
    generalAdvice: [
      'Ne JAMAIS laver l’intérieur du vagin : l’eau et le savon à l’intérieur détruisent la flore protectrice.',
      'Nettoyer uniquement la vulve externe une fois par jour avec de l’eau tiède ou un nettoyant au pH physiologique.',
      'Porter des culottes en coton respirant et éviter les pantalons trop serrés.'
    ],
    faq: [
      {
        question: 'La mycose est-elle une IST ?',
        answer: 'Non. La mycose vulvo-vaginale est un déséquilibre de sa propre flore interne, et non une infection transmise sexuellement.'
      }
    ],
    medicalSources: [
      { name: 'Haute Autorité de Santé (HAS)', description: 'Prise en charge des vaginites et vaginoses' },
      { name: 'CDC', description: 'Vaginal Candidiasis and Bacterial Vaginosis' }
    ]
  },

  // 5. Sexualité - Anatomie, plaisir et clitoris
  {
    id: 'sexualite-clitoris-plaisir',
    categoryId: 'sexuality',
    categoryName: 'Sexualité',
    subCategory: 'Anatomie et physiologie du plaisir',
    title: 'Anatomie du clitoris, lubrification et consentement',
    readTimeMinutes: 5,
    intro: 'Le clitoris est le seul organe du corps humain entièrement dédié au plaisir. Une bonne compréhension anatomique favorise une sexualité épanouie et respectueuse.',
    detailedExplanation: 'Visiblement réduit à un petit gland sous son capuchon, le clitoris mesure en réalité entre 8 et 12 centimètres en profondeur. Il comprend deux corps caverneux, deux corps spongieux (bulbes vestibulaires) qui s’étendent de part et d’autre de l’orifice vaginal, et plus de 10 000 terminaisons nerveuses sensorielles. Lors de l’excitation, ces structures se gorgent de sang, tandis que les glandes de Bartholin et les parois vaginales sécrètent la lubrification naturelle.',
    whyItHappens: [
      'Stimulation physique et émotionnelle déclenchant une vasodilatation pelvienne.',
      'Rôle des hormones (œstrogènes, testostérone) et des neurotransmetteurs (dopamine, ocytocine).'
    ],
    associatedSymptoms: [
      'Engorgement doux des tissus génitaux.',
      'Lubrification fluide facilitant la pénétration ou le contact.',
      'Contractions rythmiques des muscles pelviens lors de l’orgasme.'
    ],
    whatIsUsual: 'La grande majorité des femmes atteignent l’orgasme par stimulation directe ou indirecte du clitoris externe. La lubrification peut fluctuer selon le cycle ou l’état de fatigue.',
    whatMeritsConsultation: [
      'Douleurs systématiques lors de toute tentative de pénétration (vaginisme ou dyspareunie).',
      'Sécheresse persistante causant des microlésions douloureuses.',
      'Perte brutale de sensation génitale.'
    ],
    urgentRedFlags: [
      'Saignement abondant immédiat après un rapport avec douleur violente.',
      'Suspicion d’agression ou rapport non consenti (urgence médico-légale et de soutien psychologique).'
    ],
    generalAdvice: [
      'L’usage d’un lubrifiant à base d’eau ou de silicone est un allié précieux du confort intime.',
      'Le consentement est explicite, enthousiaste, libre et peut être retiré à tout moment.',
      'Ne jamais forcer son corps : la douleur n’est jamais normale lors d’un rapport.'
    ],
    faq: [
      {
        question: 'Le « point G » est-il un organe distinct ?',
        answer: 'Non, les recherches anatomiques modernes ont démontré qu’il s’agit de la face interne des bulbes du clitoris et de la zone urétrale stimulée à travers la paroi antérieure du vagin.'
      }
    ],
    medicalSources: [
      { name: 'OMS', description: 'Santé sexuelle et droits reproductifs' },
      { name: 'Inserm', description: 'Recherche sur la physiologie de la sexualité féminine' }
    ]
  },

  // 6. Contraception - Panorama des méthodes
  {
    id: 'contraception-panorama-choix',
    categoryId: 'contraception',
    categoryName: 'Contraception',
    subCategory: 'Méthodes et tolérance',
    title: 'Pilule, DIU, implant : comment choisir sa méthode de contraception ?',
    readTimeMinutes: 6,
    intro: 'La meilleure contraception est celle que vous choisissez librement, adaptée à votre santé, votre mode de vie et vos tolérances individuelles.',
    detailedExplanation: 'On distingue les contraceptions hormonales (pilule combinée œstroprogestative, pilule microprogestative continue, implant sous-cutané, patch, anneau, DIU hormonal) et les méthodes non hormonales (DIU au cuivre, préservatifs externes ou internes, diaphragme). Les méthodes hormonales agissent en bloquant l’ovulation, en épaississant la glaire cervicale ou en amincissant l’endomètre. Le DIU au cuivre neutralise les spermatozoïdes par l’action spermicide naturelle des ions cuivre sans modifier le cycle hormonal.',
    whyItHappens: [
      'Nécessité d’éviter une grossesse non planifiée.',
      'Prise en charge de règles hémorragiques ou douloureuses par progestatifs.',
      'Recherche d’une méthode sans contrainte quotidienne d’horaire.'
    ],
    associatedSymptoms: [
      'Spotting lors des 3 premiers mois d’adaptation.',
      'Diminution ou disparition des saignements sous DIU hormonal ou implant.',
      'Règles parfois plus abondantes sous DIU au cuivre.'
    ],
    whatIsUsual: 'Une période d’adaptation de 3 cycles est habituelle lors de l’instauration d’une nouvelle méthode contraceptive.',
    whatMeritsConsultation: [
      'Oubli de pilule au-delà du délai toléré (généralement 12h pour combinée, 3h pour certaines microprogestatives) avec rapport récent.',
      'Maux de tête sévères inhabituels ou troubles visuels sous pilule combinée.',
      'Douleurs pelviennes persistantes après la pose d’un DIU.'
    ],
    urgentRedFlags: [
      'Mollet douloureux, gonflé et chaud (signe possible de phlébite / thrombose veineuse).',
      'Douleur thoracique subite avec essoufflement (embolie pulmonaire).'
    ],
    generalAdvice: [
      'Seul le préservatif protège à la fois d’une grossesse et des Infections Sexuellement Transmissibles (IST).',
      'Consultez votre notice spécifique ou demandez conseil à votre pharmacien en cas de vomissements ou diarrhées après la prise.'
    ],
    faq: [
      {
        question: 'Le DIU au cuivre rend-il stérile ?',
        answer: 'Faux. Le DIU au cuivre est entièrement réversible : la fertilité antérieure revient dès son retrait par un soignant.'
      }
    ],
    medicalSources: [
      { name: 'Haute Autorité de Santé (HAS)', description: 'Fiche mémo : Choix d’une méthode contraceptive chez la femme' },
      { name: 'Santé Publique France', description: 'Choixdeclic / Onsexprime' }
    ]
  },

  // 7. Pathologies - Endométriose
  {
    id: 'pathologies-endometriose',
    categoryId: 'pathologies',
    categoryName: 'Troubles gynécologiques',
    subCategory: 'Maladies inflammatoires chroniques',
    title: 'L’endométriose : reconnaître les signes et sortir de l’errance médicale',
    readTimeMinutes: 7,
    intro: 'L’endométriose touche environ 1 femme sur 10. Ce n’est pas un simple « mal de ventre » : c’est une maladie inflammatoire chronique où des tissus semblables à l’endomètre se développent hors de l’utérus.',
    detailedExplanation: 'Lors de chaque cycle, sous l’influence des hormones ovariennes, ces implants de tissu endométriosique greffés sur les ovaires, les trompes, les ligaments utérins, la vessie ou les intestins s’épaississent puis saignent. Contrairement au sang des règles expulsé par le col, ce sang piégé dans la cavité abdominale ne peut pas s’évacuer. Il crée des micro-lésions, une inflammation locale intense, des adhérences fibreuses et des kystes (endométriomes) qui expliquent les douleurs aiguës.',
    whyItHappens: [
      'Mécanismes complexes : reflux menstruel rétrograde associé à une prédisposition génétique et une défaillance de la clairance immunitaire péritonéale.',
      'Dérégulation inflammatoire et prolifération cellulaire hormonodépendante.'
    ],
    associatedSymptoms: [
      'Dysménorrhée sévère résistant aux antalgiques usuels (paracétamol inefficace).',
      'Douleurs profondes pendant ou après les rapports sexuels (dyspareunie).',
      'Douleurs à la défécation ou en urinant pendant les règles.',
      'Fatigue chronique invalidante.',
      'Difficultés potentielles pour concevoir.'
    ],
    whatIsUsual: 'Avoir mal au point de devoir manquer l’école, le travail ou rester clouée au lit n’est JAMAIS normal lors des règles.',
    whatMeritsConsultation: [
      'Douleurs menstruelles qui s’aggravent avec les années.',
      'Douleurs pelviennes chroniques quotidiennes même en dehors des règles.',
      'Troubles digestifs cycliques synchronisés avec le cycle.'
    ],
    urgentRedFlags: [
      'Occlusion intestinale aiguë (impossibilité d’émettre gaz ou selles avec vomissements).',
      'Rupture de kyste ovarien avec péritonite aiguë.'
    ],
    generalAdvice: [
      'Noter scrupuleusement la localisation et l’intensité de vos douleurs dans Mood pour constituer un dossier à présenter à un spécialiste.',
      'Demander une échographie pelvienne ou une IRM réalisée par un radiologue référent endométriose.',
      'L’alimentation anti-inflammatoire et la kinésithérapie pelvienne apportent souvent un soulagement complémentaire.'
    ],
    faq: [
      {
        question: 'L’endométriose empêche-t-elle toujours d’avoir des enfants ?',
        answer: 'Non. De nombreuses femmes atteintes d’endométriose mènent des grossesses spontanées. Pour d’autres, la PMA (Assistance Médicale à la Procréation) permet de surmonter les obstacles mécaniques.'
      }
    ],
    medicalSources: [
      { name: 'HAS / CNGOF', description: 'Recommandations pour la pratique clinique : Prise en charge de l’endométriose' },
      { name: 'INSERM', description: 'Dossier scientifique Endométriose' }
    ]
  },

  // 7. Pathologies - SOPK
  {
    id: 'pathologies-sopk',
    categoryId: 'pathologies',
    categoryName: 'Troubles gynécologiques',
    subCategory: 'Troubles endocriniens',
    title: 'Le Syndrome des Ovaires Polykystiques (SOPK)',
    readTimeMinutes: 6,
    intro: 'Le SOPK est le premier trouble hormonal chez les femmes en âge de procréer. Il se caractérise par une anomalie de la maturation des follicules et un excès d’androgènes.',
    detailedExplanation: 'Dans le SOPK, la régulation hypothalamo-hypophysaire est altérée (sécrétion excessive de LH) et souvent associée à une résistance à l’insuline. Au lieu qu’un seul follicule grossisse jusqu’à l’ovulation, de multiples petits follicules restent bloqués à un stade immature autour de l’ovaire, donnant un aspect « polykystique » à l’échographie. Les ovaires produisent alors un excès de testostérone.',
    whyItHappens: [
      'Terrain génétique multifactoriel associé à des facteurs épigénétiques et environnementaux.',
      'Résistance à l’insuline entraînant une hyperinsulinémie qui stimule la production ovarienne d’androgènes.'
    ],
    associatedSymptoms: [
      'Cycles longs, très irréguliers ou absence totale de règles.',
      'Hyperandrogénie clinique : acné persistante de l’adulte, excès de pilosité (hirsutisme), chute de cheveux (alopécie).',
      'Prise de poids difficile à réguler ou fatigue.'
    ],
    whatIsUsual: 'Le diagnostic repose sur les critères de Rotterdam (au moins 2 critères sur 3 : ovulation rare/absente, signes d’androgènes élevés, aspect échographique caractéristique).',
    whatMeritsConsultation: [
      'Cycles dépassant régulièrement 35 à 45 jours.',
      'Acné inflammatoire du bas du visage réfractaire aux soins dermatologiques usuels.'
    ],
    urgentRedFlags: [
      'Saignement utérin très abondant et prolongé après plusieurs mois sans règles (risque d’anémie aiguë).'
    ],
    generalAdvice: [
      'Adopter une alimentation à charge glycémique basse pour limiter les pics d’insuline.',
      'Pratiquer une activité physique régulière (musculation douce, marche active) qui améliore la sensibilité musculaire à l’insuline.',
      'Un bilan métabolique (glycémie, lipides) et hormonal est indispensable.'
    ],
    faq: [
      {
        question: 'Y a-t-il vraiment des « kystes » dans les ovaires ?',
        answer: 'Non, le terme est trompeur : ce ne sont pas de vrais kystes liquidiens pathologiques, mais simplement de nombreux petits follicules normaux en pause de développement.'
      }
    ],
    medicalSources: [
      { name: 'Monash University / ESHRE / ASRM', description: 'International Evidence-Based Guideline for PCOS' },
      { name: 'Inserm', description: 'SOPK : Première cause d’infertilité féminine' }
    ]
  },

  // 8. Fertilité - Conception et fenêtre fertile
  {
    id: 'fertilite-conception-fenetre',
    categoryId: 'fertility',
    categoryName: 'Fertilité',
    subCategory: 'Optimisation de la conception',
    title: 'Comprendre la fertilité et optimiser ses chances de conception',
    readTimeMinutes: 5,
    intro: 'La conception humaine est un processus biologique subtil. Connaître sa fenêtre de fertilité permet d’aborder son projet de grossesse avec sérénité et méthode.',
    detailedExplanation: 'La fenêtre fertile ne dure qu’environ 6 jours par cycle : les 5 jours précédant l’ovulation et le jour même de celle-ci. Cette durée correspond à la capacité des spermatozoïdes à survivre dans la glaire cervicale fertile (jusqu’à 3 à 5 jours) combinée à la brève survie de l’ovocyte (12 à 24 heures). Les rapports situés 1 à 2 jours avant l’ovulation offrent la plus forte probabilité statistique de fécondation.',
    whyItHappens: [
      'Rencontre entre un spermatozoïde capacite et un ovocyte mature dans le tiers externe de la trompe de Fallope.',
      'Implantation (nidation) du blastocyste dans l’endomètre environ 6 à 9 jours après la fécondation.'
    ],
    associatedSymptoms: [
      'Glaire cervicale étirable type « blanc d’œuf ».',
      'Légère hausse de la libido.',
      'Décalage thermique sur la courbe de température au lendemain de l’ovulation.'
    ],
    whatIsUsual: 'Pour un couple jeune et fertile, la probabilité de grossesse par cycle est d’environ 20 à 25 %. Il est normal que la conception demande entre 6 et 12 mois.',
    whatMeritsConsultation: [
      'Absence de conception après 12 mois de rapports réguliers non protégés (ou 6 mois si la femme a plus de 35 ans).',
      'Antécédents connus de chirurgie pelvienne, d’endométriose ou d’infections à Chlamydia.'
    ],
    urgentRedFlags: [
      'Antécédents de grossesse extra-utérine avec nouvelles douleurs unilatérales.'
    ],
    generalAdvice: [
      'Commencer une supplémentation en acide folique (vitamine B9, 400 µg/jour) dès le projet de conception pour prévenir les anomalies du tube neural du fœtus.',
      'Arrêter le tabac, l’alcool et limiter la caféine pour les deux partenaires.',
      'Avoir des rapports tous les 2 à 3 jours sans pression de calendrier strict.'
    ],
    faq: [
      {
        question: 'Faut-il avoir des rapports tous les jours pour maximiser les chances ?',
        answer: 'Pas nécessairement. Un rapport tous les deux jours durant la fenêtre fertile suffit largement et permet de préserver la concentration et la mobilité des spermatozoïdes.'
      }
    ],
    medicalSources: [
      { name: 'ACOG', description: 'Optimizing Natural Fertility Guidelines' },
      { name: 'Ameli', description: 'Désir d’enfant et consultation préconceptionnelle' }
    ]
  },

  // 9. Grossesse - Les premiers signes et repères
  {
    id: 'grossesse-premiers-signes',
    categoryId: 'pregnancy',
    categoryName: 'Grossesse',
    subCategory: 'Premier trimestre',
    title: 'Premiers signes de grossesse, test et repères semaine par semaine',
    readTimeMinutes: 6,
    intro: 'L’annonce d’une grossesse marque le début d’une grande aventure biologique. Savoir repérer les signes précoces et les étapes clés permet d’avancer en confiance.',
    detailedExplanation: 'Dès que le blastocyste s’implante dans la paroi utérine, le trophoblaste (futur placenta) commence à sécréter l’hormone bêta-hCG. Cette hormone maintient le corps jaune en activité pour continuer à produire de la progestérone, empêchant le décollement de l’endomètre. La concentration de hCG double environ toutes les 48 heures au début, ce qui est détecté par les tests de grossesse.',
    whyItHappens: [
      'Bouleversement hormonal rapide orchestré par l’élévation conjointe de la hCG, de la progestérone et des œstrogènes.',
      'Augmentation du volume sanguin maternel et vasodilatation.'
    ],
    associatedSymptoms: [
      'Retard franc de règles chez une femme habituellement réglée.',
      'Nausées matinales ou dégoût subit pour certaines odeurs.',
      'Fatigue intense et envie irrépressible de dormir.',
      'Seins gonflés, plus denses et aréoles foncées ou plus sensibles.'
    ],
    whatIsUsual: 'Certaines femmes ressentent de nombreux symptômes dès 2 à 3 semaines, tandis que d’autres ne ressentent absolument rien. Les deux situations sont courantes et n’ont pas de lien avec la viabilité de la grossesse.',
    whatMeritsConsultation: [
      'Confirmation de la grossesse par une prise de sang ou consultation médicale pour planifier l’échographie du premier trimestre (vers 11-13 semaines d’aménorrhée).',
      'Nausées incoercibles empêchant de s’alimenter ou de boire (hyperémèse gravidique).'
    ],
    urgentRedFlags: [
      'Saignements rouges vifs abondants associés à des crampes intenses.',
      'Douleur aiguë brutale localisée sur un côté du bas-ventre.',
      'Fièvre supérieure à 38 °C pendant la grossesse.'
    ],
    generalAdvice: [
      'Supprimer totalement l’alcool et le tabac dès la confirmation.',
      'Vérifier votre statut immunitaire contre la toxoplasmose et la rubéole avec votre médecin.',
      'Éviter les viandes crues, charcuteries artisanales et fromages au lait cru non pasteurisé.'
    ],
    faq: [
      {
        question: 'Quelle est la différence entre semaines de grossesse (SG) et semaines d’aménorrhée (SA) ?',
        answer: 'Les SA se comptent depuis le premier jour de vos dernières règles, tandis que les SG se comptent depuis la date présumée de fécondation (environ 2 semaines de moins que les SA).'
      }
    ],
    medicalSources: [
      { name: 'Collège National des Gynécologues et Obstétriciens Français', description: 'Suivi de la grossesse physiologique' },
      { name: 'HAS', description: 'Recommandations pour le suivi prénatal' }
    ]
  },

  // 10. Post-partum - Récupération et lochies
  {
    id: 'postpartum-recuperation-lochies',
    categoryId: 'postpartum',
    categoryName: 'Post-partum',
    subCategory: 'Quatrième trimestre',
    title: 'Post-partum : lochies, récupération physique et bienveillance mentale',
    readTimeMinutes: 6,
    intro: 'La période qui suit la naissance est un bouleversement à la fois physique, hormonal et émotionnel qui mérite toute l’attention et le repos possible.',
    detailedExplanation: 'Après la délivrance du placenta, l’utérus se contracte (les « tranchées ») pour refermer les vaisseaux sanguins et reprendre sa taille d’origine. Cette cicatrisation s’accompagne des lochies, des saignements qui durent de 3 à 6 semaines : d’abord rouge vif pendant les premiers jours, ils deviennent rosés, puis brunâtres et enfin jaunâtres avant de disparaître. La chute vertigineuse des hormones de grossesse vers le 3e-5e jour peut provoquer le classique « baby blues ».',
    whyItHappens: [
      'Cicatrisation de la plaie placentaire intra-utérine.',
      'Involution utérine sous l’action de l’ocytocine (stimulée notamment par la tétée).',
      'Chute brutale des œstrogènes et de la progestérone.'
    ],
    associatedSymptoms: [
      'Tranchées (contractions utérines soulagées par la chaleur ou antalgiques).',
      'Fatigue profonde liée au manque de sommeil.',
      'Sensibilité émotionnelle et pleurs faciles lors des premiers jours.',
      'Engorgement mammaire au moment de la montée de lait.'
    ],
    whatIsUsual: 'Le baby blues dure généralement entre 2 et 10 jours et se résout spontanément avec du soutien et du repos.',
    whatMeritsConsultation: [
      'Persistance d’une tristesse profonde, d’une anxiété permanente ou d’un sentiment d’incapacité au-delà de deux semaines (suspicion de dépression post-partum).',
      'Rééducation périnéale et abdominale à débuter 6 à 8 semaines après l’accouchement.'
    ],
    urgentRedFlags: [
      'Hémorragie de la délivrance tardive : saignements très soudains saturant plus de 2 protections par heure.',
      'Lochies à l’odeur nauséabonde accompagnées de fièvre ou de frissons (suspicion d’endométrite).',
      'Mollet douloureux et gonflé.'
    ],
    generalAdvice: [
      'Priorité absolue au repos : déléguez les tâches ménagères et préservez votre bulle.',
      'Utiliser des sous-vêtements confortables et des serviettes de maternité en coton.',
      'Parler librement de ses émotions sans honte : la dépression post-partum se soigne très bien lorsqu’elle est dépistée tôt.'
    ],
    faq: [
      {
        question: 'Quand reviennent les règles après l’accouchement ?',
        answer: 'Le « retour de couches » survient en général 6 à 8 semaines après la naissance en l’absence d’allaitement, et peut être décalé de plusieurs mois chez les femmes allaitant exclusivement.'
      }
    ],
    medicalSources: [
      { name: 'Santé Publique France', description: 'Les 1000 premiers jours : le post-partum' },
      { name: 'OMS', description: 'Recommandations pour les soins postnatals de la mère et du nouveau-né' }
    ]
  },

  // 11. Ménopause - Périménopause et signes
  {
    id: 'menopause-perimenopause-bouffees',
    categoryId: 'menopause',
    categoryName: 'Ménopause',
    subCategory: 'Transition hormonale',
    title: 'Périménopause et ménopause : apprivoiser la transition en douceur',
    readTimeMinutes: 5,
    intro: 'La ménopause est une étape naturelle de la vie reproductive d’une femme, marquée par l’arrêt définitif de l’activité ovarienne.',
    detailedExplanation: 'La périménopause précède la ménopause de 2 à 5 ans en moyenne (généralement entre 45 et 52 ans). La réserve d’ovocytes s’amenuise, les ovulations deviennent irrégulières, et les niveaux d’œstrogènes oscillent fortement avant de baisser durablement. La ménopause est confirmée a posteriori après 12 mois consécutifs d’absence complète de règles.',
    whyItHappens: [
      'Épuisement physiologique programmé du capital folliculaire ovarien.',
      'Baisse progressive de la sécrétion d’œstradiol et de progestérone.'
    ],
    associatedSymptoms: [
      'Cycles qui raccourcissent puis s’espacent de manière imprévisible.',
      'Bouffées de chaleur et sueurs nocturnes.',
      'Troubles du sommeil et fatigue matinale.',
      'Sécheresse cutanée et vaginale.'
    ],
    whatIsUsual: 'Ressentir des fluctuations d’énergie et de cycle autour de la cinquantaine est la norme biologique.',
    whatMeritsConsultation: [
      'Bouffées de chaleur altérant sévèrement la qualité de vie et le sommeil (discussion d’un Traitement Hormonal de la Ménopause - THM si approprié).',
      'Tout saignement survenant chez une femme ménopausée depuis plus d’un an (impératif d’investigation endométriale).'
    ],
    urgentRedFlags: [
      'Saignement vaginal abondant après la ménopause confirmée.'
    ],
    generalAdvice: [
      'Veiller aux apports en calcium et vitamine D pour préserver la densité osseuse.',
      'Pratiquer des exercices avec résistance (renforcement musculaire) pour protéger les os et les articulations.',
      'Utiliser des hydratants vaginaux à base d’acide hyaluronique pour le confort intime.'
    ],
    faq: [
      {
        question: 'Peut-on encore tomber enceinte en périménopause ?',
        answer: 'Oui, tant que les règles ne sont pas interrompues depuis 12 mois complets, des ovulations spontanées restent possibles.'
      }
    ],
    medicalSources: [
      { name: 'HAS', description: 'Prise en charge de la ménopause et place du THM' },
      { name: 'The North American Menopause Society (NAMS)', description: 'Menopause Practice Guidelines' }
    ]
  },

  // 12. Bien-être - Nutrition, sommeil et cycle
  {
    id: 'bien-etre-nutrition-sommeil',
    categoryId: 'wellness',
    categoryName: 'Bien-être & Hygiène de vie',
    subCategory: 'Rythmes biologiques et hygiène de vie',
    title: 'Adapter son alimentation, son sommeil et son sport selon les phases de son cycle',
    readTimeMinutes: 5,
    intro: 'Vivre au rythme de son cycle permet de travailler avec son corps plutôt que contre lui. Découvrez comment harmoniser votre quotidien.',
    detailedExplanation: 'Durant la phase folliculaire, l’augmentation des œstrogènes améliore la sensibilité à l’insuline et la récupération musculaire : c’est le moment idéal pour les entraînements intenses, les projets stimulants et une alimentation riche en antioxydants. En phase lutéale, la hausse de la progestérone augmente le métabolisme de base (d’environ 100 à 300 kcal/jour) tout en rendant le corps plus vulnérable à la déshydratation et aux fringales de sucre.',
    whyItHappens: [
      'Influence directe des hormones sexuelles sur les neurotransmetteurs cérébraux et le métabolisme énergétique.',
      'Fluctuations de la température interne affectant la profondeur du sommeil paradoxal.'
    ],
    associatedSymptoms: [
      'Pic d’endurance et de créativité vers le milieu du cycle.',
      'Besoin accru de sommeil et de calories réconfortantes avant les règles.',
      'Tendance accrue à la rétention d’eau en phase prémenstruelle.'
    ],
    whatIsUsual: 'Avoir un appétit plus important et un besoin de repos les 3 à 5 jours avant les règles est biologiquement fondé.',
    whatMeritsConsultation: [
      'Insomnies chroniques sévères récurrentes chaque mois.',
      'Compulsions alimentaires prémenstruelles incontrôlables associées à une souffrance morale.'
    ],
    urgentRedFlags: [
      'Épuisement total avec incapacité à se lever ou dénutrition.'
    ],
    generalAdvice: [
      'Augmenter les apports en magnésium (chocolat noir, amandes, légumes verts) pour apaiser le système nerveux en phase lutéale.',
      'Boire au moins 1,5 à 2 litres d’eau par jour pour limiter les ballonnements.',
      'Privilégier le yoga doux, la marche ou les étirements pendant les menstruations.'
    ],
    faq: [
      {
        question: 'Le sport est-il déconseillé pendant les règles ?',
        answer: 'Au contraire ! Une activité modérée libère des endorphines naturelles qui soulagent efficacement les crampes utérines.'
      }
    ],
    medicalSources: [
      { name: 'Inserm', description: 'Rythmes circadiens, sommeil et santé des femmes' },
      { name: 'OMS', description: 'Activité physique et bien-être mental' }
    ]
  }
];

export function getArticleById(id: string): MedicalArticle | undefined {
  return MEDICAL_ARTICLES.find(article => article.id === id);
}

export function searchArticles(query: string, categoryFilter?: string): MedicalArticle[] {
  const normalizedQuery = query.toLowerCase().trim();
  return MEDICAL_ARTICLES.filter(article => {
    if (categoryFilter && categoryFilter !== 'all' && article.categoryId !== categoryFilter) {
      return false;
    }
    if (!normalizedQuery) return true;
    return (
      article.title.toLowerCase().includes(normalizedQuery) ||
      article.intro.toLowerCase().includes(normalizedQuery) ||
      article.detailedExplanation.toLowerCase().includes(normalizedQuery) ||
      article.subCategory.toLowerCase().includes(normalizedQuery) ||
      article.associatedSymptoms.some(s => s.toLowerCase().includes(normalizedQuery)) ||
      article.whyItHappens.some(w => w.toLowerCase().includes(normalizedQuery))
    );
  });
}
