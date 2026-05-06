// =============================================
// MART 220 - FINAL PROJECT: CRAB-MAN PRO
// =============================================

let player, playerBody;
let goodFoods = [], badFoods = [], walls;
let score = 0, health = 3, currentLevel = 1;
let gameState = "START"; // START, PLAY, GAMEOVER, WIN
let powerUpActive = false, powerUpTimer = 0;

// Assets
let idleImgs = [], runImgs = [], deadImgs = [];
let goodFoodImg, badFoodImg, bgMusic, goodFoodSnd, badFoodSnd;

const mazeMap = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,0,0,0,0,1,3,0,0,0,0,0,3,1],
  [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1],
  [1,3,1,3,3,3,0,3,3,3,1,3,1,3,1],
  [1,0,1,0,1,1,1,1,1,0,1,0,1,0,1],
  [1,3,0,3,0,0,4,0,0,3,0,3,4,3,1],
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
  new Canvas(15 * tileSize, 7 * tileSize);
  bgMusic.setLoop(true);
}

function initLevel() {
  goodFoods = []; 
  badFoods = [];
  if (walls) walls.removeAll();
  walls = new Group();
  walls.collider = 'static';

  for (let r = 0; r < mazeMap.length; r++) {
    for (let c = 0; c < mazeMap[r].length; c++) {
      let x = c * tileSize + tileSize/2;
      let y = r * tileSize + tileSize/2;
      if (mazeMap[r][c] === 1) {
        let w = new walls.Sprite(x, y, tileSize, tileSize);
        // Change wall colors based on level
        if (currentLevel === 1) w.color = color(40, 40, 150);
        else if (currentLevel === 2) w.color = color(150, 40, 40);
        else w.color = color(40, 150, 40);
      } else if (mazeMap[r][c] === 2) {
        player = new Player(idleImgs, runImgs, deadImgs, x, y);
        if (playerBody) playerBody.remove();
        playerBody = new Sprite(x, y, 25, 25);
        playerBody.rotationLock = true;
        playerBody.visible = false;
      } else if (mazeMap[r][c] === 3 || (mazeMap[r][c] === 0 && random() < 0.3)) {
        goodFoods.push(new Food(goodFoodImg, x, y));
      } else if (mazeMap[r][c] === 4) {
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
    updateGame();
  } else if (gameState === "GAMEOVER") {
    drawGameOver();
  } else if (gameState === "WIN") {
    drawGameWon();
  }
}

function updateGame() {
  playerBody.velocity.x = 0; playerBody.velocity.y = 0;
  let speed = 3 + currentLevel; // Gets faster each level
  if (keyIsDown(LEFT_ARROW))  playerBody.velocity.x = -speed;
  if (keyIsDown(RIGHT_ARROW)) playerBody.velocity.x = speed;
  if (keyIsDown(UP_ARROW))    playerBody.velocity.y = -speed;
  if (keyIsDown(DOWN_ARROW))  playerBody.velocity.y = speed;

  playerBody.collide(walls);
  player.x = playerBody.x; player.y = playerBody.y;
  player.update(health <= 0);

  // Power-up logic
  if (powerUpActive) {
    powerUpTimer--;
    if (powerUpTimer <= 0) powerUpActive = false;
  }

  // Crabs / Pellets
  for (let i = goodFoods.length - 1; i >= 0; i--) {
    goodFoods[i].display();
    if (dist(player.x, player.y, goodFoods[i].x, goodFoods[i].y) < 25) {
      if (goodFoods[i].isSpecial) {
        powerUpActive = true;
        powerUpTimer = 300; // 5 seconds at 60fps
      }
      goodFoods.splice(i, 1);
      score += 10;
      goodFoodSnd.play();
    }
  }

  // Ghosts
  for (let i = badFoods.length - 1; i >= 0; i--) {
    badFoods[i].display(powerUpActive);
    badFoods[i].moveInMaze(walls, currentLevel);
    
    if (dist(player.x, player.y, badFoods[i].x, badFoods[i].y) < 25) {
      if (powerUpActive) {
        badFoods.splice(i, 1); // Eat the ghost!
        score += 100;
      } else {
        health--;
        badFoodSnd.play();
        playerBody.x = tileSize * 1.5; playerBody.y = tileSize * 1.5;
        if (health <= 0) gameState = "GAMEOVER";
      }
    }
  }

  if (goodFoods.length === 0) {
    if (currentLevel < 3) {
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
    currentLevel = 1; score = 0; health = 3;
    gameState = "PLAY";
    initLevel();
  }
}

// --- UI SCREENS ---
function drawStartScreen() {
  fill(255); textAlign(CENTER, CENTER); textFont('sans-serif');
  textSize(40); text("CRAB-MAN", width/2, height/2 - 40);
  textSize(18); text("Eat Crabs. Avoid Skulls.\nGolden Crabs let you eat the Skulls!\n\nPRESS ANY KEY TO START", width/2, height/2 + 40);
}

function drawHUD() {
  push(); textFont('sans-serif'); fill(255); textSize(16);
  text(`Score: ${score}  Level: ${currentLevel}`, 20, 25);
  textAlign(RIGHT); text("♥ ".repeat(health), width - 20, 25);
  if (powerUpActive) { fill(255, 215, 0); textAlign(CENTER); text("POWER UP ACTIVE!", width/2, 25); }
  pop();
}

function drawGameOver() {
  fill(255, 0, 0); textAlign(CENTER, CENTER); textSize(50);
  text("WASTED", width/2, height/2);
  fill(255); textSize(20); text("Press 'R' to Restart", width/2, height/2 + 50);
}

function drawGameWon() {
  fill(0, 255, 0); textAlign(CENTER, CENTER); textSize(50);
  text("GRAND CHAMPION", width/2, height/2);
  fill(255); textSize(20); text("Press 'R' to Play Again", width/2, height/2 + 50);
}

// --- CLASSES ---
class Food {
  constructor(img, x, y) {
    this.img = img; this.x = x; this.y = y;
    this.isSpecial = random() < 0.1; // 10% chance for power-up
  }
  display() {
    if (this.isSpecial) tint(255, 215, 0); 
    image(this.img, this.x, this.y, 25, 25);
    noTint();
  }
}

class BadFood {
  constructor(img, x, y) {
    this.img = img; this.x = x; this.y = y;
    this.vx = random([-2, 2]); this.vy = 0;
  }
  display(isScared) {
    if (isScared) tint(100, 100, 255); // Ghosts turn blue when scared
    image(this.img, this.x, this.y, 30, 30);
    noTint();
  }
  moveInMaze(walls, lvl) {
    this.x += this.vx; this.y += this.vy;
    for (let wall of walls) {
      if (dist(this.x, this.y, wall.x, wall.y) < 30) {
        this.vx *= -1; this.x += this.vx * 2;
        if (random() < 0.5) { // Occasional vertical shift
           this.vy = random([-2, 2]); this.vx = 0;
        }
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
      let moving = (abs(playerBody.velocity.x) > 0.1 || abs(playerBody.velocity.y) > 0.1);
      if (playerBody.velocity.x < 0) this.flipped = true;
      if (playerBody.velocity.x > 0) this.flipped = false;
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