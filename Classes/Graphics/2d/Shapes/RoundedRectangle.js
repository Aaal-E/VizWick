/*
   Author: Mara Miulescu
   Date:   07/05/2018
*/

    class RoundedRectangle2d extends Shape2d {
        constructor(graphics, width, height, radius, color) {
          super(graphics, color);
          this.setWidth(width);
          this.setHeight(height);
          this.setRadius(radius);
        }

        __redraw() {
          this.gfx.clear();
          this.gfx.beginFill(this.color);
          this.gfx.drawRoundedRectangle(0, 0, this.width, this.height, this.radius);
          this.gfx.endFill();

          this.gfx.hitArea = new PIXI.RoundedRectangle(0, 0, this.width, this.height, this.radius);
        }

        setRadius(radius) {
            this.radius = radius;
            this.__redraw();
            return this;
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

        __getRadius() {
          return this.radius;
        }

        __getWidth() {
          return this.width;
        }

        __getHeight() {
          return this.height;
        }
    }
