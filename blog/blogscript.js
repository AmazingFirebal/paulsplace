document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('magazine-viewer-modal');
    if (!modal) return; // Exit if modal not on this page

    const modalCloseBtn = modal.querySelector('.modal-close-btn');
    const modalImage = document.getElementById('magazine-image');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const magazineCovers = document.querySelectorAll('.magazine-cover[data-img-src]');

    // Create an array of magazine sources from the covers that have an image
    const magazineSources = Array.from(magazineCovers).map(cover => cover.dataset.imgSrc);
    let currentMagazineIndex = 0;

    function updateNavButtons() {
        prevBtn.disabled = currentMagazineIndex === 0;
        nextBtn.disabled = currentMagazineIndex === magazineSources.length - 1;
    }

    function showMagazine(index) {
        if (index < 0 || index >= magazineSources.length) {
            return;
        }
        currentMagazineIndex = index;
        modalImage.src = magazineSources[currentMagazineIndex];
        updateNavButtons();
        modal.style.display = 'flex';
    }

    function hideModal() {
        modal.style.display = 'none';
        // Optional: clear image src when closing
        // modalImage.src = ""; 
    }

    // Event Listeners
    magazineCovers.forEach(cover => {
        cover.addEventListener('click', () => {
            const imgSrc = cover.dataset.imgSrc;
            const index = magazineSources.indexOf(imgSrc);
            if (index !== -1) {
                showMagazine(index);
            }
        });
    });

    modalCloseBtn.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => {
        // Close if clicking on the overlay, but not on the window itself
        if (e.target === modal) {
            hideModal();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentMagazineIndex < magazineSources.length - 1) {
            showMagazine(currentMagazineIndex + 1);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentMagazineIndex > 0) {
            showMagazine(currentMagazineIndex - 1);
        }
    });

    // Bonus: Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'flex') {
            if (e.key === 'ArrowRight' && !nextBtn.disabled) {
                nextBtn.click();
            } else if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
                prevBtn.click();
            } else if (e.key === 'Escape') {
                hideModal();
            }
        }
    });
});