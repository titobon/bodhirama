document.addEventListener('DOMContentLoaded', function() {
    const eventsContainer = document.querySelector('.content-section');

    // Function to load and render events
    async function loadAndRenderEvents() {
        try {
            const response = await fetch('Json/events.json');
            const events = await response.json();
            eventsContainer.innerHTML = ''; // Clear placeholder content

            const currentLang = getCurrentLanguage(); // Get current language from i18n.js

            events.forEach(event => {
                const title = event.title[currentLang] || event.title['en'];
                const time = event.time[currentLang] || event.time['en'];
                const location = event.location[currentLang] || event.location['en'];
                const speaker = event.speaker[currentLang] || event.speaker['en'];
                const summary = event.summary[currentLang] || event.summary['en'];

                const eventElement = document.createElement('div');
                eventElement.classList.add('event-item');
                eventElement.innerHTML = `
                    <h3>${title}</h3>
                    <p><strong>Date:</strong> ${event.date}</p>
                    <p><strong>Time:</strong> ${time}</p>
                    <p><strong>Location:</strong> ${location}</p>
                    <p><strong>Speaker:</strong> ${speaker}</p>
                    <p>${summary}</p>
                    ${event.registration_link ? `<a href="${event.registration_link}" class="read-more" data-i18n="events_register_link">Register/More Info</a>` : ''}
                    <hr>
                `;
                eventsContainer.appendChild(eventElement);
            });
            // After all dynamic content is loaded, trigger translation for it
            // This is crucial for elements like the 'Register/More Info' link
            if (typeof translatePage === 'function') {
                translatePage(currentLang);
            }
        } catch (error) {
            console.error('Error loading events:', error);
            // Display a message if events fail to load
            eventsContainer.innerHTML = `<p data-i18n="events_load_error">Failed to load events. Please try again later.</p>`;
            if (typeof translatePage === 'function') {
                translatePage(getCurrentLanguage());
            }
        }
    }

    // Initial load of events
    loadAndRenderEvents();

    // Re-render events when language changes (if needed, this can be triggered by i18n.js)
    // For now, assume i18n.js handles re-translation of dynamic content if it's already in DOM
    // However, if the dynamic content is added *after* i18n.js has run, we need to ensure it's translated.
    // The previous modification to loadComponents.js helps, but for content loaded by specific loaders,
    // we need to explicitly call translatePage after content is added.
});