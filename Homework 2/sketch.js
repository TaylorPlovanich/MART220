function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(245, 230, 210); // Soft, warm cream background for the room

  // 1. THE FLOOR (using rect)
  noStroke();
  fill(120, 80, 50); // Brown floor color
  rect(0, 450, 600, 150);

  // 2. THE WINDOW (using rect and line)
  fill(173, 216, 230); // Light blue glass
  stroke(255);
  strokeWeight(8);
  rect(350, 80, 180, 250);
  line(440, 80, 440, 330); // Vertical window pane
  line(350, 205, 530, 205); // Horizontal window pane

  // 3. THE ROCK POSTER (using rect and triangle)
  noStroke();
  fill(40); // Dark poster background
  rect(80, 100, 120, 160);
  fill(255, 0, 0); // Red "band logo" shape
  triangle(100, 230, 140, 130, 180, 230);

  // 4. THE SPEAKER / AMP (using rect and circle)
  fill(60); // Dark grey amp body
  rect(100, 380, 100, 120);
  fill(30); // Darker speaker cone
  circle(150, 415, 40);
  circle(150, 465, 50);
  fill(200, 150, 50); // Gold knob
  circle(115, 395, 8);

  // 5. THE ACOUSTIC GUITAR (using circle, rect, and line)
  // Body
  fill(180, 90, 40); // Wood brown
  circle(420, 480, 90);
  circle(420, 420, 70);
  // Sound hole
  fill(40);
  circle(420, 435, 30);
  // Neck
  fill(100, 50, 20);
  rect(410, 300, 20, 100);
  // Strings
  stroke(220);
  strokeWeight(1);
  line(414, 300, 414, 480);
  line(420, 300, 420, 480);
  line(426, 300, 426, 480);

  // 6. RECORD PLAYER / TURNTABLE (using rect and circle)
  noStroke();
  fill(100, 100, 120); // Blue-ish grey base
  rect(230, 420, 120, 60);
  fill(20); // The Vinyl record
  circle(290, 450, 45);
  fill(255, 255, 100); // Record label
  circle(290, 450, 10);
  
  noLoop(); // Stops the draw loop since this is a static image
}