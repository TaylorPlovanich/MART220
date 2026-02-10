/* GENERATIVE AI REFLECTION:
Which Generative AI image model did you use?
 I used Gemini to generate one of my pizza images.
   
Why did you choose that specific one?
   Because it's completely free to use and doesn't require 
   any paid subscription. Plus, I just wanted to see if Gemini has gotten better.
   
What was your prompt like?
   My prompt was simple: make me an image of a pepperoni pizza top view. I kept it straightforward 
   because I wanted a clean, realistic image that would work well in my project.
   
Was the image what you expected? Why or why not?
   Yes, the result was good. I didn't have any expectations. The AI created a realistic 
   pizza with good detail and natural lighting. The cheese and pepperoni looked authentic, 
   which was important for making my project feel more polished.
   
How did the image contribute to your overall project?
   It looks real, so you can't even tell. It doesn't stand out from the other images I used.
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
    // Load all three images
    pizza1 = loadImage('images/pizza1.png');
    pizza2 = loadImage('images/pizza2.jpg');
    aiPizza = loadImage('images/pizza3.jpg'); 
    
    // Load custom font
    theFont = loadFont('assets/PizzaFont.ttf');
}

function setup() {
    createCanvas(800, 600);
    // Timer-based movement: moves pizza1 every 5 seconds
    setInterval(randomMovement, 5000); 
    // Timer countdown: decreases every second
    timerInterval = setInterval(timer, 1000);
}

function draw() {
    background(220);
    
    // Image 1: Pizza that moves randomly every 5 seconds (timer-based) AI image
    pizza1.resize(100, 0);
    image(pizza1, staticX, staticY);

    // Image 2: Static pizza in bottom right corner
    pizza2.resize(80, 0);
    image(pizza2, 650, 500);

    // Image 3: pizza controlled by arrow keys
    aiPizza.resize(200, 0);
    image(aiPizza, aiX, aiY);

    // Project Title with custom font
    fill(255, 0, 0);
    textFont(theFont);
    textSize(48);
    textAlign(CENTER);
    text("PIZZA CATCHER", width / 2, 50);
    
    // Name with custom font
    textSize(24);
    text("by Taylor Plovanich", width / 2, 90);
    
    // Timer display
    textAlign(LEFT);
    fill(0);
    textSize(20);
    text("Time Left: " + timeLeft, 20, height - 20);

    // Game Over screen
    if(timeLeft <= 0){
        fill(0);
        textSize(64);
        textAlign(CENTER);
        text("Game Over!", width / 2, height / 2);
    }

    // Arrow key controls for AI pizza
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

// Timer function: Moves pizza1 to random position every 5 seconds
function randomMovement() {
    staticX = random(0, width - 100);
    staticY = random(0, height - 100);
} 

// Timer function: Countdown every second
function timer() {
    timeLeft -= 1;
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        noLoop(); // Stops the project when time is up
    }
}