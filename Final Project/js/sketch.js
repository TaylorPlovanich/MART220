// =============================================
// MART 220 - FINAL PROJECT: CRAB-MAN PRO
// =============================================

let score = 0, health = 3, currentLevel = 0;
let gameState = "START";
let powerUpActive = false, powerUpTimer = 0;
let invincibleTimer = 0;
let highScore = 0;
let particles = [];
let deadEnemies = []; // {col, row, timer} — waiting to respawn

// ── GRID-LOCKED PLAYER STATE ──────────────────────────────────────────────────
// The player always lives on exact tile centers.
// When a key is pressed we start a smooth slide to the next tile.
let playerCol = 1, playerRow = 1;
let playerX, playerY;        // current pixel position (interpolated)
let targetX,  targetY;       // pixel center of destination tile
let playerMoving  = false;
let moveProgress  = 0;
let startPX, startPY;        // pixel center we started from
const MOVE_SPEED  = 0.14;    // fraction of one tile per frame  ← tune here
let facingDir = 'right';
let queuedDir = null;

// Walls (p5play static sprites, used only for visual drawing)
let walls;

// Food
let goodFoods = [];  // plain objects {col,row,x,y,isPowerUp,phase}
let badFoods  = [];  // BadFood instances

// Images
let idleImgs = [], runImgs = [], deadImgs = [], slideImgs = [];
let badFoodImg, bgMusic, goodFoodSnd, badFoodSnd;

// Animation
let animState = 'idle', animFrame = 0, animTimer = 0;

const TILE = 44;

