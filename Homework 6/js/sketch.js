// Animation frames
var idleImages = [];
var deadImages = [];
var totalFrames = 10;

// Animation state
var frameIndex = 0;
var animationSpeed = 8;
var isMoving = false;

// Character position
var charX = 300;
var charY = 300;
var targetX = 300;
var targetY = 300;
var moveSpeed = 3;

// Food array
var foods = [];

function preload() {
  for (var i = 0; i < totalFrames; i++) {
    var frameNum = nf(i, 3);
    idleImages[i] = loadImage("images/Idle" + frameNum + ".png");
    deadImages[i] = loadImage("images/Dead__" + frameNum + ".png");
  }
}

function setup() {
  createCanvas(800, 600);

  // Create 5 food objects with different colors, sizes, and positions
  foods[0] = new Food(100, 150, 40, color(255, 80, 80));
  foods[1] = new Food(250, 400, 30, color(80, 200, 80));
  foods[2] = new Food(500, 100, 50, color(80, 150, 255));
  foods[3] = new Food(650, 450, 35, color(255, 200, 50));
  foods[4] = new Food(400, 500, 45, color(200, 80, 255));
}

function draw() {
  background(40);

  // Draw all food items
  for (var i = 0; i < foods.length; i++) {
    foods[i].display();
  }

  // Move character toward target
  var d = dist(charX, charY, targetX, targetY);
  if (d > moveSpeed) {
    charX += (targetX - charX) / d * moveSpeed;
    charY += (targetY - charY) / d * moveSpeed;
    isMoving = true;
  } else {
    isMoving = false;
  }

  // Pick animation based on movement
  var currentAnim = isMoving ? deadImages : idleImages;

  // Draw character
  if (currentAnim.length > 0) {
    image(currentAnim[frameIndex], charX - 50, charY - 80);
  }

  // Advance animation frame
  if (frameCount % animationSpeed === 0) {
    frameIndex = (frameIndex + 1) % totalFrames;
  }
}

// When user clicks, set new target
function mouseClicked() {
  targetX = mouseX;
  targetY = mouseY;
  frameIndex = 0;
}