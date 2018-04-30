/*
    A simple 2d rectangle shape
    Author: Tar van Krieken
    Starting Date: 28/04/2018
*/
class Circle2d extends Shape2d{
    constructor(radius, color){
        super(color);
        this.setRadius(radius);
    }   
    //the draw method
    __redraw(){
        //draw the shape
        this.gfx.clear();
        this.gfx.beginFill(this.color);
        this.gfx.drawCircle(0, 0, this.radius);
        this.gfx.endFill();
        
        //setup the hitbox (used for interaction events)
        this.gfx.hitArea = new PIXI.Circle(0, 0, this.radius);
    }
    
    //the radius of the circle
    setRadius(radius){
        this.radius = radius;
        this.__redraw();
        return this;
    }
    getRadius(){
        return this.radius;
    }
    
    //the radius to be used for the AABB
    __getRadius(){  
        return this.radius;
    }
}