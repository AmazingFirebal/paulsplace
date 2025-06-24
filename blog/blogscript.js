document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('magazine-viewer-modal');
    if (!modal) return; // Exit if modal not on this page

    // Get modal elements
    const modalCloseBtn = modal.querySelector('.modal-close-btn');
    const pageContentContainer = document.getElementById('page-content-container');
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

    /**
     * Dynamically splits text content into pages and interleaves images.
     * @param {string} textContent The full blog post content.
     * @param {string[]} imageList An array of image URLs to scatter.
     * @returns {string[]} An array of HTML strings, each representing a page.
     */
    function generatePages(textContent, imageList = []) {
        const pages = [];
        // Adjust this value based on your font size and desired page density.
        const CHARS_PER_PAGE = 950;
        const imagesToPlace = [...imageList];

        let remainingText = textContent.trim();
        let pageCount = 0;

        while (remainingText.length > 0) {
            pageCount++;
            let pageText;
            let splitPoint = -1;

            if (remainingText.length <= CHARS_PER_PAGE) {
                pageText = remainingText;
                remainingText = "";
            } else {
                // Try to find a natural break point (end of paragraph or sentence)
                // by searching backwards from the character limit.
                for (let i = CHARS_PER_PAGE; i > 0; i--) {
                    if (remainingText[i] === '\n' || remainingText[i] === '.') {
                        splitPoint = i + 1;
                        break;
                    }
                }
                // If no natural break found, just cut at the limit.
                if (splitPoint === -1) {
                    splitPoint = CHARS_PER_PAGE;
                }
                pageText = remainingText.substring(0, splitPoint);
                remainingText = remainingText.substring(splitPoint);
            }

            // Format the text and preserve line breaks from the JSON.
            let pageHTML = `<div class="text-block"><p>${pageText.trim().replace(/\n/g, '<br><br>')}</p></div>`;

            // Insert an image on every other page (page 2, 4, etc.), if available.
            if (pageCount > 1 && pageCount % 2 === 0 && imagesToPlace.length > 0) {
                const imageUrl = imagesToPlace.shift(); // Get and remove the next image
                pageHTML += `<img src="${imageUrl}" alt="Blog post image" class="inline-blog-image">`;
            }

            pages.push(pageHTML);
        }

        // If there are leftover images, add them to their own pages at the end.
        while (imagesToPlace.length > 0) {
            const imageUrl = imagesToPlace.shift();
            pages.push(`<img src="${imageUrl}" alt="Blog post image" class="inline-blog-image">`);
        }

        return pages;
    }

    // Function to show a specific page
    function showPage(index) {
        currentPageIndex = (index + currentMagazinePages.length) % currentMagazinePages.length;
        pageContentContainer.innerHTML = currentMagazinePages[currentPageIndex];
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

            // Generate pages dynamically from the 'content' and 'images' fields.
            const contentPages = generatePages(magazineData.content || "", magazineData.images || []);

            // The first page is always the cover image.
            const coverPage = `<img id="magazine-image" src="${magazineData.cover}" alt="${magazineData.title || 'Cover'}">`;
            currentMagazinePages = [coverPage, ...contentPages];
            modalTitle.textContent = magazineData.title || "Magazine Viewer";

            // Show the first page (the cover) and the modal
            showPage(0);
            modal.style.display = 'flex';

        } catch (error) {
            console.error("Could not load magazine:", error);
            alert("Sorry, there was an error loading this magazine.");
        }
    }

    // Function to close the modal
    function hideModal() {
        modal.style.display = 'none';
        // Reset state
        currentMagazinePages = [];
        currentPageIndex = 0;
        pageContentContainer.innerHTML = ""; // Clear content
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