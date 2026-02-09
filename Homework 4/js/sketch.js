let titleFont;
let pizza1, pizza2, aiPizza;
let aiX = 100;
let aiY = 100;

function preload() {
  // Pathing updated to match your images folder screenshot
  pizza1 = loadImage('images/pizza1.png'); 
  pizza2 = loadImage('images/pizza2.jpg'); 
  aiPizza = loadImage('images/pizza3.jpg'); 

  // Pathing updated to match your uploaded font file
  titleFont = loadFont('assets/PizzaHoot-JRawE.otf'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Requirement: Timer-based movement
  setInterval(movePizza, 1500);
}

function draw() {
  background(255, 248, 220); 

  // Requirement: Custom Typography
  textFont(titleFont);
  fill(180, 0, 0); 
  textAlign(CENTER);
  
  textSize(60);
  text("Taylor's Pizza Paradise", width / 2, 80);
  
  textSize(24);
  text("By: Taylor Plovnich", width / 2, 120);

  // Requirement: Three Images (Static)
  image(pizza1, 50, 200, 300, 300);
  image(pizza2, width - 350, 200, 300, 300);

  // Moving Image (Controlled by Timer)
  image(aiPizza, aiX, aiY, 250, 250);
}

function movePizza() {
  aiX = random(50, width - 250);
  aiY = random(150, height - 250);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}