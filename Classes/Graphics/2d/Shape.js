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

        //add interaction events
        {
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
                if(This.__triggerMousePress(true, data))
                    data.stopPropagation();
            };
            var mouseUp = function(data){
                if(This.__triggerMousePress(false, data))
                    data.stopPropagation();
            };
            var mouseMove = function(data){
                if(This.__triggerMouseMove(new XYZ(data.data.global.x, data.data.global.y), data))
                    data.stopPropagation();
            };
            var mouseScroll = function(data){
                if(This.__triggerMouseScroll(data.data.originalEvent.originalEvent.wheelDeltaY, data))
                    data.stopPropagation();
            };
            var keyPress = function(data){
                var key = data.data.originalEvent.key;
                if(This.__triggerKeyPress(data.data.originalEvent.type=="keydown", key?key.toLowerCase():key, data))
                    data.stopPropagation();
            };
            this.gfx.on('mousedown', mouseDown)
                    .on('touchstart', mouseDown)
                    .on('mouseup', mouseUp)
                    .on('mouseupoutside', mouseUp)
                    .on('touchend', mouseUp)
                    .on('touchendoutside', mouseUp)
                    .on('mousemove', mouseMove)
                    .on('touchmove', mouseMove)
                    .on('scroll', mouseScroll)
                    .on('keypress', keyPress);
        }
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
    getWorldScale(){
        if(this.parentShape)
            return this.getScale()*this.getWorldScale();
        return super.getWorldScale();
    }
    getWorldAngle(){
        if(this.parentShape)
            return this.getAngle()+this.getWorldAngle();
        return super.getWorldAngle();
    }
    isVisible(){
        var loc = this.getWorldLoc();
        var graphics = this.getGraphics();
        var camera = graphics.getCamera();
        var camLoc = camera.getLoc();
        var x = loc.getX()-camLoc.getX();
        var y = loc.getY()-camLoc.getY();
        var w = graphics.getWidth()/2/camera.getScale();
        var h = graphics.getHeight()/2/camera.getScale();
        var r = this.__getRadius();
        return x+r>-w && x-r<w && y+r>-h && y-r<h;
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
        this.__redraw();
        return this;
    }
    setAlpha(alpha){
        this.gfx.alpha = alpha;
        return super.setAlpha(alpha);
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
        this.__updateZOrder();
        return this;
    }
    __delete(){
        this.graphics.__getStage().removeChild(this.gfx);
        super.__delete();
    }

    //update zindex on parent changes
    __setParentShape(parent){
        super.__setParentShape(parent);
        this.__updateZOrder();
        return this;
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
}
