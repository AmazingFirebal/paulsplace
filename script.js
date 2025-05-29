function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
}

function draw() {
  background(50, 0, 70, 20);

  fill(150 + sin(frameCount * 0.01) * 100, 50, 200, 100);
  ellipse(
    width / 2 + sin(frameCount * 0.01) * 200,
    height / 2 + cos(frameCount * 0.01) * 200,
    300, 300
  );
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
