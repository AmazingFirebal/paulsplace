let noiseCanvas;
let noiseScale = 0.005; // Made smaller for more defined patterns
let noiseOffset = 0;
let secondaryNoiseScale = 0.02; // Additional noise layer for smoke-like effect

function setup() {
  // Create canvas and set it as background
  noiseCanvas = createCanvas(windowWidth, windowHeight);
  noiseCanvas.style('position', 'fixed');
  noiseCanvas.style('top', '0');
  noiseCanvas.style('left', '0');
  noiseCanvas.style('z-index', '-1');
  noiseCanvas.style('pointer-events', 'none');
  pixelDensity(1);
  noiseSeed(random(10000)); // Random seed for variation
  
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
      // Combine two noise layers for more detail
      let mainNoise = noise((x * noiseScale), (y * noiseScale) + noiseOffset);
      let secondNoise = noise((x * secondaryNoiseScale) + 1000, (y * secondaryNoiseScale) + noiseOffset + 1000);
      
      // Combine the noise layers and add contrast
      let noiseVal = (mainNoise * 0.7 + secondNoise * 0.3);
      noiseVal = pow(noiseVal, 1.5); // Add contrast
      
      // Create a purple gradient based on noise value
      let r = map(noiseVal, 0, 1, 0, 85); // Slightly brighter purple
      let g = map(noiseVal, 0, 1, 0, 5); // Tiny bit of green for depth
      let b = map(noiseVal, 0, 1, 10, 135); // More blue range for better contrast
      
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
  noiseOffset += 0.002; // Slightly faster animation for smoky effect
  drawNoiseBackground();
}

// Parallax effect
document.addEventListener('mousemove', (e) => {
  const moveX = (e.clientX - windowWidth/2) * 0.02;
  const moveY = (e.clientY - windowHeight/2) * 0.02;
  noiseCanvas.style('transform', `translate(${moveX}px, ${moveY}px)`);
}); 