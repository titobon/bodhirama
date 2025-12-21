document.addEventListener('DOMContentLoaded', function() {
    const meetingsContainer = document.getElementById('meetings-container');
    const noticiasContainer = document.getElementById('noticias-container');

    // Clear existing placeholder content
    if (meetingsContainer) meetingsContainer.innerHTML = '';
    if (noticiasContainer) noticiasContainer.innerHTML = '';

    fetch('Json/events.json')
        .then(response => response.json())
        .then(events => {
            const currentLang = getCurrentLanguage();

            // Upcoming Events
            const upcomingEvents = events.slice(0, 3); // Get first 3 events
            if (meetingsContainer) {
                if (upcomingEvents.length > 0) {
                    upcomingEvents.forEach(event => {
                        const title = event.title[currentLang] || event.title['en'];
                        const location = event.location[currentLang] || event.location['en'];
                        const summary = event.summary[currentLang] || event.summary['en'];

                        const eventElement = document.createElement('div');
                        eventElement.classList.add('reunion');
                        eventElement.innerHTML = `
                            <h4>${title}</h4>
                            <p><span data-i18n="events_date_label">Date</span>: ${event.date} - <span data-i18n="events_location_label">Location</span>: ${location}</p>
                            <p>${summary}</p>
                            ${event.registration_link ? `<a href="${event.registration_link}" class="read-more" data-i18n="homepage_more_info_link">More Info</a>` : ''}
                            <hr>
                        `;
                        meetingsContainer.appendChild(eventElement);
                    });
                } else {
                    meetingsContainer.innerHTML = `<p data-i18n="homepage_no_upcoming_events">No upcoming events at this time.</p>`;
                }
                // Trigger translation for dynamically added content
                if (typeof translatePage === 'function') {
                    translatePage(currentLang);
                }
            }

            // Latest Announcements
            const latestAnnouncements = events.slice(0, 3); // Get first 3 events as announcements
            if (noticiasContainer) {
                if (latestAnnouncements.length > 0) {
                    latestAnnouncements.forEach(announcement => {
                        const title = announcement.title[currentLang] || announcement.title['en'];
                        const summary = announcement.summary[currentLang] || announcement.summary['en'];

                        const announcementElement = document.createElement('div');
                        announcementElement.classList.add('noticia');
                        announcementElement.innerHTML = `
                            <h4>${title}</h4>
                            <p><span data-i18n="events_date_label">Date</span>: ${announcement.date}</p>
                            <p>${summary}</p>
                            <hr>
                        `;
                        noticiasContainer.appendChild(announcementElement);
                    });
                } else {
                    noticiasContainer.innerHTML = `<p data-i18n="homepage_no_new_announcements">No new announcements at this time.</p>`;
                }
                // Trigger translation for dynamically added content
                if (typeof translatePage === 'function') {
                    translatePage(currentLang);
                }
            }
        })
        .catch(error => {
            console.error('Error loading homepage data:', error);
            if (meetingsContainer) {
                meetingsContainer.innerHTML = `<p data-i18n="homepage_load_error">Failed to load homepage data. Please try again later.</p>`;
            }
            if (noticiasContainer) {
                noticiasContainer.innerHTML = `<p data-i18n="homepage_load_error">Failed to load homepage data. Please try again later.</p>`;
            }
            if (typeof translatePage === 'function') {
                translatePage(getCurrentLanguage());
            }
        });

    const readMoreBtn = document.getElementById('read-more-btn');
    const moreInfo = document.getElementById('more-info');

    if (readMoreBtn && moreInfo) {
        readMoreBtn.addEventListener('click', function() {
            const isHidden = moreInfo.style.display === 'none' || moreInfo.style.display === '';
            
            if (isHidden) {
                moreInfo.style.display = 'block';
                moreInfo.style.maxHeight = moreInfo.scrollHeight + 'px'; // For CSS transition
                readMoreBtn.setAttribute('data-i18n', 'read_less');
                if (typeof translatePage === 'function') {
                    translatePage(getCurrentLanguage());
                }
            } else {
                moreInfo.style.maxHeight = '0'; // For CSS transition
                // Hide after transition
                setTimeout(() => {
                    moreInfo.style.display = 'none';
                }, 500); // Should match CSS transition duration
                readMoreBtn.setAttribute('data-i18n', 'read_more');
                 if (typeof translatePage === 'function') {
                    translatePage(getCurrentLanguage());
                }
            }
        });
    }
});