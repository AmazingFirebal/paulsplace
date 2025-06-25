const modal = document.getElementById("magazine-viewer-modal");
const closeBtn = document.querySelector(".modal-close-btn");
const pageContainer = document.getElementById("page-content-container");
const pageIndicator = document.getElementById("page-indicator");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

const entries = Array.from(document.querySelectorAll(".magazine-cover"));
let entryIndex = 0;
let pages = [];
let currentPage = 0;

function paginateText(text, wordsPerPage = 350) {
    const words = text.split(/\s+/);
    const pages = [];
    for (let i = 0; i < words.length; i += wordsPerPage) {
        pages.push(words.slice(i, i + wordsPerPage).join(" "));
    }
    return pages;
}

function renderPage(index) {
    if (index < 0 || index >= pages.length) return;
    pageContainer.innerHTML = "";

    // Optional: add cover image only on first page
    if (index === 0 && currentCoverImg) {
        const img = document.createElement("img");
        img.src = currentCoverImg;
        img.className = "inline-blog-image";
        pageContainer.appendChild(img);
    }

    const p = document.createElement("p");
    p.textContent = pages[index];
    pageContainer.appendChild(p);

    pageIndicator.textContent = `Page ${index + 1} of ${pages.length}`;
    prevBtn.disabled = entryIndex === 0;
    nextBtn.disabled = entryIndex === entries.length - 1;
}

let currentCoverImg = "";

function openMagazineFromIndex(i) {
    const cover = entries[i];
    const jsonURL = cover.getAttribute("data-json-src");
    const baseName = jsonURL.split('/').pop().replace(/\.json$/, '');
    const txtURL = `https://raw.githubusercontent.com/AmazingFirebal/Blog-posts/main/${baseName}.txt`;
    currentCoverImg = `assets/images/${baseName}.png`;

    fetch(txtURL)
        .then(res => res.text())
        .then(text => {
            pages = paginateText(text);
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

closeBtn.onclick = () => modal.style.display = "none";
prevBtn.onclick = () => {
    if (entryIndex > 0) {
        openMagazineFromIndex(entryIndex - 1);
    }
};
nextBtn.onclick = () => {
    if (entryIndex < entries.length - 1) {
        openMagazineFromIndex(entryIndex + 1);
    }
};

// Bind each cover
entries.forEach((cover, i) => {
    cover.addEventListener("click", () => openMagazineFromIndex(i));
});