// ── MAPS ──────────────────────────────────────────────────────────────────────
// 0=open 1=wall 2=player_start 3=food 4=enemy 5=power_pellet
const levels = [
  [ // Level 1
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
  [ // Level 2
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
  [ // Level 3
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
  { wall:[30,80,200],  wallStroke:[80,140,255],  bg:[5,5,30]   },
  { wall:[180,30,30],  wallStroke:[255,80,80],   bg:[25,5,5]   },
  { wall:[100,20,180], wallStroke:[180,80,255],  bg:[15,5,25]  }
];

// ── PRELOAD ───────────────────────────────────────────────────────────────────
function preload() {
  for (let i = 0; i <= 9; i++) {
    let n = nf(i, 3);
    idleImgs.push( loadImage('images/Idle'    + n + '.png'));
    runImgs.push(  loadImage('images/Run__'   + n + '.png'));
    deadImgs.push( loadImage('images/Dead'    + n + '.png'));
    slideImgs.push(loadImage('images/Slide__' + n + '.png'));
  }
  badFoodImg  = loadImage('images/bad_food.png');
  bgMusic     = loadSound('sounds/background.mp3');
  goodFoodSnd = loadSound('sounds/good_food.mp3');
  badFoodSnd  = loadSound('sounds/bad_food.mp3');
}

// ── SETUP ─────────────────────────────────────────────────────────────────────
function setup() {
  new Canvas(20 * TILE, 14 * TILE);
  world.gravity.y = 0;
  allSprites.autoDraw = false; // we draw sprites manually so UI always renders on top
  bgMusic.setLoop(true);
}

// ── LEVEL INIT ────────────────────────────────────────────────────────────────
function initLevel() {
  goodFoods     = [];
  badFoods      = [];
  particles     = [];
  deadEnemies   = [];
  powerUpActive = false;
  powerUpTimer  = 0;
  invincibleTimer = 0;
  playerMoving  = false;
  moveProgress  = 0;
  queuedDir     = null;
  animState     = 'idle';
  animFrame     = 0;
  animTimer     = 0;

  if (walls) walls.deleteAll();
  walls = new Group();
  walls.collider = 'static';

  let map = levels[currentLevel];
  let col = levelColors[currentLevel];

  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[r].length; c++) {
      let px = c * TILE + TILE / 2;
      let py = r * TILE + TILE / 2;
      let t  = map[r][c];

      if (t === 1) {
        let w = new walls.Sprite(px, py, TILE, TILE);
        w.color       = color(col.wall[0],       col.wall[1],       col.wall[2]);
        w.stroke      = color(col.wallStroke[0], col.wallStroke[1], col.wallStroke[2]);
        w.strokeWeight = 1.5;
      } else if (t === 2) {
        playerCol = c; playerRow = r;
        playerX = px; playerY = py;
        targetX = px; targetY = py;
        startPX = px; startPY = py;
      } else if (t === 3) {
        goodFoods.push({ col:c, row:r, x:px, y:py, isPowerUp:false, phase:random(TWO_PI) });
      } else if (t === 4) {
        badFoods.push(new BadFood(c, r));
      } else if (t === 5) {
        goodFoods.push({ col:c, row:r, x:px, y:py, isPowerUp:true,  phase:random(TWO_PI) });
      }
    }
  }
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function isWall(c, r) {
  let map = levels[currentLevel];
  if (r < 0 || r >= map.length || c < 0 || c >= map[0].length) return true;
  return map[r][c] === 1;
}

// ── DRAW ──────────────────────────────────────────────────────────────────────
function draw() {
  if      (gameState === "START")    drawStartScreen();
  else if (gameState === "PLAY")     updateGameLogic();
  else if (gameState === "GAMEOVER") drawGameOver();
  else if (gameState === "WIN")      drawGameWon();
}

// ── MAIN GAME LOGIC ───────────────────────────────────────────────────────────
function updateGameLogic() {
  let col = levelColors[currentLevel];
  background(col.bg[0], col.bg[1], col.bg[2]);
  drawFloor();
  if (walls) walls.draw(); // draw walls now, before player/food/UI

  // ── READ INPUT (queue direction, never clear while key held) ──────────────
  if      (kb.pressing('left')  || kb.pressing('a')) queuedDir = 'left';
  else if (kb.pressing('right') || kb.pressing('d')) queuedDir = 'right';
  else if (kb.pressing('up')    || kb.pressing('w')) queuedDir = 'up';
  else if (kb.pressing('down')  || kb.pressing('s')) queuedDir = 'down';

  // ── PLAYER GRID MOVEMENT ──────────────────────────────────────────────────
  if (!playerMoving && queuedDir) {
    let nc = playerCol, nr = playerRow;
    if      (queuedDir === 'left')  nc--;
    else if (queuedDir === 'right') nc++;
    else if (queuedDir === 'up')    nr--;
    else if (queuedDir === 'down')  nr++;

    if (!isWall(nc, nr)) {
      startPX = playerX;  startPY = playerY;
      playerCol = nc; playerRow = nr;
      targetX = nc * TILE + TILE / 2;
      targetY = nr * TILE + TILE / 2;
      playerMoving = true;
      moveProgress = 0;
      facingDir  = queuedDir;
      animState  = 'run';
      animFrame  = 0;
    }
    // do NOT clear queuedDir — holding a key should keep moving
  }

  if (playerMoving) {
    moveProgress += MOVE_SPEED;
    if (moveProgress >= 1) {
      moveProgress = 1;
      playerX = targetX; playerY = targetY;
      playerMoving = false;
      animState = 'idle';
    } else {
      playerX = lerp(startPX, targetX, moveProgress);
      playerY = lerp(startPY, targetY, moveProgress);
    }
  }

  // ── TIMERS ────────────────────────────────────────────────────────────────
  if (powerUpActive) { powerUpTimer--;  if (powerUpTimer  <= 0) powerUpActive = false; }
  if (invincibleTimer > 0) invincibleTimer--;

  // ── PARTICLES ─────────────────────────────────────────────────────────────
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].done()) particles.splice(i, 1);
  }

  // ── FOOD ──────────────────────────────────────────────────────────────────
  drawAllFood();
  for (let i = goodFoods.length - 1; i >= 0; i--) {
    let f = goodFoods[i];
    // Collect when the player's tile matches (only when movement finishes)
    if (!playerMoving && playerCol === f.col && playerRow === f.row) {
      spawnParticles(f.x, f.y, f.isPowerUp ? [255,215,0] : [100,255,100]);
      goodFoods.splice(i, 1);
      if (f.isPowerUp) { powerUpActive = true; powerUpTimer = 420; score += 20; }
      else             { score += 10; }
      if (score > highScore) highScore = score;
      goodFoodSnd.play();
    }
  }

  // ── ENEMIES ───────────────────────────────────────────────────────────────
  for (let i = badFoods.length - 1; i >= 0; i--) {
    badFoods[i].update();
    badFoods[i].display(powerUpActive);

    // Same-tile collision
    if (badFoods[i].col === playerCol && badFoods[i].row === playerRow) {
      if (powerUpActive) {
        spawnParticles(badFoods[i].px, badFoods[i].py, [50,100,255]);
        // Queue respawn at the enemy's original spawn tile after 180 frames (3 sec)
        deadEnemies.push({ col: badFoods[i].spawnCol, row: badFoods[i].spawnRow, timer: 180 });
        badFoods.splice(i, 1);
        score += 50;
        if (score > highScore) highScore = score;
      } else if (invincibleTimer <= 0) {
        health--;
        invincibleTimer = 100;
        badFoodSnd.play();
        spawnParticles(playerX, playerY, [255,50,50]);
        respawnPlayer();
        if (health <= 0) gameState = "GAMEOVER";
      }
    }
  }

  // ── ENEMY RESPAWN ─────────────────────────────────────────────────────────
  for (let i = deadEnemies.length - 1; i >= 0; i--) {
    deadEnemies[i].timer--;
    // Draw a pulsing ghost outline at the spawn point while waiting
    let d = deadEnemies[i];
    let sx = d.col * TILE + TILE / 2;
    let sy = d.row * TILE + TILE / 2;
    let pulse = (sin(frameCount * 0.2) + 1) / 2;
    noFill(); stroke(100, 100, 255, lerp(60, 180, pulse));
    strokeWeight(2);
    ellipse(sx, sy, 24, 24);
    noStroke();

    if (deadEnemies[i].timer <= 0) {
      badFoods.push(new BadFood(d.col, d.row));
      deadEnemies.splice(i, 1);
    }
  }

  // ── LEVEL COMPLETE ────────────────────────────────────────────────────────
  if (goodFoods.length === 0) {
    if (currentLevel < levels.length - 1) { currentLevel++; initLevel(); }
    else                                  { gameState = "WIN"; }
  }

  // ── DRAW PLAYER (with invincibility flicker) ──────────────────────────────
  if (invincibleTimer <= 0 || frameCount % 6 < 3) drawPlayer();
  drawHUD();
}

