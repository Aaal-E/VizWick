/*
    A simple 2d rectangle shape
    Author: Tar van Krieken
    Starting Date: 28/04/2018
*/
class Rectangle2d extends Shape2d{
    constructor(width, height, color){
        super(color);
        this.size = {
            width: 0,
            height: 0,
        }
        this.size(width, height);
    }   
    __redraw(){
        this.gfx.clear();
        this.gfx.beginFill(this.color);
        this.gfx.drawRect(-this.size.width/2, -this.size.height/2, this.size.width, this.size.height);
        this.gfx.endFill();
    }
    wdith(width){
        if(width!=null){
            this.size.width = width;
            this.__redraw();
            return this;
        }
        return this.size.width;
    }
    height(height){
        if(height!=null){
            this.size.height = height;
            this.__redraw();
            return this;
        }
        return this.size.height;
    }
    __getWidth(){
        return this.size.width;
    }
    __getHeight(){
        return this.size.height;
    }
}