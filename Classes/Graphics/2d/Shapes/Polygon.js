/*
    Author: Mara Miulescu
    Date:   07/05/2018
*/

    class Polygon2d extends Shape2d {
        constructor(graphics, points[], color) {
          super(graphics, color);
          // takes as argument an array of points ([x,y, x,y, x, y,..])
          this.setPoints(points[]);
        }

        __redraw() {
          this.gfx.clear();
          this.gfx.beginFill(this.color);
          this.gfx.drawPolygon(0, 0, this.)
        }
    }
