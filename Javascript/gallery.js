document.addEventListener("DOMContentLoaded", function () {
    const galleryGrid = document.getElementById("gallery-grid");
    const paginationContainer = document.getElementById("pagination-container");
    const modal = document.getElementById("image-modal");
    const modalImage = document.getElementById("modal-image");
    const modalVideo = document.getElementById("modal-video");
    const closeModal = document.querySelector(".close-modal");
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");
    const filterContainer = document.querySelector(".filter-container");

    let allMedia = [];
    let filteredMedia = [];
    let currentPage = 1;
    const itemsPerPage = 6;
    let currentModalIndex = 0;

    async function fetchMedia() {
        try {
            const response = await fetch('Json/gallery.json');
            const data = await response.json();
            allMedia = data.media;
            applyFilterAndRender('all');
        } catch (error) {
            console.error('Error fetching gallery media:', error);
            galleryGrid.innerHTML = '<p>Error loading media gallery.</p>';
        }
    }

    function applyFilterAndRender(filter) {
        if (filter === 'all') {
            filteredMedia = allMedia;
        } else if (filter === 'photos') {
            filteredMedia = allMedia.filter(item => item.type === 'image');
        } else if (filter === 'videos') {
            filteredMedia = allMedia.filter(item => item.type === 'video');
        }
        currentPage = 1;
        renderGalleryPage();
        renderPagination();
    }

    function renderGalleryPage() {
        galleryGrid.innerHTML = "";
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = filteredMedia.slice(startIndex, endIndex);

        pageItems.forEach(item => {
            const galleryItem = document.createElement("div");
            galleryItem.classList.add("gallery-item", item.type);
            
            const mediaElement = item.type === 'image' ? document.createElement("img") : document.createElement("video");
            mediaElement.src = item.src;
            
            if(item.type === 'video') {
                mediaElement.muted = true;
                mediaElement.playsInline = true;
                mediaElement.preload = "metadata";
            }

            galleryItem.appendChild(mediaElement);
            galleryGrid.appendChild(galleryItem);

            galleryItem.addEventListener("click", () => {
                currentModalIndex = filteredMedia.indexOf(item);
                showModal(currentModalIndex);
            });
        });
    }

    function renderPagination() {
        paginationContainer.innerHTML = "";
        const totalPages = Math.ceil(filteredMedia.length / itemsPerPage);
        if (totalPages <= 1) return;

        const createPageButton = (page) => {
            const btn = document.createElement('button');
            btn.textContent = page;
            if (page === currentPage) {
                btn.classList.add('active');
            }
            btn.addEventListener('click', () => {
                currentPage = page;
                renderGalleryPage();
                renderPagination();
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
                renderGalleryPage();
                renderPagination();
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
                renderGalleryPage();
                renderPagination();
            }
        });
        paginationContainer.appendChild(nextPageBtn);
    }

    function showModal(index) {
        const item = filteredMedia[index];
        if (!item) return;

        if (item.type === "image") {
            modalImage.src = item.src;
            modalImage.style.display = "block";
            modalVideo.style.display = "none";
            modalVideo.pause();
        } else if (item.type === "video") {
            modalVideo.src = item.src;
            modalVideo.style.display = "block";
            modalImage.style.display = "none";
            modalVideo.play();
        }
        modal.style.display = "flex";
    }

    function closeModalAndVideo() {
        modal.style.display = "none";
        modalVideo.pause();
        modalVideo.src = "";
    }

    // Event Listeners
    closeModal?.addEventListener("click", closeModalAndVideo);
    modal?.addEventListener("click", (e) => {
        if (e.target === modal) closeModalAndVideo();
    });

    nextButton?.addEventListener("click", (e) => {
        e.stopPropagation();
        currentModalIndex = (currentModalIndex + 1) % filteredMedia.length;
        showModal(currentModalIndex);
    });

    prevButton?.addEventListener("click", (e) => {
        e.stopPropagation();
        currentModalIndex = (currentModalIndex - 1 + filteredMedia.length) % filteredMedia.length;
        showModal(currentModalIndex);
    });

    filterContainer?.addEventListener("click", (e) => {
        if (e.target.classList.contains("filter-btn")) {
            const filter = e.target.dataset.filter;
            document.querySelector(".filter-btn.active").classList.remove("active");
            e.target.classList.add("active");
            applyFilterAndRender(filter);
        }
    });

    document.addEventListener("keydown", (e) => {
        if (modal.style.display === "flex") {
            if (e.key === "ArrowRight") nextButton.click();
            else if (e.key === "ArrowLeft") prevButton.click();
            else if (e.key === "Escape") closeModalAndVideo();
        }
    });

    // Initial Fetch
    fetchMedia();
});
