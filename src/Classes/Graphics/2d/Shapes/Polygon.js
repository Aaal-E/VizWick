/*
    Author: Mara Miulescu
    Date:   07/05/2018
*/

    class Polygon2d extends Shape2d {
          constructor(graphics, points, color) {
              super(graphics, color);
              this.setPoints(points);
          }

          __redraw() {
              this.gfx.clear();
              this.gfx.beginFill(this.color);
              this.gfx.drawPolygon(this.points);
              this.gfx.endFill();

              this.gfx.hitArea = new PIXI.Polygon(this.points);
          }


        // takes as argument an array of points ([x1,y1, x2,y2, x3, y3,..])
          setPoints(points) {
              this.points = points;
              this.__redraw();
              return this;
          }

          getPoints() {
              return this.points;
          }

          __getPoints() {
              return this.points;
          }

          __getRadius() {
              var radius = 0;
              for(var i = 0; i < this.points.length - 1; i += 2) {
                  var corner = new Vec(this.points[i], this.points[i+1], 0);
                  var dist = corner.getLength();
                  if (dist > radius) {
                      radius = dist;
                  }
              }
              return radius;
          }
    }
