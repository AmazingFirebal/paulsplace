// filescript.js

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://script.google.com/macros/s/AKfycbzfntI4q05B0dA0_Dglou9HSuogVWvcuTUdy4SruEmUGMj8J0nEKa4t1X8vEjuR-9oLJA/exec")
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("gallery");
      if (!container) return;

      data.forEach(entry => {
        const images = entry.Image;
        const folder = entry.Folder || "Uncategorized";

        const section = document.createElement("div");
        section.classList.add("photo-folder");

        const title = document.createElement("h3");
        title.textContent = folder;
        section.appendChild(title);

        const row = document.createElement("div");
        row.classList.add("image-row");

        if (Array.isArray(images)) {
          images.forEach(url => {
            const img = document.createElement("img");
            img.src = url;
            img.alt = "Uploaded photo";
            img.style.maxWidth = "200px";
            img.style.margin = "5px";
            row.appendChild(img);
          });
        }

        section.appendChild(row);
        container.appendChild(section);
      });
    })
    .catch(error => {
      console.error("Error fetching images:", error);
      const container = document.getElementById("gallery");
      if (container) container.innerHTML = "<p>Failed to load images.</p>";
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("photos-container");
  const loading = document.getElementById("loading");

  fetch("https://script.google.com/macros/s/AKfycbzfntI4q05B0dA0_Dglou9HSuogVWvcuTUdy4SruEmUGMj8J0nEKa4t1X8vEjuR-9oLJA/exec")
    .then(response => response.json())
    .then(data => {
      loading.style.display = "none";

      // Group entries by Folder (subcategory)
      const folders = {};

      data.forEach(entry => {
        const folder = entry.Folder || "Uncategorized";
        if (!folders[folder]) folders[folder] = [];
        folders[folder].push(entry);
      });

      // Create a details block per folder
      Object.entries(folders).forEach(([folderName, entries]) => {
        const details = document.createElement("details");
        const summary = document.createElement("summary");
        summary.textContent = folderName;
        details.appendChild(summary);

        const imageRow = document.createElement("div");
        imageRow.style.display = "flex";
        imageRow.style.flexWrap = "wrap";
        imageRow.style.gap = "10px";
        imageRow.style.padding = "0.5em 0";

        entries.forEach(entry => {
          const images = entry.Image;
          if (Array.isArray(images)) {
            images.forEach(url => {
              const img = document.createElement("img");
              img.src = url.replace('uc?export=view', 'thumbnail'); // optional, use thumbnail
              img.alt = `Photo in ${folderName}`;
              img.style.maxWidth = "150px";
              img.style.borderRadius = "6px";
              img.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
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
