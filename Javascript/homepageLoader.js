document.addEventListener("DOMContentLoaded", function () {
  const meetingsContainer = document.getElementById("meetings-container");
  const noticiasContainer = document.getElementById("noticias-container");
  const modal = document.getElementById("news-modal");
  const closeModal = document.querySelector(".close-modal");
  const modalTitle = document.getElementById("modal-title-news");
  const modalDate = document.getElementById("modal-date");
  const modalFullStory = document.getElementById("modal-full-story");

  // Clear existing placeholder content
  if (meetingsContainer) meetingsContainer.innerHTML = "";
  if (noticiasContainer) noticiasContainer.innerHTML = "";

  fetch("Json/events.json")
    .then((response) => response.json())
    .then((events) => {
      const currentLang = getCurrentLanguage();

      // Upcoming Events
      const upcomingEvents = events.slice(0, 3); // Get first 3 events
      if (meetingsContainer) {
        if (upcomingEvents.length > 0) {
          upcomingEvents.forEach((event) => {
            const title = event.title[currentLang] || event.title["en"];
            const location =
              event.location[currentLang] || event.location["en"];
            const summary = event.summary[currentLang] || event.summary["en"];

            const eventElement = document.createElement("div");
            eventElement.classList.add("reunion");
            eventElement.innerHTML = `
                            <h4>${title}</h4>
                            <p><span data-i18n="events_date_label">Date</span>: ${
                              event.date
                            } - <span data-i18n="events_location_label">Location</span>: ${location}</p>
                            <p>${summary}</p>
                            ${
                              event.registration_link
                                ? `<a href="${event.registration_link}" class="read-more" data-i18n="homepage_more_info_link">More Info</a>`
                                : ""
                            }
                            <hr>
                        `;
            meetingsContainer.appendChild(eventElement);
          });
        } else {
          meetingsContainer.innerHTML = `<p data-i18n="homepage_no_upcoming_events">No upcoming events at this time.</p>`;
        }
        // Trigger translation for dynamically added content
        if (typeof translatePage === "function") {
          translatePage(currentLang);
        }
      }
    })
    .catch((error) => {
      console.error("Error loading events data:", error);
      if (meetingsContainer) {
        meetingsContainer.innerHTML = `<p data-i18n="homepage_load_error">Failed to load events data. Please try again later.</p>`;
      }
      if (typeof translatePage === "function") {
        translatePage(getCurrentLanguage());
      }
    });

  fetch("Json/news.json")
    .then((response) => response.json())
    .then((news) => {
      const currentLang = getCurrentLanguage();
      if (noticiasContainer) noticiasContainer.innerHTML = "";
      // Sort news by date, most recent first
      news.sort((a, b) => new Date(b.date) - new Date(a.date));

      // Latest Announcements
      const latestAnnouncements = news.slice(0, 3); // Get first 3 news items
      if (noticiasContainer) {
        if (latestAnnouncements.length > 0) {
          latestAnnouncements.forEach((announcement) => {
            const title =
              announcement.title[currentLang] || announcement.title["en"];
            const summary =
              announcement.summary[currentLang] || announcement.summary["en"];

            const announcementElement = document.createElement("div");
            announcementElement.classList.add("noticia");
            announcementElement.innerHTML = `
                            <h4>${title}</h4>
                            <p><span data-i18n="events_date_label">Date</span>: ${announcement.date}</p>
                            <p>${summary}</p>
                            <hr>
                        `;
            announcementElement.addEventListener("click", () =>
              showModal(announcement)
            );
            noticiasContainer.appendChild(announcementElement);
          });
          const readMoreLink = document.createElement("a");
          readMoreLink.href = "news.html";
          readMoreLink.textContent = "View all news";
          readMoreLink.classList.add("read-more-btn");
          readMoreLink.setAttribute("data-i18n", "homepage_view_all_news");
          noticiasContainer.appendChild(readMoreLink);
        } else {
          noticiasContainer.innerHTML = `<p data-i18n="homepage_no_new_announcements">No new announcements at this time.</p>`;
        }
        // Trigger translation for dynamically added content
        if (typeof translatePage === "function") {
          translatePage(currentLang);
        }
      }
    })
    .catch((error) => {
      console.error("Error loading news data:", error);
      if (noticiasContainer) {
        noticiasContainer.innerHTML = `<p data-i18n="homepage_load_error">Failed to load news data. Please try again later.</p>`;
      }
      if (typeof translatePage === "function") {
        translatePage(getCurrentLanguage());
      }
    });

  function showModal(item) {
    const currentLang = getCurrentLanguage();
    modalTitle.textContent = item.title[currentLang] || item.title["en"];
    modalDate.textContent = item.date;
    modalFullStory.innerHTML = (
      item.full_story[currentLang] || item.full_story["en"]
    ).replace(/\n/g, "<br>");
    modal.style.display = "flex";
  }

  function hideModal() {
    modal.style.display = "none";
  }

  closeModal?.addEventListener("click", hideModal);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
      hideModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "flex") {
      hideModal();
    }
  });

  const readMoreBtn = document.getElementById("read-more-btn");
  const moreInfo = document.getElementById("more-info");

  if (readMoreBtn && moreInfo) {
    readMoreBtn.addEventListener("click", function () {
      const isHidden =
        moreInfo.style.display === "none" || moreInfo.style.display === "";

      if (isHidden) {
        moreInfo.style.display = "block";
        moreInfo.style.maxHeight = moreInfo.scrollHeight + "px"; // For CSS transition
        readMoreBtn.setAttribute("data-i18n", "read_less");
        if (typeof translatePage === "function") {
          translatePage(getCurrentLanguage());
        }
      } else {
        moreInfo.style.maxHeight = "0"; // For CSS transition
        // Hide after transition
        setTimeout(() => {
          moreInfo.style.display = "none";
        }, 500); // Should match CSS transition duration
        readMoreBtn.setAttribute("data-i18n", "read_more");
        if (typeof translatePage === "function") {
          translatePage(getCurrentLanguage());
        }
      }
    });
  }
});
