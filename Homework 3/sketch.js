var noteX = 300;
var noteY = 300;

function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(245, 230, 210); // Soft, warm cream background for the room

  // 1. THE FLOOR
  noStroke();
  fill(120, 80, 50); 
  rect(0, 450, 600, 150);

  // 2. THE WINDOW
  fill(173, 216, 230); 
  stroke(255);
  strokeWeight(8);
  rect(350, 80, 180, 250);
  line(440, 80, 440, 330); 
  line(350, 205, 530, 205); 

  // 3. THE ROCK POSTER
  noStroke();
  fill(40); 
  rect(80, 100, 120, 160);
  fill(255, 0, 0); 
  triangle(100, 230, 140, 130, 180, 230);

  // 4. THE SPEAKER / AMP
  fill(60); 
  rect(100, 380, 100, 120);
  fill(30); 
  circle(150, 415, 40);
  circle(150, 465, 50);
  fill(200, 150, 50); 
  circle(115, 395, 8);

  // 5. THE ACOUSTIC GUITAR
  fill(180, 90, 40); 
  circle(420, 480, 90);
  circle(420, 420, 70);
  fill(40);
  circle(420, 435, 30);
  fill(100, 50, 20);
  rect(410, 300, 20, 100);
  stroke(220);
  strokeWeight(1);
  line(414, 300, 414, 480);
  line(420, 300, 420, 480);
  line(426, 300, 426, 480);

  // 6. RECORD PLAYER / TURNTABLE
  noStroke();
  fill(100, 100, 120); 
  rect(230, 420, 120, 60);
  fill(20); 
  circle(290, 450, 45);
  fill(255, 255, 100); 
  circle(290, 450, 10);
  
  // 7. INTERACTIVE RANDOM SHAPE (Music Note)
  fill(255, 100, 100);
  noStroke();
  circle(noteX, noteY, 20); // This moves only when you click
  
  // 8. REQUIRED METADATA
  fill(0);
  textSize(16);
  textAlign(LEFT, TOP);
  text("Cozy Music Corner v2", 15, 15); // Title: Upper-left
  
  textAlign(RIGHT, BOTTOM);
  text("Taylor Plovanich", 585, 585); // Name: Lower-right
}

// Click to move the note to a random location
function mousePressed() {
  noteX = random(50, 550);
  noteY = random(50, 550);
}