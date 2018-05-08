/*
    Author: Mara Miulescu
    Date:   08/05/2018
*/

    class Line2d extends Shape2d {
         constructor(graphics, startX, startY, endX, endY, width, color) {
           super(graphics, color);
           this.setWidth(width);
           this.setStartPoints(startx, starty);
           this.setEndPoints(endx, endy);
         }

         __redraw() {
           this.gfx.clear();
           this.gfx.lineStyle(this, width, this.color);
           this.gfx.moveTo(startX, startY);
           this.gfx.lineTo(endX, endY);
           this.gfx.endFill();
         }

         setWidth(width) {
           this.width = width;
           this.__redraw();
           return this;
         }

         setStartPoints(startX, startY) {
           this.startX = startX;
           this.startY = startY;
           return this;
         }

         setEndPoints(endX, endY) {
           this.endX = endX;
           this.endY = endY;
           return this;
         }

         getWidth() {
           return this.width;
         }

         getStartPoints() {
           return {
             startX: this.startX,
             startY: this.startY;
           };
         }

         getEndPoints() {
           return {
             endX: this.endX;
             endY: this.endY;
           };
         }
    }
