// =============================================
// MART 220 - FINAL PROJECT: CRAB-MAN PRO
// Improved Version
// =============================================

let player, playerBody;
let goodFoods = [], badFoods = [], walls;
let score = 0, health = 3, currentLevel = 0;
let gameState = "START";
let powerUpActive = false, powerUpTimer = 0;
let invincibleTimer = 0;
let totalGoodFoods = 0;
let highScore = 0;
let particles = [];

let idleImgs = [], runImgs = [], deadImgs = [], slideImgs = [], jumpImgs = [];
let badFoodImg, bgMusic, goodFoodSnd, badFoodSnd;

const tileSize = 40;

// --- MAZE LAYOUTS (20 wide x 14 tall) ---
// Wide 2-tile corridors so player never gets stuck.
// 0 = open space, 1 = wall, 2 = player start
// 3 = good food dot, 4 = bad food enemy, 5 = power pellet
const levels = [
  [ // Level 1 — Open Classic
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,1,1,3,3,1,1,3,3,1,1,3,3,1,1,3,3,1],
    [1,5,3,1,1,3,3,1,1,3,3,1,1,3,3,1,1,3,5,1],
    [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,1,1,3,3,1,1,0,0,1,1,3,3,1,1,3,3,1],
    [1,3,3,1,1,3,3,1,1,0,0,1,1,3,3,1,1,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,5,3,1,1,3,3,1,1,3,3,1,1,3,3,1,1,3,5,1],
    [1,3,3,1,1,4,3,1,1,3,3,1,1,3,4,1,1,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,1,1,3,3,1,1,3,3,1,1,3,3,1,1,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  [ // Level 2 — Island Blocks
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,1,1,1,3,3,1,1,1,3,3,1,1,1,3,3,3,1],
    [1,5,3,1,1,1,3,3,1,1,1,3,3,1,1,1,3,3,5,1],
    [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,1,4,3,3,1,1,3,3,1,1,3,3,4,1,3,3,1],
    [1,3,3,1,1,3,3,1,1,3,3,1,1,3,3,1,1,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,1,1,3,3,1,4,3,3,4,1,3,3,1,1,3,3,1],
    [1,5,3,1,1,3,3,1,1,3,3,1,1,3,3,1,1,3,5,1],
    [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,1,1,1,3,3,1,1,1,3,3,1,1,1,3,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  [ // Level 3 — Gauntlet
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,1,3,3,1,3,3,1,3,3,1,3,3,1,3,3,3,1],
    [1,5,3,1,3,3,1,3,3,1,3,3,1,3,3,1,3,3,5,1],
    [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,1,4,3,1,3,3,1,1,3,3,1,4,3,1,3,3,1],
    [1,3,3,1,1,3,1,3,3,1,1,3,3,1,1,3,1,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,1,1,4,1,3,4,3,3,4,3,1,4,1,1,3,3,1],
    [1,5,3,1,1,3,1,3,3,3,3,3,3,1,3,1,1,3,5,1],
    [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,1,3,3,1,3,3,1,3,3,1,3,3,1,3,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ]
];

const levelColors = [
  { wall: [30, 80, 200], wallStroke: [80, 140, 255], bg: [5, 5, 30] },
  { wall: [180, 30, 30], wallStroke: [255, 80, 80], bg: [25, 5, 5] },
  { wall: [100, 20, 180], wallStroke: [180, 80, 255], bg: [15, 5, 25] }
];

// =============================================
// PRELOAD
// =============================================
function preload() {
  for (let i = 0; i <= 9; i++) {
    let num = nf(i, 3);
    idleImgs.push(loadImage('images/Idle' + num + '.png'));
    runImgs.push(loadImage('images/Run__' + num + '.png'));
    deadImgs.push(loadImage('images/Dead' + num + '.png'));
    slideImgs.push(loadImage('images/Slide__' + num + '.png'));
    jumpImgs.push(loadImage('images/Jump__' + num + '.png'));
  }
  badFoodImg = loadImage('images/bad_food.png');
  bgMusic     = loadSound('sounds/background.mp3');
  goodFoodSnd = loadSound('sounds/good_food.mp3');
  badFoodSnd  = loadSound('sounds/bad_food.mp3');
}

// =============================================
// SETUP
// =============================================
function setup() {
  new Canvas(20 * tileSize, 14 * tileSize);
  world.gravity.y = 0;
  bgMusic.setLoop(true);
}

// =============================================
// LEVEL INIT
// =============================================
function initLevel() {
  goodFoods = [];
  badFoods = [];
  particles = [];
  powerUpActive = false;
  powerUpTimer = 0;
  invincibleTimer = 0;

  if (walls) walls.deleteAll();
  walls = new Group();
  walls.collider = 'static';

  let map = levels[currentLevel];
  let col = levelColors[currentLevel];

  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[r].length; c++) {
      let x = c * tileSize + tileSize / 2;
      let y = r * tileSize + tileSize / 2;
      let type = map[r][c];

      if (type === 1) {
        let w = new walls.Sprite(x, y, tileSize, tileSize);
        w.color = color(col.wall[0], col.wall[1], col.wall[2]);
        w.stroke = color(col.wallStroke[0], col.wallStroke[1], col.wallStroke[2]);
        w.strokeWeight = 1.5;
      } else if (type === 2) {
        if (player) {
          player.x = x; player.y = y;
          player.frameIndex = 0; player.state = 'idle';
        } else {
          player = new Player(x, y);
        }
        if (playerBody) {
          playerBody.x = x; playerBody.y = y;
          playerBody.vel.x = 0; playerBody.vel.y = 0;
        } else {
          playerBody = new Sprite(x, y, 22, 22);
          playerBody.rotationLock = true;
          playerBody.visible = false;
        }
      } else if (type === 3) {
        goodFoods.push(new Food(x, y, false));
      } else if (type === 4) {
        badFoods.push(new BadFood(x, y));
      } else if (type === 5) {
        goodFoods.push(new Food(x, y, true)); // power pellet
      }
    }
  }
  totalGoodFoods = goodFoods.length;
}

