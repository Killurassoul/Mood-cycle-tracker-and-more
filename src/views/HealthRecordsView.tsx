import React, { useState } from 'react';
import {
  UserProfile,
  CycleRecord,
  DailyLog,
  HealthAppointment,
  MedicationItem,
  ContraceptionRecord
} from '../types';
import { generateDoctorPdfReport } from '../services/pdfReport';
import {
  FileText,
  Download,
  Calendar,
  Pill,
  Shield,
  Plus,
  Trash2,
  CheckCircle2,
  UserCheck,
  Clock,
  Sparkles
} from 'lucide-react';

interface HealthRecordsViewProps {
  profile: UserProfile;
  cycles: CycleRecord[];
  dailyLogs: Record<string, DailyLog>;
  appointments: HealthAppointment[];
  medications: MedicationItem[];
  contraception: ContraceptionRecord;
  onSaveAppointments: (appointments: HealthAppointment[]) => void;
  onSaveMedications: (medications: MedicationItem[]) => void;
  onSaveContraception: (contraception: ContraceptionRecord) => void;
}

export const HealthRecordsView: React.FC<HealthRecordsViewProps> = ({
  profile,
  cycles,
  dailyLogs,
  appointments,
  medications,
  contraception,
  onSaveAppointments,
  onSaveMedications,
  onSaveContraception
}) => {
  const [isPdfGenerating, setIsPdfGenerating] = useState<boolean>(false);
  const [pdfSuccessBanner, setPdfSuccessBanner] = useState<boolean>(false);

  // Modal for new appointment
  const [showAptModal, setShowAptModal] = useState<boolean>(false);
  const [aptDoctor, setAptDoctor] = useState<string>('');
  const [aptSpecialty, setAptSpecialty] = useState<string>('Gynécologue');
  const [aptDate, setAptDate] = useState<string>('');
  const [aptTime, setAptTime] = useState<string>('14:00');
  const [aptLocation, setAptLocation] = useState<string>('');
  const [aptReason, setAptReason] = useState<string>('Contrôle annuel');

  // Modal for new medication
  const [showMedModal, setShowMedModal] = useState<boolean>(false);
  const [medName, setMedName] = useState<string>('');
  const [medDosage, setMedDosage] = useState<string>('');
  const [medFrequency, setMedFrequency] = useState<string>('');

  const handleDownloadPdf = () => {
    setIsPdfGenerating(true);
    try {
      generateDoctorPdfReport(profile, cycles, dailyLogs, contraception, medications);
      setPdfSuccessBanner(true);
      setTimeout(() => setPdfSuccessBanner(false), 4000);
    } catch (err) {
      console.error('PDF error', err);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const newApt: HealthAppointment = {
      id: `apt-${Date.now()}`,
      doctorName: aptDoctor,
      specialty: aptSpecialty,
      date: aptDate,
      time: aptTime,
      location: aptLocation,
      reason: aptReason
    };
    onSaveAppointments([...appointments, newApt]);
    setShowAptModal(false);
    setAptDoctor('');
  };

  const handleDeleteAppointment = (id: string) => {
    onSaveAppointments(appointments.filter(a => a.id !== id));
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    const newMed: MedicationItem = {
      id: `med-${Date.now()}`,
      name: medName,
      dosage: medDosage,
      frequency: medFrequency,
      startDate: new Date().toISOString().slice(0, 10),
      isContraceptive: false
    };
    onSaveMedications([...medications, newMed]);
    setShowMedModal(false);
    setMedName('');
  };

  const handleDeleteMedication = (id: string) => {
    onSaveMedications(medications.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title & PDF Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
            Mon dossier santé & Partage soignant
          </h2>
          <p className="text-sm text-zinc-500">
            Centralise tes antécédents, traitements et génère une synthèse PDF pour ton médecin
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={isPdfGenerating}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all hover:scale-[1.02] disabled:opacity-50 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          {isPdfGenerating ? 'Génération du rapport...' : 'Générer mon rapport PDF médical'}
        </button>
      </div>

      {pdfSuccessBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Le rapport médical PDF a été généré avec succès et téléchargé sur ton appareil !
        </div>
      )}

      {/* PDF Generator Showcase Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-rose-500 to-purple-600 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-200 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-300" /> Rapport clinique prêt pour consultation
          </span>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Gagnez un temps précieux lors de votre prochain rendez-vous
          </h3>
          <p className="text-xs text-rose-100 leading-relaxed">
            Votre gynécologue ou sage-femme pourra consulter en un coup d'œil l'historique précis de vos 5 derniers cycles, la durée moyenne de vos saignements, vos localisations de douleurs récurrentes et vos traitements en cours.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadPdf}
          className="px-6 py-3.5 rounded-2xl bg-white text-rose-700 hover:bg-rose-50 text-xs font-extrabold shadow-lg transition-transform hover:scale-105 shrink-0"
        >
          Télécharger le PDF (.pdf)
        </button>
      </div>

      {/* Section 1: Contraception actuelle */}
      <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-rose-100 pb-3">
          <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-rose-500" />
            Ma méthode de contraception
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Type de méthode :
            </label>
            <select
              value={contraception.type}
              onChange={e => onSaveContraception({ ...contraception, type: e.target.value as any })}
              className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-800"
            >
              <option value="none">Aucune / Préservatifs ponctuels</option>
              <option value="pill">Pilule contraceptive</option>
              <option value="copper_iud">DIU au cuivre (Stérilet)</option>
              <option value="hormonal_iud">DIU hormonal</option>
              <option value="implant">Implant sous-cutané</option>
              <option value="condom">Préservatif externe systématique</option>
              <option value="patch">Patch contraceptif</option>
              <option value="ring">Anneau vaginal</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Nom / Marque commerciale :
            </label>
            <input
              type="text"
              value={contraception.brandName}
              onChange={e => onSaveContraception({ ...contraception, brandName: e.target.value })}
              placeholder="Ex : Optilova, Levosert, Jaydess..."
              className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Date de début ou de pose :
            </label>
            <input
              type="date"
              value={contraception.startDate}
              onChange={e => onSaveContraception({ ...contraception, startDate: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-800"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Carnet de rendez-vous médicaux */}
      <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-rose-100 pb-3">
          <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            Mes rendez-vous médicaux ({appointments.length})
          </h3>
          <button
            type="button"
            onClick={() => setShowAptModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Ajouter un RDV
          </button>
        </div>

        {appointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map(apt => (
              <div
                key={apt.id}
                className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2 relative group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-black text-zinc-900 block">{apt.doctorName}</span>
                    <span className="text-[11px] text-purple-700 font-semibold">{apt.specialty}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteAppointment(apt.id)}
                    className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-xs text-zinc-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{apt.date} à {apt.time}</span>
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Lieu : {apt.location || 'Cabinet médical'}
                  </div>
                  <div className="text-[11px] text-zinc-700 font-medium bg-white p-2 rounded-xl border border-zinc-200">
                    Motif : {apt.reason}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-400 italic">
            Aucun rendez-vous médical enregistré pour l'instant.
          </p>
        )}
      </div>

      {/* Section 3: Médicaments et compléments */}
      <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-rose-100 pb-3">
          <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <Pill className="w-5 h-5 text-rose-500" />
            Traitements & Compléments en cours ({medications.length})
          </h3>
          <button
            type="button"
            onClick={() => setShowMedModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Ajouter un traitement
          </button>
        </div>

        {medications.length > 0 ? (
          <div className="divide-y divide-zinc-100">
            {medications.map(med => (
              <div key={med.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-zinc-900">{med.name}</span>
                  <div className="text-[11px] text-zinc-500">
                    Dosage : {med.dosage} • Fréquence : {med.frequency}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteMedication(med.id)}
                  className="text-zinc-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-400 italic">
            Aucun médicament enregistré.
          </p>
        )}
      </div>

      {/* Appointment Modal */}
      {showAptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/25 backdrop-blur-xs">
          <form
            onSubmit={handleAddAppointment}
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-rose-100 space-y-4"
          >
            <h3 className="text-base font-bold text-zinc-900">Ajouter un rendez-vous médical</h3>
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Nom du praticien :</label>
              <input
                type="text"
                required
                placeholder="Ex : Dr. Sophie Laurent"
                value={aptDoctor}
                onChange={e => setAptDoctor(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs font-medium"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Spécialité :</label>
                <input
                  type="text"
                  value={aptSpecialty}
                  onChange={e => setAptSpecialty(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Motif :</label>
                <input
                  type="text"
                  value={aptReason}
                  onChange={e => setAptReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Date :</label>
                <input
                  type="date"
                  required
                  value={aptDate}
                  onChange={e => setAptDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Heure :</label>
                <input
                  type="time"
                  value={aptTime}
                  onChange={e => setAptTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Lieu / Adresse :</label>
              <input
                type="text"
                placeholder="Ex : Cabinet Médical Haussmann..."
                value={aptLocation}
                onChange={e => setAptLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setShowAptModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-200"
              >
                Enregistrer le rendez-vous
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Medication Modal */}
      {showMedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/25 backdrop-blur-xs">
          <form
            onSubmit={handleAddMedication}
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-rose-100 space-y-4"
          >
            <h3 className="text-base font-bold text-zinc-900">Ajouter un traitement</h3>
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Nom du traitement / complément :</label>
              <input
                type="text"
                required
                placeholder="Ex : Spasfon, Fer, Magnésium..."
                value={medName}
                onChange={e => setMedName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Dosage :</label>
              <input
                type="text"
                placeholder="Ex : 80mg, 1 gélule..."
                value={medDosage}
                onChange={e => setMedDosage(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Fréquence / Moment de prise :</label>
              <input
                type="text"
                placeholder="Ex : Au besoin en cas de crampes, matin..."
                value={medFrequency}
                onChange={e => setMedFrequency(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setShowMedModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-md shadow-rose-200"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
