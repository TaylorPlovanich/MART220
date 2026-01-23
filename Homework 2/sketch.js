function setup() {
    createCanvas(600, 600);
  }
  
  function draw() {
    background(245, 230, 210); // Warm cream walls
  
    // 1. FLOOR
    noStroke();
    fill(120, 80, 50); // Brown floor
    rect(0, 450, 600, 150);
  
    // 2. WINDOW
    fill(173, 216, 230); // Glass blue
    stroke(255);
    strokeWeight(8);
    rect(350, 80, 180, 250);
    line(440, 80, 440, 330); // Vertical pane
    line(350, 205, 530, 205); // Horizontal pane
  
    // 4. GUITAR
    // Body (Two circles layered)
    fill(180, 90, 40); 
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
  
    // 5. AMP/SPEAKER
    noStroke();
    fill(60); 
    rect(100, 380, 100, 120);
    fill(30); 
    circle(150, 415, 40);
    circle(150, 465, 50);
    fill(200, 150, 50); // Volume knob
    circle(115, 395, 8);
  
    // 6. VINYL PLAYER
    fill(100, 100, 120);
    rect(230, 420, 120, 60);
    fill(20); 
    circle(290, 450, 45);
    fill(255, 255, 100); 
    circle(290, 450, 10);
    
    noLoop(); 
  }