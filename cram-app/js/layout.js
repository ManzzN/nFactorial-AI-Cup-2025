/**
 * Layout management for Cram application
 * 
 * This file contains functions for managing the layout and appearance
 * of the cheat sheet based on the selected type (bottle or cheat).
 */

/**
 * Applies layout based on the selected type (bottle or cheat)
 */
function applyLayout() {
  const type = currentType();
  const portrait = [21, 29.7];    // A4 dimensions in cm
  const landscape = [29.7, 21];
  const scissorsLine = document.getElementById('scissors-line-top');
  const scissorsContainer = document.getElementById('scissors-container');

  // Сначала очистим все линии ножниц
  scissorsContainer.innerHTML = '';
  if (scissorsLine) scissorsLine.style.display = 'none';

  if (type === 'cheat') {
    sizeGroup.classList.remove('hidden');
    page2.classList.add('hidden');
    
    page1.style.width = portrait[0] + 'cm';
    page1.style.height = portrait[1] + 'cm';

    Object.assign(preview.style, {
      width: sizeRange.value + 'cm',
      minHeight: '29cm',
      maxHeight: '29cm',
      padding: '1cm',
      columnCount: '3', // Добавляем колонки для вертикальной шпоры
      columnGap: '1cm',
      columnFill: 'auto',
      borderRadius: '4px',
      overflow: 'visible'
    });
    
    // Добавляем вертикальные линии с ножницами между колонками
    createVerticalScissorsLines();
  } else {
    sizeGroup.classList.add('hidden');
    page2.classList.remove('hidden');
    
    // Показать линию с ножницами в режиме бутылочной шпоры
    if (scissorsLine) scissorsLine.style.display = 'flex';

    page1.style.width = landscape[0] + 'cm';
    page1.style.height = landscape[1] + 'cm';
    page2.style.width = landscape[0] + 'cm';
    page2.style.height = landscape[1] + 'cm';
    
    Object.assign(preview.style, {
      width: landscape[0] + 'cm',
      minHeight: '5cm',
      maxHeight: CONFIG.maxBottleHeightCm + 'cm',
      padding: '0.5cm 1cm',
      columnCount: CONFIG.bottleColumns,
      columnGap: '0.8cm', // Уменьшаем отступ между колонками для более эффективного использования пространства
      columnFill: 'auto',
      borderRadius: '4px',
      overflow: 'hidden' // Предотвращаем выход контента за пределы контейнера
    });

    Object.assign(wrapperPreview.style, {
      width: landscape[0] + 'cm',
      minHeight: '5cm',
      padding: '0.5cm 1cm',
      borderRadius: '4px'
    });
  }
}

/**
 * Auto-adjusts font size to fit content within the bottle layout
 * Checks both height and width constraints using binary search for efficiency
 */
function fitBottleFont() {
  if (currentType() !== 'bottle') return;
  
  const maxH = cmToPx(CONFIG.maxBottleHeightCm);
  const maxW = cmToPx(29.7); // A4 landscape width in cm
  
  // Используем бинарный поиск для более быстрого подбора размера
  let minSize = 8;  // Минимальный допустимый размер шрифта
  let maxSize = 20; // Начальное значение максимального размера
  let currentSize = parseFloat(getComputedStyle(preview).fontSize);
  
  // Проверяем сначала текущий размер
  setFontSize(currentSize);
  if (preview.scrollHeight <= maxH && preview.scrollWidth <= maxW) {
    // Если уже подходит, пробуем увеличить размер
    while (preview.scrollHeight <= maxH && preview.scrollWidth <= maxW && currentSize < maxSize) {
      currentSize += 0.5;
      setFontSize(currentSize);
    }
    
    // Если вышли за границы, откатываемся на один шаг назад
    if (preview.scrollHeight > maxH || preview.scrollWidth > maxW) {
      currentSize -= 0.5;
      setFontSize(currentSize);
    }
  } else {
    // Если не подходит, используем бинарный поиск
    while (maxSize - minSize > 0.5) {
      currentSize = (minSize + maxSize) / 2;
      setFontSize(currentSize);
      
      if (preview.scrollHeight > maxH || preview.scrollWidth > maxW) {
        maxSize = currentSize;
      } else {
        minSize = currentSize;
      }
    }
    
    // Устанавливаем окончательный размер (минимальный из подходящих)
    setFontSize(minSize);
  }
  
  console.log(`Подобран оптимальный размер шрифта: ${currentSize}px`);
}

/**
 * Creates vertical scissors lines between columns for the cheat sheet with animation
 */
function createVerticalScissorsLines() {
  // Очищаем контейнер для ножниц
  const scissorsContainer = document.getElementById('scissors-container');
  scissorsContainer.innerHTML = '';
  
  // В режиме вертикальной шпоры не добавляем линии ножниц
  // Возвращаемся сразу, чтобы не создавать лишние элементы
  if (currentType() !== 'cheat') {
    return;
  }
  
  // Для вертикальных линий между колонками добавляем только пунктирные линии без иконок ножниц
  const contentWidth = parseFloat(sizeRange.value);
  const columnCount = 3; // Соответствует columnCount в стилях
  const columnWidth = contentWidth / columnCount;
  
  // Создаем линии между колонками (кроме последней) с анимацией появления
  for (let i = 1; i < columnCount; i++) {
    const position = i * columnWidth;
    
    const scissorsLine = document.createElement('div');
    scissorsLine.className = 'scissors-line scissors-line-vertical';
    scissorsLine.style.left = position + 'cm';
    scissorsLine.style.borderLeft = '2px dashed #888';
    scissorsLine.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    scissorsLine.style.opacity = '0';
    scissorsLine.style.transform = 'scaleY(0.97)';
    
    scissorsContainer.appendChild(scissorsLine);
    
    // Поочередное появление с небольшой задержкой для каждой линии
    setTimeout(() => {
      scissorsLine.style.opacity = '1';
      scissorsLine.style.transform = 'scaleY(1)';
    }, i * 150);
    
    // Добавляем эффект "переливания" для пунктирной линии
    scissorsLine.addEventListener('mouseover', () => {
      scissorsLine.style.borderLeft = '2px dashed #4299e1';
      scissorsLine.style.boxShadow = '0 0 8px rgba(66, 153, 225, 0.4)';
    });
    
    scissorsLine.addEventListener('mouseout', () => {
      scissorsLine.style.borderLeft = '2px dashed #888';
      scissorsLine.style.boxShadow = 'none';
    });
  }
}
