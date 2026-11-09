import {
  UserProfile,
  CycleRecord,
  DailyLog,
  ReminderItem,
  HealthAppointment,
  MedicationItem,
  ContraceptionRecord
} from '../types';
import { formatDate, addDays } from './cycleCalculator';

const STORAGE_KEYS = {
  PROFILE: 'mood_app_profile_v1',
  CYCLES: 'mood_app_cycles_v1',
  DAILY_LOGS: 'mood_app_daily_logs_v1',
  REMINDERS: 'mood_app_reminders_v1',
  APPOINTMENTS: 'mood_app_appointments_v1',
  MEDICATIONS: 'mood_app_medications_v1',
  CONTRACEPTION: 'mood_app_contraception_v1',
  IS_LOCKED: 'mood_app_session_locked_v1'
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Camille',
  birthDate: '1997-04-18',
  cycleLength: 28,
  periodLength: 5,
  activeMode: 'cycle',
  discreteMode: false,
  isPinEnabled: false,
  pinCode: '',
  theme: 'light',
  textSize: 'normal',
  lang: 'fr',
  onboarded: true
};

const DEFAULT_REMINDERS: ReminderItem[] = [
  {
    id: 'rem-period',
    type: 'period',
    title: 'Règles prévues dans 2 jours',
    discreetTitle: 'Rappel bien-être programmé',
    time: '08:30',
    enabled: true
  },
  {
    id: 'rem-pill',
    type: 'pill',
    title: 'Prise de ma pilule contraceptive',
    discreetTitle: 'Moment santé personnel',
    time: '20:00',
    enabled: true
  },
  {
    id: 'rem-water',
    type: 'hydration',
    title: 'Pense à boire un grand verre d’eau fraîche',
    discreetTitle: 'Pause hydratation',
    time: '14:00',
    enabled: true
  },
  {
    id: 'rem-daily-log',
    type: 'daily_log',
    title: 'Comment s’est passée ta journée ? Prends 1 minute pour noter ton humeur',
    discreetTitle: 'Bilan de journée',
    time: '21:00',
    enabled: true
  }
];

const DEFAULT_CONTRACEPTION: ContraceptionRecord = {
  type: 'pill',
  brandName: 'Optilova',
  startDate: '2025-01-15',
  dailyReminderTime: '20:00',
  notes: 'Prise quotidienne régulière au coucher.'
};

const DEFAULT_MEDICATIONS: MedicationItem[] = [
  {
    id: 'med-1',
    name: 'Spasfon (Phloroglucinol)',
    dosage: '80 mg au besoin',
    frequency: 'En cas de crampes pelviennes',
    startDate: '2026-01-01',
    isContraceptive: false,
    notes: 'Max 6 comprimés par jour.'
  },
  {
    id: 'med-2',
    name: 'Magnésium Marin + Vitamine B6',
    dosage: '1 gélule le matin',
    frequency: 'Quotidien en deuxième partie de cycle',
    startDate: '2026-02-01',
    isContraceptive: false,
    notes: 'Favorise la relaxation nerveuse et musculaire.'
  }
];

const DEFAULT_APPOINTMENTS: HealthAppointment[] = [
  {
    id: 'apt-1',
    doctorName: 'Dr. Sophie Laurent',
    specialty: 'Gynécologue-Obstétricienne',
    date: '2026-11-20',
    time: '14:30',
    location: 'Cabinet Médical Haussmann, Paris',
    reason: 'Contrôle annuel et frottis de dépistage',
    notes: 'Apporter les résultats de la dernière prise de sang.'
  }
];

/**
 * Generate sensible seed cycles so the user immediately sees a functional app with rich charts
 */
