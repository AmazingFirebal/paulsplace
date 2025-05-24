const canvas = document.getElementById("goop-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const blobs = Array.from({ length: 6 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: Math.random() * 2 - 1,
  vy: Math.random() * 2 - 1,
  r: 80 + Math.random() * 40,
}));

function drawBlob(blob) {
  const gradient = ctx.createRadialGradient(blob.x, blob.y, blob.r * 0.3, blob.x, blob.y, blob.r);
  gradient.addColorStop(0, "rgba(204,0,255,0.6)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
  ctx.fill();
}

function connectBlobs(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  if (dist < (a.r + b.r) * 0.9) {
    const opacity = 1 - dist / ((a.r + b.r) * 0.9);
    ctx.strokeStyle = `rgba(204,0,255,${opacity * 0.2})`;
    ctx.lineWidth = 8 * opacity;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < blobs.length; i++) {
    const b = blobs[i];

    b.x += b.vx;
    b.y += b.vy;

    if (b.x - b.r < 0 || b.x + b.r > canvas.width) b.vx *= -1;
    if (b.y - b.r < 0 || b.y + b.r > canvas.height) b.vy *= -1;

    drawBlob(b);

    for (let j = i + 1; j < blobs.length; j++) {
      connectBlobs(b, blobs[j]);
    }
  }

  requestAnimationFrame(animate);
}
animate();
