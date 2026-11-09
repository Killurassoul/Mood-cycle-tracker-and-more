/**
 * Data models for Mood - Santé & Bien-être Féminin
 */

export type AppLanguage = 'fr' | 'en' | 'wo';
export type AppTheme = 'light' | 'dark';
export type TextSize = 'normal' | 'large' | 'xlarge';
export type ActiveTrackingMode = 'cycle' | 'fertility' | 'pregnancy' | 'postpartum';

export interface UserProfile {
  name: string; // Optional pseudo or first name
  birthDate?: string; // Optional
  cycleLength: number; // e.g. 28 days
  periodLength: number; // e.g. 5 days
  activeMode: ActiveTrackingMode;
  discreteMode: boolean; // Masks sensitive terms in UI & notifications
  pinCode?: string; // 4-digit PIN if enabled
  isPinEnabled: boolean;
  theme: AppTheme;
  textSize: TextSize;
  lang: AppLanguage;
  onboarded: boolean;
  pregnancyConceptionDate?: string;
  postpartumDeliveryDate?: string;
}

export type MenstrualFlow = 'none' | 'spotting' | 'light' | 'medium' | 'heavy' | 'very_heavy';

export interface CycleRecord {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  periodDuration?: number; // Days of bleeding
  cycleDuration?: number; // Total length until next start
  flowIntensity?: MenstrualFlow;
  notes?: string;
}

export type PainZone = 'head' | 'breasts' | 'abdomen' | 'pelvis' | 'lower_back' | 'legs' | 'joints' | 'generalized';

export interface PhysicalSymptom {
  id: string;
  category: 'pain' | 'physical' | 'vaginal' | 'digestive';
  name: string;
  intensity: number; // 1 to 10
  time?: string;
  durationHours?: number;
  location?: PainZone;
  notes?: string;
}

export interface VaginalHealthLog {
  dischargeType: 'none' | 'creamy' | 'egg_white' | 'sticky' | 'watery' | 'thick_white' | 'yellow_green' | 'brownish';
  color?: string;
  odor: 'normal' | 'none' | 'mild' | 'metallic' | 'fishy' | 'strong';
  itching: boolean;
  irritation: boolean;
  dryness: boolean;
}

export interface MoodLog {
  primaryMood: string; // e.g. 'calm', 'joy', 'fatigue', 'stress', 'anxiety', 'irritability', 'energetic'
  ratings: {
    joy: number; // 0-10
    sadness: number;
    stress: number;
    anxiety: number;
    irritability: number;
    motivation: number;
    energy: number;
    confidence: number;
    mentalFatigue: number;
    emotionalSensitivity: number;
  };
  freeJournal: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  flow: MenstrualFlow;
  symptoms: PhysicalSymptom[];
  painLocations: PainZone[];
  vaginalHealth?: VaginalHealthLog;
  mood?: MoodLog;
  quickMood?: string; // fast check-in from dashboard
  basalTemperature?: number; // e.g. 36.6 °C
  ovulationTestResult?: 'none' | 'negative' | 'positive';
  sexualIntercourse?: {
    protected: boolean;
    painFelt: boolean;
  };
  waterGlasses: number; // 0 to 12
  sleepHours: number; // 0 to 14
  generalNotes?: string;
}

export interface MedicalArticle {
  id: string;
  categoryId: string;
  categoryName: string;
  subCategory: string;
  title: string;
  readTimeMinutes: number;
  intro: string;
  detailedExplanation: string;
  whyItHappens: string[];
  associatedSymptoms: string[];
  whatIsUsual: string;
  whatMeritsConsultation: string[];
  urgentRedFlags: string[];
  generalAdvice: string[];
  faq: Array<{ question: string; answer: string }>;
  medicalSources: Array<{ name: string; url?: string; description?: string }>;
}

export interface ReminderItem {
  id: string;
  type: 'period' | 'pill' | 'medication' | 'appointment' | 'hydration' | 'daily_log' | 'custom';
  title: string;
  discreetTitle: string; // Neutral wording for discreet mode
  time: string; // HH:mm
  daysOfWeek?: number[]; // [0,1,2,3,4,5,6]
  enabled: boolean;
  notes?: string;
}

export interface HealthAppointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  reason: string;
  notes?: string;
  followUpTasks?: string;
}

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  reminderTime?: string;
  startDate: string;
  endDate?: string;
  isContraceptive: boolean;
  notes?: string;
}

export interface ContraceptionRecord {
  type: 'none' | 'pill' | 'copper_iud' | 'hormonal_iud' | 'implant' | 'condom' | 'patch' | 'ring' | 'other';
  brandName: string;
  startDate: string;
  renewalDate?: string;
  dailyReminderTime?: string;
  notes?: string;
}

export type CyclePhase = 'menstrual' | 'follicular' | 'fertile' | 'ovulation' | 'luteal';

export interface CycleCalculationResult {
  currentDayOfCycle: number;
  totalCycleLength: number;
  phase: CyclePhase;
  phaseName: string;
  phaseDescription: string;
  daysUntilNextPeriod: number;
  nextPeriodDate: string;
  ovulationDate: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  isDelayed: boolean;
  daysDelayed: number;
  averageCycleLength: number;
  averagePeriodLength: number;
  isIrregular: boolean;
}

export interface SkincareProduct {
  id: string;
  stepNumber: number;
  category: string; // 'Cleanser', 'Toner', 'Serum', 'Moisturizer', 'Sunscreen', 'Night Mask', etc.
  name: string; // e.g. "Cetaphil Gentle Skin Cleanser"
  brand?: string;
  completed: boolean;
  timeOfDay: 'morning' | 'night';
  cyclePhaseMatch?: CyclePhase; // Beneficial for specific cycle phases!
  tip?: string;
}

export interface SkinConcern {
  id: string;
  name: string; // 'Acne', 'Dark Spots', 'Redness', 'Dryness', 'Dullness'
  status: 'improving' | 'stable' | 'needs_care';
  improvementPercentage: number; // e.g. 40, 20, 15
}

export interface SkinProgressData {
  score: number; // e.g. 85
  scoreFeedback: string; // "Great! Your skin is happy and healthy 💕"
  concerns: SkinConcern[];
  streakDays: number; // e.g. 12
  weeklyScores: Array<{ day: string; score: number }>;
}

