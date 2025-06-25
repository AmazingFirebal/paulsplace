document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('magazine-viewer-modal');
    if (!modal) return;

    const closeBtn = modal.querySelector('.modal-close-btn');
    const pageContainer = document.getElementById('page-content-container');
    const pageIndicator = document.getElementById('page-indicator');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    const entries = Array.from(document.querySelectorAll('.magazine-cover[data-json-src]'));
    let entryIndex = 0;
    let pages = [];
    let currentPage = 0;
    let currentCoverImg = "";

    function parseTextToChunks(text, wordsPerPage = 350) {
        const lines = text.split(/\r?\n/);
        const chunks = [];

        lines.forEach(line => {
            const imageMatch = line.match(/\[\[image:(.+?)\]\]/i);
            if (imageMatch) {
                chunks.push({ type: "image", url: imageMatch[1].trim() });
            } else if (line.trim().length > 0) {
                chunks.push({ type: "text", content: line.trim() });
            }
        });

        const paginated = [];
        let currentWords = 0;
        let currentPage = [];

        for (const chunk of chunks) {
            if (chunk.type === "image") {
                currentPage.push(chunk);
            } else {
                const words = chunk.content.split(/\s+/);
                while (words.length > 0) {
                    const take = Math.min(wordsPerPage - currentWords, words.length);
                    const slice = words.splice(0, take).join(" ");
                    currentPage.push({ type: "text", content: slice });
                    currentWords += take;

                    if (currentWords >= wordsPerPage) {
                        paginated.push(currentPage);
                        currentPage = [];
                        currentWords = 0;
                    }
                }
            }
        }

        if (currentPage.length > 0) paginated.push(currentPage);
        return paginated;
    }

    function renderPage(index) {
        if (index < 0 || index >= pages.length) return;
        pageContainer.innerHTML = "";

        const chunks = pages[index];

        // Insert cover image on first page
        if (index === 0 && currentCoverImg) {
            const coverImg = document.createElement("img");
            coverImg.src = currentCoverImg;
            coverImg.className = "inline-blog-image";
            pageContainer.appendChild(coverImg);
        }

        for (const chunk of chunks) {
            if (chunk.type === "text") {
                const p = document.createElement("p");
                p.textContent = chunk.content;
                pageContainer.appendChild(p);
            } else if (chunk.type === "image") {
                const img = document.createElement("img");
                img.src = chunk.url;
                img.className = "inline-blog-image";
                pageContainer.appendChild(img);
            }
        }

        pageIndicator.textContent = `Page ${index + 1} of ${pages.length}`;
        prevBtn.disabled = entryIndex === 0;
        nextBtn.disabled = entryIndex === entries.length - 1;
    }

    function openMagazineFromIndex(i) {
        const cover = entries[i];
        const jsonURL = cover.getAttribute("data-json-src");
        const baseName = jsonURL.split('/').pop().replace(/\.json$/, '');
        const txtURL = `https://raw.githubusercontent.com/AmazingFirebal/Blog-posts/main/${baseName}.txt`;
        currentCoverImg = `assets/images/${baseName}.png`;

        fetch(txtURL)
            .then(res => res.text())
            .then(text => {
                pages = parseTextToChunks(text);
                currentPage = 0;
                renderPage(currentPage);
                modal.style.display = "flex";
                entryIndex = i;
            })
            .catch(err => {
                console.error("Failed to load blog:", err);
                pageContainer.innerHTML = "<p>Error loading blog content.</p>";
            });
    }

    // Navigation buttons
    prevBtn.onclick = () => {
        if (entryIndex > 0) openMagazineFromIndex(entryIndex - 1);
    };

    nextBtn.onclick = () => {
        if (entryIndex < entries.length - 1) openMagazineFromIndex(entryIndex + 1);
    };

    closeBtn.onclick = () => {
        modal.style.display = "none";
        pages = [];
        currentPage = 0;
        pageContainer.innerHTML = "";
    };

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'flex') {
            if (e.key === 'ArrowRight') nextBtn.click();
            else if (e.key === 'ArrowLeft') prevBtn.click();
            else if (e.key === 'Escape') modal.style.display = 'none';
        }
    });

    entries.forEach((cover, i) => {
        cover.addEventListener('click', () => openMagazineFromIndex(i));
    });
});