function generateSeedCycles(): CycleRecord[] {
  const today = new Date();
  // Latest cycle started 12 days ago
  const c1Start = addDays(today, -12);
  const c2Start = addDays(c1Start, -28);
  const c3Start = addDays(c2Start, -27);
  const c4Start = addDays(c3Start, -29);
  const c5Start = addDays(c4Start, -28);

  return [
    {
      id: 'cycle-1',
      startDate: formatDate(c1Start),
      periodDuration: 5,
      cycleDuration: 28,
      flowIntensity: 'medium',
      notes: 'Flux régulier, légères crampes le premier jour.'
    },
    {
      id: 'cycle-2',
      startDate: formatDate(c2Start),
      endDate: formatDate(addDays(c2Start, 4)),
      periodDuration: 5,
      cycleDuration: 28,
      flowIntensity: 'heavy',
      notes: 'Jour 2 un peu abondant.'
    },
    {
      id: 'cycle-3',
      startDate: formatDate(c3Start),
      endDate: formatDate(addDays(c3Start, 4)),
      periodDuration: 4,
      cycleDuration: 27,
      flowIntensity: 'medium',
      notes: 'Cycle très calme, bonne énergie.'
    },
    {
      id: 'cycle-4',
      startDate: formatDate(c4Start),
      endDate: formatDate(addDays(c4Start, 5)),
      periodDuration: 5,
      cycleDuration: 29,
      flowIntensity: 'heavy',
      notes: 'Légère fatigue en fin de cycle.'
    },
    {
      id: 'cycle-5',
      startDate: formatDate(c5Start),
      endDate: formatDate(addDays(c5Start, 4)),
      periodDuration: 5,
      cycleDuration: 28,
      flowIntensity: 'medium'
    }
  ];
}

function generateSeedLogs(): Record<string, DailyLog> {
  const today = new Date();
  const todayStr = formatDate(today);
  const yesterdayStr = formatDate(addDays(today, -1));
  const twoDaysAgoStr = formatDate(addDays(today, -2));

  return {
    [todayStr]: {
      date: todayStr,
      flow: 'none',
      symptoms: [
        {
          id: 'sym-1',
          category: 'physical',
          name: 'Légère fatigue d’après-midi',
          intensity: 4,
          location: 'generalized',
          notes: 'Liée à la charge de travail'
        }
      ],
      painLocations: [],
      vaginalHealth: {
        dischargeType: 'egg_white',
        color: 'translucide',
        odor: 'none',
        itching: false,
        irritation: false,
        dryness: false
      },
      mood: {
        primaryMood: 'calm',
        ratings: {
          joy: 7,
          sadness: 1,
          stress: 3,
          anxiety: 2,
          irritability: 2,
          motivation: 8,
          energy: 7,
          confidence: 8,
          mentalFatigue: 4,
          emotionalSensitivity: 4
        },
        freeJournal: 'Journée agréable, je me sens à l’écoute de mon corps. Beaucoup d’inspiration pour mes projets personnels.'
      },
      quickMood: 'Je me sens bien',
      waterGlasses: 6,
      sleepHours: 8,
      generalNotes: 'Marche de 30 minutes au soleil.'
    },
    [yesterdayStr]: {
      date: yesterdayStr,
      flow: 'none',
      symptoms: [
        {
          id: 'sym-2',
          category: 'pain',
          name: 'Tiraillement doux côté gauche',
          intensity: 3,
          location: 'pelvis',
          notes: 'Sensation typique d’ovulation'
        }
      ],
      painLocations: ['pelvis'],
      mood: {
        primaryMood: 'energetic',
        ratings: {
          joy: 8,
          sadness: 0,
          stress: 2,
          anxiety: 1,
          irritability: 1,
          motivation: 9,
          energy: 9,
          confidence: 8,
          mentalFatigue: 2,
          emotionalSensitivity: 3
        },
        freeJournal: 'Plein d’énergie aujourd’hui ! J’ai cuisiné un bon repas sain.'
      },
      quickMood: 'Je me sens énergique',
      waterGlasses: 8,
      sleepHours: 7.5
    },
    [twoDaysAgoStr]: {
      date: twoDaysAgoStr,
      flow: 'none',
      symptoms: [],
      painLocations: [],
      mood: {
        primaryMood: 'calm',
        ratings: {
          joy: 7,
          sadness: 2,
          stress: 4,
          anxiety: 3,
          irritability: 2,
          motivation: 7,
          energy: 6,
          confidence: 7,
          mentalFatigue: 4,
          emotionalSensitivity: 5
        },
        freeJournal: 'Soirée lecture au calme avec une tisane à la camomille.'
      },
      quickMood: 'Je me sens bien',
      waterGlasses: 7,
      sleepHours: 8
    }
  };
}

