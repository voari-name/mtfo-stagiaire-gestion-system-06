
import jsPDF from 'jspdf';

export interface InternData {
  id: number;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  startDate: string;
  endDate: string;
  status: string;
}

export const generateInternPDF = async (intern: InternData) => {
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
  doc.text('CERTIFICAT DE STAGE', pageWidth / 2, yPosition + 10, { align: 'center' });
  
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
    `Monsieur/Madame ${intern.firstName} ${intern.lastName.toUpperCase()}`,
    '',
    'a effectué un stage au sein de notre organisation selon les modalités suivantes :'
  ];
  
  introText.forEach(line => {
    if (line === '') {
      yPosition += 5;
    } else if (line.includes(intern.firstName)) {
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
  const boxHeight = 60;
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(1);
  doc.rect(margin + 10, boxY, pageWidth - 2 * (margin + 10), boxHeight);
  
  // Information details
  yPosition += 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  
  const details = [
    { label: 'Intitulé du stage :', value: intern.title },
    { label: 'Période du stage :', value: `Du ${new Date(intern.startDate).toLocaleDateString('fr-FR')} au ${new Date(intern.endDate).toLocaleDateString('fr-FR')}` },
    { label: 'Statut :', value: intern.status === 'en cours' ? 'En cours' : intern.status === 'fin' ? 'Terminé avec succès' : 'À commencer' }
  ];
  
  details.forEach(detail => {
    doc.setFont('helvetica', 'bold');
    doc.text(detail.label, margin + 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(detail.value, margin + 55, yPosition);
    yPosition += 12;
  });
  
  yPosition = boxY + boxHeight + 20;
  
  // Official conclusion
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  const conclusionText = [
    'Ce certificat est délivré à l\'intéressé(e) pour servir et valoir ce que de droit.',
    '',
    'Le présent certificat atteste de la réalisation effective du stage susmentionné',
    'dans le respect des dispositions réglementaires en vigueur.'
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
  const signatureY = Math.max(yPosition, pageHeight - 60);
  
  // Date and place
  doc.setFont('helvetica', 'bold');
  doc.text('Fait à Antananarivo, le ', margin + 20, signatureY);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('fr-FR'), margin + 65, signatureY);
  
  // Signature box
  doc.setFont('helvetica', 'bold');
  doc.text('Le Directeur du Système d\'Information', pageWidth - margin - 80, signatureY);
  
  // Signature line
  doc.setLineWidth(0.5);
  doc.line(pageWidth - margin - 80, signatureY + 25, pageWidth - margin - 10, signatureY + 25);
  
  // Footer with official seal placeholder
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Cachet et signature', pageWidth - margin - 50, signatureY + 30, { align: 'center' });
  
  // Page border for official look
  doc.setLineWidth(1);
  doc.setDrawColor(0, 51, 102);
  doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
  
  // Télécharger le PDF avec un nom plus officiel
  const fileName = `Certificat_Stage_${intern.lastName.toUpperCase()}_${intern.firstName}_${new Date().getFullYear()}.pdf`;
  doc.save(fileName);
};
