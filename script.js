const disk = document.querySelector('.disk');
let lastScrollTop = 0;
let speed = 0.05;
let angle = 0;

function animate() {
  const scrollTop = window.scrollY;
  const scrollDiff = Math.abs(scrollTop - lastScrollTop);
  speed = 0.05 + scrollDiff * 0.1;
  angle += speed;
  disk.style.transform = `rotate(${angle}deg)`;
  lastScrollTop = scrollTop;
  requestAnimationFrame(animate);
}

if (disk) animate();
