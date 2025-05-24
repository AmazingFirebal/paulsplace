const canvas = document.getElementById('goop-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let blobs = Array.from({ length: 6 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: 80 + Math.random() * 50,
  dx: Math.random() * 2 - 1,
  dy: Math.random() * 2 - 1,
}));

function drawBlob(blob) {
  let gradient = ctx.createRadialGradient(blob.x, blob.y, blob.r * 0.5, blob.x, blob.y, blob.r);
  gradient.addColorStop(0, 'rgba(204,0,255,0.8)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
  ctx.fill();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  blobs.forEach(blob => {
    blob.x += blob.dx;
    blob.y += blob.dy;

    // Bounce
    if (blob.x < 0 || blob.x > canvas.width) blob.dx *= -1;
    if (blob.y < 0 || blob.y > canvas.height) blob.dy *= -1;

    drawBlob(blob);
  });

  requestAnimationFrame(animate);
}
animate();
