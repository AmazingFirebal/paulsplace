const API_KEY = "AIzaSyDicG28BjedTA44teSup3iX46dBU3znbm8";
const videosDiv = document.getElementById("videos");

async function loadPaigeVideos() {
  try {
    // Step 1: Search for the channel
    const searchRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=paigey4lifez&key=${API_KEY}`);
    const searchData = await searchRes.json();

    if (!searchData.items.length) {
      videosDiv.innerHTML = "<p>Paige's channel not found.</p>";
      return;
    }

    const channelId = searchData.items[0].snippet.channelId;
    const uploadsPlaylistId = "UU" + channelId.substring(2); // Convert UCxxx -> UUxxx

    // Step 2: Fetch videos from the uploads playlist
    const playlistRes = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&playlistId=${uploadsPlaylistId}&part=snippet&maxResults=3`);
    const playlistData = await playlistRes.json();

    videosDiv.innerHTML = "";

    playlistData.items.forEach((item) => {
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
    videosDiv.innerHTML = "<p>Error loading videos.</p>";
    console.error("Error fetching YouTube videos:", err);
  }
}

loadPaigeVideos();
