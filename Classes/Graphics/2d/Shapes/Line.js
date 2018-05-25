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

               this.getRot().onChange(function() {
                 This.__redraw();
               })

               this.setStartPoint(startPoint);

               this.endPoint.onChange(function() {
                 This.__redraw();
               });
               this.setEndPoint(endPoint);
             }

             setScale(scale) {
               super.setScale(scale);
               this.__redraw();
               return this;
             }

           __redraw() {
               this.gfx.clear();
               this.gfx.lineStyle(this.width, this.color);
               this.gfx.moveTo(0, 0);

               var delta = new Vec(this.endPoint).sub(this.getWorldLoc());
               if (this.parentShape) {
                 delta.div(this.parentShape.getWorldScale());
                 delta.addAngle(-this.parentShape.getWorldAngle());
               }
               this.gfx.lineTo(delta.getX(), delta.getY());
               this.gfx.endFill();
            }

           setWidth(width) {
               this.width = width;
               this.__redraw();
               return this;
            }

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


            //redraw on scale change
            __triggerScaleChange(){
                super.__triggerScaleChange();
                this.__redraw();
            }
    }
}
