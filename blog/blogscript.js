const modal = document.getElementById("magazine-viewer-modal");
const closeBtn = document.querySelector(".modal-close-btn");
const pageContainer = document.getElementById("page-content-container");
const pageIndicator = document.getElementById("page-indicator");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

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

    const p = document.createElement("p");
    p.textContent = pages[index];
    pageContainer.appendChild(p);

    pageIndicator.textContent = `Page ${index + 1} of ${pages.length}`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === pages.length - 1;
}

function openMagazine(url) {
    fetch(url)
        .then(res => res.text())
        .then(text => {
            pages = paginateText(text);
            currentPage = 0;
            renderPage(currentPage);
            modal.style.display = "flex";
        })
        .catch(err => {
            console.error("Failed to load blog:", err);
            pageContainer.innerHTML = "<p>Error loading blog content.</p>";
        });
}

// Bind modal controls
closeBtn.onclick = () => modal.style.display = "none";
prevBtn.onclick = () => {
    if (currentPage > 0) {
        currentPage--;
        renderPage(currentPage);
    }
};
nextBtn.onclick = () => {
    if (currentPage < pages.length - 1) {
        currentPage++;
        renderPage(currentPage);
    }
};

// Bind all magazine covers
document.querySelectorAll(".magazine-cover").forEach(cover => {
    cover.addEventListener("click", () => {
        const txtSrc = cover.getAttribute("data-json-src") // still using data-json-src for now
                          .replace(/\.json$/, ".txt"); // Convert .json to .txt automatically
        openMagazine(txtSrc);
    });
});
