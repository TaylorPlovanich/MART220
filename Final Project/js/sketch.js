// =============================================
// MART 220 - FINAL PROJECT: CRAB-MAN PRO
// =============================================

let player, playerBody;
let goodFoods = [], badFoods = [], walls;
let score = 0, health = 3, currentLevel = 0; 
let gameState = "START"; 
let powerUpActive = false, powerUpTimer = 0;

let idleImgs = [], runImgs = [], deadImgs = [];
let goodFoodImg, badFoodImg, bgMusic, goodFoodSnd, badFoodSnd;

const tileSize = 50;

// --- 3 UNIQUE MAZE LAYOUTS ---
const levels = [
  [ // Level 1
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,3,3,3,1,3,3,3,3,3,1],
    [1,3,1,1,3,1,3,1,1,1,3,1],
    [1,4,3,3,3,0,3,3,4,3,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  [ // Level 2
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,0,0,4,1,3,3,3,4,3,1],
    [1,3,1,1,1,1,0,1,1,1,0,1],
    [1,3,3,3,3,3,3,3,3,3,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  [ // Level 3
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,4,4,4,1,4,4,4,4,3,1],
    [1,0,1,1,1,1,1,1,1,1,0,1],
    [1,3,3,3,3,3,3,3,3,3,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1]
  ]
];

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
  // Set canvas to match the largest possible maze
  new Canvas(12 * tileSize, 5 * tileSize);
  bgMusic.setLoop(true);
}

function initLevel() {
  goodFoods = []; 
  badFoods = [];
  if (walls) walls.removeAll();
  walls = new Group();
  walls.collider = 'static';

  let currentMap = levels[currentLevel];

  for (let r = 0; r < currentMap.length; r++) {
    for (let c = 0; c < currentMap[r].length; c++) {
      let x = c * tileSize + tileSize/2;
      let y = r * tileSize + tileSize/2;
      
      let type = currentMap[r][c];
      if (type === 1) {
        let w = new walls.Sprite(x, y, tileSize, tileSize);
        w.color = (currentLevel === 0) ? 'blue' : (currentLevel === 1) ? 'red' : 'purple';
      } else if (type === 2) {
        player = new Player(idleImgs, runImgs, deadImgs, x, y);
        if (playerBody) playerBody.remove();
        playerBody = new Sprite(x, y, 30, 30);
        playerBody.rotationLock = true;
        playerBody.visible = false;
      } else if (type === 3) {
        goodFoods.push(new Food(goodFoodImg, x, y));
      } else if (type === 4) {
        badFoods.push(new BadFood(badFoodImg, x, y));
      }
    }
  }
}

function draw() {
  background(15);

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
  // Simple Grid Controls
  playerBody.vel.x = 0; playerBody.vel.y = 0;
  let s = 4;
  if (kb.pressing('left'))  playerBody.vel.x = -s;
  if (kb.pressing('right')) playerBody.vel.x = s;
  if (kb.pressing('up'))    playerBody.vel.y = -s;
  if (kb.pressing('down'))  playerBody.vel.y = s;

  playerBody.collide(walls);
  player.x = playerBody.x; player.y = playerBody.y;
  player.update(health <= 0);

  if (powerUpActive) {
    powerUpTimer--;
    if (powerUpTimer <= 0) powerUpActive = false;
  }

  // Collection
  for (let i = goodFoods.length - 1; i >= 0; i--) {
    goodFoods[i].display();
    if (dist(player.x, player.y, goodFoods[i].x, goodFoods[i].y) < 30) {
      if (goodFoods[i].isPowerUp) {
        powerUpActive = true;
        powerUpTimer = 300; 
      }
      goodFoods.splice(i, 1);
      score += 10;
      goodFoodSnd.play();
    }
  }

  // Enemies
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
        playerBody.x = tileSize * 1.5; 
        playerBody.y = tileSize * 1.5;
        if (health <= 0) gameState = "GAMEOVER";
      }
    }
  }

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
    if (!bgMusic.isPlaying()) bgMusic.play();
    initLevel();
  } else if ((gameState === "GAMEOVER" || gameState === "WIN") && key === 'r') {
    currentLevel = 0; score = 0; health = 3;
    gameState = "START";
  }
}

// --- UI SCREENS ---
function drawStartScreen() {
  fill(255); textAlign(CENTER, CENTER); textFont('sans-serif');
  textSize(32); text("CRAB-MAN PRO", width/2, height/2 - 20);
  textSize(14); text("Press any key to begin!", width/2, height/2 + 20);
}

function drawHUD() {
  push(); textFont('sans-serif'); fill(255); textSize(14);
  text(`Level: ${currentLevel + 1} | Score: ${score}`, 20, 20);
  textAlign(RIGHT); text("♥ ".repeat(health), width - 20, 20);
  pop();
}

function drawGameOver() {
  background(0, 150); fill(255, 0, 0); textAlign(CENTER, CENTER);
  textSize(40); text("GAME OVER", width/2, height/2);
}

function drawGameWon() {
  background(0, 150); fill(0, 255, 0); textAlign(CENTER, CENTER);
  textSize(40); text("YOU WIN!", width/2, height/2);
}

// --- CLASSES ---
class Food {
  constructor(img, x, y) {
    this.img = img; this.x = x; this.y = y;
    this.isPowerUp = random() < 0.2; 
  }
  display() {
    if (this.isPowerUp) tint(255, 215, 0); 
    image(this.img, this.x, this.y, 25, 25);
    noTint();
  }
}

class BadFood {
  constructor(img, x, y) {
    this.img = img; this.x = x; this.y = y;
    this.vx = 2; this.vy = 0;
  }
  display(scared) {
    if (scared) tint(100, 100, 255); 
    image(this.img, this.x, this.y, 30, 30);
    noTint();
  }
  move(walls) {
    this.x += this.vx;
    for (let w of walls) {
      if (dist(this.x, this.y, w.x, w.y) < 35) {
        this.vx *= -1; this.x += this.vx * 2;
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
  update(dead) {
    if (dead) { this.state = 'dead'; }
    else {
      let moving = (abs(playerBody.vel.x) > 0.1 || abs(playerBody.vel.y) > 0.1);
      if (playerBody.vel.x < 0) this.flipped = true;
      if (playerBody.vel.x > 0) this.flipped = false;
      this.state = moving ? 'run' : 'idle';
    }
    this.animTimer++;
    if (this.animTimer >= this.animSpeed) {
      this.animTimer = 0;
      this.frameIndex = (this.frameIndex + 1) % this.currentImages().length;
    }
  }
  currentImages() {
    if (this.state === 'run') return this.runImgs;
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