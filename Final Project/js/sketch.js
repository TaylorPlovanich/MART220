// =============================================
// MART 220 - Final Project: CRAB-MAN (Maze Edition)
// =============================================

let player, playerBody;
let goodFoods = [];   
let badFoods = [];    
let walls; // p5.play Group for the maze
let score = 0;
let health = 3;
let gameStarted = false;
let gameOver = false;
let gameWon = false;

// Assets
let idleImgs = [], runImgs = [], deadImgs = [];
let goodFoodImg, badFoodImg, bgMusic, goodFoodSnd, badFoodSnd;

// --- 1. THE MAZE MAP ---
// 1 = Wall, 0 = Path, 2 = Player Start, 3 = Crab, 4 = Enemy
const mazeMap = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,0,0,0,0,1,3,3,3,0,0,0,3,1],
  [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1],
  [1,3,1,3,3,3,0,3,3,3,1,3,1,3,1],
  [1,0,1,0,1,1,1,1,1,0,1,0,1,0,1],
  [1,3,0,3,0,0,4,0,0,3,0,3,0,3,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];
const tileSize = 40;

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
  new Canvas(15 * tileSize, 7 * tileSize); // Matches mazeMap dimensions
  bgMusic.setLoop(true);
  initMaze();
}

function initMaze() {
  score = 0; health = 3; 
  gameOver = false; gameWon = false;
  goodFoods = []; badFoods = [];
  
  walls = new Group();
  walls.collider = 'static';
  walls.shapeColor = color(30, 30, 100); // Classic Blue Maze

  // Parse the Map
  for (let r = 0; r < mazeMap.length; r++) {
    for (let c = 0; c < mazeMap[r].length; c++) {
      let x = c * tileSize + tileSize/2;
      let y = r * tileSize + tileSize/2;
      
      if (mazeMap[r][c] === 1) {
        new walls.Sprite(x, y, tileSize, tileSize);
      } else if (mazeMap[r][c] === 2) {
        player = new Player(idleImgs, runImgs, deadImgs, x, y);
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

function draw() {
  background(10); // Dark arcade background

  if (!gameStarted) {
    drawStartScreen();
    if (mouseIsPressed || keyIsPressed) { gameStarted = true; bgMusic.play(); }
    return;
  }

  if (!gameOver && !gameWon) {
    // Maze Controls
    playerBody.velocity.x = 0; playerBody.velocity.y = 0;
    if (keyIsDown(LEFT_ARROW))  playerBody.velocity.x = -3;
    if (keyIsDown(RIGHT_ARROW)) playerBody.velocity.x = 3;
    if (keyIsDown(UP_ARROW))    playerBody.velocity.y = -3;
    if (keyIsDown(DOWN_ARROW))  playerBody.velocity.y = 3;

    playerBody.collide(walls);
    player.x = playerBody.x; player.y = playerBody.y;
    player.update(false);

    // Eating Crabs
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
        playerBody.x = tileSize * 1.5; playerBody.y = tileSize * 1.5; // Reset to start
        if (health <= 0) { gameOver = true; bgMusic.stop(); }
      }
    }

    if (goodFoods.length === 0) gameWon = true;

  } else {
    player.update(true);
  }

  player.display();
  drawHUD();
  if (gameOver) drawGameOver();
  if (gameWon) drawGameWon();
}

// --- HUD & UI (Forcing Font) ---
function drawHUD() {
  push(); textFont('sans-serif'); fill(255); textAlign(LEFT, TOP);
  text('Crabs Eaten: ' + score, 10, 10);
  textAlign(RIGHT, TOP); fill(255, 80, 120);
  text('♥ '.repeat(health), width - 10, 10); pop();
}

function drawStartScreen() {
  background(0); fill(255); textAlign(CENTER, CENTER); textFont('sans-serif');
  textSize(30); text('CRAB-MAN', width/2, height/2 - 20);
  textSize(15); text('Clear the maze of crabs! Avoid the Skulls.', width/2, height/2 + 20);
}

function drawGameOver() { background(0, 150); fill(255, 0, 0); text('GAME OVER', width/2, height/2); }
function drawGameWon() { background(0, 150); fill(0, 255, 0); text('MAZE CLEARED!', width/2, height/2); }

// --- UPDATED CLASSES ---

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
    // Simple "Bounce off walls" AI
    for (let wall of walls) {
      if (dist(this.x, this.y, wall.x, wall.y) < 30) {
        this.vx *= -1; // Reverse direction on hit
        this.x += this.vx * 2; 
      }
    }
  }
}

// ... [Keep your Player class from the previous version] ...