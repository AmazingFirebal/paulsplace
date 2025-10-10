document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("photos-container");
  const loading = document.getElementById("loading");

  // Extract a Google Drive file ID from a variety of URL formats
  function extractDriveId(url) {
    if (!url) return null;
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]+)/,
      /[\?&]id=([a-zA-Z0-9_-]+)/,
      /\/open\?id=([a-zA-Z0-9_-]+)/,
      /\/uc\?export=[^&]*&?id=([a-zA-Z0-9_-]+)/
    ];
    for (const re of patterns) {
      const m = url.match(re);
      if (m) return m[1];
    }
    const fallback = url.match(/([a-zA-Z0-9_-]{20,})/);
    return fallback ? fallback[1] : null;
  }

  fetch("https://script.google.com/macros/s/AKfycbzfntI4q05B0dA0_Dglou9HSuogVWvcuTUdy4SruEmUGMj8J0nEKa4t1X8vEjuR-9oLJA/exec")
    .then(response => response.json())
    .then(data => {
      loading.style.display = "none";

      const folders = {};

      data.forEach(entry => {
        const folder = entry.Folder || "Uncategorized";
        if (!folders[folder]) folders[folder] = [];
        folders[folder].push(entry);
      });

      Object.entries(folders).forEach(([folderName, entries]) => {
        const details = document.createElement("details");
        const summary = document.createElement("summary");
        summary.textContent = folderName;
        details.appendChild(summary);

        const imageRow = document.createElement("div");
        imageRow.classList.add("image-row");

        entries.forEach(entry => {
          const images = entry.Image;
          if (Array.isArray(images)) {
            images.forEach(url => {
              const originalUrl = url;
              const fileId = extractDriveId(originalUrl);

              const img = document.createElement("img");
              img.src = fileId ? `https://drive.google.com/thumbnail?id=${fileId}` 
                                : originalUrl.replace('uc?export=view', 'thumbnail');
              img.alt = `Photo in ${folderName}`;
              img.classList.add("gallery-img");

              img.addEventListener("click", () => {
                if (fileId) {
                  const viewUrl = `https://drive.google.com/file/d/${fileId}/view`;
                  const a = document.createElement('a');
                  a.href = viewUrl;
                  a.target = '_blank';
                  a.rel = 'noopener noreferrer';
                  a.click();
                } else {
                  window.open(originalUrl, "_blank", "noopener,noreferrer");
                }
              });

              imageRow.appendChild(img);
            });
          }
        });

        details.appendChild(imageRow);
        container.appendChild(details);
      });
    })
    .catch(err => {
      loading.textContent = "Failed to load photos.";
      console.error("Error loading photos:", err);
    });
});