// =============================================
// DRAW LOOP
// =============================================
function draw() {
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

// =============================================
// GAME LOGIC
// =============================================
function updateGameLogic() {
  let col = levelColors[currentLevel];
  background(col.bg[0], col.bg[1], col.bg[2]);

  // Draw grid dots for un-collected cells
  drawFloor();

  // --- Player Movement ---
  playerBody.vel.x = 0;
  playerBody.vel.y = 0;
  let speed = 90;
  let moving = false;

  if (kb.pressing('left') || kb.pressing('a')) {
    playerBody.vel.x = -speed;
    moving = true;
  }
  if (kb.pressing('right') || kb.pressing('d')) {
    playerBody.vel.x = speed;
    moving = true;
  }
  if (kb.pressing('up') || kb.pressing('w')) {
    playerBody.vel.y = -speed;
    moving = true;
  }
  if (kb.pressing('down') || kb.pressing('s')) {
    playerBody.vel.y = speed;
    moving = true;
  }

  playerBody.collide(walls);

  // Sync visual player to physics body
  player.x = playerBody.x;
  player.y = playerBody.y;

  // Determine animation state
  let dead = health <= 0;
  let sliding = moving && (kb.pressing('shift') || kb.pressing('control'));
  player.update(dead, moving, sliding);

  // --- Power-Up Timer ---
  if (powerUpActive) {
    powerUpTimer--;
    if (powerUpTimer <= 0) powerUpActive = false;
  }

  // --- Invincibility Flash Timer ---
  if (invincibleTimer > 0) invincibleTimer--;

  // --- Particles ---
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].done()) particles.splice(i, 1);
  }

  // --- Good Food Collection ---
  for (let i = goodFoods.length - 1; i >= 0; i--) {
    goodFoods[i].display();
    if (dist(player.x, player.y, goodFoods[i].x, goodFoods[i].y) < 26) {
      let isPower = goodFoods[i].isPowerUp;
      spawnParticles(goodFoods[i].x, goodFoods[i].y, isPower ? [255,215,0] : [100,255,100]);
      goodFoods.splice(i, 1);

      if (isPower) {
        powerUpActive = true;
        powerUpTimer = 400;
        score += 20;
      } else {
        score += 10;
      }
      if (score > highScore) highScore = score;
      goodFoodSnd.play();
    }
  }

  // --- Bad Food (Enemy) Logic ---
  for (let i = badFoods.length - 1; i >= 0; i--) {
    badFoods[i].update(walls);
    badFoods[i].display(powerUpActive);

    if (dist(player.x, player.y, badFoods[i].x, badFoods[i].y) < 28) {
      if (powerUpActive) {
        spawnParticles(badFoods[i].x, badFoods[i].y, [50,100,255]);
        badFoods.splice(i, 1);
        score += 50;
        if (score > highScore) highScore = score;
      } else if (invincibleTimer <= 0) {
        health--;
        invincibleTimer = 90; // 1.5 seconds of invincibility
        badFoodSnd.play();
        spawnParticles(player.x, player.y, [255, 50, 50]);
        // Respawn player at start
        respawnPlayer();
        if (health <= 0) {
          gameState = "GAMEOVER";
        }
      }
    }
  }

  // --- Level Complete ---
  if (goodFoods.length === 0) {
    if (currentLevel < levels.length - 1) {
      currentLevel++;
      initLevel();
    } else {
      gameState = "WIN";
    }
  }

  // Draw player (with invincibility flicker)
  if (invincibleTimer <= 0 || frameCount % 6 < 3) {
    player.display();
  }

  // Draw HUD on top
  drawHUD();
}

