/*
    Author: Mara Miulescu, Tar van Krieken
    Date:   24/05/2018
*/

    class ImageShape2d extends Shape2d {
          constructor(graphics, source, width, height) {
              super(graphics, null, function() {
                  this.source = source;
              });
              this.setWidth(width);
              this.setHeight(height);

              var This = this;
              this.getLoc().onChange(function(){
                  This.gfx.x -= 0.5*This.gfx.width ;
                  This.gfx.y -= 0.5*This.gfx.height;
             });
          }

          __createGfx() {
              return new PIXI.Sprite.from(this.source);
          }

          setWidth(width) {
              this.gfx.width = width;
              return this;
          }

          setHeight(height) {
              this.gfx.height = height;
              return this;
          }

          getWidth() {
              return this.width;
          }

          getHeight() {
            return this.height;
          }



    }
