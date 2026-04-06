// Homework 12 — "Launch Day"
// Taylor Plovanich

let pg;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(RADIANS);

  pg = createGraphics(400, 100);
  pg.background(0, 0);
  pg.fill(255);
  pg.noStroke();
  pg.textSize(28);
  pg.textAlign(CENTER, TOP);
  pg.text("Launch Day", 200, 10);
  pg.textSize(18);
  pg.text("by Taylor Plovanich", 200, 50);
}

function draw() {
  background(10, 10, 30);

  ambientLight(80);
  directionalLight(255, 255, 255, 0, 1, -1);

  // slowly rotate everything
  rotateY(frameCount * 0.01);

  // rocket body
  push();
  translate(0, 0, 0);
  rotateX(PI / 2);
  ambientMaterial(200, 50, 50);
  cylinder(30, 120);
  pop();

  // nose cone
  push();
  translate(0, -100, 0);
  rotateX(-PI / 2);
  ambientMaterial(220, 220, 60);
  cone(30, 60);
  pop();

  // fin left
  push();
  translate(-50, 50, 0);
  ambientMaterial(180, 40, 40);
  box(10, 60, 30);
  pop();

  // fin right
  push();
  translate(50, 50, 0);
  ambientMaterial(180, 40, 40);
  box(10, 60, 30);
  pop();

  // engine ring
  push();
  translate(0, 80, 0);
  rotateX(frameCount * 0.02);
  specularMaterial(200, 200, 200);
  torus(35, 8);
  pop();

  // planet in background
  push();
  translate(250, 100, -200);
  rotateY(frameCount * 0.005);
  ambientMaterial(60, 100, 200);
  sphere(80);
  pop();

  // small moon
  push();
  translate(-200, -100, -100);
  ambientMaterial(180, 180, 180);
  sphere(30);
  pop();

  // title text plane
  push();
  translate(0, -220, 0);
  texture(pg);
  noStroke();
  plane(300, 75);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}