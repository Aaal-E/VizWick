/*
    3d text class
    Author: Tar van Krieken
    Starting Date: 01/06/2018
*/
class TextShape3d extends TextureShape3d{
    constructor(gfx, text, color, font, height, align){
        super(gfx, null, 0.2, 0.2, function(){
            this.text = text;
            this.color = color;
            this.font = font || "arial";
            this.height = height || 0.1;
            this.align = align || "center";
        });

        //generate
        this.refresh();
    }

    setText(text){
        this.text = text;
        this.refresh();
        return this;
    }
    refresh(){ //generate a image containing the text
        var c = document.createElement('canvas');
        c.width = 5;
        var n = 400;
        c.height = n;

        var ctx = c.getContext("2d");

        ctx.font = n+"px "+this.font;
        ctx.fillStyle = "white";
        ctx.textAlignt = this.align;

        c.width = ctx.measureText(this.text).width;
        this.ratio = c.width/c.height;

        ctx.font = n+"px "+this.font;
        ctx.fillStyle = "white";
        ctx.textAlignt = this.align;

        ctx.fillText(this.text, 0, n*0.7);

        var dataUrl = c.toDataURL();
        this.setSource(dataUrl);
        this.setHeight(this.getHeight());
        return this;
    }

    setHeight(height){
        this.size.set(this.ratio*height, height, 1);
        return this;
    }
    getHeight(){
        return this.size.getY();
    }
}
