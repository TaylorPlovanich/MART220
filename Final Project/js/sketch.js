// =============================================
// MART 220 - Final Project: CRAB-MAN (Maze Edition)
// =============================================

// --- Global Variables ---
let player, playerBody;
let goodFoods = [];   
let badFoods = [];    
let walls; 
let score = 0;
let health = 3;
let gameStarted = false;
let gameOver = false;
let gameWon = false;

// Assets
let idleImgs = [], runImgs = [], deadImgs = [];
let goodFoodImg, badFoodImg;
let bgMusic, goodFoodSnd, badFoodSnd;

// --- 1. THE MAZE MAP ---
// 1 = Wall, 0 = Path, 2 = Player Start, 3 = Crab, 4 = Enemy (Skull)
const mazeMap = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,3,3,3,3,1,3,3,3,0,0,0,3,1],
  [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1],
  [1,3,1,3,3,3,0,3,3,3,1,3,1,3,1],
  [1,0,1,0,1,1,1,1,1,0,1,0,1,0,1],
  [1,3,0,3,0,0,4,0,0,3,0,3,4,3,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];
const tileSize = 40;

// --- Preload ---
function preload() {
  // Load Character Animations
  for (let i = 0; i <= 9; i++) {
    let num = nf(i, 3);
    idleImgs.push(loadImage('images/Idle' + num + '.png'));
    runImgs.push(loadImage('images/Run__' + num + '.png'));
    deadImgs.push(loadImage('images/Dead' + num + '.png'));
  }
  // Load Food & Enemy
  goodFoodImg = loadImage('images/crab_meat.png');
  badFoodImg  = loadImage('images/bad_food.png');
  // Load Audio
  bgMusic     = loadSound('sounds/background.mp3');
  goodFoodSnd = loadSound('sounds/good_food.mp3');
  badFoodSnd  = loadSound('sounds/bad_food.mp3');
}

// --- Setup ---
function setup() {
  new Canvas(15 * tileSize, 7 * tileSize); 
  bgMusic.setLoop(true);
  initMaze();
}

// --- Initialize or Reset the Maze ---
function initMaze() {
  score = 0; 
  health = 3; 
  gameOver = false; 
  gameWon = false;
  goodFoods = []; 
  badFoods = [];
  
  // Create Walls Group
  if (walls) walls.removeAll();
  walls = new Group();
  walls.collider = 'static';
  walls.shapeColor = color(40, 40, 150); // Arcade Blue

  // Parse the Map to spawn Sprites
  for (let r = 0; r < mazeMap.length; r++) {
    for (let c = 0; c < mazeMap[r].length; c++) {
      let x = c * tileSize + tileSize/2;
      let y = r * tileSize + tileSize/2;
      
      if (mazeMap[r][c] === 1) {
        new walls.Sprite(x, y, tileSize, tileSize);
      } else if (mazeMap[r][c] === 2) {
        player = new Player(idleImgs, runImgs, deadImgs, x, y);
        if (playerBody) playerBody.remove();
        playerBody = new Sprite(x, y, 25, 25);
        playerBody.rotationLock = true;
        playerBody.visible = false;
      } else if (mazeMap[r][c] === 3) {
        goodFoods.push(new Food(goodFoodImg, x, y));
      } else if (mazeMap[r][c] === 4) {
        badFoods.push(new BadFood(badFoodImg, x, y));
      }
    }
  }
}

