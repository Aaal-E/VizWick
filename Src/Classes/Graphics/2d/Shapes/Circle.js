/*
    A simple 2d circle shape
    Author: Tar van Krieken
    Starting Date: 28/04/2018
*/
var circlePrecision = 5;
class Circle2d extends Shape2d{
    constructor(graphics, radius, color, preInit){
        super(graphics, color, preInit);
        this.setRadius(radius);
    }   
    //the draw method
    __redraw(){
        //draw the shape
        this.gfx.clear();
        this.gfx.beginFill(this.color);
        this.gfx.drawCircle(0, 0, circlePrecision);
        this.gfx.endFill();
        this.gfx.scale.set(this.getScale()*this.radius/circlePrecision); //setting the circle size by scaling in order to maintain quality for really small radii 
        
        //setup the hitbox (used for interaction events)
        this.gfx.hitArea = new PIXI.Circle(0, 0, circlePrecision);
    }
    
    setScale(scale){
        super.setScale(scale);
        this.gfx.scale.set(this.getScale()*this.radius/circlePrecision);
        return this;
    }
    
    //the radius of the circle
    setRadius(radius){
        this.radius = radius;
        this.__redraw();
        this.__updateAABB();
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