import React, { useState } from 'react';
import {
  ENCYCLOPEDIA_CATEGORIES,
  MEDICAL_ARTICLES,
  searchArticles,
  getArticleById
} from '../data/encyclopedia';
import { MedicalArticle } from '../types';
import {
  BookOpen,
  Search,
  Clock,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Bookmark,
  Share2
} from 'lucide-react';

interface EncyclopediaViewProps {
  initialArticleId?: string;
}

export const EncyclopediaView: React.FC<EncyclopediaViewProps> = ({ initialArticleId }) => {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(initialArticleId || null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [savedArticles, setSavedArticles] = useState<string[]>([]);

  const filteredArticles = searchArticles(searchQuery, selectedCategory);
  const activeArticle = selectedArticleId ? getArticleById(selectedArticleId) : null;

  const toggleSaveArticle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedArticles(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* If an article is open, render full detailed reader */}
      {activeArticle ? (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Back button & actions */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setSelectedArticleId(null)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-rose-100 text-xs font-bold text-zinc-700 hover:bg-rose-50 shadow-2xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Retour à l'encyclopédie
            </button>

            <button
              type="button"
              onClick={e => toggleSaveArticle(activeArticle.id, e)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                savedArticles.includes(activeArticle.id)
                  ? 'bg-rose-500 text-white border-rose-600'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              {savedArticles.includes(activeArticle.id) ? 'Enregistré' : 'Marquer comme favori'}
            </button>
          </div>

          {/* Article Container */}
          <article className="p-6 sm:p-10 rounded-3xl bg-white border border-rose-100/80 shadow-xs space-y-8">
            {/* Header / Subcategory */}
            <div className="space-y-2 border-b border-rose-100 pb-6">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                  {activeArticle.categoryName}
                </span>
                <span className="text-xs text-zinc-400 font-medium">
                  • {activeArticle.subCategory}
                </span>
                <span className="text-xs text-zinc-400 flex items-center gap-1 ml-auto">
                  <Clock className="w-3.5 h-3.5" /> {activeArticle.readTimeMinutes} min de lecture
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight leading-snug">
                {activeArticle.title}
              </h1>
            </div>

            {/* 1. Intro */}
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 text-sm font-medium text-rose-950 leading-relaxed italic">
              « {activeArticle.intro} »
            </div>

            {/* 2. Detailed explanation */}
            <div className="space-y-3">
              <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-rose-500" />
                Explication médicale détaillée
              </h2>
              <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
                {activeArticle.detailedExplanation}
              </p>
            </div>

            {/* 3. Why it happens & Symptoms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/70 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                  Pourquoi cela peut arriver
                </h3>
                <ul className="space-y-1.5 text-xs text-zinc-600">
                  {activeArticle.whyItHappens.map((why, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span>{why}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/70 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                  Symptômes souvent associés
                </h3>
                <ul className="space-y-1.5 text-xs text-zinc-600">
                  {activeArticle.associatedSymptoms.map((sym, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 4. What is usual vs When to consult */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Ce qui est habituel et normal
                </h3>
                <p className="text-xs text-emerald-900/90 leading-relaxed">
                  {activeArticle.whatIsUsual}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  Ce qui mérite une consultation
                </h3>
                <ul className="space-y-1 text-xs text-amber-950/90">
                  {activeArticle.whatMeritsConsultation.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 5. Urgent Red flags */}
            <div className="p-5 rounded-2xl bg-red-50 border border-red-200 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Signes nécessitant une prise en charge urgente
              </h3>
              <ul className="space-y-1.5 text-xs text-red-900">
                {activeArticle.urgentRedFlags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-bold text-red-600">!</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-red-700/80 pt-1 font-medium">
                En cas de doute immédiat, contactez le 15, le 112 ou rendez-vous aux urgences médicales les plus proches.
              </p>
            </div>

            {/* 6. General advice */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-zinc-900">
                Conseils bien-être & Recommandations douces
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeArticle.generalAdvice.map((adv, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 text-xs text-zinc-700">
                    {adv}
                  </div>
                ))}
              </div>
            </div>

            {/* 7. FAQ */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-900">
                Foire aux questions fréquentes (FAQ)
              </h3>
              <div className="space-y-3">
                {activeArticle.faq.map((item, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1.5">
                    <h4 className="text-xs font-bold text-zinc-900">
                      Q : {item.question}
                    </h4>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      R : {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. Medical Sources */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Sources médicales vérifiées & Références :
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeArticle.medicalSources.map((source, i) => (
                  <div key={i} className="text-[11px] px-3 py-1 rounded-lg bg-white border border-zinc-200 text-zinc-700">
                    <strong className="text-rose-700">{source.name}</strong> — {source.description}
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>
      ) : (
        /* Category catalog & article listing */
        <div className="space-y-8">
          {/* Header & Search */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
                Comprendre mon corps — Encyclopédie médicale
              </h2>
              <p className="text-sm text-zinc-500">
                Documentation médicale vérifiée, claire, accessible et 100% disponible hors connexion
              </p>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher un terme, une hormone, un symptôme (ex : sang marron, œstrogènes, endométriose)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-rose-200 text-sm text-zinc-800 placeholder-zinc-400 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-rose-400"
              />
            </div>

            {/* Category horizontal filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-white text-zinc-600 hover:bg-rose-50 border border-zinc-200'
                }`}
              >
                Tous les thèmes ({MEDICAL_ARTICLES.length})
              </button>
              {ENCYCLOPEDIA_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-white text-zinc-600 hover:bg-rose-50 border border-zinc-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* 12 Categories grid overview */}
          {selectedCategory === 'all' && !searchQuery && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {ENCYCLOPEDIA_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className="p-3.5 rounded-2xl bg-white border border-rose-100 hover:border-rose-300 hover:shadow-xs transition-all text-left flex flex-col justify-between group"
                >
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block w-fit mb-2 ${cat.color}`}>
                    {cat.name}
                  </span>
                  <p className="text-[11px] text-zinc-500 line-clamp-2 leading-tight">
                    {cat.description}
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* Articles list */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-zinc-900">
              Articles disponibles ({filteredArticles.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArticles.map(article => (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticleId(article.id)}
                  className="p-5 rounded-3xl bg-white border border-rose-100 hover:border-rose-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700">
                        {article.categoryName}
                      </span>
                      <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {article.readTimeMinutes} min
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-zinc-900 group-hover:text-rose-600 transition-colors leading-snug">
                      {article.title}
                    </h4>

                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                      {article.intro}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-100 text-xs">
                    <span className="text-rose-600 font-bold group-hover:underline flex items-center gap-1">
                      Lire l'article complet <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                    <button
                      type="button"
                      onClick={e => toggleSaveArticle(article.id, e)}
                      className="text-zinc-400 hover:text-rose-500"
                    >
                      <Bookmark className={`w-4 h-4 ${savedArticles.includes(article.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
