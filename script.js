document.getElementById("surpriseBtn").addEventListener("click", () => {
  const messages = [
    "✨ Purple dreams never fade.",
    "🎸 You're jamming with the best of '99!",
    "🌀 You've unlocked a secret groove.",
    "💿 Welcome to the purple dimension!",
    "💜 Vibes fully activated."
  ];

  const random = Math.floor(Math.random() * messages.length);
  document.getElementById("surpriseMessage").textContent = messages[random];
});