export const StorageService = {
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? { ...DEFAULT_PROFILE, ...JSON.parse(data) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  getCycles(): CycleRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CYCLES);
      if (!data) {
        const seeds = generateSeedCycles();
        this.saveCycles(seeds);
        return seeds;
      }
      return JSON.parse(data);
    } catch {
      return generateSeedCycles();
    }
  },

  saveCycles(cycles: CycleRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.CYCLES, JSON.stringify(cycles));
  },

  addOrUpdateCycle(cycle: CycleRecord): CycleRecord[] {
    const cycles = this.getCycles();
    const index = cycles.findIndex(c => c.id === cycle.id);
    if (index >= 0) {
      cycles[index] = cycle;
    } else {
      cycles.unshift(cycle);
    }
    this.saveCycles(cycles);
    return cycles;
  },

  deleteCycle(id: string): CycleRecord[] {
    const cycles = this.getCycles().filter(c => c.id !== id);
    this.saveCycles(cycles);
    return cycles;
  },

  getDailyLogs(): Record<string, DailyLog> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
      if (!data) {
        const seeds = generateSeedLogs();
        this.saveDailyLogs(seeds);
        return seeds;
      }
      return JSON.parse(data);
    } catch {
      return generateSeedLogs();
    }
  },

  getLogForDate(dateStr: string): DailyLog {
    const logs = this.getDailyLogs();
    return logs[dateStr] || {
      date: dateStr,
      flow: 'none',
      symptoms: [],
      painLocations: [],
      waterGlasses: 0,
      sleepHours: 7
    };
  },

  saveDailyLog(log: DailyLog): void {
    const logs = this.getDailyLogs();
    logs[log.date] = log;
    this.saveDailyLogs(logs);
  },

  saveDailyLogs(logs: Record<string, DailyLog>): void {
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
  },

  getReminders(): ReminderItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      return data ? JSON.parse(data) : DEFAULT_REMINDERS;
    } catch {
      return DEFAULT_REMINDERS;
    }
  },

  saveReminders(reminders: ReminderItem[]): void {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  },

  getAppointments(): HealthAppointment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return data ? JSON.parse(data) : DEFAULT_APPOINTMENTS;
    } catch {
      return DEFAULT_APPOINTMENTS;
    }
  },

  saveAppointments(appointments: HealthAppointment[]): void {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  },

  getMedications(): MedicationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);
      return data ? JSON.parse(data) : DEFAULT_MEDICATIONS;
    } catch {
      return DEFAULT_MEDICATIONS;
    }
  },

  saveMedications(meds: MedicationItem[]): void {
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(meds));
  },

  getContraception(): ContraceptionRecord {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONTRACEPTION);
      return data ? JSON.parse(data) : DEFAULT_CONTRACEPTION;
    } catch {
      return DEFAULT_CONTRACEPTION;
    }
  },

  saveContraception(contraception: ContraceptionRecord): void {
    localStorage.setItem(STORAGE_KEYS.CONTRACEPTION, JSON.stringify(contraception));
  },

  isSessionLocked(): boolean {
    const profile = this.getProfile();
    if (!profile.isPinEnabled || !profile.pinCode) return false;
    return sessionStorage.getItem(STORAGE_KEYS.IS_LOCKED) === 'true';
  },

  lockSession(): void {
    sessionStorage.setItem(STORAGE_KEYS.IS_LOCKED, 'true');
  },

  unlockSession(): void {
    sessionStorage.removeItem(STORAGE_KEYS.IS_LOCKED);
  },

  exportAllDataJSON(): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile: this.getProfile(),
      cycles: this.getCycles(),
      dailyLogs: this.getDailyLogs(),
      reminders: this.getReminders(),
      appointments: this.getAppointments(),
      medications: this.getMedications(),
      contraception: this.getContraception()
    };
    return JSON.stringify(backup, null, 2);
  },

  importDataJSON(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data.profile) this.saveProfile(data.profile);
      if (data.cycles) this.saveCycles(data.cycles);
      if (data.dailyLogs) this.saveDailyLogs(data.dailyLogs);
      if (data.reminders) this.saveReminders(data.reminders);
      if (data.appointments) this.saveAppointments(data.appointments);
      if (data.medications) this.saveMedications(data.medications);
      if (data.contraception) this.saveContraception(data.contraception);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  },

  wipeAllData(): void {
    localStorage.clear();
    sessionStorage.clear();
  }
};
