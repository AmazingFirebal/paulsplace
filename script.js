const canvas = document.getElementById("goop-canvas");
const ctx = canvas.getContext("2d");

let width, height;
function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Create gooey blobs
const blobs = Array.from({ length: 8 }, () => ({
  x: Math.random() * width,
  y: Math.random() * height,
  r: 70 + Math.random() * 30,
  vx: (Math.random() - 0.5) * 1,
  vy: (Math.random() - 0.5) * 1,
}));

function update() {
  for (let b of blobs) {
    b.x += b.vx;
    b.y += b.vy;

    if (b.x < 0 || b.x > width) b.vx *= -1;
    if (b.y < 0 || b.y > height) b.vy *= -1;
  }
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(179, 0, 255, 0.7)";
  ctx.globalCompositeOperation = "lighter";

  for (let i = 0; i < blobs.length; i++) {
    const a = blobs[i];
    ctx.beginPath();
    ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
    ctx.fill();

    for (let j = i + 1; j < blobs.length; j++) {
      const b = blobs[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy);
      const maxDist = (a.r + b.r) * 0.75;

      if (dist < maxDist) {
        // tension line with curved width
        const t = 1 - dist / maxDist;
        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2;
        const angle = Math.atan2(dy, dx);
        const offset = t * 20;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(
          midX + Math.cos(angle + Math.PI / 2) * offset,
          midY + Math.sin(angle + Math.PI / 2) * offset,
          b.x,
          b.y
        );
        ctx.strokeStyle = `rgba(179, 0, 255, ${0.2 * t})`;
        ctx.lineWidth = 10 * t;
        ctx.stroke();
      }
    }
  }

  ctx.globalCompositeOperation = "source-over";
}

function animate() {
  update();
  draw();
  requestAnimationFrame(animate);
}
animate();
