function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
}

function draw() {
  background(30, 0, 60, 20);

  fill(150, 0, 255, 100);
  let x = width / 2 + sin(frameCount * 0.01) * 150;
  let y = height / 2 + cos(frameCount * 0.01) * 150;
  ellipse(x, y, 300, 300);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// wallpaper stuff
const disk = document.querySelector('.disk');

let lastScrollTop = 0;
let speed = 5; 
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

animate();
