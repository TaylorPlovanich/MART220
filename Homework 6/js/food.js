// Food class
class Food {
    constructor(x, y, size, col) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.col = col;
    }
  
    display() {
      fill(this.col);
      noStroke();
  
      // Rectangle (stem)
      rect(this.x - this.size / 6, this.y, this.size / 3, this.size);
  
      // Circle (top)
      circle(this.x, this.y, this.size);
    }
  }