let noiseCanvas;
let noiseScale = 0.02;
let noiseOffset = 0;

function setup() {
  // Create canvas and set it as background
  noiseCanvas = createCanvas(windowWidth, windowHeight);
  noiseCanvas.style('position', 'fixed');
  noiseCanvas.style('top', '0');
  noiseCanvas.style('left', '0');
  noiseCanvas.style('z-index', '-1');
  noiseCanvas.style('pointer-events', 'none');
  pixelDensity(1);
  
  // Initial draw
  drawNoiseBackground();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  drawNoiseBackground();
}

function drawNoiseBackground() {
  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let noiseVal = noise((x * noiseScale), (y * noiseScale) + noiseOffset);
      
      // Create a purple gradient based on noise value
      let r = map(noiseVal, 0, 1, 0, 68); // Dark purple
      let g = map(noiseVal, 0, 1, 0, 0);
      let b = map(noiseVal, 0, 1, 0, 108);
      
      let index = (x + y * width) * 4;
      pixels[index] = r;
      pixels[index + 1] = g;
      pixels[index + 2] = b;
      pixels[index + 3] = 255;
    }
  }
  updatePixels();
}

function draw() {
  noiseOffset += 0.001; // Subtle animation
  drawNoiseBackground();
}

// Parallax effect
document.addEventListener('mousemove', (e) => {
  const moveX = (e.clientX - windowWidth/2) * 0.02;
  const moveY = (e.clientY - windowHeight/2) * 0.02;
  noiseCanvas.style('transform', `translate(${moveX}px, ${moveY}px)`);
}); 