/*
    2d shape class
    Author: Tar van Krieken
    Starting Date: 28/04/2018
*/
class Shape2d extends AbstractShape{
    constructor(graphics, color, preInit){
        super(graphics, preInit);
        this.gfx = this.__createGfx();
        this.setColor(color);
        this.gfx.zIndex = 0;            //orders the rendering of th shapes
        
        //add listeners to change pos/rot
        var This = this;
        var oldZ = 0;
        this.getLoc().onChange(function(){
            This.gfx.x = this.getX();
            This.gfx.y = this.getY();
            
            var newZ = this.getZ();
            if(oldZ!=newZ){
                This.__updateZOrder();
                oldZ = newZ;
            }
        });
        this.getRot().onChange(function(){
            This.gfx.rotation = this.getZ();
        });
        
        //add hover handlers
        this.gfx.on("mouseover", function(data){
            if(This.__triggerHover(true, data))
                data.stopPropagation();
        });
        this.gfx.on("mouseout", function(data){
            if(This.__triggerHover(false, data))
                data.stopPropagation();
        });
        
        //add click handler
        this.gfx.on("click", function(data){
            if(This.__triggerClick(data))
                data.stopPropagation();
        });
        
        //add mouse events
        var mouseDown = function(data){
            var args = Array.from(arguments);
            args.unshift("down");
            if(This.__triggerMouseEvent.apply(This, args))
                data.stopPropagation();
        };
        var mouseUp = function(data){
            var args = Array.from(arguments);
            args.unshift("up");
            if(This.__triggerMouseEvent.apply(This, args))
                data.stopPropagation();
        };
        var mouseMove = function(data){
            var args = Array.from(arguments);
            args.unshift("move");
            if(This.__triggerMouseEvent.apply(This, args))
                data.stopPropagation();
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
    
    //change scale
    setScale(scale){
        this.gfx.scale.set(scale);
        return super.setScale(scale);
    }
    
    //absolute coordinates, relative to the screen
    getAbsoluteX(){
        return this.gfx.worldTransform.tx;
    }
    getAbsoluteY(){
        return this.gfx.worldTransform.ty;
    }
    
    //world location (when in other shape)
    getWorldLoc(){
        if(this.parentShape){
            var p = this.parentShape;
            var vec = new Vec(this.getLoc());
            vec.mul(p.getScale()).addAngle(p.getAngle());
            vec.add(p.getWorldLoc());
            return vec;
        }
        return this.getLoc();
    }
    
    //method alias
    setAngle(angle){
        return this.setZRot(angle);
    }
    getAngle(){
        return this.getZRot();
    }
    
    //update color
    setColor(color){
        super.setColor(color);
        this.setAlpha(1-(Math.floor(color/0xffffff)-1)/255);
        this.__redraw();
        return this;
    }
    setAlpha(alpha){
        this.gfx.alpha = alpha;
        return this;
    }
    getAlpha(){
        return this.gfx.alpha;
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
        this.gfx.parentGroup = this.graphics.group;
        return this;
    }
    __delete(){
        if(this.graphics)
            this.graphics.__getStage().removeChild(this.gfx);
        super.__delete();
    }
    
    
    //targetting ignore z
    __onUpdate(deltaTime){
        this.getVelo().setZ(0);
        if(this.target.loc){
            var delta = this.getVecTo((this.target.loc) instanceof Function?
                                        this.target.loc.call(this):
                                        this.target.loc).setZ(0);
            var velo = this.getVelo();
            if(delta.getLength()<1*this.getScale() && velo.getLength()<150*this.getScale() && this.target.callback.loc){
                this.target.callback.loc.call(this);
                this.target.callback.loc = null;
            }
        }
        
        return super.__onUpdate(deltaTime);
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