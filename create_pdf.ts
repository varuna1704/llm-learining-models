import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { CURRICULUM } from './src/data/curriculum';

function generatePDF() {
  const doc = new PDFDocument({
    size: 'LETTER',
    margins: { top: 54, bottom: 54, left: 54, right: 54 },
    bufferPages: true // Allows total page count calculations in footer
  });

  const outputFilePath = path.resolve(process.cwd(), 'notes.pdf');
  const writeStream = fs.createWriteStream(outputFilePath);
  doc.pipe(writeStream);

  // Styling Constants (Slate Palette)
  const COLOR_TITLE = '#0f172a'; // Slate 900
  const COLOR_TEXT = '#334155'; // Slate 700
  const COLOR_MUTED = '#64748b'; // Slate 500
  const COLOR_BG_CODE = '#f8fafc'; // Slate 50
  const COLOR_BORDER_CODE = '#e2e8f0'; // Slate 200
  const COLOR_ACCENT = '#2563eb'; // Royal Blue Accent

  // ================= TITLE PAGE =================
  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0f172a');
  
  doc.fillColor('#38bdf8') // Light blue
     .font('Helvetica-Bold')
     .fontSize(32)
     .text('AI Engineering from First Principles', 54, 250, { align: 'left' });
  
  doc.fillColor('#e2e8f0') // Light gray
     .font('Helvetica-Oblique')
     .fontSize(16)
     .text('Interactive Curriculum, Visual Flowcharts & Code Architecture Reference', 54, 300, { align: 'left' });

  doc.fillColor('#94a3b8')
     .font('Helvetica')
     .fontSize(11)
     .text('Compiled: July 2026', 54, 650);

  doc.addPage();

  // Reset text color for body pages
  doc.fillColor(COLOR_TEXT);

  // ================= CURRICULUM GENERATION =================
  CURRICULUM.forEach((topic) => {
    // Page Header / Title
    doc.fillColor(COLOR_ACCENT)
       .font('Helvetica-Bold')
       .fontSize(18)
       .text(topic.title, { underline: true });
    doc.moveDown(0.4);

    doc.fillColor(COLOR_TEXT)
       .font('Helvetica-Bold')
       .fontSize(10)
       .text(`Overview: `, { continued: true })
       .font('Helvetica')
       .text(topic.summary);
    doc.moveDown(0.8);

    // Loop through subdiagrams and nodes
    Object.values(topic.subDiagrams).forEach((subDiagram) => {
      // If it's a sub-diagram (not root), render its title
      if (subDiagram.id !== topic.rootDiagramId) {
        doc.fillColor(COLOR_TITLE)
           .font('Helvetica-Bold')
           .fontSize(12)
           .text(`Subsection: ${subDiagram.title}`);
        doc.moveDown(0.4);
      }

      // Render Visual Diagram Layout (Arrow-chain style)
      if (subDiagram.nodes.length > 0) {
        doc.fillColor(COLOR_TITLE)
           .font('Helvetica-Bold')
           .fontSize(11)
           .text('Visual Flowchart:');
        doc.moveDown(0.2);

        // Render nodes sequentially inside boxes
        subDiagram.nodes.forEach((node, index) => {
          const text = `[ ${node.label} (${node.type.toUpperCase()}) ]`;
          
          doc.fillColor(COLOR_MUTED)
             .font('Courier-Bold')
             .fontSize(9.5)
             .text(text, { align: 'center' });
          
          if (index < subDiagram.nodes.length - 1) {
            doc.fillColor(COLOR_ACCENT)
               .font('Helvetica-Bold')
               .fontSize(12)
               .text('↓', { align: 'center' });
          }
        });
        doc.moveDown(0.8);
      }

      // Detailed nodes descriptions
      subDiagram.nodes.forEach((node) => {
        // Divider
        doc.strokeColor(COLOR_BORDER_CODE).lineWidth(0.5)
           .moveTo(54, doc.y)
           .lineTo(doc.page.width - 54, doc.y)
           .stroke();
        doc.moveDown(0.6);

        // Node Title
        doc.fillColor(COLOR_TITLE)
           .font('Helvetica-Bold')
           .fontSize(13)
           .text(`${node.label} (${node.type.toUpperCase()})`);
        doc.moveDown(0.2);

        // Short explanation
        doc.fillColor(COLOR_MUTED)
           .font('Helvetica-Oblique')
           .fontSize(10)
           .text(node.shortExplanation);
        doc.moveDown(0.4);

        // Detailed markdown parsing
        const details = node.detailedExplanation;
        const lines = details.split('\n');
        
        let inCodeBlock = false;
        let codeContent = '';

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];

          // Code Block boundary
          if (line.startsWith('```')) {
            if (inCodeBlock) {
              // End code block
              inCodeBlock = false;
              // Render code block background box
              const codeHeight = doc.heightOfString(codeContent, { width: doc.page.width - 128, font: 'Courier', size: 8.5 }) + 12;
              
              // Page break safety check
              if (doc.y + codeHeight > doc.page.height - doc.page.margins.bottom) {
                doc.addPage();
              }

              const startY = doc.y;
              doc.rect(54, startY, doc.page.width - 108, codeHeight)
                 .fillAndStroke(COLOR_BG_CODE, COLOR_BORDER_CODE);
              
              doc.fillColor('#0f172a') // Dark slate text for code
                 .font('Courier')
                 .fontSize(8.5)
                 .text(codeContent.trim(), 60, startY + 6, {
                   width: doc.page.width - 120,
                   lineGap: 2
                 });
              
              // Reset doc Y cursor back after the code box text
              doc.y = startY + codeHeight;
              doc.moveDown(0.4);
              codeContent = '';
            } else {
              // Start code block
              inCodeBlock = true;
            }
            continue;
          }

          if (inCodeBlock) {
            codeContent += line + '\n';
            continue;
          }

          // Markdown headers
          if (line.startsWith('###')) {
            const headingText = line.replace(/^###\s*/, '');
            doc.fillColor(COLOR_TITLE)
               .font('Helvetica-Bold')
               .fontSize(11)
               .text(headingText);
            doc.moveDown(0.2);
          } else if (line.startsWith('####')) {
            const headingText = line.replace(/^####\s*/, '');
            doc.fillColor(COLOR_ACCENT)
               .font('Helvetica-Bold')
               .fontSize(10.5)
               .text(headingText);
            doc.moveDown(0.2);
          } else if (line.startsWith('-')) {
            // Bullet items
            const bulletText = line.replace(/^-\s*/, '');
            doc.fillColor(COLOR_TEXT)
               .font('Helvetica')
               .fontSize(9.5)
               .text(`•  ${bulletText}`, { indent: 10 });
            doc.moveDown(0.15);
          } else if (line.trim() !== '') {
            // Regular paragraphs
            doc.fillColor(COLOR_TEXT)
               .font('Helvetica')
               .fontSize(9.5)
               .text(line, { lineGap: 2 });
            doc.moveDown(0.3);
          }
        }
        doc.moveDown(0.6);
      });
    });

    // Page break after each major topic
    doc.addPage();
  });

  // ================= GLOBAL HEADER & FOOTER =================
  const range = doc.bufferedPageRange();
  for (let i = 1; i < range.count; i++) {
    doc.switchToPage(i);

    // Header
    doc.fillColor(COLOR_MUTED)
       .font('Helvetica-Oblique')
       .fontSize(8)
       .text('AI Engineering from First Principles', 54, 25, { align: 'left' });
    
    doc.strokeColor('#cbd5e1').lineWidth(0.5)
       .moveTo(54, 38)
       .lineTo(doc.page.width - 54, 38)
       .stroke();

    // Footer
    doc.strokeColor('#cbd5e1').lineWidth(0.5)
       .moveTo(54, doc.page.height - 38)
       .lineTo(doc.page.width - 54, doc.page.height - 38)
       .stroke();

    doc.fillColor(COLOR_MUTED)
       .font('Helvetica')
       .fontSize(8)
       .text(`Page ${i + 1} of ${range.count}`, 54, doc.page.height - 28, { align: 'center' });
  }

  doc.end();
  writeStream.on('finish', () => {
    console.log(`PDF Course book generated successfully at: ${outputFilePath}`);
  });
}

generatePDF();
