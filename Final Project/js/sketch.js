// =============================================
// MART 220 - Final Project: Crab Collector
// =============================================

// --- Global Variables ---
let player, playerBody;
let goodFoods = [];   
let badFoods = [];    
let particles = [];   
let obstacles = null;
let score = 0;
let health = 3;
let gameOver = false;
let gameWon = false;
let gameStarted = false;

// Assets
let idleImgs = [], runImgs = [], deadImgs = [];
let goodFoodImg, badFoodImg;
let bgMusic, goodFoodSnd, badFoodSnd;

function preload() {
  // Character Animations
  for (let i = 0; i <= 9; i++) {
    let num = nf(i, 3);
    idleImgs.push(loadImage('images/Idle' + num + '.png'));
    runImgs.push(loadImage('images/Run__' + num + '.png'));
    deadImgs.push(loadImage('images/Dead' + num + '.png'));
  }
  // Environment Assets
  goodFoodImg = loadImage('images/crab_meat.png');
  badFoodImg  = loadImage('images/bad_food.png');
  // Audio Assets
  bgMusic     = loadSound('sounds/background.mp3');
  goodFoodSnd = loadSound('sounds/good_food.mp3');
  badFoodSnd  = loadSound('sounds/bad_food.mp3');
}

function setup() {
  new Canvas(600, 400);
  bgMusic.setLoop(true);
  initGame(); // Encapsulated setup for easy restarting
}

// Function to (re)initialize game state
function initGame() {
  score = 0;
  health = 3;
  gameOver = false;
  gameWon = false;
  goodFoods = [];
  badFoods = [];
  particles = [];
  
  player = new Player(idleImgs, runImgs, deadImgs);
  
  if (playerBody) playerBody.remove(); // Clean up old physics body
  playerBody = new Sprite(300, 200, 30, 50);
  playerBody.collider = 'dynamic';
  playerBody.rotationLock = true;
  playerBody.visible = false;

  for (let i = 0; i < 5; i++) goodFoods.push(new Food(goodFoodImg));
  for (let i = 0; i < 3; i++) badFoods.push(new BadFood(badFoodImg));
  
  if (obstacles) obstacles.removeAll();
  createObstacles();
}

function createObstacles() {
  obstacles = new Group();
  for (let i = 0; i < 4; i++) {
    let obs = new Sprite(random(150, 500), random(50, 350), 40, 40, 'static');
    obs.shapeColor = color(120, 80, 40);
    obstacles.add(obs);
  }
}

function keyPressed() {
  // Start Game
  if (!gameStarted) {
    gameStarted = true;
    bgMusic.play();
  }
  // Restart Game
  if ((gameOver || gameWon) && key === 'r') {
    initGame();
    bgMusic.play();
  }
}

function draw() {
  background(50, 120, 80);

  if (!gameStarted) {
    drawStartScreen();
    return;
  }

  if (!gameOver && !gameWon) {
    // Movement Logic
    playerBody.velocity.x = 0;
    playerBody.velocity.y = 0;
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65))  playerBody.velocity.x = -4;
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) playerBody.velocity.x = 4;
    if (keyIsDown(UP_ARROW) || keyIsDown(87))    playerBody.velocity.y = -4;
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83))  playerBody.velocity.y = 4;

    playerBody.pos.x = constrain(playerBody.pos.x, 20, width - 20);
    playerBody.pos.y = constrain(playerBody.pos.y, 20, height - 20);
    player.x = playerBody.pos.x;
    player.y = playerBody.pos.y;
    player.update(false);

    // Collectibles
    for (let f of goodFoods) {
      f.display();
      if (f.hits(player)) {
        score++;
        goodFoodSnd.play();
        f.moveRandom();
      }
    }

    // Enemies
    for (let i = badFoods.length - 1; i >= 0; i--) {
      badFoods[i].display();
      if (badFoods[i].hits(player)) {
        health--;
        badFoodSnd.play();
        badFoods[i].moveRandom();
        if (health <= 0) { gameOver = true; bgMusic.stop(); }
      }

      // Attack Mechanic (X key)
      if (keyIsDown(88)) {
        let d = dist(player.x, player.y, badFoods[i].x, badFoods[i].y);
        if (d < 100) {
          badFoods[i].takeDamage(); 
          createParticles(badFoods[i].x, badFoods[i].y);
          // Intentional Audio: High pitched beep for hit
          if (!goodFoodSnd.isPlaying()) {
             goodFoodSnd.rate(2.0); 
             goodFoodSnd.play();
          }
          if (badFoods[i].hp <= 0) badFoods.splice(i, 1);
        }
      }
    }

    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].show();
      if (particles[i].finished()) particles.splice(i, 1);
    }

    if (badFoods.length === 0) { gameWon = true; bgMusic.stop(); }

  } else {
    player.update(true); // Death animation
  }

  player.display();
  drawHUD();
  if (gameOver) drawGameOver();
  if (gameWon)  drawGameWon();
}

