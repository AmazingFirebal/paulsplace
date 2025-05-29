function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  frameRate(30);
}

function draw() {
  background(20, 0, 40, 10); // Dark purple transparent background

  // Draw swirl dots
  for (let i = 0; i < 20; i++) {
    let angle = frameCount * 0.01 + i;
    let radius = 200 + sin(frameCount * 0.01 + i) * 100;
    let x = width / 2 + cos(angle) * radius;
    let y = height / 2 + sin(angle) * radius;

    fill(150 + sin(i) * 100, 50, 200, 90);
    ellipse(x, y, 100, 100);
  }
}
