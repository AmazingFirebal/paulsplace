document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("photos-container");
  const loading = document.getElementById("loading");

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
              const img = document.createElement("img");
              img.src = url.replace('uc?export=view', 'thumbnail');
              img.alt = `Photo in ${folderName}`;
              img.classList.add("gallery-img");
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
