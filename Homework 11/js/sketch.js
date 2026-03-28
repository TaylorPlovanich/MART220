// =============================================
// Homework 11 - Particles, Combat, and Win Conditions
// =============================================

// --- Global Variables ---
let player;
let playerBody;
let goodFoods = [];   // array of 5 good food items
let badFoods = [];    // array of bad food enemies
let particles = [];   // particle array
let obstacles = null;
let score = 0;
let health = 3;
let gameOver = false;
let gameWon = false;
let gameStarted = false;

// Image arrays
let idleImgs = [];
let runImgs = [];
let deadImgs = [];
let goodFoodImg;
let badFoodImg;

// Sounds
let bgMusic;
let goodFoodSnd;
let badFoodSnd;

// --- Preload ---
function preload() {
  for (let i = 0; i <= 9; i++) {
    let num = nf(i, 3);
    idleImgs.push(loadImage('images/Idle' + num + '.png'));
    runImgs.push(loadImage('images/Run__' + num + '.png'));
    deadImgs.push(loadImage('images/Dead' + num + '.png'));
  }

  goodFoodImg = loadImage('images/crab_meat.png');
  badFoodImg  = loadImage('images/bad_food.png');

  bgMusic     = loadSound('sounds/background.mp3');
  goodFoodSnd = loadSound('sounds/good_food.mp3');
  badFoodSnd  = loadSound('sounds/bad_food.mp3');
}

// --- Setup ---
function setup() {
  new Canvas(600, 400);

  bgMusic.setLoop(true);

  // Player visuals
  player = new Player(idleImgs, runImgs, deadImgs);

  // Invisible p5.play body for obstacle collision
  playerBody = new Sprite(player.x, player.y, 30, 50);
  playerBody.collider = 'dynamic';
  playerBody.rotationLock = true;
  playerBody.visible = false;
  playerBody.mass = 100;

  // 5 good food items
  for (let i = 0; i < 5; i++) {
    goodFoods.push(new Food(goodFoodImg, 'good'));
  }

  // 3 bad food enemies
  for (let i = 0; i < 3; i++) {
    badFoods.push(new BadFood(badFoodImg));
  }
}

// --- Create Obstacles ---
function createObstacles() {
  obstacles = new Group();
  for (let i = 0; i < 4; i++) {
    let obs = new Sprite();
    obs.pos.x = random(150, 500);
    obs.pos.y = random(50, 350);
    obs.width = 40;
    obs.height = 40;
    obs.shapeColor = color(120, 80, 40);
    obs.collider = 'static';
    obs.rotationLock = true;
    obstacles.add(obs);
  }
}

// --- Start game ---
function keyPressed() {
  if (!gameStarted && !gameOver && !gameWon) {
    gameStarted = true;
    bgMusic.play();
    createObstacles();
  }
}

function mousePressed() {
  if (!gameStarted && !gameOver && !gameWon) {
    gameStarted = true;
    bgMusic.play();
    createObstacles();
  }
}

// --- Draw ---
function draw() {
  background(50, 120, 80);

  if (!gameStarted) {
    drawStartScreen();
    return;
  }

  if (!gameOver && !gameWon) {
    // --- Player Movement ---
    playerBody.velocity.x = 0;
    playerBody.velocity.y = 0;

    if (keyIsDown(LEFT_ARROW) || keyIsDown(65))  playerBody.velocity.x = -4;
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) playerBody.velocity.x = 4;
    if (keyIsDown(UP_ARROW) || keyIsDown(87))    playerBody.velocity.y = -4;
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83))  playerBody.velocity.y = 4;

    // Obstacle collision
    if (obstacles) playerBody.collide(obstacles);

    // Keep on canvas
    playerBody.pos.x = constrain(playerBody.pos.x, 20, width - 20);
    playerBody.pos.y = constrain(playerBody.pos.y, 20, height - 20);

    // Sync position to player visuals
    player.x = playerBody.pos.x;
    player.y = playerBody.pos.y;

    // Update player animation
    player.update(false);

    // --- Good Food ---
    for (let i = 0; i < goodFoods.length; i++) {
      goodFoods[i].update();
      goodFoods[i].display();

      if (goodFoods[i].hits(player)) {
        score++;
        goodFoodSnd.play();
        goodFoods[i].moveRandom();
      }
    }

    // --- Bad Food (enemies) ---
    for (let i = badFoods.length - 1; i >= 0; i--) {
      badFoods[i].display();

      // Player walks into bad food → lose health
      if (badFoods[i].hits(player)) {
        health--;
        badFoodSnd.play();
        badFoods[i].moveRandom();
        if (health <= 0) {
          health = 0;
          gameOver = true;
          bgMusic.stop();
        }
      }

      // Press X to attack nearby bad food
      if (keyIsDown(88)) { // X key
        let d = dist(player.x, player.y, badFoods[i].x, badFoods[i].y);
        if (d < 80) {
          // Spawn particles at enemy position
          createParticles(badFoods[i].x, badFoods[i].y);

          // Reduce enemy health
          badFoods[i].hp -= 1;

          // Remove enemy if health hits 0
          if (badFoods[i].hp <= 0) {
            badFoods.splice(i, 1);
          }
        }
      }
    }

    // --- Update and draw particles ---
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].show();
      if (particles[i].finished()) {
        particles.splice(i, 1);
      }
    }

    // --- Win condition: all bad food destroyed ---
    if (badFoods.length === 0) {
      gameWon = true;
      bgMusic.stop();
    }

  } else {
    player.update(true);
    player.display();
  }

  // Display player during gameplay
  if (!gameOver && !gameWon) {
    player.display();
  }

  drawHUD();
  if (gameOver) drawGameOver();
  if (gameWon)  drawGameWon();
}

