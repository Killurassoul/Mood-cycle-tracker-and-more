import React from 'react';
import {
  Home,
  Calendar,
  Activity,
  Heart,
  BookOpen,
  HelpCircle,
  Baby,
  FileText,
  Bell,
  BarChart3,
  User,
  Bot,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  Layers,
  Smile
} from 'lucide-react';
import { AppLanguage } from '../types';
import { getTranslation } from '../locales/i18n';

export type NavTabId =
  | 'home'
  | 'routine'
  | 'progress'
  | 'cycle'
  | 'body'
  | 'mood'
  | 'encyclopedia'
  | 'normality'
  | 'fertility'
  | 'healthRecords'
  | 'assistant'
  | 'statistics'
  | 'reminders'
  | 'profile';

interface NavbarProps {
  currentTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  lang: AppLanguage;
  discreteMode: boolean;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenQuickAdd: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  lang,
  discreteMode,
  isSidebarCollapsed,
  onToggleSidebar,
  onOpenQuickAdd
}) => {
  const t = getTranslation(lang);

  const NAV_ITEMS: Array<{ id: NavTabId; label: string; icon: any; badge?: string }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'routine', label: 'My Routine', icon: Layers, badge: 'Glow' },
    { id: 'progress', label: 'My Progress', icon: BarChart3, badge: 'Score 85' },
    { id: 'cycle', label: t.nav.cycle, icon: Calendar },
    { id: 'body', label: t.nav.body, icon: Activity },
    { id: 'mood', label: t.nav.mood, icon: Heart },
    { id: 'normality', label: t.nav.normality, icon: HelpCircle, badge: 'Guide' },
    { id: 'encyclopedia', label: t.nav.encyclopedia, icon: BookOpen },
    { id: 'assistant', label: t.nav.assistant, icon: Bot },
    { id: 'fertility', label: t.nav.fertility, icon: Baby },
    { id: 'healthRecords', label: t.nav.healthRecords, icon: FileText, badge: 'PDF' },
    { id: 'statistics', label: t.nav.statistics, icon: BarChart3 },
    { id: 'reminders', label: t.nav.reminders, icon: Bell },
    { id: 'profile', label: t.nav.profile, icon: User }
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col border-r border-rose-200/70 bg-linear-to-b from-white via-rose-50/30 to-pink-50/20 transition-all duration-300 z-30 shrink-0 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand header with hot pink badge */}
        <div className="flex items-center justify-between p-4 border-b border-rose-100">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-[#FF7A9C] to-[#FF4370] text-white flex items-center justify-center font-bold text-lg shadow-md shadow-rose-200">
                ✨
              </div>
              <div>
                <h1 className="text-lg font-black text-zinc-900 tracking-tight leading-none">
                  Mood
                </h1>
                <span className="text-[10px] text-[#FF5B84] font-extrabold tracking-wider uppercase">
                  {discreteMode ? 'Espace Privé' : 'Glow & Cycle'}
                </span>
              </div>
            </div>
          )}

          {isSidebarCollapsed && (
            <div className="mx-auto w-10 h-10 rounded-2xl bg-linear-to-tr from-[#FF7A9C] to-[#FF4370] text-white flex items-center justify-center font-bold shadow-md">
              ✨
            </div>
          )}

          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-rose-100 transition-colors"
            title={isSidebarCollapsed ? 'Agrandir la barre' : 'Réduire la barre'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = currentTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                title={isSidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-[#FF6584] text-white shadow-md shadow-rose-300/50 scale-[1.01]'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-rose-100/60'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-zinc-500'}`} />
                {!isSidebarCollapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}
                {!isSidebarCollapsed && item.badge && !active && (
                  <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-rose-100 text-[#FF5B84]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer CTA: Quick add */}
        {!isSidebarCollapsed && (
          <div className="p-4 border-t border-rose-100/80">
            <button
              type="button"
              onClick={onOpenQuickAdd}
              className="w-full py-3 rounded-2xl bg-linear-to-r from-[#FF7A9C] to-[#FF4370] text-white text-xs font-extrabold shadow-md shadow-rose-200 flex items-center justify-center gap-2 hover:opacity-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Noter mon état</span>
            </button>
          </div>
        )}
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR (Exact visual match from user screenshot!) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-rose-200/80 px-4 py-2 shadow-xl">
        <div className="flex items-center justify-between max-w-md mx-auto relative">
          {/* 1. Home */}
          <button
            type="button"
            onClick={() => onSelectTab('home')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              currentTab === 'home' ? 'text-[#FF5B84] font-black' : 'text-zinc-400'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-bold">Home</span>
          </button>

          {/* 2. Routine */}
          <button
            type="button"
            onClick={() => onSelectTab('routine')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              currentTab === 'routine' ? 'text-[#FF5B84] font-black' : 'text-zinc-400'
            }`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-bold">Routine</span>
          </button>

          {/* 3. Floating Big Pink Plus Button in Center (Matching image exactly) */}
          <div className="relative -top-5">
            <button
              type="button"
              onClick={onOpenQuickAdd}
              className="w-13 h-13 rounded-full bg-[#FF5B84] hover:bg-[#FF4370] active:scale-95 text-white flex items-center justify-center shadow-lg shadow-rose-400/60 transition-all border-4 border-white"
              title="Noter mon état"
            >
              <Plus className="w-6 h-6 stroke-[3]" />
            </button>
          </div>

          {/* 4. Progress */}
          <button
            type="button"
            onClick={() => onSelectTab('progress')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              currentTab === 'progress' ? 'text-[#FF5B84] font-black' : 'text-zinc-400'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-bold">Progress</span>
          </button>

          {/* 5. Profile / More */}
          <button
            type="button"
            onClick={() => onSelectTab('profile')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              currentTab === 'profile' ? 'text-[#FF5B84] font-black' : 'text-zinc-400'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-bold">Profile</span>
          </button>
        </div>
      </nav>
    </>
  );
};
