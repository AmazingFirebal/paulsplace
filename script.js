document.getElementById("surpriseBtn").addEventListener("click", function () {
  const messages = [
    "You found the purple vibe! 🎵",
    "Groovy times ahead! 🌈",
    "Keep it funky, web wanderer! 🕺",
    "Retro never dies! 💿",
    "💜 You just made the internet 37% cooler 💜"
  ];

  const randomIndex = Math.floor(Math.random() * messages.length);
  document.getElementById("surpriseMessage").textContent = messages[randomIndex];
});