function respawnPlayer() {
  let map = levels[currentLevel];
  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[r].length; c++) {
      if (map[r][c] === 2) {
        playerBody.x = c * tileSize + tileSize / 2;
        playerBody.y = r * tileSize + tileSize / 2;
        playerBody.vel.x = 0;
        playerBody.vel.y = 0;
        return;
      }
    }
  }
}

// =============================================
// FLOOR DECORATION
// =============================================
function drawFloor() {
  let map = levels[currentLevel];
  noStroke();
  fill(40, 40, 60, 120);
  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[r].length; c++) {
      if (map[r][c] !== 1) {
        rect(c * tileSize, r * tileSize, tileSize, tileSize);
      }
    }
  }
}

// =============================================
// PARTICLES
// =============================================
function spawnParticles(x, y, col) {
  for (let i = 0; i < 10; i++) {
    particles.push(new Particle(x, y, col));
  }
}

class Particle {
  constructor(x, y, col) {
    this.x = x; this.y = y;
    this.vx = random(-3, 3);
    this.vy = random(-3, 3);
    this.alpha = 255;
    this.size = random(4, 10);
    this.col = col;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.92;
    this.vy *= 0.92;
    this.alpha -= 12;
    this.size *= 0.95;
  }
  display() {
    noStroke();
    fill(this.col[0], this.col[1], this.col[2], this.alpha);
    ellipse(this.x, this.y, this.size);
  }
  done() { return this.alpha <= 0; }
}

// =============================================
// HUD
// =============================================
function drawHUD() {
  push();
  noStroke();
  fill(0, 0, 0, 160);
  rect(0, 0, width, 28);

  textFont('monospace');
  textSize(13);
  fill(255);
  textAlign(LEFT, CENTER);
  text(`LVL ${currentLevel + 1}`, 8, 14);

  textAlign(CENTER, CENTER);
  text(`SCORE: ${score}`, width / 2, 14);

  textAlign(RIGHT, CENTER);
  // Draw hearts
  let hx = width - 10;
  for (let i = 0; i < 3; i++) {
    fill(i < health ? color(255, 50, 50) : color(60, 60, 60));
    drawHeart(hx - i * 22, 14, 8);
  }

  // Power-up indicator
  if (powerUpActive) {
    let barW = map(powerUpTimer, 0, 400, 0, 100);
    fill(0, 0, 0, 120);
    rect(width / 2 - 52, height - 18, 104, 12, 6);
    fill(255, 215, 0);
    rect(width / 2 - 50, height - 17, barW, 9, 5);
    textAlign(CENTER, CENTER);
    textSize(10);
    fill(0);
    text("POWER!", width / 2, height - 12);
  }

  pop();
}

function drawHeart(x, y, r) {
  push();
  translate(x, y);
  beginShape();
  for (let a = 0; a < TWO_PI; a += 0.1) {
    let px = r * (16 * pow(sin(a), 3));
    let py = -r * (13 * cos(a) - 5 * cos(2*a) - 2 * cos(3*a) - cos(4*a));
    vertex(px / 16, py / 16);
  }
  endShape(CLOSE);
  pop();
}

// =============================================
// SCREENS
// =============================================
function drawStartScreen() {
  background(5, 5, 20);

  // Animated title glow
  let pulse = (sin(frameCount * 0.05) + 1) / 2;
  let glowSize = lerp(34, 38, pulse);

  noStroke();
  fill(30, 80, 200, 80);
  textAlign(CENTER, CENTER);
  textFont('monospace');
  textSize(glowSize + 4);
  text("CRAB-MAN PRO", width / 2, height / 2 - 50);

  fill(255);
  textSize(glowSize);
  text("CRAB-MAN PRO", width / 2, height / 2 - 50);

  fill(180);
  textSize(14);
  text("Collect all the food to advance!", width / 2, height / 2);
  text("Arrow keys or WASD to move", width / 2, height / 2 + 24);
  text("Grab GOLD pellets for power mode!", width / 2, height / 2 + 48);

  fill(lerp(100, 255, pulse));
  textSize(16);
  text("Press ANY KEY to start", width / 2, height / 2 + 85);

  fill(100);
  textSize(12);
  text(`High Score: ${highScore}`, width / 2, height / 2 + 115);
}

