/**
 * PDF Export functionality for Cram application
 * 
 * This file contains functions for exporting the generated cheat sheets to PDF.
 */

// Initialize export button handler
function initExport() {
  exportBtn.addEventListener('click', exportToPDF);
}

/**
 * Exports the generated cheat sheet to a PDF file
 */
async function exportToPDF() {
  // Disable button with animated feedback
  exportBtn.disabled = true;
  exportBtn.classList.add('relative', 'overflow-hidden');
  
  // Add progress animation
  const progressBar = document.createElement('div');
  progressBar.className = 'absolute bottom-0 left-0 h-1 bg-white';
  progressBar.style.width = '0%';
  progressBar.style.transition = 'width 0.8s ease-in-out';
  exportBtn.appendChild(progressBar);
  
  setTimeout(() => {
    progressBar.style.width = '100%';
  }, 50);
  
  try {
    loading.classList.remove('hidden');
    
    // Make sure MathJax has rendered all formulas
    await MathJax.typesetPromise([preview, wrapperPreview]);
    fitBottleFont();
    
    const type = currentType();
    const isBottle = type === 'bottle';
    const isLandscape = isBottle;
    
    // Create clones for export to avoid modifying the originals
    const { container, elements } = prepareExport();
    
    // Get PDF dimensions in points (72 points = 1 inch, 1 inch = 2.54 cm)
    const cmToPoints = cm => cm * 72 / 2.54;
    const pageWidth = isLandscape ? cmToPoints(29.7) : cmToPoints(21);
    const pageHeight = isLandscape ? cmToPoints(21) : cmToPoints(29.7);
    
    // Create PDF with jsPDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'pt',
      format: [pageWidth, pageHeight]
    });
    
    // Convert each page to canvas and add to PDF
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      
      // Ensure element is visible for html2canvas
      element.style.display = 'block';
      
      // Перед конвертацией, убедимся что пунктирные линии хорошо видны
      const scissorsLines = element.querySelectorAll('.scissors-line');
      scissorsLines.forEach(elem => {
        elem.style.zIndex = '1000'; // Устанавливаем высокий z-index
      });      // Скрыть вспомогательные MathML элементы перед рендерингом canvas
      const mathMLElements = element.querySelectorAll('mjx-assistive-mml');
      mathMLElements.forEach(el => 
        el.style.setProperty('display', 'none', 'important'));

      // Convert to canvas with enhanced settings
      const canvas = await html2canvas(element, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          // Additional styling for cloned document
          const clonedLines = clonedDoc.querySelectorAll('.scissors-line');
          clonedLines.forEach(line => {
            line.style.zIndex = '1000';
            if (line.classList.contains('scissors-line-horizontal')) {
              line.style.borderTop = '2px dashed #888';
            } else {
              line.style.borderLeft = '2px dashed #888';
            }
          });
          
          // Также скрываем MathML элементы в клонированном документе
          const clonedMathMLElements = clonedDoc.querySelectorAll('mjx-assistive-mml');
          clonedMathMLElements.forEach(el => 
            el.style.setProperty('display', 'none', 'important'));
        }
      });
        // Восстановить отображение вспомогательных MathML элементов
      mathMLElements.forEach(el => 
        el.style.removeProperty('display'));
        
      // Add canvas to PDF
      const imgData = canvas.toDataURL('image/png');
      
      if (i > 0) {
        pdf.addPage();
      }
      
      pdf.addImage(
        imgData, 
        'PNG', 
        0, 0, 
        pdf.internal.pageSize.getWidth(),
        pdf.internal.pageSize.getHeight(),
        '', 
        'FAST'
      );
    }
      // Дополнительная проверка, чтобы убедиться, что все MathML элементы видимы
    const finalCheck = container.querySelectorAll('mjx-assistive-mml');
    finalCheck.forEach(el => {
      if (el.style.display === 'none') {
        el.style.removeProperty('display');
      }
    });
    
    // Save PDF
    pdf.save(`cheatsheet-${topicDisplay.value}.pdf`);
    
    // Clean up
    document.body.removeChild(container);
    
  } catch (err) {
    showError(`Ошибка экспорта: ${err.message}`);
    console.error(err);
  } finally {
    loading.classList.add('hidden');
    
    // Clean up progress bar with animation
    const progressBar = exportBtn.querySelector('div');
    if (progressBar) {
      progressBar.style.transition = 'opacity 0.3s ease';
      progressBar.style.opacity = '0';
      
      setTimeout(() => {
        exportBtn.removeChild(progressBar);
        exportBtn.classList.remove('relative', 'overflow-hidden');
        exportBtn.disabled = false;
      }, 300);
    } else {
      exportBtn.disabled = false;
    }
  }
}

/**
 * Prepares elements for PDF export
 * @returns {Object} Object containing the container and elements to be exported
 */
function prepareExport() {
  const type = currentType();
  const isBottle = type === 'bottle';
  
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  document.body.appendChild(container);
  
  // Clone page1 content
  const page1Clone = page1.cloneNode(true);
  page1Clone.style.margin = '0';
  page1Clone.style.boxShadow = 'none';
  
  // Remove scissors icons but keep lines
  const scissorsIcons = page1Clone.querySelectorAll('.scissors-icon');
  scissorsIcons.forEach(elem => elem.remove());
  
  // Ensure lines are visible and styles preserved
  const scissorsLines = page1Clone.querySelectorAll('.scissors-line');
  scissorsLines.forEach(elem => {
    if (elem.classList.contains('scissors-line-horizontal')) {
      elem.style.borderTop = '2px dashed #888';
    } else if (elem.classList.contains('scissors-line-vertical')) {
      elem.style.borderLeft = '2px dashed #888';
    }
  });
  
  container.appendChild(page1Clone);
  
  let elements = [page1Clone];
  
  // For bottle type, also clone page2
  if (isBottle) {
    const page2Clone = page2.cloneNode(true);
    page2Clone.style.margin = '0';
    page2Clone.style.boxShadow = 'none';
    container.appendChild(page2Clone);
    elements = [page1Clone, page2Clone];
  }
  
  return { container, elements };
}
