// --- DATA FOR FOOD ---
var foodX = [];
var foodY = [];
var foodSize = [];
var foodColor = [];
var numberOfFoodItems = 15; // Requirement 1: Multiple items

// --- DATA FOR ANIMATION ---
var idleImages = [];
var frameIndex = 0;
var totalFrames = 6; // Requirement 5: At least 6 frames
var animationSpeed = 8; 

function preload() {
  // Requirement 5: Using a loop to load animation frames
  for (var i = 0; i < totalFrames; i++) {
    // This handles your Idle__002 to Idle__007 naming
    var frameNum = nf(i + 2, 3); 
    
    // FIX: Added "assets/" so p5 knows to look inside your folder
    // Also using "__" to match your double underscores
    idleImages[i] = loadImage("assets/Idle__" + frameNum + ".png");
  }
}

function setup() {
  createCanvas(800, 600);

  // Requirement 1 & 4: Populate Food Arrays using a Loop
  for (var i = 0; i < numberOfFoodItems; i++) {
    foodX[i] = random(50, width - 50);
    foodY[i] = random(50, height - 50);
    foodSize[i] = random(15, 30);
    // Requirement 3: Using color data
    foodColor[i] = color(random(255), random(100), random(100)); 
  }
}

function draw() {
  background(40);

  // Requirement 4: Display Multiple Food Instances using a Loop
  for (var i = 0; i < foodX.length; i++) {
    fill(foodColor[i]);
    noStroke();
    circle(foodX[i], foodY[i], foodSize[i]);
  }

  // Requirement 5: Display the Animation
  if (idleImages.length > 0) {
    image(idleImages[frameIndex], 300, 200);
  }

  // Timing logic: Advances the animation every 8 frames
  if (frameCount % animationSpeed === 0) {
    frameIndex = (frameIndex + 1) % idleImages.length;
  }
}