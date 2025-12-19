document.addEventListener('DOMContentLoaded', function() {
    const mediaFiles = [
        // Images
        { type: 'image', src: "flor_loto.jpg" },
        { type: 'image', src: "flor_loto1.jpg" },
        { type: 'image', src: "IMG_20250918_103633462.jpg" },
        { type: 'image', src: "IMG_20250918_103639293.jpg" },
        { type: 'image', src: "IMG_20250918_103648874.jpg" },
        // Videos
        { type: 'video', src: "WhatsApp Video 2025-12-01 at 9.15.28 PM (1).mp4" },
        { type: 'video', src: "WhatsApp Video 2025-12-01 at 9.15.28 PM.mp4" },
        { type: 'video', src: "WhatsApp Video 2025-12-01 at 9.15.29 PM.mp4" },
    ];

    const galleryGrid = document.getElementById('gallery-grid');
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalVideo = document.getElementById('modal-video');
    const closeModal = document.querySelector('.close-modal');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const filterContainer = document.querySelector('.filter-container');

    let currentIndex = 0;
    let currentFilter = 'all';
    let filteredMedia = [];

    function renderGallery(filter = 'all') {
        galleryGrid.innerHTML = '';
        currentFilter = filter;
        
        if (filter === 'all') {
            filteredMedia = mediaFiles;
        } else if (filter === 'photos') {
            filteredMedia = mediaFiles.filter(item => item.type === 'image');
        } else if (filter === 'videos') {
            filteredMedia = mediaFiles.filter(item => item.type === 'video');
        }

        filteredMedia.forEach((item, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.classList.add('gallery-item');
            galleryItem.classList.add(item.type);

            if (item.type === 'image') {
                const mediaElement = document.createElement('img');
                mediaElement.src = `multimedia/images/${item.src}`;
                mediaElement.alt = `Gallery image: ${item.src}`;
                galleryItem.appendChild(mediaElement);
            } else if (item.type === 'video') {
                const mediaElement = document.createElement('video');
                mediaElement.src = `multimedia/videos/${item.src}`;
                mediaElement.muted = true;
                mediaElement.playsInline = true;
                mediaElement.preload = 'metadata';

                mediaElement.addEventListener('loadedmetadata', function() {
                    // Timeout to ensure the frame is ready
                    setTimeout(() => {
                        const canvas = document.createElement('canvas');
                        canvas.width = this.videoWidth;
                        canvas.height = this.videoHeight;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
                        this.poster = canvas.toDataURL();
                    }, 200); // 200ms delay
                }.bind(mediaElement));
                galleryItem.appendChild(mediaElement);
            }

            galleryGrid.appendChild(galleryItem);

            galleryItem.addEventListener('click', () => {
                currentIndex = index;
                showMedia(currentIndex);
                modal.style.display = 'flex';
            });
        });
    }

    function showMedia(index) {
        const item = filteredMedia[index];
        if (item.type === 'image') {
            modalImage.src = `multimedia/images/${item.src}`;
            modalImage.style.display = 'block';
            modalVideo.style.display = 'none';
            modalVideo.pause();
        } else if (item.type === 'video') {
            modalVideo.src = `multimedia/videos/${item.src}`;
            modalVideo.style.display = 'block';
            modalImage.style.display = 'none';
            modalVideo.play();
        }
    }

    const close = () => {
        modal.style.display = 'none';
        modalVideo.pause();
        modalVideo.src = '';
    };

    if (closeModal) {
        closeModal.addEventListener('click', close);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                close();
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % filteredMedia.length;
            showMedia(currentIndex);
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + filteredMedia.length) % filteredMedia.length;
            showMedia(currentIndex);
        });
    }
    
    if (filterContainer) {
        filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                const filter = e.target.dataset.filter;
                document.querySelector('.filter-btn.active').classList.remove('active');
                e.target.classList.add('active');
                renderGallery(filter);
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'flex') {
            if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % filteredMedia.length;
                showMedia(currentIndex);
            } else if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + filteredMedia.length) % filteredMedia.length;
                showMedia(currentIndex);
            } else if (e.key === 'Escape') {
                close();
            }
        }
    });

    // Initial render
    renderGallery();
});
