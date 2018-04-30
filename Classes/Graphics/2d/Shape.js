/*
    2d shape class
    Author: Tar van Krieken
    Starting Date: 28/04/2018
*/
class Shape2d extends AbstractShape{
    constructor(color){
        super();
        this.color = color;
        this.gfx = this.__createGfx();
        
        //add listeners to change pos/rot
        var This = this;
        this.loc.onChange(function(){
            This.gfx.x = this.getX();
            This.gfx.y = this.getY();
        });
        this.rot.onChange(function(){
            This.gfx.rotation = this.getZ();
        });
        
        //add hover handlers
        this.gfx.mouseover = function(data){
            This.__triggerHover(true, data);
        };
        this.gfx.mouseout = function(data){
            This.__triggerHover(false, data);
        };
        
        //add click handler
        this.gfx.click = function(data){
            This.__triggerClick(data);
        };
    }
    __redraw(){}
    __getGfx(){
        return this.gfx;
    }
    __createGfx(){
        return new PIXI.Graphics();
    }
    
    //method alias
    setAngle(angle){
        return this.setZRot(angle);
    }
    getAngle(){
        return this.getZRot(angle);
    }
    
    //update color
    setColor(color){
        super.setColor(color);
        this.__redraw();
        return this;
    }
    
    //enable/disabling interactions
    enableInteraction(){
        this.gfx.interactive = true;
    }
    disableInteraction(){
        this.gfx.interactive = false;
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
        return this;
    }
    
    //get size information to be used by the compount shape texture to determine the texture size
    __getMinX(){
        return this.loc.getX() - this.__getRadius();
    }
    __getMaxX(){
        return this.loc.getX() + this.__getRadius();
    }
    __getMinY(){
        return this.loc.getY() - this.__getRadius();
    }
    __getMaxY(){
        return this.loc.getY() + this.__getRadius();
    }
}