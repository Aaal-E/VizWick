/*
    A simple 2d rectangle shape
    Author: Tar van Krieken
    Starting Date: 28/04/2018
*/
class Circle2d extends Shape2d{
    constructor(radius, color){
        super(color);
        this.radius(radius);
    }   
    __redraw(){
        this.gfx.clear();
        this.gfx.beginFill(this.color);
        this.gfx.drawCircle(0, 0, this.rad);
        this.gfx.endFill();
    }
    radius(radius){
        if(radius!=null){
            this.rad = radius;
            this.__redraw();
            return this;
        }
        return this.rad;
    }
    __getRadius(){  //the radius tp be used for the AABB
        return this.rad;
    }
    __getWidth(){
        return this.rad*2;
    }
    __getHeight(){
        return this.rad*2;
    }
}