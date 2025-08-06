const username = "AmazingFirebal";
const repo = "Images";
const branch = "main";
const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

// Fetch contents of a folder from GitHub repo (no auth, public repo)
async function fetchFolderContents(path = "") {
  const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${path}?ref=${branch}`;
  const response = await fetch(apiUrl);
  if (!response.ok) throw new Error(`GitHub API error: ${response.status} (${response.statusText})`);
  return await response.json();
}

// Fetch latest commit date for a file path
async function fetchCommitDate(path) {
  const url = `https://api.github.com/repos/${username}/${repo}/commits?path=${path}&per_page=1&sha=${branch}`;
  const res = await fetch(url);
  if (!res.ok) return ""; // Just return empty if error (e.g., rate limited)
  const commits = await res.json();
  return commits[0]?.commit?.committer?.date || "";
}

// Build folder buttons and gallery containers
async function buildGallery() {
  try {
    const folders = await fetchFolderContents();
    const photoTabs = document.querySelector(".photo-tabs");
    const gallery = document.getElementById("gallery");
    photoTabs.innerHTML = "";
    gallery.innerHTML = "";

    for (const folder of folders.reverse()) {
      if (folder.type !== "dir") continue;

      // Create tab button
      const btn = document.createElement("button");
      btn.className = "photo-tab";
      btn.dataset.target = folder.name;
      btn.innerHTML = `
        <img src="assets/images/files.png" alt="${folder.name}" style="width:20px;vertical-align:middle;margin-right:5px;">
        <span>${folder.name}</span>
      `;
      photoTabs.appendChild(btn);

      // Create image panel
      const panel = document.createElement("div");
      panel.className = "photo-panel";
      panel.id = folder.name;
      gallery.appendChild(panel);

      btn.addEventListener("click", () => {
        // Hide all panels
        document.querySelectorAll(".photo-panel").forEach(p => p.classList.remove("active"));
        // Show current panel
        panel.classList.add("active");

        // Load images if not loaded yet
        if (!panel.hasChildNodes()) {
          loadImages(folder.path, panel);
        }
      });
    }
  } catch (err) {
    console.error("Error building gallery:", err);
  }
}

// Load images from a folder, sorted by latest commit date
async function loadImages(folderPath, panel) {
  try {
    let files = await fetchFolderContents(folderPath);
    files = files.filter(file => file.type === "file" && imageExtensions.some(ext => file.name.toLowerCase().endsWith(ext)));

    // Fetch commit dates for sorting
    const filesWithDates = await Promise.all(files.map(async file => {
      const date = await fetchCommitDate(file.path);
      return { ...file, date };
    }));

    // Sort newest first
    filesWithDates.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Create a strip container for images
    const strip = document.createElement("div");
    strip.className = "photo-strip";
    strip.style.display = "flex";
    strip.style.gap = "10px";
    strip.style.flexWrap = "wrap";

filesWithDates.forEach(file => {
  const img = document.createElement("img");
  img.src = file.download_url;
  img.alt = file.name;
  img.style.maxWidth = "200px";
  img.style.height = "auto";
  img.style.borderRadius = "4px";
  img.style.boxShadow = "0 2px 5px rgba(0,0,0,0.3)";
  strip.appendChild(img);
});


    panel.appendChild(strip);
  } catch (err) {
    console.error("Error loading images:", err);
  }
}

// Initialize gallery on page load
document.addEventListener("DOMContentLoaded", buildGallery);
