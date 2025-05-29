const canvas = document.getElementById("swirlCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function drawSwirl() {
  const gradient = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 100,
    canvas.width / 2, canvas.height / 2, canvas.width
  );

  gradient.addColorStop(0, "#c9a0ff");
  gradient.addColorStop(0.3, "#a069cc");
  gradient.addColorStop(0.6, "#8031b2");
  gradient.addColorStop(1, "#0b0014");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Optional blur
  ctx.filter = "blur(40px)";
}

drawSwirl();