function drawGameOver() {
  // Freeze the game frame behind
  fill(0, 0, 0, 180);
  rect(0, 0, width, height);

  textAlign(CENTER, CENTER);
  textFont('monospace');

  fill(255, 40, 40);
  textSize(48);
  text("GAME OVER", width / 2, height / 2 - 40);

  fill(255);
  textSize(18);
  text(`Final Score: ${score}`, width / 2, height / 2 + 10);

  fill(180);
  textSize(14);
  text(`High Score: ${highScore}`, width / 2, height / 2 + 36);

  let pulse = (sin(frameCount * 0.08) + 1) / 2;
  fill(lerp(150, 255, pulse));
  textSize(15);
  text("Press R to restart", width / 2, height / 2 + 70);
}

function drawGameWon() {
  fill(0, 0, 0, 180);
  rect(0, 0, width, height);

  textAlign(CENTER, CENTER);
  textFont('monospace');

  // Rainbow cycling color
  colorMode(HSB);
  fill(frameCount % 360, 100, 100);
  colorMode(RGB);

  textSize(48);
  text("YOU WIN!", width / 2, height / 2 - 40);

  fill(255);
  textSize(18);
  text(`Final Score: ${score}`, width / 2, height / 2 + 10);
  text(`High Score: ${highScore}`, width / 2, height / 2 + 36);

  let pulse = (sin(frameCount * 0.08) + 1) / 2;
  fill(lerp(150, 255, pulse));
  textSize(15);
  text("Press R to play again", width / 2, height / 2 + 70);
}

// =============================================
// INPUT
// =============================================
function keyPressed() {
  if (gameState === "START") {
    gameState = "PLAY";
    if (!bgMusic.isPlaying()) bgMusic.play();
    initLevel();
  } else if ((gameState === "GAMEOVER" || gameState === "WIN") && (key === 'r' || key === 'R')) {
    currentLevel = 0;
    score = 0;
    health = 3;
    player = null;
    playerBody = null;
    gameState = "START";
  }
}

// =============================================
// FOOD CLASS
// =============================================
class Food {
  constructor(x, y, isPowerUp) {
    this.x = x;
    this.y = y;
    this.isPowerUp = isPowerUp;
    this.pulse = random(TWO_PI); // random phase for pulsing
  }

  display() {
    push();
    translate(this.x, this.y);
    noStroke();

    if (this.isPowerUp) {
      // Glowing power pellet
      let p = (sin(frameCount * 0.1 + this.pulse) + 1) / 2;
      let r = lerp(10, 14, p);
      fill(255, 215, 0, 80);
      ellipse(0, 0, r * 2.5);
      fill(255, 215, 0);
      ellipse(0, 0, r);
    } else {
      // Small food dot
      fill(200, 180, 100);
      ellipse(0, 0, 8, 8);
    }
    pop();
  }
}

