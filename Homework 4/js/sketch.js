/* GENERATIVE AI REFLECTION:
   I used a Generative AI model to create 'pizza3.jpg'. 
   I chose this model because I wanted a hyper-realistic image of a pizza 
   that looked visually intentional for my theme. 
   The prompt used was "top-down view of a fresh pepperoni pizza on a 
   black background". The image was exactly what I expected 
   and helps the project feel more dynamic.
*/

let pizza1, pizza2, aiPizza;
let aiX = 400; 
let aiY = 0;
let staticX = 100;
let staticY = 50;
let timeLeft = 10;
let theFont;
let timerInterval;

function preload() {
    // Corrected paths to match your folder structure and filenames
    pizza1 = loadImage('images/pizza1.png');
    pizza2 = loadImage('images/pizza2.jpg');
    aiPizza = loadImage('images/pizza3.jpg'); // Your Generative AI image
    
    // Path for your Pizza Hoot font
    theFont = loadFont('assets/PizzaHoot-JRawE.otf');
}

function setup() {
    createCanvas(800, 600);
    // Requirement: Timer-based logic
    setInterval(randomMovement, 5000); 
    timerInterval = setInterval(timer, 1000);
}

function draw() {
    background(220);
    
    // Images must be loaded and displayed properly
    pizza1.resize(100, 0);
    image(pizza1, staticX, staticY);

    // This image moves using arrow keys and follows timer-based logic
    aiPizza.resize(200, 0);
    image(aiPizza, aiX, aiY);

    // Custom Typography Requirement
    fill(255, 0, 0);
    textFont(theFont);
    textSize(32);
    text("Time Left: " + timeLeft, 20, 40);
    text("By: Taylor Plovnich", 20, 80);

    if(timeLeft <= 0){
        fill(0);
        textSize(64);
        textAlign(CENTER);
        text("Game Over!", width / 2, height / 2);
    }

    // Interactive movement logic
    if (keyIsPressed) {
        if (keyCode === LEFT_ARROW) {
            if (aiX <= -200) {
                aiX = width - 200;
            }
            aiX -= 5;
        } else if (keyCode === RIGHT_ARROW) {
            if (aiX >= width) {
                aiX = 0;
            }
            aiX += 5;
        } else if (keyCode === UP_ARROW) {
            aiY -= 5;
        } else if (keyCode === DOWN_ARROW) {
            aiY += 5;
        }
    }
}

function randomMovement() {
    // Changes the position of the static pizza every 5 seconds
    staticX = random(0, width - 100);
    staticY = random(0, height - 100);
} 

function timer() {
    // Decrements the timer value every second
    timeLeft -= 1;
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        noLoop(); // Stops the project when time is up
    }
}