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
          this.gfx.drawRectangle(0, 0, this.width, this.height);
          this.gfx.endFill();

          this.gfx.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height);
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

        __getWidth() {
          return this.width;
        }

        __getHeight() {
          return this.height;
        }
    }
