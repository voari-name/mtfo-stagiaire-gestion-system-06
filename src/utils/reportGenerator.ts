
import jsPDF from 'jspdf';

export interface ReportData {
  interns?: any[];
  projects?: any[];
  evaluations?: any[];
}

export const generatePDFReport = (type: string, data: ReportData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPosition = 20;
  
  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  const title = type === 'personnalisé' ? 'Rapport Personnalisé' : `Rapport ${type.charAt(0).toUpperCase() + type.slice(1)}`;
  doc.text(title, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 20;
  
  // Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString('fr-FR');
  doc.text(`Généré le: ${currentDate}`, 20, yPosition);
  
  yPosition += 20;
  
  // Content based on type
  doc.setFontSize(12);
  
  if (data.interns && data.interns.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('Liste des Stagiaires:', 20, yPosition);
    yPosition += 10;
    
    doc.setFont('helvetica', 'normal');
    data.interns.forEach((intern, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.text(`${index + 1}. ${intern.lastName} ${intern.firstName}`, 25, yPosition);
      yPosition += 6;
      doc.text(`   Email: ${intern.email}`, 25, yPosition);
      yPosition += 6;
      doc.text(`   Stage: ${intern.title}`, 25, yPosition);
      yPosition += 6;
      doc.text(`   Période: ${new Date(intern.startDate).toLocaleDateString('fr-FR')} - ${new Date(intern.endDate).toLocaleDateString('fr-FR')}`, 25, yPosition);
      yPosition += 6;
      doc.text(`   Statut: ${intern.status}`, 25, yPosition);
      yPosition += 6;
      if (intern.gender) {
        doc.text(`   Sexe: ${intern.gender}`, 25, yPosition);
        yPosition += 6;
      }
      yPosition += 6;
    });
  }

  if (data.projects && data.projects.length > 0) {
    if (data.interns && data.interns.length > 0) yPosition += 10;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Liste des Projets:', 20, yPosition);
    yPosition += 10;
    
    doc.setFont('helvetica', 'normal');
    data.projects.forEach((project, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.text(`${index + 1}. ${project.title}`, 25, yPosition);
      yPosition += 6;
      doc.text(`   Description: ${project.description || 'Aucune description'}`, 25, yPosition);
      yPosition += 6;
      doc.text(`   Période: ${new Date(project.startDate).toLocaleDateString('fr-FR')} - ${new Date(project.endDate).toLocaleDateString('fr-FR')}`, 25, yPosition);
      yPosition += 6;
      doc.text(`   Stagiaires: ${project.interns.map(i => i.name).join(', ')}`, 25, yPosition);
      yPosition += 12;
    });
  }

  if (data.evaluations && data.evaluations.length > 0) {
    if ((data.interns && data.interns.length > 0) || (data.projects && data.projects.length > 0)) yPosition += 10;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Liste des Évaluations:', 20, yPosition);
    yPosition += 10;
    
    doc.setFont('helvetica', 'normal');
    data.evaluations.forEach((evaluation, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.text(`${index + 1}. ${evaluation.lastName} ${evaluation.firstName}`, 25, yPosition);
      yPosition += 6;
      doc.text(`   Note: ${evaluation.grade}/20`, 25, yPosition);
      yPosition += 6;
      doc.text(`   Commentaire: ${evaluation.comment}`, 25, yPosition);
      yPosition += 6;
      doc.text(`   Période: ${new Date(evaluation.startDate).toLocaleDateString('fr-FR')} - ${new Date(evaluation.endDate).toLocaleDateString('fr-FR')}`, 25, yPosition);
      yPosition += 12;
    });
  }
  
  // Save the PDF
  const filename = type === 'personnalisé' ? `rapport-personnalise-${currentDate.replace(/\//g, '-')}.pdf` : `rapport-${type}-${currentDate.replace(/\//g, '-')}.pdf`;
  doc.save(filename);
};

export const generateCSVReport = (type: string, data: ReportData) => {
  let csvContent = '';
  let allRows: string[] = [];
  
  if (data.interns && data.interns.length > 0) {
    const headers = 'Type,Nom,Prénom,Email,Intitulé du stage,Date de début,Date de fin,Statut,Sexe\n';
    const rows = data.interns.map(intern => 
      `"Stagiaire","${intern.lastName}","${intern.firstName}","${intern.email}","${intern.title}","${intern.startDate}","${intern.endDate}","${intern.status}","${intern.gender || 'Non spécifié'}"`
    );
    if (allRows.length === 0) csvContent += headers;
    allRows.push(...rows);
  }

  if (data.projects && data.projects.length > 0) {
    if (allRows.length === 0) {
      csvContent += 'Type,Titre,Description,Date de début,Date de fin,Stagiaires\n';
    }
    const rows = data.projects.map(project => 
      `"Projet","${project.title}","${project.description || ''}","${project.startDate}","${project.endDate}","${project.interns.map(i => i.name).join('; ')}"`
    );
    allRows.push(...rows);
  }

  if (data.evaluations && data.evaluations.length > 0) {
    if (allRows.length === 0) {
      csvContent += 'Type,Nom,Prénom,Note,Commentaire,Date de début,Date de fin\n';
    }
    const rows = data.evaluations.map(evaluation => 
      `"Évaluation","${evaluation.lastName}","${evaluation.firstName}","${evaluation.grade}","${evaluation.comment}","${evaluation.startDate}","${evaluation.endDate}"`
    );
    allRows.push(...rows);
  }
  
  csvContent += allRows.join('\n');
  
  // Create and download CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  const filename = type === 'personnalisé' ? `rapport-personnalise-${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.csv` : `rapport-${type}-${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.csv`;
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