// =============================================
// BAD FOOD (ENEMY) CLASS
// =============================================
class BadFood {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random([-1.2, 1.2]);
    this.vy = 0;
    this.speed = 1.2;
    this.dirTimer = 0;
    this.dirInterval = floor(random(40, 100));
    this.eyeAngle = 0;
    this.scared = false;
  }

  update(walls) {
    this.dirTimer++;

    // Occasionally try to change direction
    if (this.dirTimer >= this.dirInterval) {
      this.dirTimer = 0;
      this.dirInterval = floor(random(40, 100));
      let choices = [
        {vx: this.speed, vy: 0},
        {vx: -this.speed, vy: 0},
        {vx: 0, vy: this.speed},
        {vx: 0, vy: -this.speed}
      ];
      // Bias toward moving toward player
      if (player && !this.scared) {
        let dx = player.x - this.x;
        let dy = player.y - this.y;
        if (abs(dx) > abs(dy)) {
          choices.unshift({vx: this.speed * sign(dx), vy: 0});
        } else {
          choices.unshift({vx: 0, vy: this.speed * sign(dy)});
        }
      }
      let pick = choices[floor(random(choices.length))];
      this.vx = pick.vx;
      this.vy = pick.vy;
    }

    this.x += this.vx;
    this.y += this.vy;

    // Wall collision - reverse
    for (let w of walls) {
      let dx = this.x - w.x;
      let dy = this.y - w.y;
      let overlap = tileSize - 4;
      if (abs(dx) < overlap / 2 && abs(dy) < overlap / 2) {
        // Push out and reverse
        if (abs(this.vx) > 0) {
          this.vx *= -1;
          this.x += this.vx * 4;
        } else {
          this.vy *= -1;
          this.y += this.vy * 4;
        }
      }
    }

    // Keep in bounds
    this.x = constrain(this.x, tileSize, width - tileSize);
    this.y = constrain(this.y, tileSize, height - tileSize);

    // Update eye direction
    this.eyeAngle = atan2(this.vy, this.vx);
  }

  display(powerMode) {
    this.scared = powerMode;
    push();
    translate(this.x, this.y);

    if (powerMode) {
      // Scared mode: blue wobbly ghost
      let wobble = sin(frameCount * 0.3) * 2;
      fill(60, 80, 220);
      ellipse(0, 0, 30 + wobble, 30);
      // Scared face
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(10);
      text(">_<", 0, 1);
    } else {
      // Draw a little skull/monster
      fill(230, 80, 80);
      ellipse(0, -2, 28, 26);
      // Bottom bumps
      fill(230, 80, 80);
      ellipse(-9, 8, 10, 10);
      ellipse(0, 9, 10, 10);
      ellipse(9, 8, 10, 10);

      // Eyes
      let ex = cos(this.eyeAngle) * 5;
      let ey = sin(this.eyeAngle) * 5;
      fill(255);
      ellipse(-6, -3, 10, 10);
      ellipse(6, -3, 10, 10);
      fill(20);
      ellipse(-6 + ex * 0.4, -3 + ey * 0.4, 5, 5);
      ellipse(6 + ex * 0.4, -3 + ey * 0.4, 5, 5);

      // Use bad food image as overlay if loaded
      if (badFoodImg && badFoodImg.width > 1) {
        tint(255, 180);
        imageMode(CENTER);
        image(badFoodImg, 0, 0, 28, 28);
        noTint();
      }
    }
    pop();
  }
}

// =============================================
// PLAYER CLASS
// =============================================
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 52;
    this.state = 'idle';
    this.frameIndex = 0;
    this.animTimer = 0;
    this.animSpeed = 5;
    this.flipped = false;
  }

  currentImages() {
    if (this.state === 'dead')  return deadImgs;
    if (this.state === 'slide') return slideImgs.length ? slideImgs : runImgs;
    if (this.state === 'jump')  return jumpImgs.length ? jumpImgs : runImgs;
    if (this.state === 'run')   return runImgs;
    return idleImgs;
  }

  update(dead, moving, sliding) {
    if (dead) {
      this.state = 'dead';
      this.animSpeed = 8;
    } else if (sliding) {
      this.state = 'slide';
      this.animSpeed = 4;
    } else if (moving) {
      this.state = 'run';
      this.animSpeed = 5;
    } else {
      this.state = 'idle';
      this.animSpeed = 7;
    }

    // Flip direction
    if (playerBody.vel.x < -0.5) this.flipped = true;
    if (playerBody.vel.x > 0.5)  this.flipped = false;

    // Advance animation frame
    this.animTimer++;
    if (this.animTimer >= this.animSpeed) {
      this.animTimer = 0;
      let imgs = this.currentImages();
      // Dead animation stops on last frame
      if (this.state === 'dead') {
        this.frameIndex = min(this.frameIndex + 1, imgs.length - 1);
      } else {
        this.frameIndex = (this.frameIndex + 1) % imgs.length;
      }
    }
  }

  display() {
    let imgs = this.currentImages();
    if (!imgs || imgs.length === 0) return;

    push();
    imageMode(CENTER);
    translate(this.x, this.y);

    // Power-up glow
    if (powerUpActive) {
      let p = (sin(frameCount * 0.15) + 1) / 2;
      noStroke();
      fill(255, 215, 0, lerp(30, 90, p));
      ellipse(0, 0, this.size * 1.6);
    }

    if (this.flipped) scale(-1, 1);
    image(imgs[this.frameIndex], 0, 0, this.size, this.size);
    pop();
  }
}

// =============================================
// UTILITY
// =============================================
function sign(v) {
  return v > 0 ? 1 : v < 0 ? -1 : 0;
}