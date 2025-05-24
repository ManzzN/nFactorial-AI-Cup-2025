/**
 * API Interaction for Cram application
 * 
 * This file contains functions for interacting with the OpenAI API.
 */

/**
 * Starts the generation process
 * @param {string} [forceTopic] - Optional topic to use instead of input value
 */
async function startGeneration(forceTopic) {
  // Get topic and ensure it's a string (not an event object)
  const topic = typeof forceTopic === 'string' ? forceTopic : topicInput.value.trim();
  if (!topic) return alert('Введите тему!');
  
  currentTopic = topic;
  
  // Show app and hide intro with enhanced animations
  hideError();
  
  // Animate intro section out with a slide up effect
  intro.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  intro.style.opacity = '0';
  intro.style.transform = 'translateY(-30px)';
  
  setTimeout(() => {
    intro.classList.add('hidden');
    
    // Prepare app animation
    app.style.transition = 'opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.1, 0.9, 0.2, 1.0)';
    app.classList.remove('hidden');
    
    // Trigger staggered animations
    setTimeout(() => {
      app.style.opacity = '1';
      app.style.transform = 'translateY(0) scale(1)';
      
      // Animate toolbar elements sequentially
      const toolbarItems = app.querySelectorAll('.flex-1, .flex.items-center, #regenerate-btn, #export-btn');
      toolbarItems.forEach((item, index) => {
        setTimeout(() => {
          item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 100 * index);
      });
    }, 50);
  }, 700);

  // Update UI
  topicDisplay.value = topic;
  loading.classList.remove('hidden');
  preview.classList.add('hidden');
  wrapperPreview.classList.add('hidden');
  applyLayout();
  exportBtn.disabled = true;

  try {
    await generateCheatSheet(topic);
    
    exportBtn.disabled = false;
    loading.classList.add('hidden');
  } catch (err) {
    showError(`Ошибка API: ${err.message}`);
  }
}

/**
 * Makes the actual API call to OpenAI to generate the cheat sheet
 * @param {string} topic - The topic to generate content for
 */
async function generateCheatSheet(topic) {
  const prompt = `Сгенерируй одностраничную HTML‑шпаргалку по теме «${topic}».
· Используй h2/h3, ul/li.
· Формулы вставляй как LaTeX между $$ … $$.
· Не добавляй <!DOCTYPE>.
· Оберни всё в <section id="sheet"> … </section>.`;

  const response = await fetch(CONFIG.apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.apiKey}`
    },
    body: JSON.stringify({
      model: CONFIG.model,
      temperature: 0.5,
      max_tokens: 2048,
      messages: [
        { role: 'system', content: 'You are a concise cheat‑sheet generator. Do not include any instructions about HTML format in your response.' },
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  const data = await response.json();
  const content = data.choices[0].message.content.trim();
  
  // Display the content
  preview.innerHTML = content;
  preview.classList.remove('hidden');
  
  // Display placeholder content for wrapper preview
  wrapperPreview.innerHTML = '<div class="p-4 text-center">' +
    '<h3 class="text-lg font-bold mb-2">Обратная сторона обёртки</h3>' +
    '<p>Здесь можно разместить дополнительную информацию или оставить пустым</p>' +
    '</div>';
  wrapperPreview.classList.remove('hidden');
  
  // Render math formulas
  await MathJax.typesetPromise([preview, wrapperPreview]);
  
  // Auto-adjust font size if in bottle mode
  if (currentType() === 'bottle') {
    // Небольшая задержка для корректного вычисления размеров после рендеринга
    setTimeout(() => {
      fitBottleFont();
    }, 100);
  }
}
