/*
    Author: Mara Miulescu, Tar van Krieken
    Date:   24/05/2018
*/

    class TextShape2d extends Shape2d {
        constructor(graphics, text, color, font, size, preInit){
            super(graphics, color, function() {
                this.text = text;
                this.color = color;
                this.font = font;
                this.size = size;
                this.align = align;

                if(preInit) preInit.call(this);
            });

            var This = this;
            this.getLoc().onChange(function(){
                This.gfx.x -= 0.5*This.gfx.width ;
                This.gfx.y -= 0.5*This.gfx.height;
           });
        }

        __createGfx() {
            var data = {
                fontFamily: 'Arial',
                fontSize: 24,
                fill: 0x00ff00,
                align: 'left'
            };
            if (this.font)      data.fontFamily = this.font;
            if (this.color)     data.fill = this.color;
            if (this.font)      data.fontFamily = this.font;
            if (this.align)     data.align = this.align;

            return new PIXI.Text(this.text, data);
        }

        setColor(color) {
            if (color != null) {
              super.setColor(color);
              this.gfx.style.fill = color;
            }
            return this;
        }
    }
