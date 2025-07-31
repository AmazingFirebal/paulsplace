const API_KEY = "AIzaSyDicG28BjedTA44teSup3iX46dBU3znbm8";
const videosDiv = document.getElementById("videos");
const carouselDiv = document.getElementById("carousel");

// Load YouTube Videos from Paige's Channel


async function loadPaigeVideos() {
  try {
    const channelId = "UCGc3Tkh0YbhLTaHJvI41fAA";

    // 1. Get the uploads playlist from the channel
    const channelRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${API_KEY}`);
    const channelData = await channelRes.json();

    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // 2. Get latest videos from that playlist
    const playlistRes = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=3&key=${API_KEY}`);
    const playlistData = await playlistRes.json();

    videosDiv.innerHTML = "";

    if (!playlistData.items || playlistData.items.length === 0) {
      videosDiv.innerHTML = "<p>No public videos found on Paige's channel.</p>";
      return;
    }

    playlistData.items.forEach((item) => {
      const videoId = item.snippet.resourceId.videoId;
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube.com/embed/${videoId}`;
      iframe.width = "50%";
      iframe.height = "400";
      iframe.frameBorder = "0";
      iframe.allowFullscreen = true;
      iframe.style.marginBottom = "15px";
      videosDiv.appendChild(iframe);
    });
  } catch (err) {
    videosDiv.innerHTML = "<p>Error loading videos.</p>";
    console.error("Error fetching YouTube videos:", err);
  }
}

window.addEventListener("DOMContentLoaded", loadPaigeVideos);


// Load Posts from Google Sheet
async function loadSheetPosts() {
  const sheetURL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjT3LoE9SZL2XtFByaKXGBoea_l-0lmDP8n22GEePCyWrrg8X2DJkaYnh0_1B6P99YkG03Rl-wYwykBI9BCcB7263z8fH9ni6e5CehqeGGhGKDdSaIFahW8yryfWqAKnoqRNpq_ly3F95YLWKLpYXBfztJb17yvGcW6VZR3Lit4Z_GX0A70MiYAfN4XV_PJG1Xc019fYz1x1gxi3WnMgZ2dPv4pJZqzPeuv8m584_7q454qLV6ykNTr_V4pO1jv6gLcBqFHzHj7TD29khbQxhx53ftbZg&lib=MxZwZMYfQ7583d_jaz3St0LvxbzDu_lgW';

  try {
    const res = await fetch(sheetURL);
    const data = await res.json();

    data.reverse().forEach(entry => {
      const card = document.createElement('div');
      card.className = 'card';

      if (entry["Image URL"]) {
        const img = document.createElement('img');
        img.src = toDriveThumbnailURL(entry["Image URL"]);
        img.alt = "Uploaded image";
        card.appendChild(img);
      }

      if (entry["Video URL"]) {
        const iframe = document.createElement('iframe');
        iframe.src = toDrivePreviewURL(entry["Video URL"]);
        iframe.width = "100%";
        iframe.height = "300";
        iframe.allow = "autoplay";
        iframe.loading = "lazy";
        iframe.style.border = "none";
        card.appendChild(iframe);
      }

      if (entry["Text"]) {
        const p = document.createElement('p');
        p.textContent = entry["Text"];
        card.appendChild(p);
      }

      carouselDiv.appendChild(card);
    });

  } catch (err) {
    console.error("Error fetching Google Sheet posts:", err);
  }
}

// Helper Functions for Google Drive URLs
function extractDriveId(url) {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)\//);
  if (match && match[1]) return match[1];

  const idFromOpen = url.match(/id=([a-zA-Z0-9_-]+)/);
  if (idFromOpen && idFromOpen[1]) return idFromOpen[1];

  return null;
}

function toDriveThumbnailURL(url) {
  const id = extractDriveId(url);
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=s4000` : url;
}

function toDrivePreviewURL(url) {
  const id = extractDriveId(url);
  return id ? `https://drive.google.com/file/d/${id}/preview` : url;
}

// Load both on page ready
window.addEventListener("DOMContentLoaded", () => {
  loadPaigeVideos();
  loadSheetPosts();
});
