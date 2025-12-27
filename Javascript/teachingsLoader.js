document.addEventListener('DOMContentLoaded', function() {
    console.log('teachingsLoader.js: DOMContentLoaded event fired.');
    const teachingsVideoGrid = document.getElementById('teachings-video-grid'); 
    const teachingsList = document.getElementById('teachings-list');

    if (!teachingsVideoGrid) {
        console.error('teachingsLoader.js: #teachings-video-grid not found.');
        return;
    }
    if (!teachingsList) {
        console.error('teachingsLoader.js: #teachings-list not found.');
        return;
    }

    fetch('Json/teachings.json')
        .then(response => response.json())
        .then(teachings => {
            console.log('teachingsLoader.js: Teachings data fetched successfully:', teachings);
            teachingsVideoGrid.innerHTML = ''; 
            teachingsList.innerHTML = '';
            const currentLang = getCurrentLanguage();

            // Sort teachings by date, most recent first
            teachings.sort((a, b) => new Date(b.date) - new Date(a.date));

            teachings.forEach(teaching => {
                const title = teaching.title[currentLang] || teaching.title['en'];
                const speaker = teaching.speaker[currentLang] || teaching.speaker['en'];
                const summary = teaching.summary[currentLang] || teaching.summary['en'];
                const type = teaching.type[currentLang] || teaching.type['en'];

                if (teaching.type === "YouTube") {
                    console.log('teachingsLoader.js: Processing YouTube teaching:', title);
                    const videoElement = document.createElement('div');
                    videoElement.classList.add('teaching-video-card');
                    videoElement.innerHTML = `
                        <div class="video-two-column-layout">
                            <div class="teaching-video-info">
                                <h3>${title}</h3>
                                <p><strong>Type:</strong> ${type}</p>
                                <p><strong>Date:</strong> ${teaching.date}</p>
                                <p><strong>Speaker:</strong> ${speaker}</p>
                                <p>${summary}</p>
                            </div>
                            <div class="video-container">
                                <iframe 
                                    src="https://www.youtube.com/embed/${teaching.youtube_id}" 
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen>
                                </iframe>
                            </div>
                        </div>
                    `;
                    teachingsVideoGrid.appendChild(videoElement);
                    console.log('teachingsLoader.js: YouTube video element appended:', videoElement);
                } else {
                    console.log('teachingsLoader.js: Processing text-based teaching:', title);
                    const listItem = document.createElement('div');
                    listItem.classList.add('teaching-list-item');
                    listItem.innerHTML = `
                        <h3>${title}</h3>
                        <p><strong>Type:</strong> ${type}</p>
                        <p><strong>Date:</strong> ${teaching.date}</p>
                        <p><strong>Speaker:</strong> ${speaker}</p>
                        <p>${summary}</p>
                        <a href="${teaching.content_url}" class="read-more-btn" data-i18n="teachings_read_more_link">Read More</a>
                    `;
                    teachingsList.appendChild(listItem);
                }
            });
            if (typeof translatePage === 'function') {
                translatePage(currentLang);
            }
        })
        .catch(error => {
            console.error('teachingsLoader.js: Error loading teachings:', error);
            if (teachingsVideoGrid) teachingsVideoGrid.innerHTML = `<p data-i18n="teachings_load_error">Failed to load teachings. Please try again later.</p>`;
            if (teachingsList) teachingsList.innerHTML = `<p data-i18n="teachings_load_error">Failed to load teachings. Please try again later.</p>`;
            if (typeof translatePage === 'function') {
                translatePage(getCurrentLanguage());
            }
        });
});
