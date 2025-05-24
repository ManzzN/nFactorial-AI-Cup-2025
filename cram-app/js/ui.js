/**
 * User Interface handling for Cram application
 * 
 * This file contains functions for handling user interactions
 * and UI state management.
 */

// Initialize UI event handlers
function initUI() {
  startBtn.addEventListener('click', () => {
    // Animate the project info section out
    projectInfo.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    projectInfo.style.opacity = '0';
    projectInfo.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
      projectInfo.classList.add('hidden');
      
      // Prepare intro animation
      intro.style.opacity = '0';
      intro.style.transform = 'translateY(20px)';
      intro.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      intro.classList.remove('hidden');
      
      // Trigger animation
      setTimeout(() => {
        intro.style.opacity = '1';
        intro.style.transform = 'translateY(0)';
        topicInput.focus();
      }, 50);
    }, 600);
  });
    topicInput.addEventListener('keydown', e => { 
    if (e.key === 'Enter') {
      const topic = topicInput.value.trim();
      if (topic) startGeneration();
    }
  });
  
  generateBtn.addEventListener('click', e => {
    const topic = topicInput.value.trim();
    if (topic) startGeneration();
    else alert('Введите тему!');
  });
  
  document.querySelectorAll('input[name="ctype"]').forEach(r => 
    r.addEventListener('change', () => { 
      const newType = r.value;
      
      // Добавляем анимацию перехода
      page1.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
      page1.style.opacity = '0';
      page1.style.transform = 'scale(0.98)';
      
      setTimeout(() => {
        // Полностью сбрасываем стили перед применением нового макета
        preview.removeAttribute('style');
        
        // Применяем новую компоновку
        applyLayout(); 
        
        // При переключении в режим бутылки, подстраиваем размер шрифта
        if (newType === 'bottle') {
          // Сначала устанавливаем шрифт по умолчанию, затем подгоняем
          setFontSize(CONFIG.defaultFontSize);
          
          // Анимируем иконку ножниц для бутылки
          const scissorsIcon = document.querySelector('#scissors-line-top .scissors-icon');
          if (scissorsIcon) {
            scissorsIcon.classList.add('animate-cut');
          }
          
          // Небольшая задержка для корректного применения новой компоновки
          setTimeout(() => {
            fitBottleFont();
            // Возвращаем видимость страницы с анимацией
            page1.style.opacity = '1';
            page1.style.transform = 'scale(1)';
          }, 100);
        } else {
          // Для режима шпоры - установка стандартного размера шрифта
          setFontSize(CONFIG.defaultFontSize);
          // Возвращаем видимость страницы с анимацией
          page1.style.opacity = '1';
          page1.style.transform = 'scale(1)';
        }
      }, 300);
    })
  );
  
  fontRange.addEventListener('input', e => { 
    setFontSize(parseFloat(e.target.value));
    fontSizeLabel.textContent = e.target.value;
    fitBottleFont(); 
  });
  
  sizeRange.addEventListener('input', () => { 
    sizeLabel.textContent = sizeRange.value; 
    applyLayout(); 
    // Пересоздаем вертикальные линии при изменении размера
    if (currentType() === 'cheat') {
      createVerticalScissorsLines();
    }
  });
    regenerateBtn.addEventListener('click', () => startGeneration(currentTopic));
  
  backBtn.addEventListener('click', () => {
    // Анимация скрытия приложения
    app.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    app.style.opacity = '0';
    app.style.transform = 'translateY(30px) scale(0.98)';
    
    setTimeout(() => {
      app.classList.add('hidden');
      
      // Подготавливаем элемент intro с правильными начальными стилями
      intro.style.opacity = '0';
      intro.style.transform = 'translateY(-20px)';
      intro.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      intro.classList.remove('hidden');
      
      // Сбрасываем значение поля ввода для нового ввода
      topicInput.value = '';
      
      // Применяем анимацию появления с небольшой задержкой
      setTimeout(() => {
        intro.style.opacity = '1';
        intro.style.transform = 'translateY(0)';
        // Устанавливаем фокус на поле ввода для удобства
        topicInput.focus();
      }, 50);
    }, 700);
  });
  
  themeToggle.addEventListener('click', toggleDarkMode);
  
  // Add window resize handler for bottle font adjustments
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (currentType() === 'bottle') {
        fitBottleFont();
      }
    }, 250); // Задержка для предотвращения частого вызова при изменении размера
  });
}

/**
 * Toggle dark/light mode with animation effects
 */
function toggleDarkMode() {
  // Add transition animation to the entire page
  document.body.style.transition = 'background-color 0.5s ease';
  
  // Create flash effect
  const flash = document.createElement('div');
  flash.style.position = 'fixed';
  flash.style.top = '0';
  flash.style.left = '0';
  flash.style.width = '100%';
  flash.style.height = '100%';
  flash.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
  flash.style.zIndex = '9999';
  flash.style.pointerEvents = 'none';
  flash.style.transition = 'opacity 0.3s ease';
  document.body.appendChild(flash);
  
  setTimeout(() => {
    // Toggle dark mode
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
    
    // Remove flash effect
    setTimeout(() => {
      flash.style.opacity = '0';
      setTimeout(() => document.body.removeChild(flash), 300);
    }, 50);
  }, 50);
}

// Check for stored theme preference on load
function setInitialTheme() {
  if (
    localStorage.theme === 'dark' || 
    (!('theme' in localStorage) && 
    window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}
