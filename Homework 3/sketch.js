var noteX = 300;
var noteY = 300;
var speedX = 2;
var speedY = 2;

function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(245, 230, 210); // Warm cream

  // --- 1-6: STATIC ELEMENTS ---
  noStroke();
  fill(120, 80, 50); 
  rect(0, 450, 600, 150); // Floor

  fill(173, 216, 230); 
  stroke(255);
  strokeWeight(8);
  rect(350, 80, 180, 250); // Window
  line(440, 80, 440, 330); 
  line(350, 205, 530, 205); 

  noStroke();
  fill(40); 
  rect(80, 100, 120, 160); // Poster
  fill(255, 0, 0); 
  triangle(100, 230, 140, 130, 180, 230);

  fill(60); 
  rect(100, 380, 100, 120); // Amp
  fill(30); 
  circle(150, 415, 40);
  circle(150, 465, 50);

  fill(180, 90, 40); 
  circle(420, 480, 90); // Guitar Body
  circle(420, 420, 70);
  fill(40);
  circle(420, 435, 30); // Sound hole

  fill(100, 100, 120); 
  rect(230, 420, 120, 60); // Turntable
  fill(20); 
  circle(290, 450, 45); // Record

  // --- 7: MOTION & CONTROL STATEMENTS ---
  // Basic movement logic
  noteX += speedX;
  noteY += speedY;

  // Control statements: Bounce the note if it hits the wall
  if (noteX > width || noteX < 0) {
    speedX *= -1;
  }
  if (noteY > height || noteY < 0) {
    speedY *= -1;
  }

  fill(255, 100, 100);
  noStroke();
  circle(noteX, noteY, 20); // Moving music note

  // --- 8: METADATA ---
  fill(0);
  textSize(16);
  textAlign(LEFT, TOP);
  text("Cozy Music Corner v2", 15, 15); // Title: Upper-left
  
  textAlign(RIGHT, BOTTOM);
  text("Taylor Plovanich", 585, 585); // Name: Lower-right
}

// --- 9: EVENT HANDLING ---
function mousePressed() {
  // Move randomly to different location on click
  noteX = random(50, 550);
  noteY = random(50, 550);
}