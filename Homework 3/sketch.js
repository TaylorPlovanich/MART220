// Homework 3: Interactive Cozy Music Corner
// Student Name: Your Name

// ---------------- VARIABLES ----------------
var guitarX = 420;
var guitarY = 450;
var noteX = 300;
var noteY = 300;

var isPlaying = false; // Toggles movement
var roomHue = 245;     // For changing the room vibe

// ---------------- SETUP ----------------
function setup() {
    createCanvas(600, 600);
}

// ---------------- DRAW ----------------
function draw() {
    // Room background (Warm cream)
    background(roomHue, 230, 210);

    drawEnvironment(); // Floor, Window, Poster
    drawInstruments(); // Guitar and Record Player
    
    // Logic: Only move and draw music notes if playing
    if (isPlaying) {
        moveNotes();
        drawNotes();
    }

    drawUI(); // Title and Name
}

// ---------------- FUNCTIONS ----------------

function drawEnvironment() {
    // Floor
    noStroke();
    fill(120, 80, 50);
    rect(0, 450, 600, 150);

    // Window
    stroke(255);
    strokeWeight(8);
    fill(173, 216, 230);
    rect(350, 80, 180, 250);

    // Rock Poster
    noStroke();
    fill(40);
    rect(80, 100, 120, 160);
    fill(255, 0, 0);
    triangle(100, 230, 140, 130, 180, 230);
}

function drawInstruments() {
    // Guitar (Moves with WASD)
    checkKeyboard(); 
    fill(180, 90, 40);
    noStroke();
    circle(guitarX, guitarY + 30, 90); 
    circle(guitarX, guitarY - 30, 70);

    // Record Player
    fill(100, 100, 120);
    rect(230, 420, 120, 60);
    fill(20);
    circle(290, 450, 45);
}

function moveNotes() {
    // Random jitter movement
    noteX += random(-5, 5);
    noteY += random(-5, 5);
}

function drawNotes() {
    fill(255, 100, 100);
    ellipse(noteX, noteY, 15, 15);
}

function drawUI() {
    fill(0);
    noStroke();
    textSize(16);
    textAlign(LEFT, TOP);
    text("Cozy Music Corner v2", 15, 15); // Title: Upper-left
    
    textAlign(RIGHT, BOTTOM);
    text("Taylor Plovanich", 585, 585); // Name: Lower-right
}

// ---------------- EVENTS ----------------

function checkKeyboard() {
    if (keyIsPressed) {
        if (key === 'a') { guitarX -= 5; }
        if (key === 'd') { guitarX += 5; }
        if (key === 'w') { guitarY -= 5; }
        if (key === 's') { guitarY -= 5; }
    }
}

function mousePressed() {
    // Toggle play state
    isPlaying = !isPlaying;
    
    // Teleport note to click
    noteX = mouseX;
    noteY = mouseY;
}

function keyPressed() {
    // Press 'C' to change room color randomly
    if (key === 'c' || key === 'C') {
        roomHue = random(100, 255);
    }
}