// ── RESPAWN ───────────────────────────────────────────────────────────────────
function respawnPlayer() {
  let map = levels[currentLevel];
  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[r].length; c++) {
      if (map[r][c] === 2) {
        playerCol = c; playerRow = r;
        playerX = c * TILE + TILE / 2;
        playerY = r * TILE + TILE / 2;
        targetX = playerX; targetY = playerY;
        startPX = playerX; startPY = playerY;
        playerMoving = false; moveProgress = 0;
        return;
      }
    }
  }
}

// ── FLOOR ─────────────────────────────────────────────────────────────────────
function drawFloor() {
  let map = levels[currentLevel];
  noStroke();
  fill(40, 40, 60, 100);
  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[r].length; c++) {
      if (map[r][c] !== 1) rect(c * TILE, r * TILE, TILE, TILE);
    }
  }
}

// ── FOOD ──────────────────────────────────────────────────────────────────────
function drawAllFood() {
  for (let f of goodFoods) {
    push(); translate(f.x, f.y); noStroke();
    if (f.isPowerUp) {
      let p = (sin(frameCount * 0.1 + f.phase) + 1) / 2;
      let r = lerp(10, 14, p);
      fill(255,215,0,80); ellipse(0,0,r*2.6);
      fill(255,215,0);    ellipse(0,0,r);
    } else {
      fill(200,180,100); ellipse(0,0,7,7);
    }
    pop();
  }
}

// ── PLAYER ────────────────────────────────────────────────────────────────────
function drawPlayer() {
  animTimer++;
  let spd = (animState === 'idle') ? 8 : 5;
  if (animTimer >= spd) {
    animTimer = 0;
    let imgs = currentAnimImgs();
    if (animState === 'dead') animFrame = min(animFrame + 1, imgs.length - 1);
    else                      animFrame = (animFrame + 1) % imgs.length;
  }

  let imgs = currentAnimImgs();
  if (!imgs || imgs.length === 0) return;

  push();
  imageMode(CENTER);
  translate(playerX, playerY);

  if (powerUpActive) {
    let p = (sin(frameCount * 0.15) + 1) / 2;
    noStroke(); fill(255, 215, 0, lerp(30, 90, p));
    ellipse(0, 0, TILE * 1.5);
  }

  if (facingDir === 'left') scale(-1, 1);
  image(imgs[animFrame], 0, 0, TILE + 6, TILE + 6);
  pop();
}

function currentAnimImgs() {
  if (animState === 'dead')  return deadImgs;
  if (animState === 'slide') return slideImgs.length ? slideImgs : runImgs;
  if (animState === 'run')   return runImgs;
  return idleImgs;
}

