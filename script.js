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
  ctx.fillStyle = '#b300ff';

  ctx.beginPath();

  for (let i = 0; i < balls.length; i++) {
    let b1 = balls[i];
    for (let j = i + 1; j < balls.length; j++) {
      let b2 = balls[j];
      let dx = b2.x - b1.x;
      let dy = b2.y - b1.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      let maxDist = (b1.r + b2.r) * 0.75;

      if (dist < maxDist) {
        let angle = Math.atan2(dy, dx);
        let cp1x = b1.x + Math.cos(angle) * b1.r;
        let cp1y = b1.y + Math.sin(angle) * b1.r;
        let cp2x = b2.x - Math.cos(angle) * b2.r;
        let cp2y = b2.y - Math.sin(angle) * b2.r;

        ctx.moveTo(cp1x, cp1y);
        ctx.bezierCurveTo(
          b1.x, b1.y,
          b2.x, b2.y,
          cp2x, cp2y
        );
      }
    }
  }

  balls.forEach(ball => {
    ctx.moveTo(ball.x + ball.r, ball.y);
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  });

  ctx.fill();
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