function createParticles(x, y) {
  for (let i = 0; i < 5; i++) particles.push(new Particle(x, y));
}

// --- Screen UI Functions ---
function drawStartScreen() {
  fill(0, 160); rect(0, 0, width, height);
  fill(255); textAlign(CENTER, CENTER);
  textSize(40); text('CRAB COLLECTOR', width / 2, height / 2 - 50);
  textSize(18); fill(200);
  text('Move with ARROWS. Press X to Attack.', width / 2, height / 2);
  text('Press any key to begin your hunt!', width / 2, height / 2 + 35);
}

function drawHUD() {
  fill(255); textSize(20); textAlign(LEFT, TOP);
  text('Crabs: ' + score, 10, 10);
  textAlign(RIGHT, TOP); fill(255, 80, 120);
  let hearts = '';
  for (let i = 0; i < health; i++) hearts += '♥ ';
  text(hearts, width - 10, 10);
}

function drawGameOver() {
  fill(0, 150); rect(0, 0, width, height);
  fill(255, 80, 80); textAlign(CENTER, CENTER); textSize(52);
  text('WASTED', width / 2, height / 2 - 40);
  fill(255); textSize(20); text('Press [R] to Try Again', width / 2, height / 2 + 30);
}

function drawGameWon() {
  fill(0, 150); rect(0, 0, width, height);
  fill(100, 255, 100); textAlign(CENTER, CENTER); textSize(52);
  text('CHAMPION', width / 2, height / 2 - 40);
  fill(255); textSize(20); text('Press [R] to Play Again', width / 2, height / 2 + 30);
}

// =============================================
// Classes (With Damage Feedback)
// =============================================

class BadFood {
  constructor(img) {
    this.img = img;
    this.size = 40;
    this.x = random(40, 560);
    this.y = random(40, 360);
    this.hp = 20;
    this.shake = 0; // For visual feedback
  }

  takeDamage() {
    this.hp -= 1;
    this.shake = 5; // Trigger shake
  }

  display() {
    push();
    let sx = random(-this.shake, this.shake);
    translate(this.x + sx, this.y);
    imageMode(CENTER);
    
    // Hit Flash effect
    if (this.shake > 0) {
      tint(255, 0, 0); // Flash Red when hit
      this.shake *= 0.9;
    }
    image(this.img, 0, 0, this.size, this.size);
    pop();

    // Health Bar
    fill(200, 0, 0); rect(this.x - 20, this.y - 30, 40, 5);
    fill(0, 200, 0); rect(this.x - 20, this.y - 30, 40 * (this.hp/20), 5);
  }

  hits(player) { return dist(this.x, this.y, player.x, player.y) < 35; }
  moveRandom() { this.x = random(40, 560); this.y = random(40, 360); }
}

// [Keep your existing Particle, Player, and Food classes below this!]