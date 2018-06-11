/*
   Author: Mara Miulescu
   Date:   07/05/2018
*/

    class Rectangle2d extends Shape2d {
          constructor(graphics, width, height, color) {
              super(graphics, color);
              this.setWidth(width);
              this.setHeight(height);
          }

          __redraw() {
              this.gfx.clear();
              this.gfx.beginFill(this.color);
              this.gfx.drawRect(-0.5*this.width, -0.5*this.height, this.width, this.height);
              this.gfx.endFill();

              this.gfx.hitArea = new PIXI.Rectangle(-0.5*this.width, -0.5*this.height, this.width, this.height);
          }

          setWidth(width) {
              this.width = width;
              this.__redraw();
              return this;
          }

          setHeight(height) {
              this.height = height;
              this.__redraw();
              return this;
          }

          getWidth() {
              return this.width;
          }

          getHeight() {
              return this.height;
          }

          __getRadius() { // returns longest distance from center to a corner
              return (Math.sqrt((this.width*this.width)+(this.height*this.height))/2);
          }
    }
