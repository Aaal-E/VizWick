/*
    2d shape class
    Author: Tar van Krieken
    Starting Date: 28/04/2018
*/
class Shape2d extends AbstractShape{
    constructor(graphics, color){
        super(graphics);
        this.color = color;
        this.gfx = this.__createGfx();
        this.gfx.zIndex = 0;            //orders the rendering of th shapes
        
        //add listeners to change pos/rot
        var This = this;
        var oldZ = 0;
        this.loc.onChange(function(){
            This.gfx.x = this.getX();
            This.gfx.y = this.getY();
            
            var newZ = this.getZ();
            if(oldZ!=newZ){
                This.__updateZOrder();
                oldZ = newZ;
            }
        });
        this.rot.onChange(function(){
            This.gfx.rotation = this.getZ();
        });
        
        //add hover handlers
        this.gfx.on("mouseover", function(data){
            This.__triggerHover(true, data);
        });
        this.gfx.on("mouseout", function(data){
            This.__triggerHover(false, data);
        });
        
        //add click handler
        this.gfx.on("click", function(data){
            This.__triggerClick(data);
        });
        
        //add mouse events
        var mouseDown = function(){
            var args = Array.from(arguments);
            args.unshift("down");
            This.__triggerMouseEvent.apply(This, args);
        };
        var mouseUp = function(){
            var args = Array.from(arguments);
            args.unshift("up");
            This.__triggerMouseEvent.apply(This, args);
        };
        var mouseMove = function(){
            var args = Array.from(arguments);
            args.unshift("move");
            This.__triggerMouseEvent.apply(This, args);
        };
        this.gfx.on('mousedown', mouseDown)
                .on('touchstart', mouseDown)
                .on('mouseup', mouseUp)
                .on('mouseupoutside', mouseUp)
                .on('touchend', mouseUp)
                .on('touchendoutside', mouseUp)
                .on('mousemove', mouseMove)
                .on('touchmove', mouseMove);
    }
    __redraw(){}
    __getGfx(){
        return this.gfx;
    }
    __createGfx(){
        return new PIXI.Graphics();
    }
    __updateZOrder(){
        var zOrder = -this.getZ();
        this.gfx.zOrder = zOrder;
        this.gfx.parentGroup = this.graphics.__getGroup();
    }
    
    //absolute coordinates, relative to the screen
    getAbsoluteX(){
        return this.gfx.worldTransform.tx;
    }
    getAbsoluteY(){
        return this.gfx.worldTransform.ty;
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
    enableInteraction(internally){
        this.gfx.interactive = true;
        super.enableInteraction(internally);
    }
    disableInteraction(internally){
        this.gfx.interactive = false;
        super.disableInteraction(internally);
    }
    
    //add to/remove from graphics
    add(){
        super.add();
        this.graphics.__getStage().addChild(this.gfx);
        this.gfx.parentGroup = graphics.group;
    }
    remove(){
        if(this.graphics)
            this.graphics.__getStage().removeChild(this.gfx);
        return super.remove();
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