// --- Draw Loop ---
function draw() {
  background(10); 

  if (!gameStarted) {
    drawStartScreen();
    if (mouseIsPressed || keyIsPressed) { 
      gameStarted = true; 
      bgMusic.play(); 
    }
    return;
  }

  if (!gameOver && !gameWon) {
    // Basic Maze Controls
    playerBody.velocity.x = 0; 
    playerBody.velocity.y = 0;
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65))  playerBody.velocity.x = -3;
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) playerBody.velocity.x = 3;
    if (keyIsDown(UP_ARROW) || keyIsDown(87))    playerBody.velocity.y = -3;
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83))  playerBody.velocity.y = 3;

    playerBody.collide(walls);
    
    // Sync Visuals to Physics Body
    player.x = playerBody.x; 
    player.y = playerBody.y;
    player.update(false);

    // Crab Collection
    for (let i = goodFoods.length - 1; i >= 0; i--) {
      goodFoods[i].display();
      if (dist(player.x, player.y, goodFoods[i].x, goodFoods[i].y) < 20) {
        goodFoods.splice(i, 1);
        score++;
        goodFoodSnd.play();
      }
    }

    // Ghost/Enemy Logic
    for (let ghost of badFoods) {
      ghost.display();
      ghost.moveInMaze(walls);
      if (dist(player.x, player.y, ghost.x, ghost.y) < 25) {
        health--;
        badFoodSnd.play();
        // Reset Player position on hit
        playerBody.x = tileSize * 1.5; 
        playerBody.y = tileSize * 1.5;
        if (health <= 0) { 
          gameOver = true; 
          bgMusic.stop(); 
        }
      }
    }

    if (goodFoods.length === 0) gameWon = true;

  } else {
    player.update(true); // Death animation
    if (keyIsDown(82)) { // 'R' to Restart
      initMaze();
      bgMusic.play();
    }
  }

  player.display();
  drawHUD();
  if (gameOver) drawGameOver();
  if (gameWon) drawGameWon();
}

// --- UI Functions ---
function drawHUD() {
  push(); 
  textFont('sans-serif'); 
  fill(255); 
  textAlign(LEFT, TOP);
  textSize(16);
  text('Crabs Eaten: ' + score, 15, 10);
  textAlign(RIGHT, TOP); 
  fill(255, 80, 120);
  text('♥ '.repeat(health), width - 15, 10); 
  pop();
}

function drawStartScreen() {
  push();
  background(0); 
  fill(255); 
  textAlign(CENTER, CENTER); 
  textFont('sans-serif');
  textSize(32); text('CRAB-MAN', width/2, height/2 - 20);
  textSize(16); text('Clear the maze! Avoid the Skulls.', width/2, height/2 + 20);
  pop();
}

function drawGameOver() { 
  push();
  background(0, 150); 
  fill(255, 0, 0); 
  textAlign(CENTER, CENTER);
  textFont('sans-serif');
  textSize(40); text('GAME OVER', width/2, height/2); 
  textSize(18); fill(255); text('Press R to restart', width/2, height/2 + 40);
  pop();
}

function drawGameWon() { 
  push();
  background(0, 150); 
  fill(0, 255, 0); 
  textAlign(CENTER, CENTER);
  textFont('sans-serif');
  textSize(40); text('MAZE CLEARED!', width/2, height/2); 
  textSize(18); fill(255); text('Press R to play again', width/2, height/2 + 40);
  pop();
}

// =============================================
// CLASSES
// =============================================

class Food {
  constructor(img, x, y) { this.img = img; this.x = x; this.y = y; }
  display() { image(this.img, this.x, this.y, 25, 25); }
}

class BadFood {
  constructor(img, x, y) {
    this.img = img; this.x = x; this.y = y;
    this.vx = 2; this.vy = 0;
  }
  display() { image(this.img, this.x, this.y, 30, 30); }
  moveInMaze(walls) {
    this.x += this.vx; this.y += this.vy;
    // Simple "Bounce off walls" AI for patrolling
    for (let wall of walls) {
      if (dist(this.x, this.y, wall.x, wall.y) < 30) {
        this.vx *= -1; 
        this.x += this.vx * 2; 
      }
    }
  }
}

class Player {
  constructor(idleImgs, runImgs, deadImgs, x, y) {
    this.x = x; this.y = y; this.size = 50;
    this.idleImgs = idleImgs; this.runImgs = runImgs; this.deadImgs = deadImgs;
    this.state = 'idle'; this.frameIndex = 0; this.animTimer = 0; this.animSpeed = 6; this.flipped = false;
  }
  update(isGameOver) {
    if (isGameOver) { this.state = 'dead'; this.animate(); return; }
    let moving = (abs(playerBody.velocity.x) > 0.1 || abs(playerBody.velocity.y) > 0.1);
    if (playerBody.velocity.x < 0) this.flipped = true;
    if (playerBody.velocity.x > 0) this.flipped = false;
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