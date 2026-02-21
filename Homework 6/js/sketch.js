var foodItems = []; // List to store multiple food objects
var idleImages = []; // List for idle animation frames
var runImages = []; // List for running animation frames
var currentAnim = []; // Keeps track of which animation is active

var charX = 100; // Character horizontal position
var charY = 400; // Character vertical position
var frameIdx = 0; // Current frame being shown

function preload() {
  // Loads 10 images into the idle array
  for (var i = 0; i < 10; i++) {
    idleImages[i] = loadImage("images/Idle" + nf(i, 3) + ".png");
    // Loads 10 images into the run array with double underscores
    runImages[i] = loadImage("images/Run__" + nf(i, 3) + ".png");
  }
}

function setup() {
  createCanvas(800, 600);
  currentAnim = idleImages; // Start with the idle animation

  // Loops 5 times to create 5 new food objects
  for (var i = 0; i < 5; i++) {
    foodItems.push(new Food());
  }
}

function draw() {
  background(40);

  // Runs the display function for every food object in the list
  for (var i = 0; i < foodItems.length; i++) {
    foodItems[i].display();
  }

  // Switches to run animation and moves x position if keys are held
  if (keyIsPressed) {
    currentAnim = runImages; 
    if (keyIsDown(RIGHT_ARROW)) { charX += 3; }
    if (keyIsDown(LEFT_ARROW)) { charX -= 3; }
  } else {
    // Switches back to idle if no keys are pressed
    currentAnim = idleImages; 
  }

  // Draws the current frame of the character
  image(currentAnim[frameIdx], charX, charY);

  // Changes the frame index every 6 counts to create movement
  if (frameCount % 6 == 0) {
    frameIdx = (frameIdx + 1) % currentAnim.length;
  }
}