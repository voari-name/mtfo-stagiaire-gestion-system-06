
import jsPDF from 'jspdf';

export interface EvaluationPdfData {
  id: number;
  firstName: string;
  lastName: string;
  startDate: string;
  endDate: string;
  grade: number;
  comment: string;
}

export const generateEvaluationPDF = async (evaluation: EvaluationPdfData) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  
  // Configuration
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = 25;
  
  // Add Madagascar logo
  try {
    const logoUrl = '/lovable-uploads/67674b23-2620-4e7d-a21f-7646f9891b17.png';
    doc.addImage(logoUrl, 'PNG', pageWidth / 2 - 25, yPosition, 50, 40);
    yPosition += 50;
  } catch (error) {
    console.log('Logo could not be loaded, continuing without it');
    yPosition += 10;
  }
  
  // Official header text
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  const headerLines = [
    'REPOBLIKAN\' I MADAGASIKARA',
    'Fitiavana - Tanindrazana - Fandrosoana',
    '',
    'MINISTERE DU TRAVAIL, DE L\'EMPLOI, DE LA FONCTION PUBLIQUE',
    'ET DES LOIS SOCIALES',
    'SECRETARIAT GENERAL',
    'DIRECTION DU SYSTEME D\'INFORMATION'
  ];
  
  headerLines.forEach((line, index) => {
    if (line === '') {
      yPosition += 5;
    } else {
      doc.setFontSize(index < 2 ? 12 : 10);
      doc.setFont('helvetica', index < 2 ? 'bold' : 'normal');
      doc.text(line, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += index < 2 ? 8 : 6;
    }
  });
  
  yPosition += 15;
  
  // Decorative border
  doc.setLineWidth(2);
  doc.setDrawColor(0, 51, 102); // Dark blue
  doc.rect(margin - 5, yPosition - 5, pageWidth - 2 * (margin - 5), 25);
  
  // Main title with elegant styling
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102); // Dark blue
  doc.text('CERTIFICAT DE STAGE ET D\'ÉVALUATION', pageWidth / 2, yPosition + 10, { align: 'center' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  yPosition += 35;
  
  // Decorative line
  doc.setLineWidth(1);
  doc.setDrawColor(200, 200, 200);
  doc.line(margin + 20, yPosition, pageWidth - margin - 20, yPosition);
  yPosition += 15;
  
  // Certificate content with official styling
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  const introText = [
    'Nous, soussignés, certifions par la présente que :',
    '',
    `Monsieur/Madame ${evaluation.firstName} ${evaluation.lastName.toUpperCase()}`,
    '',
    'a effectué un stage au sein de notre organisation et a été évalué(e) selon les modalités suivantes :'
  ];
  
  introText.forEach(line => {
    if (line === '') {
      yPosition += 5;
    } else if (line.includes(evaluation.firstName)) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(line, pageWidth / 2, yPosition, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      yPosition += 10;
    } else {
      doc.text(line, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 8;
    }
  });
  
  yPosition += 10;
  
  // Information box with border
  const boxY = yPosition;
  const boxHeight = 80;
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(1);
  doc.rect(margin + 10, boxY, pageWidth - 2 * (margin + 10), boxHeight);
  
  // Information details
  yPosition += 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  
  const details = [
    { label: 'Période du stage :', value: `Du ${new Date(evaluation.startDate).toLocaleDateString('fr-FR')} au ${new Date(evaluation.endDate).toLocaleDateString('fr-FR')}` },
    { label: 'Note obtenue :', value: `${evaluation.grade}/20` },
    { label: 'Appréciation :', value: evaluation.grade >= 16 ? 'Excellent' : evaluation.grade >= 14 ? 'Très bien' : evaluation.grade >= 12 ? 'Bien' : evaluation.grade >= 10 ? 'Passable' : 'Insuffisant' },
    { label: 'Commentaire :', value: evaluation.comment }
  ];
  
  details.forEach(detail => {
    doc.setFont('helvetica', 'bold');
    doc.text(detail.label, margin + 20, yPosition);
    doc.setFont('helvetica', 'normal');
    const textWidth = pageWidth - 2 * (margin + 20) - 60;
    const lines = doc.splitTextToSize(detail.value, textWidth);
    doc.text(lines, margin + 65, yPosition);
    yPosition += lines.length * 6 + 6;
  });
  
  yPosition = boxY + boxHeight + 20;
  
  // Official conclusion
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  const conclusionText = [
    'Ce certificat est délivré à l\'intéressé(e) pour servir et valoir ce que de droit.',
    '',
    'Le présent certificat atteste de la réalisation effective du stage susmentionné',
    'et de son évaluation dans le respect des dispositions réglementaires en vigueur.'
  ];
  
  conclusionText.forEach(line => {
    if (line === '') {
      yPosition += 5;
    } else {
      doc.text(line, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 8;
    }
  });
  
  yPosition += 20;
  
  // Signature section with official layout
  const signatureY = Math.max(yPosition, pageHeight - 100);
  
  // Date and place
  doc.setFont('helvetica', 'bold');
  doc.text('Fait à Antananarivo, le ', margin + 20, signatureY);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('fr-FR'), margin + 65, signatureY);
  
  // Director signature section
  doc.setFont('helvetica', 'bold');
  doc.text('Le Directeur du Système d\'Information', pageWidth - margin - 80, signatureY);
  
  // Add signature image
  try {
    const signatureUrl = '/lovable-uploads/52778f7b-9712-4ba5-91b9-65eeb655d7b5.png';
    doc.addImage(signatureUrl, 'PNG', pageWidth - margin - 70, signatureY + 5, 40, 20);
  } catch (error) {
    console.log('Signature image could not be loaded');
  }
  
  // Signature line
  doc.setLineWidth(0.5);
  doc.line(pageWidth - margin - 80, signatureY + 30, pageWidth - margin - 10, signatureY + 30);
  
  // Supervisor signature
  doc.setFont('helvetica', 'bold');
  doc.text('Le Maître de Stage', margin + 20, signatureY + 40);
  doc.line(margin + 20, signatureY + 55, margin + 80, signatureY + 55);
  
  // Signature placeholder
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Cachet et signature', pageWidth - margin - 50, signatureY + 35, { align: 'center' });
  doc.text('Signature', margin + 50, signatureY + 60, { align: 'center' });
  
  // Official stamp placeholder
  doc.setLineWidth(1);
  doc.setDrawColor(100, 100, 100);
  doc.circle(pageWidth - margin - 40, signatureY + 50, 15);
  doc.setFontSize(6);
  doc.text('CACHET', pageWidth - margin - 40, signatureY + 50, { align: 'center' });
  doc.text('OFFICIEL', pageWidth - margin - 40, signatureY + 52, { align: 'center' });
  
  // Page border for official look
  doc.setLineWidth(1);
  doc.setDrawColor(0, 51, 102);
  doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
  
  // Download with official filename
  const fileName = `Certificat_Evaluation_${evaluation.lastName.toUpperCase()}_${evaluation.firstName}_${new Date().getFullYear()}.pdf`;
  doc.save(fileName);
};
