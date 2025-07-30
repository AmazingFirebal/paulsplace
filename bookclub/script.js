const API_KEY = "AIzaSyDicG28BjedTA44teSup3iX46dBU3znbm8";
const UPLOADS_PLAYLIST_ID = "UU3RiE5W0M6m9AUIaiDgppjA"; // "UU" + channel ID without @

const videosDiv = document.getElementById("videos");

async function loadLatestVideos() {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&playlistId=${UPLOADS_PLAYLIST_ID}&part=snippet&maxResults=3`
    );
    const data = await res.json();

    videosDiv.innerHTML = "";

    data.items.forEach((item) => {
      const videoId = item.snippet.resourceId.videoId;
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube.com/embed/${videoId}`;
      iframe.width = "100%";
      iframe.height = "200";
      iframe.frameBorder = "0";
      iframe.allowFullscreen = true;
      iframe.style.marginBottom = "15px";
      videosDiv.appendChild(iframe);
    });
  } catch (err) {
    videosDiv.innerHTML = "<p>Could not load videos right now.</p>";
    console.error("YouTube API error:", err);
  }
}

loadLatestVideos();
