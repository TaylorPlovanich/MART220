// Variables for images and font
let customFont;
let pizzaImg1, pizzaImg2, pizzaImg3;

// Variables for movement
let pizzaX = 100;
let moveRight = true;

function preload() {
  // Load the custom font
  customFont = loadFont('assets/PizzaFont.ttf');
  
  // Load the three images
  pizzaImg1 = loadImage('images/pizza1.png');  // AI-generated
  pizzaImg2 = loadImage('images/pizza2.png');  
  pizzaImg3 = loadImage('images/topping.png'); 
}

function setup() {
  createCanvas(800, 600);
  
  // Timer that moves the pizza every 2 seconds
  setInterval(movePizza, 2000);
}

function draw() {
  // Simple background
  background(255, 230, 200);
  
  // Title with custom font
  fill(200, 50, 50);
  textFont(customFont);
  textSize(48);
  textAlign(CENTER);
  text("TAYLOR'S PIZZA PARADISE", 400, 60);
  
  // My name with custom font
  fill(100);
  textSize(20);
  text("by Taylor Plovanich", 400, 580);
  
  // Draw a simple counter/table
  fill(139, 90, 43);
  rect(0, 400, 800, 200);
  
  // Image 1: Moving pizza (timer-based movement)
  image(pizzaImg1, pizzaX, 250, 120, 120);
  
  // Image 2: Static pizza on the right
  image(pizzaImg2, 550, 300, 100, 100);
  
  // Image 3: Topping in the corner
  image(pizzaImg3, 100, 450, 50, 50);
}

// This function is called by the timer every 2 seconds
function movePizza() {
  if (moveRight) {
    pizzaX = pizzaX + 150;
  } else {
    pizzaX = pizzaX - 150;
  }
  
  // Change direction at edges
  if (pizzaX > 600) {
    moveRight = false;
  }
  if (pizzaX < 100) {
    moveRight = true;
  }
}