// --- Spawn particles at x, y ---
function createParticles(x, y) {
  for (let i = 0; i < 5; i++) {
    particles.push(new Particle(x, y));
  }
}

// --- Start Screen ---
function drawStartScreen() {
  fill(0, 0, 0, 160);
  rect(0, 0, width, height);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(40);
  text('CRAB COLLECTOR', width / 2, height / 2 - 50);
  textSize(18);
  fill(200);
  text('Collect crab meat. Press X to attack bad food.', width / 2, height / 2);
  text('Press any key or click to start!', width / 2, height / 2 + 35);
}

// --- HUD ---
function drawHUD() {
  noStroke();
  textSize(20);
  fill(255);
  textAlign(LEFT, TOP);
  text('Score: ' + score, 10, 10);

  textAlign(RIGHT, TOP);
  fill(255, 80, 120);
  let hearts = '';
  for (let i = 0; i < health; i++) hearts += '♥ ';
  text(hearts, width - 10, 10);

  // Show remaining enemies
  fill(255);
  textAlign(CENTER, TOP);
  text('Enemies: ' + badFoods.length, width / 2, 10);
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

// --- You Win Screen ---
function drawGameWon() {
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);
  fill(100, 255, 100);
  textAlign(CENTER, CENTER);
  textSize(52);
  text('YOU WIN!', width / 2, height / 2 - 40);
  fill(255);
  textSize(26);
  text('Final Score: ' + score, width / 2, height / 2 + 20);
  fill(200);
  textSize(16);
  text('Refresh the page to play again', width / 2, height / 2 + 60);
}

// =============================================
// Particle Class
// =============================================
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-2, 2);
    this.vy = random(-4, -1);
    this.alpha = 255;
  }

  finished() {
    return this.alpha < 0;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 8;
  }

  show() {
    noStroke();
    fill(255, 150, 0, this.alpha); // orange particles
    ellipse(this.x, this.y, 12);
  }
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

  update(isGameOver) {
    if (isGameOver) {
      this.state = 'dead';
      this.animate();
      return;
    }

    let moving = false;
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65))  { this.flipped = true;  moving = true; }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { this.flipped = false; moving = true; }
    if (keyIsDown(UP_ARROW) || keyIsDown(87))    moving = true;
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83))  moving = true;

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
    if (this.state === 'run')  return this.runImgs;
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
// Food Class (good food)
// =============================================
class Food {
  constructor(img, type) {
    this.img  = img;
    this.type = type;
    this.size = 40;
    this.x = random(this.size, width - this.size);
    this.y = random(this.size, height - this.size);
    this.moveInterval = int(random(120, 300));
    this.timer = 0;
  }

  update() {
    this.timer++;
    if (this.timer >= this.moveInterval) this.moveRandom();
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

// =============================================
// BadFood Class (enemy)
// =============================================
class BadFood {
  constructor(img) {
    this.img  = img;
    this.size = 40;
    this.x = random(this.size, width - this.size);
    this.y = random(this.size, height - this.size);
    this.hp = 20; // takes 20 hits to destroy
  }

  moveRandom() {
    this.x = random(this.size, width - this.size);
    this.y = random(this.size, height - this.size);
  }

  display() {
    imageMode(CENTER);
    image(this.img, this.x, this.y, this.size, this.size);

    // Show health bar above enemy
    let barWidth = 40;
    let barHeight = 6;
    let hpPercent = this.hp / 20;
    noStroke();
    fill(200, 0, 0);
    rect(this.x - barWidth / 2, this.y - this.size / 2 - 10, barWidth, barHeight);
    fill(0, 200, 0);
    rect(this.x - barWidth / 2, this.y - this.size / 2 - 10, barWidth * hpPercent, barHeight);
  }

  hits(player) {
    let d = dist(this.x, this.y, player.x, player.y);
    return d < (this.size / 2 + player.size / 2);
  }
}