// ── HUD ───────────────────────────────────────────────────────────────────────
function drawHUD() {
  push(); noStroke();
  fill(0,0,0,170); rect(0,0,width,26);
  textFont('monospace'); textSize(13); fill(255);
  textAlign(LEFT,   CENTER); text(`LVL ${currentLevel+1}`, 8, 13);
  textAlign(CENTER, CENTER); text(`SCORE: ${score}`, width/2, 13);
  textAlign(RIGHT,  CENTER);
  for (let i = 0; i < 3; i++) {
    fill(i < health ? color(255,50,50) : color(60,60,60));
    drawHeart(width - 14 - i*22, 13, 7);
  }
  if (powerUpActive) {
    let bw = map(powerUpTimer, 0, 420, 0, 100);
    fill(0,0,0,130); rect(width/2-52, height-18, 104, 12, 6);
    fill(255,215,0); rect(width/2-50, height-17, bw,   9,  5);
    fill(0); textAlign(CENTER,CENTER); textSize(9);
    text("POWER!", width/2, height-12);
  }
  pop();
}

function drawHeart(x, y, r) {
  push(); translate(x, y); noStroke();
  beginShape();
  for (let a = 0; a < TWO_PI; a += 0.1) {
    let px2 = r * (16 * pow(sin(a), 3));
    let py2 = -r * (13*cos(a) - 5*cos(2*a) - 2*cos(3*a) - cos(4*a));
    vertex(px2/16, py2/16);
  }
  endShape(CLOSE); pop();
}

// ── SCREENS ───────────────────────────────────────────────────────────────────
function drawStartScreen() {
  background(5,5,20);
  let p = (sin(frameCount * 0.05) + 1) / 2;
  textAlign(CENTER,CENTER); textFont('monospace'); noStroke();
  fill(30,80,200,80); textSize(42); text("CRAB-MAN PRO", width/2, height/2-55);
  fill(255);          textSize(38); text("CRAB-MAN PRO", width/2, height/2-55);
  fill(170); textSize(14);
  text("Collect all food dots to advance levels!", width/2, height/2-5);
  text("Arrow keys or WASD to move",               width/2, height/2+22);
  text("Grab GOLD pellets for power mode!",         width/2, height/2+48);
  fill(lerp(120,255,p)); textSize(16);
  text("Press ANY KEY to start", width/2, height/2+84);
  fill(100); textSize(12);
  text(`High Score: ${highScore}`, width/2, height/2+112);
}

function drawGameOver() {
  // Redraw the level behind the overlay so it looks frozen
  let col = levelColors[currentLevel];
  background(col.bg[0], col.bg[1], col.bg[2]);
  drawFloor();
  if (walls) walls.draw();
  // Dark overlay — drawn after walls, so text on top of everything
  fill(0,0,0,180); rect(0,0,width,height);
  textAlign(CENTER,CENTER); textFont('monospace');
  fill(255,40,40); textSize(52); text("GAME OVER", width/2, height/2-44);
  fill(255); textSize(18);
  text(`Final Score: ${score}`,    width/2, height/2+8);
  text(`High Score:  ${highScore}`, width/2, height/2+34);
  let p = (sin(frameCount*0.08)+1)/2;
  fill(lerp(150,255,p)); textSize(15);
  text("Press R to restart", width/2, height/2+68);
}

function drawGameWon() {
  let col = levelColors[currentLevel];
  background(col.bg[0], col.bg[1], col.bg[2]);
  drawFloor();
  if (walls) walls.draw();
  fill(0,0,0,180); rect(0,0,width,height);
  textAlign(CENTER,CENTER); textFont('monospace');
  colorMode(HSB); fill(frameCount%360, 100, 100); colorMode(RGB);
  textSize(52); text("YOU WIN!", width/2, height/2-44);
  fill(255); textSize(18);
  text(`Final Score: ${score}`,    width/2, height/2+8);
  text(`High Score:  ${highScore}`, width/2, height/2+34);
  let p = (sin(frameCount*0.08)+1)/2;
  fill(lerp(150,255,p)); textSize(15);
  text("Press R to play again", width/2, height/2+68);
}

// ── INPUT ─────────────────────────────────────────────────────────────────────
function keyPressed() {
  if (gameState === "START") {
    gameState = "PLAY";
    if (!bgMusic.isPlaying()) bgMusic.play();
    initLevel();
  } else if ((gameState === "GAMEOVER" || gameState === "WIN") && (key==='r'||key==='R')) {
    currentLevel = 0; score = 0; health = 3;
    gameState = "START";
  }
}

