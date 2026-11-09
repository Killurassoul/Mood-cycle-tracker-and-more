import { jsPDF } from 'jspdf';
import { UserProfile, CycleRecord, DailyLog, ContraceptionRecord, MedicationItem } from '../types';
import { calculateCycleStatus } from './cycleCalculator';

export function generateDoctorPdfReport(
  profile: UserProfile,
  cycles: CycleRecord[],
  dailyLogs: Record<string, DailyLog>,
  contraception?: ContraceptionRecord,
  medications?: MedicationItem[]
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const cycleStats = calculateCycleStatus(cycles, profile.cycleLength, profile.periodLength);
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

  // Soft palette colors
  const primaryPink = [217, 101, 116]; // #D96574
  const darkText = [45, 35, 46];
  const mutedText = [120, 110, 125];
  const tableBg = [250, 245, 247];

  // Header banner
  doc.setFillColor(252, 240, 243);
  doc.rect(0, 0, pageWidth, 35, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(primaryPink[0], primaryPink[1], primaryPink[2]);
  doc.text('MOOD — RAPPORT DE SANTÉ & SUIVI MENSTRUEL', 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text('Synthèse clinique pour consultation médicale gynécologique / sage-femme', 14, 25);
  doc.text(`Édité le : ${dateStr}`, pageWidth - 14, 25, { align: 'right' });

  let y = 45;

  // Section 1: Informations patiente
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(primaryPink[0], primaryPink[1], primaryPink[2]);
  doc.text('1. INFORMATIONS GÉNÉRALES', 14, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  doc.text(`Patiente : ${profile.name || 'Anonyme'}`, 14, y);
  if (profile.birthDate) {
    doc.text(`Date de naissance : ${profile.birthDate}`, 90, y);
  }
  y += 6;

  const contraceptionText = contraception && contraception.type !== 'none'
    ? `${contraception.type.toUpperCase()} (${contraception.brandName || 'Non précisé'}) depuis ${contraception.startDate}`
    : 'Aucune contraception hormonale / stérilet renseigné';
  doc.text(`Contraception actuelle : ${contraceptionText}`, 14, y);
  y += 8;

  // Section 2: Biométrie des cycles
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(primaryPink[0], primaryPink[1], primaryPink[2]);
  doc.text('2. CARACTÉRISTIQUES & RÉGULARITÉ DES CYCLES', 14, y);
  y += 6;

  doc.setFillColor(tableBg[0], tableBg[1], tableBg[2]);
  doc.roundedRect(14, y, pageWidth - 28, 22, 3, 3, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  doc.text(`• Durée moyenne des cycles : ${cycleStats.averageCycleLength} jours`, 18, y + 6);
  doc.text(`• Durée moyenne des règles : ${cycleStats.averagePeriodLength} jours`, 18, y + 12);
  doc.text(`• Régularité globale : ${cycleStats.isIrregular ? 'Cycles variables (écart-type > 4j)' : 'Régulier (variation habituelle ≤ 3j)'}`, 18, y + 18);

  doc.text(`• Nombre de cycles analysés : ${cycles.length}`, 110, y + 6);
  doc.text(`• Date dernières règles : ${cycles[0]?.startDate || 'Non enregistrée'}`, 110, y + 12);
  doc.text(`• Phase actuelle : ${cycleStats.phaseName}`, 110, y + 18);
  y += 28;

  // Section 3: Historique des 5 derniers cycles
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(primaryPink[0], primaryPink[1], primaryPink[2]);
  doc.text('3. HISTORIQUE RÉCENT DES CYCLES', 14, y);
  y += 6;

  // Table header
  doc.setFillColor(primaryPink[0], primaryPink[1], primaryPink[2]);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('Date de début', 18, y + 5);
  doc.text('Durée règles', 60, y + 5);
  doc.text('Durée totale cycle', 105, y + 5);
  doc.text('Flux / Notes', 150, y + 5);
  y += 7;

  // Rows
  const recentCycles = cycles.slice(0, 5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);

  recentCycles.forEach((c, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(252, 248, 249);
      doc.rect(14, y, pageWidth - 28, 6.5, 'F');
    }
    doc.text(c.startDate, 18, y + 4.5);
    doc.text(c.periodDuration ? `${c.periodDuration} jours` : '—', 60, y + 4.5);
    doc.text(c.cycleDuration ? `${c.cycleDuration} jours` : '—', 105, y + 4.5);
    doc.text((c.notes || c.flowIntensity || 'Normal').slice(0, 30), 150, y + 4.5);
    y += 6.5;
  });

  y += 6;

  // Section 4: Synthèse des symptômes et intensité des douleurs
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(primaryPink[0], primaryPink[1], primaryPink[2]);
  doc.text('4. OBSERVATION CLINIQUE DES DOULEURS & SYMPTÔMES', 14, y);
  y += 6;

  // Compute symptom statistics from logs
  const logValues = Object.values(dailyLogs);
  const painLogs = logValues.filter(l => l.symptoms?.some(s => s.category === 'pain') || (l.painLocations && l.painLocations.length > 0));
  let maxPainIntensity = 0;
  const painZonesCount: Record<string, number> = {};

  logValues.forEach(log => {
    log.symptoms?.forEach(s => {
      if (s.intensity > maxPainIntensity) maxPainIntensity = s.intensity;
      if (s.location) {
        painZonesCount[s.location] = (painZonesCount[s.location] || 0) + 1;
      }
    });
    log.painLocations?.forEach(loc => {
      painZonesCount[loc] = (painZonesCount[loc] || 0) + 1;
    });
  });

  doc.setFillColor(tableBg[0], tableBg[1], tableBg[2]);
  doc.roundedRect(14, y, pageWidth - 28, 22, 3, 3, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  doc.text(`• Intensité maximale de douleur rapportée : ${maxPainIntensity}/10`, 18, y + 6);
  doc.text(`• Jours avec douleurs signalées : ${painLogs.length} jour(s) dans le journal`, 18, y + 12);

  const topZones = Object.entries(painZonesCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([z, cnt]) => `${z} (${cnt}x)`)
    .join(', ') || 'Aucune localisation récurrente marquée';

  doc.text(`• Localisations anatomiques préférentielles : ${topZones}`, 18, y + 18);
  y += 28;

  // Section 5: Traitements en cours
  if (medications && medications.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(primaryPink[0], primaryPink[1], primaryPink[2]);
    doc.text('5. TRAITEMENTS ET COMPLÉMENTS EN COURS', 14, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    medications.forEach(m => {
      doc.text(`• ${m.name} — Posologie : ${m.dosage} (${m.frequency})`, 18, y);
      y += 5.5;
    });
    y += 4;
  }

  // Footer Disclaimer
  doc.setDrawColor(220, 220, 220);
  doc.line(14, 275, pageWidth - 14, 275);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text(
    'Rapport généré localement par l’application Mood. Données purement déclaratives destinées à l’orientation clinique.',
    14,
    280
  );
  doc.text(
    'Ce document ne constitue pas un diagnostic médical et doit être interprété par un praticien diplômé.',
    14,
    284
  );

  // Save the PDF file in browser
  doc.save(`Rapport_Sante_Mood_${profile.name || 'Patiente'}_${now.toISOString().slice(0, 10)}.pdf`);
}
