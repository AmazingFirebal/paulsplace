let noiseCanvas;
let seed;
const scale = 0.003; // Adjust this to change noise scale
const speed = 0.0005; // Adjust this to change animation speed
let zoff = 0;

// Function to get user's IP and generate seed
async function initializeSeed() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    // Convert IP to number by removing dots and parsing
    seed = parseInt(data.ip.replace(/\./g, ''));
    noiseSeed(seed);
  } catch (error) {
    // Fallback to random seed if IP fetch fails
    seed = Math.floor(Math.random() * 1000000);
    noiseSeed(seed);
  }
}

function setupNoiseBackground() {
  // Create canvas and set it as background
  noiseCanvas = createCanvas(windowWidth, windowHeight);
  noiseCanvas.style('position', 'fixed');
  noiseCanvas.style('top', '0');
  noiseCanvas.style('left', '0');
  noiseCanvas.style('z-index', '-2');
  noiseCanvas.parent('noise-background');
  
  initializeSeed();
  pixelDensity(1);
  noiseDetail(4, 0.5);
}

function drawNoiseBackground() {
  loadPixels();
  
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const noiseVal = noise(x * scale, y * scale, zoff);
      const index = (x + y * width) * 4;
      
      // Create purple gradient based on noise value
      const r = map(noiseVal, 0, 1, 0, 41); // Dark purple R component
      const g = map(noiseVal, 0, 1, 0, 0); // Dark purple G component
      const b = map(noiseVal, 0, 1, 0, 66); // Dark purple B component
      
      pixels[index] = r;
      pixels[index + 1] = g;
      pixels[index + 2] = b;
      pixels[index + 3] = 255;
    }
  }
  
  updatePixels();
  zoff += speed;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// p5.js setup and draw functions
function setup() {
  setupNoiseBackground();
}

function draw() {
  drawNoiseBackground();
} 