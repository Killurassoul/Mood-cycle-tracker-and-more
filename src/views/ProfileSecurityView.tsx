import React, { useState } from 'react';
import { UserProfile, AppLanguage, TextSize } from '../types';
import { StorageService } from '../services/storage';
import {
  Shield,
  Lock,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  User,
  Globe,
  Sliders,
  Sparkles
} from 'lucide-react';

interface ProfileSecurityViewProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onDataReset: () => void;
}

export const ProfileSecurityView: React.FC<ProfileSecurityViewProps> = ({
  profile,
  onUpdateProfile,
  onDataReset
}) => {
  const [name, setName] = useState<string>(profile.name || '');
  const [cycleLength, setCycleLength] = useState<number>(profile.cycleLength || 28);
  const [periodLength, setPeriodLength] = useState<number>(profile.periodLength || 5);
  const [isPinEnabled, setIsPinEnabled] = useState<boolean>(profile.isPinEnabled || false);
  const [newPin, setNewPin] = useState<string>(profile.pinCode || '');
  const [showWipeConfirm, setShowWipeConfirm] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      cycleLength,
      periodLength,
      isPinEnabled,
      pinCode: isPinEnabled ? newPin : ''
    });
    setStatusMessage('Profil et préférences enregistrés avec succès !');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleExportJSON = () => {
    const jsonStr = StorageService.exportAllDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sauvegarde_Mood_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage('Fichier de sauvegarde JSON exporté avec succès.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const success = StorageService.importDataJSON(content);
      if (success) {
        setStatusMessage('Sauvegarde restaurée avec succès ! Rechargement...');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        alert('Erreur lors de la lecture du fichier JSON de sauvegarde.');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmWipe = () => {
    StorageService.wipeAllData();
    onDataReset();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
          Mon profil & Confidentialité
        </h2>
        <p className="text-sm text-zinc-500">
          Gestion de tes données locales, protection par code PIN et souveraineté totale
        </p>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {statusMessage}
        </div>
      )}

      {/* Manifest of Privacy */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-rose-50 to-purple-50 border border-rose-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wider">
          <Shield className="w-4 h-4 text-rose-600" /> Charte de protection des données Mood
        </div>
        <h3 className="text-lg font-black text-zinc-900">
          Zéro traceur. Zéro publicité. Zéro revente.
        </h3>
        <p className="text-xs text-zinc-700 leading-relaxed">
          Les données relatives à votre cycle, votre intimité, votre fertilité et vos émotions sont les informations les plus précieuses qui soient. Dans Mood, toutes vos saisies sont traitées et stockées exclusivement sur votre appareil. Aucun serveur ne collecte vos données intimes à votre insu.
        </p>
      </div>

      {/* Form: Profile and Cycle Defaults */}
      <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2 border-b border-rose-100 pb-3">
          <User className="w-5 h-5 text-rose-500" />
          Paramètres personnels
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Prénom ou pseudonyme :
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex : Camille"
              className="w-full p-3 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Durée habituelle du cycle :
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="20"
                max="45"
                value={cycleLength}
                onChange={e => setCycleLength(parseInt(e.target.value) || 28)}
                className="w-20 p-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-center text-zinc-800"
              />
              <span className="text-xs text-zinc-500">jours</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Durée habituelle des règles :
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="2"
                max="10"
                value={periodLength}
                onChange={e => setPeriodLength(parseInt(e.target.value) || 5)}
                className="w-20 p-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-center text-zinc-800"
              />
              <span className="text-xs text-zinc-500">jours</span>
            </div>
          </div>
        </div>

        {/* PIN Security Switch */}
        <div className="pt-4 border-t border-zinc-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-zinc-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-600" />
                Code PIN de verrouillage (4 chiffres)
              </h4>
              <p className="text-[11px] text-zinc-500">
                Demande un code secret à 4 chiffres à l'ouverture de l'application
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsPinEnabled(!isPinEnabled)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                isPinEnabled ? 'bg-purple-600' : 'bg-zinc-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  isPinEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {isPinEnabled && (
            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
              <label className="block text-xs font-bold text-purple-950">
                Définir ton code PIN secret à 4 chiffres :
              </label>
              <input
                type="password"
                maxLength={4}
                value={newPin}
                onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                placeholder="Ex : 1234"
                className="w-32 p-3 rounded-xl border border-purple-200 text-center font-mono text-lg font-black tracking-widest text-purple-900"
              />
              <span className="text-[10px] text-zinc-500 block">
                Mémorise bien ce code. Il est stocké uniquement sur cet appareil.
              </span>
            </div>
          )}
        </div>

        {/* Language & Accessibility */}
        <div className="pt-4 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Langue de l'application :
            </label>
            <select
              value={profile.lang}
              onChange={e => onUpdateProfile({ lang: e.target.value as AppLanguage })}
              className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-800"
            >
              <option value="fr">Français (Par défaut)</option>
              <option value="en">English (Anglais)</option>
              <option value="wo">Wolof (Sénégal / Ouest-Africain)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Taille d'affichage du texte :
            </label>
            <select
              value={profile.textSize}
              onChange={e => onUpdateProfile({ textSize: e.target.value as TextSize })}
              className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-800"
            >
              <option value="normal">Normale (Standard)</option>
              <option value="large">Grande (+10%)</option>
              <option value="xlarge">Très grande (+22% - Confort visuel)</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all"
          >
            Enregistrer les modifications
          </button>
        </div>
      </form>

      {/* Export & Import Data */}
      <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-zinc-900">
          Sauvegarde & Transfert des données
        </h3>
        <p className="text-xs text-zinc-500">
          Tu peux exporter l'intégralité de ton historique (cycles, symptômes, notes, journal) pour changer de téléphone ou conserver une archive personnelle.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExportJSON}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4 text-zinc-600" /> Exporter mes données (.json)
          </button>

          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-zinc-600" />
            <span>Restaurer une sauvegarde</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Danger Zone: Permanent Wipe */}
      <div className="p-6 rounded-3xl bg-red-50/50 border border-red-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-red-900 font-bold text-xs uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 text-red-600" /> Zone irréversible
        </div>
        <h3 className="text-base font-bold text-red-950">
          Suppression définitive de toutes mes données
        </h3>
        <p className="text-xs text-red-900/80 leading-relaxed">
          Cette action efface définitivement tous les cycles, journaux intimes, notes, rappels et réglages enregistrés sur cet appareil.
        </p>

        {!showWipeConfirm ? (
          <button
            type="button"
            onClick={() => setShowWipeConfirm(true)}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-red-100 border border-red-300 text-red-700 text-xs font-bold transition-colors"
          >
            Supprimer définitivement mes données
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-white border border-red-300 space-y-3">
            <p className="text-xs font-bold text-red-700">
              Êtes-vous absolument certaine ? Toutes vos informations seront irrémédiablement effacées.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleConfirmWipe}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Oui, tout effacer
              </button>
              <button
                type="button"
                onClick={() => setShowWipeConfirm(false)}
                className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
