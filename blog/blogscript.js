document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('magazine-viewer-modal');
    if (!modal) return; // Exit if modal not on this page

    // Get modal elements
    const modalCloseBtn = modal.querySelector('.modal-close-btn');
    const modalImage = document.getElementById('magazine-image');
    const modalTitle = modal.querySelector('.modal-title');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageIndicator = document.getElementById('page-indicator');
    const magazineCovers = document.querySelectorAll('.magazine-cover[data-json-src]');

    // State for the currently viewed magazine
    let currentMagazinePages = [];
    let currentPageIndex = 0;

    // Function to update navigation buttons and page indicator
    function updateControls() {
        prevBtn.disabled = currentPageIndex === 0;
        nextBtn.disabled = currentPageIndex === currentMagazinePages.length - 1;
        if (pageIndicator) {
            pageIndicator.textContent = `Page ${currentPageIndex + 1} of ${currentMagazinePages.length}`;
        }
    }

    // Function to show a specific page
    function showPage(index) {
        if (index < 0 || index >= currentMagazinePages.length) {
            return;
        }
        currentPageIndex = index;
        modalImage.src = currentMagazinePages[currentPageIndex];
        updateControls();
    }

    // Function to open the modal and load a magazine
    async function openMagazine(jsonUrl) {
        try {
            const response = await fetch(jsonUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const magazineData = await response.json();

            // Extract data from your custom format
            const title = magazineData.title;
            const subHeading = magazineData["sub-heading"];
            const content = magazineData.content;

            // Create HTML content to display in the modal
            const magazineHTML = `
                <h1>${title}</h1>
                <h2>${subHeading}</h2>
                <p>${content}</p>
            `;

            // Set the content as a single "page"
            currentMagazinePages = [magazineHTML];
            modalTitle.textContent = title || "Magazine Viewer";

            // Display the content and show the modal
            showPage(0); // Show the first (and only) page
            modal.style.display = 'flex';

        } catch (error) {
            console.error("Could not load magazine:", error);
            alert("Sorry, there was an error loading this magazine.");
        }
    // Function to close the modal
    function hideModal() {
        modal.style.display = 'none';
        // Reset state
        currentMagazinePages = [];
        currentPageIndex = 0;
        modalImage.src = ""; // Clear image
        modalTitle.textContent = "Magazine Viewer"; // Reset title
    }

    // --- Event Listeners ---

    // Click on a magazine cover
    magazineCovers.forEach(cover => {
        cover.addEventListener('click', () => {
            const jsonSrc = cover.dataset.jsonSrc;
            if (jsonSrc) {
                openMagazine(jsonSrc);
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

    nextBtn.addEventListener('click', () => showPage(currentPageIndex + 1));
    prevBtn.addEventListener('click', () => showPage(currentPageIndex - 1));

    // Keyboard navigation
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