/*
    Author: Mara Miulescu
    Date:   08/05/2018
*/

    class Line2d extends Shape2d {
         constructor(graphics, startPoint, endPoint, width, color) {
           super(graphics, color);
           this.setWidth(width);
           this.startPoint = this.getLoc();
           this.endPoint = new XYZ(0,0,0);

           var This = this;
           this.startPoint.onChange(function() {
             This.__redraw();
           });

           this.setStartPoint(startPoint);


           this.endPoint.onChange(function() {
             This.__redraw();
           });
           this.setEndPoint(endPoint);
         }

         __redraw() {
           this.gfx.clear();
           this.gfx.lineStyle(this.width, this.color);
           this.gfx.moveTo(0, 0);

           var delta = new Vec(this.endPoint).sub(this.getWorldLoc());
           console.log(this.startPoint, this.endPoint, this.getWorldLoc());
           console.trace('sometext');
           this.gfx.lineTo(delta.getX(), delta.getY());
          //this.gfx.lineTo(50, 50);
           this.gfx.endFill();
         }

         setWidth(width) {
           this.width = width;
           this.__redraw();
           return this;
         }
         // use loc thing
         // this.getLoc()
         setStartPoint(startX, startY) {
           this.startPoint.set(startX, startY);
           return this;
         }

         setEndPoint(endX, endY) {
           this.endPoint.set(endX, endY);
           return this;
         }

         getWidth() {
           return this.width;
         }

         getStartPoint() {
           return this.startPoint;
         }

         getEndPoint() {
           return this.endPoint;
         }
    }
