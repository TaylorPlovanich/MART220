// =============================================
// MART 220 - Final Project: Crab Collector
// =============================================

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

let idleImgs = [], runImgs = [], deadImgs = [];
let goodFoodImg, badFoodImg;
let bgMusic, goodFoodSnd, badFoodSnd;

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

function setup() {
  new Canvas(600, 400);
  bgMusic.setLoop(true);
  initGame(); 
}

function initGame() {
  score = 0;
  health = 3;
  gameOver = false;
  gameWon = false;
  goodFoods = [];
  badFoods = [];
  particles = [];
  
  player = new Player(idleImgs, runImgs, deadImgs);
  
  if (playerBody) playerBody.remove(); 
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
  if (!gameStarted) {
    gameStarted = true;
    bgMusic.play();
  }
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

    for (let f of goodFoods) {
      f.display();
      if (f.hits(player)) {
        score++;
        goodFoodSnd.play();
        f.moveRandom();
      }
    }

    for (let i = badFoods.length - 1; i >= 0; i--) {
      badFoods[i].display();
      if (badFoods[i].hits(player)) {
        health--;
        badFoodSnd.play();
        badFoods[i].moveRandom();
        if (health <= 0) { gameOver = true; bgMusic.stop(); }
      }

      if (keyIsDown(88)) {
        let d = dist(player.x, player.y, badFoods[i].x, badFoods[i].y);
        if (d < 100) {
          badFoods[i].takeDamage(); 
          createParticles(badFoods[i].x, badFoods[i].y);
          if (!goodFoodSnd.isPlaying()) {
             goodFoodSnd.rate(2.0); 
             goodFoodSnd.play();
          }
          if (badFoods[i].hp <= 0) badFoods.splice(i, 1);
        }
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].show();
      if (particles[i].finished()) particles.splice(i, 1);
    }

    if (badFoods.length === 0) { gameWon = true; bgMusic.stop(); }

  } else {
    player.update(true); 
  }

  player.display();
  drawHUD();
  if (gameOver) drawGameOver();
  if (gameWon)  drawGameWon();
}

function createParticles(x, y) {
  for (let i = 0; i < 5; i++) particles.push(new Particle(x, y));
}

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

// --- CLASSES ---

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-2, 2);
    this.vy = random(-4, -1);
    this.alpha = 255;
  }
  finished() { return this.alpha < 0; }
  update() { this.x += this.vx; this.y += this.vy; this.alpha -= 8; }
  show() {
    noStroke();
    fill(255, 150, 0, this.alpha);
    ellipse(this.x, this.y, 12);
  }
}

class Player {
  constructor(idleImgs, runImgs, deadImgs) {
    this.x = 300; this.y = 200; this.size = 64;
    this.idleImgs = idleImgs; this.runImgs = runImgs; this.deadImgs = deadImgs;
    this.state = 'idle'; this.frameIndex = 0; this.animTimer = 0; this.animSpeed = 6; this.flipped = false;
  }
  update(isGameOver) {
    if (isGameOver) { this.state = 'dead'; this.animate(); return; }
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
    push(); imageMode(CENTER); translate(this.x, this.y);
    if (this.flipped) scale(-1, 1);
    image(this.currentImages()[this.frameIndex], 0, 0, this.size, this.size);
    pop();
  }
}

class Food {
  constructor(img) {
    this.img = img; this.size = 40;
    this.x = random(this.size, width - this.size);
    this.y = random(this.size, height - this.size);
    this.timer = 0; this.moveInterval = int(random(120, 300));
  }
  update() {
    this.timer++;
    if (this.timer >= this.moveInterval) this.moveRandom();
  }
  moveRandom() {
    this.x = random(this.size, width - this.size);
    this.y = random(this.size, height - this.size);
    this.timer = 0;
  }
  display() { imageMode(CENTER); image(this.img, this.x, this.y, this.size, this.size); }
  hits(player) { return dist(this.x, this.y, player.x, player.y) < 40; }
}

class BadFood {
  constructor(img) {
    this.img = img; this.size = 40;
    this.x = random(40, 560); this.y = random(40, 360);
    this.hp = 20; this.shake = 0;
  }
  takeDamage() { this.hp -= 1; this.shake = 5; }
  display() {
    push();
    let sx = random(-this.shake, this.shake);
    translate(this.x + sx, this.y);
    imageMode(CENTER);
    if (this.shake > 0) { tint(255, 0, 0); this.shake *= 0.9; }
    image(this.img, 0, 0, this.size, this.size);
    pop();
    fill(200, 0, 0); rect(this.x - 20, this.y - 30, 40, 5);
    fill(0, 200, 0); rect(this.x - 20, this.y - 30, 40 * (this.hp/20), 5);
  }
  hits(player) { return dist(this.x, this.y, player.x, player.y) < 35; }
  moveRandom() { this.x = random(40, 560); this.y = random(40, 360); }
}