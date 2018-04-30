/*
    2d shape class
    Author: Tar van Krieken
    Starting Date: 28/04/2018
*/
class Shape2d extends AbstractShape{
    constructor(color){
        super();
        this.color = color;
        this.gfx = new PIXI.Graphics();
        
        //add listeners to change pos/rot
        var This = this;
        this.loc.listen(function(){
            This.gfx.x = this.x();
            This.gfx.y = this.y();
        });
        this.rot.listen(function(){
            This.gfx.rotation = this.z();
        });
    }
    __redraw(){}
    __getGfx(){
        return this.gfx;
    }
    
    //update color
    setColor(color){
        super.setColor(color);
        this.redraw();
        return this;
    }
    
    //add to/remove from graphics
    addTo(graphics){
        super.addTo(graphics);
        graphics.__getStage().addChild(this.gfx);
    }
    remove(){
        super.remove();
        if(this.graphics)
            this.graphics.__getStage().removeChild(this.gfx);
    }
    
    
    //get size information to be used by the compount shape texture
    __getWidth(){
        return 0;
    }
    __getHeight(){
        return 0;
    }
    __getMinX(){
        return this.loc.x - (this.__getWidth()/2*Math.cos(this.rot.z) + this.__getHeight()/2*Math.sin(this.rot.z));
    }
    __getMaxX(){
        return this.loc.x + (this.__getWidth()/2*Math.cos(this.rot.z) + this.__getHeight()/2*Math.sin(this.rot.z));
    }
    __getMinY(){
        return this.loc.y - (this.__getHeight()/2*Math.cos(this.rot.z) + this.__getWidth()/2*Math.sin(this.rot.z));
    }
    __getMaxY(){
        return this.loc.y + (this.__getHeight()/2*Math.cos(this.rot.z) + this.__getWidth()/2*Math.sin(this.rot.z));
    }
}