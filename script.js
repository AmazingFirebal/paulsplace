const canvas = document.getElementById('goop-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let balls = Array.from({ length: 6 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: 80 + Math.random() * 40,
  dx: Math.random() * 1.5 - 0.75,
  dy: Math.random() * 1.5 - 0.75
}));

function drawMetaballs() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Composite mode to simulate blob merging
  ctx.globalCompositeOperation = 'lighter';

  balls.forEach(ball => {
    const gradient = ctx.createRadialGradient(ball.x, ball.y, ball.r * 0.4, ball.x, ball.y, ball.r);
    gradient.addColorStop(0, 'rgba(179, 0, 255, 0.6)');
    gradient.addColorStop(1, 'rgba(179, 0, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.globalCompositeOperation = 'source-over';
}

function animate() {
  balls.forEach(b => {
    b.x += b.dx;
    b.y += b.dy;

    if (b.x < b.r || b.x > canvas.width - b.r) b.dx *= -1;
    if (b.y < b.r || b.y > canvas.height - b.r) b.dy *= -1;
  });

  drawMetaballs();
  requestAnimationFrame(animate);
}
animate();