// ── PARTICLES ─────────────────────────────────────────────────────────────────
function spawnParticles(x, y, c) {
  for (let i = 0; i < 10; i++) particles.push(new Particle(x, y, c));
}

class Particle {
  constructor(x, y, c) {
    this.x=x; this.y=y;
    this.vx=random(-3,3); this.vy=random(-3,3);
    this.alpha=255; this.size=random(4,10); this.col=c;
  }
  update()  { this.x+=this.vx; this.y+=this.vy; this.vx*=0.92; this.vy*=0.92; this.alpha-=12; this.size*=0.95; }
  display() { noStroke(); fill(this.col[0],this.col[1],this.col[2],this.alpha); ellipse(this.x,this.y,this.size); }
  done()    { return this.alpha<=0; }
}

// ── BAD FOOD (ENEMY) ──────────────────────────────────────────────────────────
class BadFood {
  constructor(startCol, startRow) {
    this.col = startCol; this.row = startRow;
    this.spawnCol = startCol; this.spawnRow = startRow; // remember home tile
    this.px  = startCol * TILE + TILE / 2;
    this.py  = startRow * TILE + TILE / 2;
    this.startPx = this.px; this.startPy = this.py;
    this.targetPx = this.px; this.targetPy = this.py;
    this.moving   = false;
    this.progress = 0;
    this.moveSpeed = 0.055;   // faster than before
    this.moveTimer    = 0;
    this.moveInterval = floor(random(20, 50)); // shorter pause between moves
    this.eyeAngle  = 0;
    this.facingLeft = false;
  }

  update() {
    if (!this.moving) {
      this.moveTimer++;
      if (this.moveTimer >= this.moveInterval) {
        this.moveTimer = 0;
        this.moveInterval = floor(random(20, 50));
        this._pickDir();
      }
    }

    if (this.moving) {
      this.progress += this.moveSpeed;
      if (this.progress >= 1) {
        this.progress = 1;
        this.px = this.targetPx; this.py = this.targetPy;
        this.moving = false;
      } else {
        this.px = lerp(this.startPx, this.targetPx, this.progress);
        this.py = lerp(this.startPy, this.targetPy, this.progress);
      }
    }
  }

  _pickDir() {
    let dirs = [
      {dc:-1,dr:0}, {dc:1,dr:0}, {dc:0,dr:-1}, {dc:0,dr:1}
    ].filter(d => !isWall(this.col+d.dc, this.row+d.dr));

    if (dirs.length === 0) return;

    let pick;
    if (random() < 0.70) {
      // Chase player
      let best = null, bestD = Infinity;
      for (let d of dirs) {
        let dist = abs((this.col+d.dc)-playerCol) + abs((this.row+d.dr)-playerRow);
        if (dist < bestD) { bestD = dist; best = d; }
      }
      pick = best;
    } else {
      pick = random(dirs);
    }

    this.startPx  = this.px; this.startPy = this.py;
    this.col += pick.dc; this.row += pick.dr;
    this.targetPx = this.col * TILE + TILE / 2;
    this.targetPy = this.row * TILE + TILE / 2;
    this.moving   = true; this.progress = 0;
    if (pick.dc === -1) this.facingLeft = true;
    if (pick.dc ===  1) this.facingLeft = false;
    this.eyeAngle = atan2(pick.dr, pick.dc);
  }

  display(powerMode) {
    push(); translate(this.px, this.py);
    if (powerMode) {
      let w = sin(frameCount*0.3)*2;
      fill(60,80,220); ellipse(0,0,30+w,30);
      fill(255); textAlign(CENTER,CENTER); textSize(10); text(">_<",0,1);
    } else {
      fill(230,80,80);
      ellipse(0,-2,28,26);
      ellipse(-9,8,10,10); ellipse(0,9,10,10); ellipse(9,8,10,10);
      let ex=cos(this.eyeAngle)*4, ey=sin(this.eyeAngle)*4;
      fill(255); ellipse(-6,-3,10,10); ellipse(6,-3,10,10);
      fill(20);  ellipse(-6+ex*0.4,-3+ey*0.4,5,5); ellipse(6+ex*0.4,-3+ey*0.4,5,5);
      if (badFoodImg && badFoodImg.width > 1) {
        tint(255,180); imageMode(CENTER); image(badFoodImg,0,0,28,28); noTint();
      }
    }
    pop();
  }
}