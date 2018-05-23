/*
   Author: Mara Miulescu
   Date:   07/05/2018
*/

    class Ellipse2d extends Shape2d {
          constructor(graphics, width, height, color) {
              super(graphics, color);
              this.setWidth(width);
              this.setHeight(height);
          }

          __redraw() {
              this.gfx.clear();
              this.gfx.beginFill(this.color);
              this.gfx.drawEllipse(-0.5*this.width, -0.5*this.height, this.width, this.height);

              this.gfx.hitArea = new PIXI.Ellipse(-0.5*this.width, -0.5*this.height, this.width, this.height);
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

          getRadius() {
              return this.radius;
          }

          __getRadius() { // returns longest distance from center to a corner
              if (this.width >= this.height) {
                  return this.width;
              }
              return this.height;
          }
}
