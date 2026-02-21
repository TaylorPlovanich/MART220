class Food {
    constructor() {
      // Sets starting position, size, and color for each item
      this.x = random(50, 750);
      this.y = random(50, 550);
      this.size = random(20, 40);
      this.color = color(random(255), random(100), random(100));
    }
  
    // Draws the shapes on the screen
    display() {
      fill(this.color);
      noStroke();
      // Draws the main circle
      circle(this.x, this.y, this.size); 
      
      // Draws a small square detail
      fill(255, 150); 
      rect(this.x, this.y, this.size/4, this.size/4);
    }
  }