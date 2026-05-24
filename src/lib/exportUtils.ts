/**
 * Export utilities — uses dynamic imports to avoid bundling
 * jsPDF (~280KB) and xlsx (~500KB) into every page.
 */

export const exportToPDF = async (title: string, headers: string[][], data: any[][], fileName: string) => {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();
  
  // Add Title
  doc.setFontSize(18);
  doc.setTextColor(40);
  doc.text(title, 14, 22);
  
  // Add Date Range / Generation Time
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

  // Generate Table
  autoTable(doc, {
    startY: 35,
    head: headers,
    body: data,
    theme: 'striped',
    headStyles: { fillColor: [99, 102, 241], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  doc.save(`${fileName}.pdf`);
};

export const exportToExcel = async (data: any[], fileName: string) => {
  const XLSX = await import("xlsx");

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
