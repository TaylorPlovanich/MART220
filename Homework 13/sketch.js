// Homework 13 — 3D Models, Textures, and Interaction
// Artwork: "Sting"
// Taylor Plovanich

let artifact;
let textures = [];
let shapes = [];

function preload() {
  artifact = loadModel("assets/Sting-Sword-lowpoly.obj", true);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Generate 5 colored textures dynamically
  let colors = ["#e63946", "#457b9d", "#2a9d8f", "#e9c46a", "#f4a261"];
  for (let i = 0; i < 5; i++) {
    let g = createGraphics(200, 200);
    g.background(colors[i]);
    g.fill(255);
    g.textSize(40);
    g.textAlign(CENTER, CENTER);
    g.text("✦", 100, 100);
    textures[i] = g;
  }

  // Store all orbiting shapes in an array
  shapes = [
    { type: "box",      radius: 200, speed: 0.01,  y: -50, tex: textures[0] },
    { type: "sphere",   radius: 280, speed: 0.02,  y: 30,  tex: textures[1] },
    { type: "cone",     radius: 160, speed: 0.015, y: 80,  tex: textures[2] },
    { type: "cylinder", radius: 320, speed: 0.008, y: -80, tex: textures[3] },
    { type: "torus",    radius: 240, speed: 0.025, y: 0,   tex: textures[4] },
  ];
}

function draw() {
  background(20);

  ambientLight(80);
  directionalLight(255, 255, 255, 0.5, 1, -1);

  // Central model — focal point of the scene
  push();
  rotateY(frameCount * 0.008);
  rotateX(-0.3);
  specularMaterial(200);
  shininess(80);
  scale(2);
  model(artifact);
  pop();

  // Loop through all shapes and draw each one
  for (let i = 0; i < shapes.length; i++) {
    let s = shapes[i];
    let angle = frameCount * s.speed + i;

    push();
    translate(cos(angle) * s.radius, s.y, sin(angle) * s.radius);
    rotateY(angle * 2);
    texture(s.tex);
    noStroke();

    if (s.type === "box")      box(60, 60, 60);
    if (s.type === "sphere")   sphere(35);
    if (s.type === "cone")     cone(30, 70);
    if (s.type === "cylinder") cylinder(25, 60);
    if (s.type === "torus")    torus(30, 12);
    pop();
  }

  // Display title and name
  push();
  translate(-width / 2, -height / 2, 0);
  fill(255);
  noStroke();
  textSize(22);
  text("Sting", 20, 38);
  textSize(14);
  text("Taylor Plovanich", 20, 62);
  pop();
}

// On mouse click, move two shapes to new random positions
function mouseClicked() {
  for (let i = 0; i < 2; i++) {
    shapes[i].radius = random(120, 350);
    shapes[i].y = random(-150, 150);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}