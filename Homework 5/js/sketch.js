// --- DATA FOR FOOD ---
var foodX = [];
var foodY = [];
var foodSize = [];
var foodColor = [];
var numberOfFoodItems = 12; // Repetition and scaling

// --- DATA FOR ANIMATION ---
var idleImages = [];
var frameIndex = 0;
// You have images 002 through 007, which is 6 frames
var totalFrames = 6; 
var animationSpeed = 8; 

function preload() {
  // Requirement 5: Using a loop to load animation frames
  for (var i = 0; i < totalFrames; i++) {
    // This matches your specific names: Idle__002, Idle__003, etc.
    // We start at 2 because your first screenshot shows Idle__002.png
    var frameNum = nf(i + 2, 3); 
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
    foodColor[i] = color(random(255), random(100), random(100)); // reddish food
  }
}

function draw() {
  background(40);

  // Requirement 2 & 4: Display Multiple Food Instances using a Loop
  for (var i = 0; i < foodX.length; i++) {
    fill(foodColor[i]);
    noStroke();
    // Requirement 3: Simplified food (circles)
    circle(foodX[i], foodY[i], foodSize[i]);
  }

  // Requirement 5: Display a single Animation using a loop/index
  if (idleImages.length > 0) {
    image(idleImages[frameIndex], 300, 200);
  }

  // Advance the animation index based on timing
  if (frameCount % animationSpeed === 0) {
    frameIndex = (frameIndex + 1) % idleImages.length;
  }
}