document.addEventListener('DOMContentLoaded', function() {
    const newsGrid = document.getElementById('news-grid');
    const paginationContainer = document.getElementById('pagination-container');
    const modal = document.getElementById('news-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDate = document.getElementById('modal-date');
    const modalFullStory = document.getElementById('modal-full-story');

    let allNews = [];
    let currentPage = 1;
    const itemsPerPage = 6;

    async function fetchNews() {
        try {
            const response = await fetch('Json/news.json');
            allNews = await response.json();
            // Sort news by date, most recent first
            allNews.sort((a, b) => new Date(b.date) - new Date(a.date));
            renderNewsPage();
            renderPagination();
        } catch (error) {
            console.error('Error fetching news:', error);
            newsGrid.innerHTML = '<p data-i18n="news_load_error">Error loading news.</p>';
            if (typeof translatePage === 'function') {
                translatePage(getCurrentLanguage());
            }
        }
    }

    function renderNewsPage() {
        newsGrid.innerHTML = "";
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = allNews.slice(startIndex, endIndex);
        const currentLang = getCurrentLanguage();

        pageItems.forEach(item => {
            const title = item.title[currentLang] || item.title['en'];
            const summary = item.summary[currentLang] || item.summary['en'];

            const card = document.createElement('div');
            card.classList.add('news-card');
            card.innerHTML = `
                <h2>${title}</h2>
                <p class="date">${item.date}</p>
                <p>${summary}</p>
                <button class="read-more-btn">Read More</button>
            `;
            newsGrid.appendChild(card);

            card.querySelector('.read-more-btn').addEventListener('click', () => {
                showModal(item);
            });
        });
        if (typeof translatePage === 'function') {
            translatePage(currentLang);
        }
    }

    function renderPagination() {
        paginationContainer.innerHTML = "";
        const totalPages = Math.ceil(allNews.length / itemsPerPage);
        if (totalPages <= 1) return;

        const createPageButton = (page) => {
            const btn = document.createElement('button');
            btn.textContent = page;
            if (page === currentPage) {
                btn.classList.add('active');
            }
            btn.addEventListener('click', () => {
                currentPage = page;
                renderNewsPage();
                renderPagination();
                window.scrollTo(0, 0);
            });
            return btn;
        };

        const createEllipsis = () => {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.classList.add('pagination-ellipsis');
            return ellipsis;
        };
        
        const prevPageBtn = document.createElement('button');
        prevPageBtn.textContent = 'Prev';
        prevPageBtn.disabled = currentPage === 1;
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderNewsPage();
                renderPagination();
                window.scrollTo(0, 0);
            }
        });
        paginationContainer.appendChild(prevPageBtn);

        let lastPageAdded = 0;
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                if (lastPageAdded !== 0 && i > lastPageAdded + 1) {
                    paginationContainer.appendChild(createEllipsis());
                }
                paginationContainer.appendChild(createPageButton(i));
                lastPageAdded = i;
            }
        }

        const nextPageBtn = document.createElement('button');
        nextPageBtn.textContent = 'Next';
        nextPageBtn.disabled = currentPage === totalPages;
        nextPageBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderNewsPage();
                renderPagination();
                window.scrollTo(0, 0);
            }
        });
        paginationContainer.appendChild(nextPageBtn);
    }

    function showModal(item) {
        const currentLang = getCurrentLanguage();
        modalTitle.textContent = item.title[currentLang] || item.title['en'];
        modalDate.textContent = item.date;
        modalFullStory.innerHTML = (item.full_story[currentLang] || item.full_story['en']).replace(/\n/g, '<br>');
        modal.style.display = 'flex';
    }

    function hideModal() {
        modal.style.display = 'none';
    }

    closeModal?.addEventListener('click', hideModal);
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            hideModal();
        }
    });

    fetchNews();
});
