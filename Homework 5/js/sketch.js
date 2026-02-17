var foodX = [];
var foodY = [];
var foodSize = [];
var foodColor = [];
var numberOfFoodItems = 15; 

var idleImages = [];
var frameIndex = 0;
var totalFrames = 9; 
var animationSpeed = 8; 

function preload() {
  for (var i = 0; i < totalFrames; i++) {
    var frameNum = nf(i + 1, 3); 
    idleImages[i] = loadImage("assets/Idle" + frameNum + ".png");
  }
}

function setup() {
  createCanvas(800, 600);

  for (var i = 0; i < numberOfFoodItems; i++) {
    foodX[i] = random(50, width - 50);
    foodY[i] = random(50, height - 50);
    foodSize[i] = random(15, 30);
    foodColor[i] = color(random(255), random(100), random(100)); 
  }
}

function draw() {
  background(40);

  for (var i = 0; i < foodX.length; i++) {
    fill(foodColor[i]);
    noStroke();
    circle(foodX[i], foodY[i], foodSize[i]);
  }

  if (idleImages.length > 0) {
    image(idleImages[frameIndex], 300, 200);
  }

  if (frameCount % animationSpeed === 0) {
    frameIndex = (frameIndex + 1) % idleImages.length;
  }
}