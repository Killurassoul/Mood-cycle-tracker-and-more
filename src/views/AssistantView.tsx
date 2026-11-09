import React, { useState } from 'react';
import { MEDICAL_ARTICLES, getArticleById } from '../data/encyclopedia';
import { MedicalArticle } from '../types';
import {
  Bot,
  Send,
  BookOpen,
  Sparkles,
  Shield,
  HelpCircle,
  ExternalLink,
  User,
  Heart
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  articles?: MedicalArticle[];
  followUpSuggestions?: string[];
  medicalSources?: string[];
  timestamp: string;
}

interface AssistantViewProps {
  onOpenArticle: (id: string) => void;
}

const PRESET_QUESTIONS = [
  'Pourquoi mes règles sont-elles marron ou foncées ?',
  'Comment reconnaître les signes de mon ovulation ?',
  'Est-il normal d’avoir très mal pendant ses règles ?',
  'Pertes blanches ou mycose : comment faire la différence ?',
  'Qu’est-ce que le Syndrome des Ovaires Polykystiques (SOPK) ?',
  'Que faire en cas d’oubli de pilule contraceptive ?'
];

export const AssistantView: React.FC<AssistantViewProps> = ({ onOpenArticle }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Bonjour ! Je suis l’assistante documentaire de Mood. Je fonctionne 100% hors connexion à partir de notre base médicale vérifiée (INSERM, OMS, HAS, ACOG, Ameli). Tu peux me poser tes questions en toute intimité.',
      followUpSuggestions: [
        'Pourquoi mes règles sont-elles marron ?',
        'Comment observer ma glaire cervicale ?',
        'Douleurs fortes de règles : est-ce l’endométriose ?'
      ],
      timestamp: 'À l’instant'
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const findDocumentedAnswer = (query: string): {
    answer: string;
    articles: MedicalArticle[];
    followUps: string[];
    sources: string[];
  } => {
    const q = query.toLowerCase().trim();

    // 1. Brown blood / old blood
    if (q.includes('marron') || q.includes('brun') || q.includes('noir') || q.includes('vieux sang')) {
      const art = getArticleById('menstruation-sang-marron')!;
      return {
        answer: 'Le sang marron ou foncé en début ou fin de règles est un phénomène très courant et physiologique. Il s’agit simplement de sang qui s’est écoulé plus lentement le long des parois utérines et vaginales, laissant à l’hémoglobine le temps d’entrer en contact avec l’oxygène (oxydation du fer). Tant qu’il n’est pas associé à une odeur inhabituelle, de la fièvre ou des brûlures, il est tout à fait bénin.',
        articles: [art],
        followUps: [
          'Le sang marron peut-il être un signe de nidation ?',
          'Quelle est la durée normale des règles ?',
          'Quand consulter pour des saignements anormaux ?'
        ],
        sources: ['INSERM', 'ACOG', 'Ameli']
      };
    }

    // 2. Late period
    if (q.includes('retard') || q.includes('pas de règles') || q.includes('aménorrhée')) {
      const art = getArticleById('menstruation-retard-regles')!;
      return {
        answer: 'Un retard de règles de quelques jours est fréquent. En dehors d’une grossesse (à vérifier par un test urinaire), le stress aigu, la fatigue, un voyage ou une perte de poids rapide peuvent retarder la libération de l’ovocyte par l’ovaire. Au-delà de 7 jours de retard par rapport à votre cycle le plus long, un test de grossesse urinaire est conseillé.',
        articles: [art],
        followUps: [
          'Comment le stress bloque-t-il l’ovulation ?',
          'À partir de quand parle-t-on d’aménorrhée ?'
        ],
        sources: ['OMS', 'CNGOF', 'NHS']
      };
    }

    // 3. Ovulation & Cervical mucus
    if (q.includes('ovulation') || q.includes('glaire') || q.includes('blanc d’oeuf') || q.includes('fertile')) {
      const art = getArticleById('ovulation-signes-glaire')!;
      return {
        answer: 'Au moment de l’ovulation, la glaire cervicale sécrétée par le col devient translucide, fluide et très étirable, semblable à du blanc d’œuf cru. Cela signale votre pic de fertilité. Vous pouvez également observer un regain d’énergie ou un léger pincement pelvien d’un côté.',
        articles: [art],
        followUps: [
          'Combien de temps l’ovocyte survit-il après libération ?',
          'Comment suivre sa température basale ?'
        ],
        sources: ['INSERM', 'ACOG']
      };
    }

    // 4. Endometriosis / Severe pain
    if (q.includes('endométriose') || q.includes('mal pendant mes règles') || q.includes('crampes') || q.includes('dysménorrhée')) {
      const art = getArticleById('pathologies-endometriose')!;
      return {
        answer: 'Des règles douloureuses qui vous empêchent de travailler, d’aller en cours ou qui ne cèdent pas aux antalgiques usuels (paracétamol) NE SONT PAS NORMALES. Cela peut évoquer une endométriose, touchant 1 femme sur 10. Des tissus semblables à l’endomètre se développent alors hors de l’utérus et saignent sans pouvoir s’évacuer.',
        articles: [art],
        followUps: [
          'Quels examens permettent de dépister l’endométriose ?',
          'L’endométriose empêche-t-elle d’avoir des enfants ?'
        ],
        sources: ['HAS / CNGOF', 'INSERM']
      };
    }

    // 5. Vaginal discharge / Yeast infection
    if (q.includes('perte') || q.includes('mycose') || q.includes('démangeaison') || q.includes('odeur') || q.includes('vaginose')) {
      const art = getArticleById('sante-vaginale-pertes-mycoses')!;
      return {
        answer: 'Les pertes blanches inodores sont physiologiques et nettoient le vagin. En revanche, des pertes blanches compactes comme du lait caillé avec de fortes démangeaisons évoquent une mycose (Candida albicans). Si l’odeur rappelle le poisson fermenté, il peut s’agir d’une vaginose bactérienne. Ne faites jamais de douches vaginales internes.',
        articles: [art],
        followUps: [
          'La mycose est-elle transmissible sexuellement ?',
          'Comment nettoyer sa vulve sans abîmer sa flore ?'
        ],
        sources: ['Haute Autorité de Santé (HAS)', 'CDC']
      };
    }

    // 6. PCOS
    if (q.includes('sopk') || q.includes('polykystique') || q.includes('acné') || q.includes('androgène')) {
      const art = getArticleById('pathologies-sopk')!;
      return {
        answer: 'Le SOPK (Syndrome des Ovaires Polykystiques) est le premier trouble hormonal féminin. Il associe des cycles longs ou absents, une hyperandrogénie (acné, pilosité) et de nombreux petits follicules immatures dans les ovaires. Une prise en charge globale (alimentation à indice glycémique bas, bilan hormonal) permet d’atténuer considérablement les symptômes.',
        articles: [art],
        followUps: [
          'Y a-t-il vraiment des kystes dangereux dans les ovaires ?',
          'Comment le SOPK impacte-t-il la fertilité ?'
        ],
        sources: ['Monash University Guidelines', 'INSERM']
      };
    }

    // Fallback: search all articles with broader keywords
    const matches = MEDICAL_ARTICLES.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.intro.toLowerCase().includes(q) ||
      a.whyItHappens.some(w => w.toLowerCase().includes(q))
    );

    if (matches.length > 0) {
      return {
        answer: `J'ai trouvé ${matches.length} article(s) dans notre documentation médicale correspondant à votre question. Voici les informations documentées extraites :`,
        articles: matches.slice(0, 2),
        followUps: ['Poser une question plus précise', 'Consulter toute l’encyclopédie'],
        sources: ['Base documentaire locale Mood']
      };
    }

    // Neutral safety fallback
    return {
      answer: 'Je n’ai pas de réponse documentaire pré-validée spécifique pour cette formulation exacte dans ma base hors-ligne. En tant qu’assistante médicale éthique, je ne peux pas inventer de diagnostic ni de prescription. Je t’invite à explorer les catégories de l’encyclopédie ou à échanger avec ta sage-femme ou ton médecin traitant.',
      articles: [],
      followUps: [
        'Pourquoi mes règles sont-elles marron ?',
        'Comment reconnaître l’endométriose ?',
        'Consulter l’encyclopédie médicale'
      ],
      sources: ['Comité médical de référence Mood']
    };
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'À l’instant'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const result = findDocumentedAnswer(query);
      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: result.answer,
        articles: result.articles,
        followUpSuggestions: result.followUps,
        medicalSources: result.sources,
        timestamp: 'À l’instant'
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            <Bot className="w-6 h-6 text-rose-500" />
            Assistante documentaire Mood
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Réponses bienveillantes, sourcées et 100% hors connexion
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Hors connexion actif
        </div>
      </div>

      {/* Suggested chips if conversation is young */}
      {messages.length <= 2 && (
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Questions fréquentes documentées :
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_QUESTIONS.map(q => (
              <button
                key={q}
                type="button"
                onClick={() => handleSend(q)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 border border-rose-100 text-zinc-700 hover:text-rose-700 text-xs font-medium shadow-2xs transition-colors text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages stream */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-rose-100 shadow-xs min-h-[420px] max-h-[560px] overflow-y-auto space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-3xl p-4 sm:p-5 space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-rose-500 text-white shadow-xs rounded-tr-xs'
                  : 'bg-zinc-50 border border-rose-100 text-zinc-800 rounded-tl-xs'
              }`}
            >
              <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {msg.text}
              </p>

              {/* Linked articles card */}
              {msg.articles && msg.articles.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-rose-100/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 block">
                    Article(s) complet(s) associé(s) :
                  </span>
                  {msg.articles.map(art => (
                    <button
                      key={art.id}
                      type="button"
                      onClick={() => onOpenArticle(art.id)}
                      className="w-full p-3 rounded-2xl bg-white hover:bg-rose-50 border border-rose-200 text-left transition-all flex items-center justify-between group shadow-2xs"
                    >
                      <div>
                        <span className="text-xs font-bold text-zinc-900 group-hover:text-rose-700">
                          {art.title}
                        </span>
                        <span className="text-[10px] text-zinc-400 block mt-0.5">
                          {art.categoryName} • {art.readTimeMinutes} min de lecture
                        </span>
                      </div>
                      <BookOpen className="w-4 h-4 text-rose-400 group-hover:text-rose-600 shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {/* Sources */}
              {msg.medicalSources && msg.medicalSources.length > 0 && (
                <div className="text-[10px] text-zinc-400 pt-1">
                  Sources médicales de référence : <strong className="text-zinc-600">{msg.medicalSources.join(', ')}</strong>
                </div>
              )}

              {/* Follow-up suggestions */}
              {msg.followUpSuggestions && msg.followUpSuggestions.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {msg.followUpSuggestions.map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSend(sug)}
                      className="px-2.5 py-1 rounded-lg bg-rose-100/60 hover:bg-rose-200 text-rose-900 text-[11px] font-medium transition-colors"
                    >
                      {sug} →
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2 items-center text-xs text-zinc-400 pl-11">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce delay-100" />
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce delay-200" />
            <span className="ml-1">Recherche dans la base médicale Mood...</span>
          </div>
        )}
      </div>

      {/* Input bar */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Pose ta question en langage naturel (ex : Pourquoi mes règles sont-elles foncées ?)..."
          className="flex-1 p-3.5 rounded-2xl bg-white border border-rose-200 text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-rose-400"
        />
        <button
          type="submit"
          className="px-5 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all flex items-center gap-1.5"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Envoyer</span>
        </button>
      </form>
    </div>
  );
};
