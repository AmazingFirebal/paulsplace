const token = "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";
const username = "AmazingFirebal";
const repo = "Images";
const branch = "main";
const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

const apiHeaders = {
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json"
};

// Fetch folder contents
async function fetchFolderContents(path = "") {
  const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${path}?ref=${branch}`;
  const response = await fetch(apiUrl, { headers: apiHeaders });
  return await response.json();
}

// Get latest commit date for each file (optional but for sort)
async function fetchCommitDate(path) {
  const url = `https://api.github.com/repos/${username}/${repo}/commits?path=${path}&per_page=1&sha=${branch}`;
  const res = await fetch(url, { headers: apiHeaders });
  const commits = await res.json();
  return commits[0]?.commit?.committer?.date || "";
}

// Build the tab buttons and empty panels
async function buildGallery() {
  const folders = await fetchFolderContents();
  const photoTabs = document.querySelector(".photo-tabs");
  const gallery = document.getElementById("gallery");

  for (const folder of folders.reverse()) {
    if (folder.type !== "dir") continue;

    const btn = document.createElement("button");
    btn.className = "photo-tab";
    btn.dataset.target = folder.name;
    btn.innerHTML = `
      <img src="assets/images/files.png" alt="${folder.name}">
      <span>${folder.name}</span>
    `;
    photoTabs.appendChild(btn);

    const panel = document.createElement("div");
    panel.className = "photo-panel";
    panel.id = folder.name;
    gallery.appendChild(panel);

    btn.addEventListener("click", () => {
      document.querySelectorAll(".photo-panel").forEach(p => p.classList.remove("active"));
      panel.classList.add("active");

      if (!panel.hasChildNodes()) {
        loadImages(folder.path, panel);
      }
    });
  }
}

// Load images from a folder, sorted by most recent commit
async function loadImages(folderPath, panel) {
  let files = await fetchFolderContents(folderPath);
  files = files.filter(file => file.type === "file" && imageExtensions.some(ext => file.name.toLowerCase().endsWith(ext)));

  const filesWithDates = await Promise.all(files.map(async file => {
    const date = await fetchCommitDate(file.path);
    return { ...file, date };
  }));

  filesWithDates.sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first

  const strip = document.createElement("div");
  strip.className = "photo-strip";

  filesWithDates.forEach(file => {
    const img = document.createElement("img");
    img.src = file.download_url;
    img.alt = file.name;
    strip.appendChild(img);
  });

  panel.appendChild(strip);
}

// Init
document.addEventListener("DOMContentLoaded", buildGallery);
