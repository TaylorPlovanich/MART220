// =============================================
// MART 220 - FINAL PROJECT: CRAB-MAN PRO
// =============================================

let player, playerBody;
let goodFoods = [], badFoods = [], walls;
let score = 0, health = 3, currentLevel = 0; // 0, 1, 2 for three levels
let gameState = "START"; 
let powerUpActive = false, powerUpTimer = 0;

// Assets
let idleImgs = [], runImgs = [], deadImgs = [];
let goodFoodImg, badFoodImg, bgMusic, goodFoodSnd, badFoodSnd;

// --- DYNAMIC MAZE LEVELS ---
const levels = [
  // Level 1: Classic Maze
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,0,0,0,0,1,3,0,0,0,0,0,3,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1],
    [1,3,1,3,3,3,0,3,3,3,1,3,1,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Level 2: The Vertical Challenge
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,3,1,3,0,0,4,0,0,3,1,3,3,1],
    [1,0,3,1,0,1,1,1,1,1,0,1,3,0,1],
    [1,3,0,0,3,0,0,0,0,0,3,0,0,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Level 3: The Gauntlet (Large)
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,0,4,0,0,0,4,0,0,0,4,0,3,1],
    [1,1,1,0,1,1,1,0,1,1,1,0,1,1,1],
    [1,3,0,0,0,3,0,0,0,3,0,0,0,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ]
];

const tileSize = 50; // Bigger tiles for a bigger maze

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
  // Dynamic Canvas based on maze size
  new Canvas(15 * tileSize, 5 * tileSize);
  bgMusic.setLoop(true);
}

function initLevel() {
  goodFoods = []; badFoods = [];
  if (walls) walls.removeAll();
  walls = new Group();
  walls.collider = 'static';

  let currentMap = levels[currentLevel];

  for (let r = 0; r < currentMap.length; r++) {
    for (let c = 0; c < currentMap[r].length; c++) {
      let x = c * tileSize + tileSize/2;
      let y = r * tileSize + tileSize/2;
      
      if (currentMap[r][c] === 1) {
        let w = new walls.Sprite(x, y, tileSize, tileSize);
        // Visual Variety: Change wall color per level
        if (currentLevel === 0) w.color = 'blue';
        else if (currentLevel === 1) w.color = 'red';
        else w.color = 'purple';
      } else if (currentMap[r][c] === 2) {
        player = new Player(idleImgs, runImgs, deadImgs, x, y);
        if (playerBody) playerBody.remove();
        playerBody = new Sprite(x, y, 30, 30);
        playerBody.rotationLock = true;
        playerBody.visible = false;
      } else if (currentMap[r][c] === 3) {
        goodFoods.push(new Food(goodFoodImg, x, y));
      } else if (currentMap[r][c] === 4) {
        badFoods.push(new BadFood(badFoodImg, x, y));
      }
    }
  }
}

function draw() {
  background(10);

  if (gameState === "START") {
    drawStartScreen();
  } else if (gameState === "PLAY") {
    updateGameLogic();
  } else if (gameState === "GAMEOVER") {
    drawGameOver();
  } else if (gameState === "WIN") {
    drawGameWon();
  }
}

function updateGameLogic() {
  // Movement logic
  playerBody.velocity.x = 0; playerBody.velocity.y = 0;
  if (keyIsDown(LEFT_ARROW))  playerBody.velocity.x = -4;
  if (keyIsDown(RIGHT_ARROW)) playerBody.velocity.x = 4;
  if (keyIsDown(UP_ARROW))    playerBody.velocity.y = -4;
  if (keyIsDown(DOWN_ARROW))  playerBody.velocity.y = 4;

  playerBody.collide(walls);
  player.x = playerBody.x; player.y = playerBody.y;
  player.update(health <= 0);

  // Power-up timer
  if (powerUpActive) {
    powerUpTimer--;
    if (powerUpTimer <= 0) powerUpActive = false;
  }

  // Crabs and Power-ups
  for (let i = goodFoods.length - 1; i >= 0; i--) {
    goodFoods[i].display();
    if (dist(player.x, player.y, goodFoods[i].x, goodFoods[i].y) < 30) {
      if (goodFoods[i].isPowerUp) {
        powerUpActive = true;
        powerUpTimer = 300; // 5 seconds
      }
      goodFoods.splice(i, 1);
      score += 10;
      goodFoodSnd.play();
    }
  }

  // Ghosts / Enemies
  for (let i = badFoods.length - 1; i >= 0; i--) {
    badFoods[i].display(powerUpActive);
    badFoods[i].move(walls);
    
    if (dist(player.x, player.y, badFoods[i].x, badFoods[i].y) < 30) {
      if (powerUpActive) {
        badFoods.splice(i, 1);
        score += 50;
      } else {
        health--;
        badFoodSnd.play();
        playerBody.x = tileSize * 1.5; playerBody.y = tileSize * 1.5;
        if (health <= 0) gameState = "GAMEOVER";
      }
    }
  }

  // Level Clear Logic
  if (goodFoods.length === 0) {
    if (currentLevel < 2) {
      currentLevel++;
      initLevel();
    } else {
      gameState = "WIN";
    }
  }

  player.display();
  drawHUD();
}

function keyPressed() {
  if (gameState === "START") {
    gameState = "PLAY";
    bgMusic.play();
    initLevel();
  } else if ((gameState === "GAMEOVER" || gameState === "WIN") && key === 'r') {
    currentLevel = 0; score = 0; health = 3;
    gameState = "START";
  }
}

// --- UI SCREENS (Forced font to fix rendering) ---
function drawStartScreen() {
  fill(255); textAlign(CENTER, CENTER); textFont('sans-serif');
  textSize(40); text("CRAB-MAN PRO", width/2, height/2 - 20);
  textSize(16); text("Press any key to start levels 1-3!", width/2, height/2 + 30);
}

function drawHUD() {
  push(); textFont('sans-serif'); fill(255); textSize(16);
  text(`Level: ${currentLevel + 1} | Score: ${score}`, 20, 20);
  if (powerUpActive) { fill(255, 255, 0); text("POWER UP ACTIVE", width/2, 20); }
  pop();
}

function drawGameOver() {
  background(0, 150); fill(255, 0, 0); textAlign(CENTER, CENTER); textFont('sans-serif');
  textSize(50); text("GAME OVER", width/2, height/2);
}

function drawGameWon() {
  background(0, 150); fill(0, 255, 0); textAlign(CENTER, CENTER); textFont('sans-serif');
  textSize(50); text("YOU WIN!", width/2, height/2);
}

// --- CLASSES ---
class Food {
  constructor(img, x, y) {
    this.img = img; this.x = x; this.y = y;
    this.isPowerUp = random() < 0.15; // 15% chance
  }
  display() {
    if (this.isPowerUp) tint(255, 215, 0); // Golden power-up
    image(this.img, this.x, this.y, 30, 30);
    noTint();
  }
}

class BadFood {
  constructor(img, x, y) {
    this.img = img; this.x = x; this.y = y;
    this.vx = 2; this.vy = 0;
  }
  display(scared) {
    if (scared) tint(100, 100, 255); // Scared ghosts turn blue
    image(this.img, this.x, this.y, 35, 35);
    noTint();
  }
  move(walls) {
    this.x += this.vx; this.y += this.vy;
    for (let w of walls) {
      if (dist(this.x, this.y, w.x, w.y) < 40) {
        this.vx *= -1; this.x += this.vx * 2;
      }
    }
  }
}

// Include your Player class here...