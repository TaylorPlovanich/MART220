// =============================================
// Homework 7 - Interaction, Scoring, and Timers
// =============================================

// --- Global Variables ---
let player;
let food;
let score = 0;
let timeLeft = 60;
let lastSecond;
let gameOver = false;

// Image arrays
let idleImgs = [];
let runImgs = [];
let deadImgs = [];
let foodImg;

// --- Preload Images ---
function preload() {
  // Idle frames: Idle000.png - Idle009.png
  for (let i = 0; i <= 9; i++) {
    let num = nf(i, 3);
    idleImgs.push(loadImage('images/Idle' + num + '.png'));
  }

  // Run frames: Run__000.png - Run__009.png
  for (let i = 0; i <= 9; i++) {
    let num = nf(i, 3);
    runImgs.push(loadImage('images/Run__' + num + '.png'));
  }

  // Dead frames: Dead000.png - Dead009.png
  for (let i = 0; i <= 9; i++) {
    let num = nf(i, 3);
    deadImgs.push(loadImage('images/Dead' + num + '.png'));
  }

  // Food image
  foodImg = loadImage('images/crab_meat.png');
}

// --- Setup ---
function setup() {
  createCanvas(600, 400);
  player = new Player(idleImgs, runImgs, deadImgs);
  food = new Food(foodImg);
  lastSecond = millis();
}

// --- Draw ---
function draw() {
  background(50, 120, 80);

  if (!gameOver) {
    // Countdown timer
    if (millis() - lastSecond >= 1000) {
      timeLeft--;
      lastSecond = millis();
      if (timeLeft <= 0) {
        timeLeft = 0;
        gameOver = true;
      }
    }

    // Update food movement
    food.update();

    // Collision detection
    if (food.hits(player)) {
      score++;
      food.moveRandom();
    }
  }

  // Update and display player
  player.update(gameOver);
  player.display();

  // Display food only during game
  if (!gameOver) {
    food.display();
  }

  // Draw score and timer
  drawHUD();

  // Game over screen
  if (gameOver) {
    drawGameOver();
  }
}

// --- HUD ---
function drawHUD() {
  noStroke();
  textSize(20);

  fill(255);
  textAlign(LEFT, TOP);
  text('Score: ' + score, 10, 10);

  textAlign(RIGHT, TOP);
  if (timeLeft <= 10) {
    fill(255, 80, 80); // red when low
  } else {
    fill(255);
  }
  text('Time: ' + timeLeft, width - 10, 10);
}

// --- Game Over Screen ---
function drawGameOver() {
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);

  fill(255, 80, 80);
  textAlign(CENTER, CENTER);
  textSize(52);
  text('GAME OVER', width / 2, height / 2 - 40);

  fill(255);
  textSize(26);
  text('Final Score: ' + score, width / 2, height / 2 + 20);

  fill(200);
  textSize(16);
  text('Refresh the page to play again', width / 2, height / 2 + 60);
}

// =============================================
// Player Class
// =============================================
class Player {
  constructor(idleImgs, runImgs, deadImgs) {
    this.x = 300;
    this.y = 200;
    this.size = 64;
    this.speed = 4;

    this.idleImgs = idleImgs;
    this.runImgs = runImgs;
    this.deadImgs = deadImgs;

    this.state = 'idle';
    this.frameIndex = 0;
    this.animTimer = 0;
    this.animSpeed = 6;
    this.flipped = false;
  }

  update(gameOver) {
    if (gameOver) {
      this.state = 'dead';
      this.animate();
      return;
    }

    let moving = false;

    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      this.x -= this.speed;
      this.flipped = true;
      moving = true;
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      this.x += this.speed;
      this.flipped = false;
      moving = true;
    }
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
      this.y -= this.speed;
      moving = true;
    }
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
      this.y += this.speed;
      moving = true;
    }

    // Keep player on canvas
    this.x = constrain(this.x, this.size / 2, width - this.size / 2);
    this.y = constrain(this.y, this.size / 2, height - this.size / 2);

    this.state = moving ? 'run' : 'idle';
    this.animate();
  }

  animate() {
    this.animTimer++;
    if (this.animTimer >= this.animSpeed) {
      this.animTimer = 0;
      let imgs = this.currentImages();
      this.frameIndex = (this.frameIndex + 1) % imgs.length;
    }
  }

  currentImages() {
    if (this.state === 'run') return this.runImgs;
    if (this.state === 'dead') return this.deadImgs;
    return this.idleImgs;
  }

  display() {
    push();
    imageMode(CENTER);
    translate(this.x, this.y);
    if (this.flipped) scale(-1, 1);
    image(this.currentImages()[this.frameIndex], 0, 0, this.size, this.size);
    pop();
  }
}

// =============================================
// Food Class
// =============================================
class Food {
  constructor(img) {
    this.img = img;
    this.size = 40;
    this.x = random(this.size, width - this.size);
    this.y = random(this.size, height - this.size);
    this.moveInterval = int(random(120, 300));
    this.timer = 0;
  }

  update() {
    this.timer++;
    if (this.timer >= this.moveInterval) {
      this.moveRandom();
    }
  }

  moveRandom() {
    this.x = random(this.size, width - this.size);
    this.y = random(this.size, height - this.size);
    this.moveInterval = int(random(120, 300));
    this.timer = 0;
  }

  display() {
    imageMode(CENTER);
    image(this.img, this.x, this.y, this.size, this.size);
  }

  hits(player) {
    let d = dist(this.x, this.y, player.x, player.y);
    return d < (this.size / 2 + player.size / 2);
  }
}