/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  CycleRecord,
  DailyLog,
  ReminderItem,
  HealthAppointment,
  MedicationItem,
  ContraceptionRecord,
  SkincareProduct,
  SkinProgressData
} from './types';
import { StorageService } from './services/storage';
import { calculateCycleStatus, formatDate } from './services/cycleCalculator';
import {
  DEFAULT_MORNING_ROUTINE,
  DEFAULT_NIGHT_ROUTINE,
  DEFAULT_SKIN_PROGRESS
} from './data/skincareData';
import { Navbar, NavTabId } from './components/Navbar';
import { Header } from './components/Header';
import { PinLockModal } from './components/PinLockModal';
import { OnboardingModal } from './components/OnboardingModal';
import { DailyLogModal } from './components/DailyLogModal';

// Views
import { DashboardView } from './views/DashboardView';
import { RoutineView } from './views/RoutineView';
import { ProgressView } from './views/ProgressView';
import { CycleView } from './views/CycleView';
import { BodyView } from './views/BodyView';
import { MoodView } from './views/MoodView';
import { EncyclopediaView } from './views/EncyclopediaView';
import { NormalityChecker } from './views/NormalityChecker';
import { AssistantView } from './views/AssistantView';
import { FertilityPregnancyView } from './views/FertilityPregnancyView';
import { HealthRecordsView } from './views/HealthRecordsView';
import { StatisticsView } from './views/StatisticsView';
import { RemindersView } from './views/RemindersView';
import { ProfileSecurityView } from './views/ProfileSecurityView';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(StorageService.getProfile());
  const [cycles, setCycles] = useState<CycleRecord[]>(StorageService.getCycles());
  const [dailyLogs, setDailyLogs] = useState<Record<string, DailyLog>>(StorageService.getDailyLogs());
  const [reminders, setReminders] = useState<ReminderItem[]>(StorageService.getReminders());
  const [appointments, setAppointments] = useState<HealthAppointment[]>(StorageService.getAppointments());
  const [medications, setMedications] = useState<MedicationItem[]>(StorageService.getMedications());
  const [contraception, setContraception] = useState<ContraceptionRecord>(StorageService.getContraception());

  // Skincare and Glow states
  const [morningRoutine, setMorningRoutine] = useState<SkincareProduct[]>(() => {
    try {
      const saved = localStorage.getItem('mood_morning_routine_v1');
      return saved ? JSON.parse(saved) : DEFAULT_MORNING_ROUTINE;
    } catch {
      return DEFAULT_MORNING_ROUTINE;
    }
  });

  const [nightRoutine, setNightRoutine] = useState<SkincareProduct[]>(() => {
    try {
      const saved = localStorage.getItem('mood_night_routine_v1');
      return saved ? JSON.parse(saved) : DEFAULT_NIGHT_ROUTINE;
    } catch {
      return DEFAULT_NIGHT_ROUTINE;
    }
  });

  const [progressData, setProgressData] = useState<SkinProgressData>(() => {
    try {
      const saved = localStorage.getItem('mood_skin_progress_v1');
      return saved ? JSON.parse(saved) : DEFAULT_SKIN_PROGRESS;
    } catch {
      return DEFAULT_SKIN_PROGRESS;
    }
  });

  // Navigation & UI state
  const [currentTab, setCurrentTab] = useState<NavTabId>('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(StorageService.isSessionLocked());
  const [showOnboarding, setShowOnboarding] = useState<boolean>(!profile.onboarded);

  // Daily log modal state
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);
  const [logModalDate, setLogModalDate] = useState<string>(formatDate(new Date()));

  // Active article state for encyclopedia jump
  const [selectedArticleId, setSelectedArticleId] = useState<string | undefined>(undefined);

  // Today string & current log
  const todayStr = formatDate(new Date());
  const todayLog = dailyLogs[todayStr] || {
    date: todayStr,
    flow: 'none',
    symptoms: [],
    painLocations: [],
    waterGlasses: 0,
    sleepHours: 7.5
  };

  // Recalculate cycle status whenever cycles or profile change
  const cycleStats = calculateCycleStatus(cycles, profile.cycleLength, profile.periodLength);

  // Permanent light pink theme - dark theme removed per user request
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // Save skincare routines
  const handleUpdateMorningRoutine = (routine: SkincareProduct[]) => {
    setMorningRoutine(routine);
    localStorage.setItem('mood_morning_routine_v1', JSON.stringify(routine));
  };

  const handleUpdateNightRoutine = (routine: SkincareProduct[]) => {
    setNightRoutine(routine);
    localStorage.setItem('mood_night_routine_v1', JSON.stringify(routine));
  };

  const handleUpdateProgressData = (data: SkinProgressData) => {
    setProgressData(data);
    localStorage.setItem('mood_skin_progress_v1', JSON.stringify(data));
  };

  // Profile handlers
  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    StorageService.saveProfile(updated);
  };

  const handleToggleTheme = () => {
    handleUpdateProfile({ theme: profile.theme === 'light' ? 'dark' : 'light' });
  };

  const handleToggleDiscreteMode = () => {
    handleUpdateProfile({ discreteMode: !profile.discreteMode });
  };

  const handleLockNow = () => {
    StorageService.lockSession();
    setIsLocked(true);
  };

  const handleUnlocked = () => {
    StorageService.unlockSession();
    setIsLocked(false);
  };

  // Cycle handlers
  const handleSaveCycle = (cycle: CycleRecord) => {
    const updated = StorageService.addOrUpdateCycle(cycle);
    setCycles([...updated]);
  };

  const handleDeleteCycle = (id: string) => {
    const updated = StorageService.deleteCycle(id);
    setCycles([...updated]);
  };

  // Daily Log handlers
  const handleSaveDailyLog = (log: DailyLog) => {
    StorageService.saveDailyLog(log);
    setDailyLogs({ ...StorageService.getDailyLogs() });
  };

  // Quick actions
  const handleQuickMoodSelect = (mood: string) => {
    const updated: DailyLog = {
      ...todayLog,
      quickMood: mood
    };
    handleSaveDailyLog(updated);
  };

  const handleQuickLogPeriodStart = () => {
    const newCycle: CycleRecord = {
      id: `cycle-${Date.now()}`,
      startDate: todayStr,
      periodDuration: profile.periodLength,
      flowIntensity: 'medium',
      notes: 'Début de règles enregistré rapidement'
    };
    handleSaveCycle(newCycle);
    const updatedLog: DailyLog = {
      ...todayLog,
      flow: 'medium'
    };
    handleSaveDailyLog(updatedLog);
  };

  const handleOpenLogModalForDate = (dateStr: string) => {
    setLogModalDate(dateStr);
    setIsLogModalOpen(true);
  };

  const handleOpenArticle = (articleId: string) => {
    setSelectedArticleId(articleId);
    setCurrentTab('encyclopedia');
  };

  const handleOnboardingComplete = (data: Partial<UserProfile>, lastPeriodDate?: string) => {
    const updated = { ...profile, ...data, onboarded: true };
    setProfile(updated);
    StorageService.saveProfile(updated);
    setShowOnboarding(false);

    if (lastPeriodDate) {
      const newCycle: CycleRecord = {
        id: `cycle-${Date.now()}`,
        startDate: lastPeriodDate,
        periodDuration: updated.periodLength,
        flowIntensity: 'medium',
        notes: 'Dernier cycle renseigné lors de l’onboarding'
      };
      handleSaveCycle(newCycle);
    }
  };

  const handleDataReset = () => {
    setProfile(StorageService.getProfile());
    setCycles(StorageService.getCycles());
    setDailyLogs(StorageService.getDailyLogs());
    setReminders(StorageService.getReminders());
    setAppointments(StorageService.getAppointments());
    setMedications(StorageService.getMedications());
    setContraception(StorageService.getContraception());
    setMorningRoutine(DEFAULT_MORNING_ROUTINE);
    setNightRoutine(DEFAULT_NIGHT_ROUTINE);
    setProgressData(DEFAULT_SKIN_PROGRESS);
    setCurrentTab('home');
  };

  // Determine text scale class
  const textScaleClass =
    profile.textSize === 'large'
      ? 'text-scale-large'
      : profile.textSize === 'xlarge'
      ? 'text-scale-xlarge'
      : 'text-scale-normal';

  return (
    <div
      className={`min-h-screen flex bg-[#FFF5F8] text-zinc-800 font-sans transition-colors duration-200 ${textScaleClass}`}
    >
      {/* PIN Lock Screen if locked */}
      {isLocked && profile.isPinEnabled && profile.pinCode && (
        <PinLockModal
          savedPin={profile.pinCode}
          onUnlocked={handleUnlocked}
          discreteMode={profile.discreteMode}
        />
      )}

      {/* Onboarding Wizard with 3D Floral Blooming */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        onClose={() => setShowOnboarding(false)}
      />

      {/* Daily Log Modal */}
      <DailyLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        dateStr={logModalDate}
        initialLog={dailyLogs[logModalDate] || {
          date: logModalDate,
          flow: 'none',
          symptoms: [],
          painLocations: [],
          waterGlasses: 0,
          sleepHours: 7.5
        }}
        onSave={handleSaveDailyLog}
      />

      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={tab => {
          if (tab !== 'encyclopedia') setSelectedArticleId(undefined);
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        lang={profile.lang}
        discreteMode={profile.discreteMode}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onOpenQuickAdd={() => {
          setLogModalDate(todayStr);
          setIsLogModalOpen(true);
        }}
      />

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Sticky Header */}
        <Header
          profile={profile}
          lang={profile.lang}
          onChangeLang={lang => handleUpdateProfile({ lang })}
          textSize={profile.textSize}
          onChangeTextSize={size => handleUpdateProfile({ textSize: size })}
          onToggleDiscreteMode={handleToggleDiscreteMode}
          onLockNow={handleLockNow}
          onOpenProfile={() => setCurrentTab('profile')}
          onOpenFloralOnboarding={() => setShowOnboarding(true)}
        />

        {/* Dynamic View Container */}
        <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {currentTab === 'home' && (
            <DashboardView
              profile={profile}
              stats={cycleStats}
              todayLog={todayLog}
              reminders={reminders}
              morningRoutine={morningRoutine}
              nightRoutine={nightRoutine}
              onOpenLogModal={() => {
                setLogModalDate(todayStr);
                setIsLogModalOpen(true);
              }}
              onSelectTab={tab => setCurrentTab(tab)}
              onQuickMoodSelect={handleQuickMoodSelect}
              onQuickLogPeriodStart={handleQuickLogPeriodStart}
            />
          )}

          {currentTab === 'routine' && (
            <RoutineView
              morningRoutine={morningRoutine}
              nightRoutine={nightRoutine}
              currentCyclePhase={cycleStats.phase}
              onUpdateMorning={handleUpdateMorningRoutine}
              onUpdateNight={handleUpdateNightRoutine}
              onBack={() => setCurrentTab('home')}
            />
          )}

          {currentTab === 'progress' && (
            <ProgressView
              progressData={progressData}
              onUpdateProgress={handleUpdateProgressData}
            />
          )}

          {currentTab === 'cycle' && (
            <CycleView
              cycles={cycles}
              dailyLogs={dailyLogs}
              stats={cycleStats}
              profile={profile}
              onSaveCycle={handleSaveCycle}
              onDeleteCycle={handleDeleteCycle}
              onOpenLogModalForDate={handleOpenLogModalForDate}
            />
          )}

          {currentTab === 'body' && (
            <BodyView
              todayLog={todayLog}
              allLogs={dailyLogs}
              onSaveLog={handleSaveDailyLog}
            />
          )}

          {currentTab === 'mood' && (
            <MoodView
              todayLog={todayLog}
              allLogs={dailyLogs}
              onSaveLog={handleSaveDailyLog}
            />
          )}

          {currentTab === 'encyclopedia' && (
            <EncyclopediaView initialArticleId={selectedArticleId} />
          )}

          {currentTab === 'normality' && (
            <NormalityChecker
              onOpenArticle={handleOpenArticle}
              onSelectTab={tab => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'assistant' && (
            <AssistantView onOpenArticle={handleOpenArticle} />
          )}

          {currentTab === 'fertility' && (
            <FertilityPregnancyView
              profile={profile}
              stats={cycleStats}
              onUpdateProfile={handleUpdateProfile}
            />
          )}

          {currentTab === 'healthRecords' && (
            <HealthRecordsView
              profile={profile}
              cycles={cycles}
              dailyLogs={dailyLogs}
              appointments={appointments}
              medications={medications}
              contraception={contraception}
              onSaveAppointments={apts => {
                StorageService.saveAppointments(apts);
                setAppointments(apts);
              }}
              onSaveMedications={meds => {
                StorageService.saveMedications(meds);
                setMedications(meds);
              }}
              onSaveContraception={c => {
                StorageService.saveContraception(c);
                setContraception(c);
              }}
            />
          )}

          {currentTab === 'statistics' && (
            <StatisticsView
              cycles={cycles}
              dailyLogs={dailyLogs}
              stats={cycleStats}
              profile={profile}
            />
          )}

          {currentTab === 'reminders' && (
            <RemindersView
              reminders={reminders}
              profile={profile}
              onSaveReminders={rems => {
                StorageService.saveReminders(rems);
                setReminders(rems);
              }}
              onToggleDiscreteMode={handleToggleDiscreteMode}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileSecurityView
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              onDataReset={handleDataReset}
            />
          )}
        </main>
      </div>
    </div>
  );
}
