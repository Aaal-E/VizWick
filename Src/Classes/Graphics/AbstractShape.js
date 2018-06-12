/*
    Generalized shape abstract class
    Author: Tar van Krieken
    Starting Date: 28/04/2018
*/
class AbstractShape{
    constructor(graphics, preInit){
        //setup stuff before init
        this.storeInSpatialTree = false;
        if(preInit)
            preInit.call(this);

        //set fields
        this.graphics = graphics;

        this.transform = {
            loc: new XYZ(0, 0, 0),
            rot: new XYZ(0, 0, 0),
            scale: 1,
            scaleListeners: [],
        };
        this.velo = {
            loc: new Vec(0, 0, 0),
            rot: new Vec(0, 0, 0),
            scale: 0
        };
        this.speedFactor = 1;                                           //a constant to multiply the velo with
        this.aabb = {minX:0, maxX:0, minY:0, maxY:0, minZ:0, maxZ:0};   //loose bounding box
        this.color = 0;                                                 //int color
        this.isRendered = false;                                        //whether or not the shape is being rendered
        this.isRenderedListeners = [];                                  //listeners that check if the shape is rendered
        this.isAlive = false;                                           //whether or not the shape is rendered, and not in the process of being removed

        //interaction listeners
        this.listeners = {
            update: [],
            mouseClick: [],
            mouseHover: [],
            mousePress: [],
            mouseScroll: [],
            mouseMove: [],
            keyPress: []
        };

        //target
        this.target = {
            loc: null,
            rot: null,
            scale: null,
            friction: {
                loc: 0.8,
                rot: 0.8,
                scale: 0.7
            },
            speed: {
                loc: 1,
                rot: 1,
                scale: 2,
            },
            callback: {
                loc: null,
                rot: null,
                scale: null
            }
        };

        //whether updates and interactions are disabled
        this.updatesDisabled = false;
        this.interactionsDisabled = false;

        //add listener to loc changes in order to update aabb
        var This = this;
        this.transform.loc.onChange(function(){
            This.__updateAABB();
        });

        //velo listeners
        this.velo.loc.onChange(function(){
             This.__updateUpdates();
        });

        //update AABB
        this.__updateAABB();
    }

    //build in listeners
    __onDrag(location){} //method to be overwritten for custom dragging
    __registerUpdateListener(){
        return this.onUpdate(this.__onUpdate);
    }
    __deregisterUpdateListener(){
        return this.offUpdate(this.__onUpdate);
    }
    __onUpdate(deltaTime){ //method to be extended to be called every 'tick'
        //apply velocities
        var velo = this.getVelo();
        if(velo.isNonZero(this.getScale()))
            this.getLoc().add(new Vec(velo).mul(deltaTime*this.speedFactor));
        var velo = this.getRotVelo();
        if(velo.isNonZero())
            this.getRot().add(new Vec(velo).mul(deltaTime*this.speedFactor));
        var velo = this.getScaleVelo();
        if(Math.abs(velo)>1e-3*this.getScale())
            this.setScale(this.getScale() + velo*deltaTime*this.speedFactor );


        //targetting methods
        if(this.target.loc!=null){
            var delta = this.getVecTo((this.target.loc) instanceof Function?
                                            this.target.loc.call(this):
                                            this.target.loc);
            var velo = this.getVelo().mul(this.target.friction.loc).add(delta.mul(this.target.speed.loc));
            if(delta.getLength()<1*this.getScale() && velo.getLength()<150*this.getScale() && this.target.callback.loc){
                this.target.callback.loc.call(this);
                this.target.callback.loc = null;
            }
        }
        if(this.target.rot!=null){
            var delta = this.getRot().getVecTo((this.target.rot) instanceof Function?
                                            this.target.rot.call(this):
                                            this.target.rot);
            var velo = this.getRotVelo().mul(this.target.friction.rot).add(delta.mul(this.target.speed.rot));
            if(delta.getLength()<0.1 && velo.getLength()<0.1 && this.target.callback.rot){
                this.target.callback.rot.call(this);
                this.target.callback.rot = null;
            }
        }
        if(this.target.scale!=null){
            var delta = ((this.target.scale) instanceof Function?
                            this.target.scale.call(this):
                            this.target.scale)
                        -this.getScale();
            this.setScaleVelo(this.getScaleVelo()*this.target.friction.scale + delta*this.target.speed.scale);
            if(delta<0.01*Math.max(1e-2,this.getScale()) &&
                    Math.abs(this.getScaleVelo())<0.05*Math.max(1e-2,this.getScale()) &&
                    this.target.callback.scale){
                this.target.callback.scale.call(this);
                this.target.callback.scale = null;
            }
        }

        return this;
    }

    //position
    setX(x){
        this.transform.loc.setX(x);
        return this;
    }
    getX(){
        return this.transform.loc.getX();
    }
    setY(y){
        this.transform.loc.setY(y);
        return this;
    }
    getY(){
        return this.transform.loc.getY();
    }
    setZ(z){
        this.transform.loc.setZ(z);
        return this;
    }
    getZ(){
        return this.transform.loc.getZ();
    }
    setLoc(x, y, z){
        this.transform.loc.set(x, y, z);
        return this;
    }
    getLoc(){
        return this.transform.loc;
    }

    //absolute position
    getAbsoluteX(){}
    getAbsoluteY(){}

    //rotation
    setXRot(x){
        this.transform.rot.setX(x);
        return this;
    }
    getXRot(){
        return this.transform.rot.getX();
    }
    setYRot(y){
        this.transform.rot.setY(y);
        return this;
    }
    getYRot(){
        return this.transform.rot.getY();
    }
    setZRot(z){
        this.transform.rot.setZ(z);
        return this;
    }
    getZRot(){
        return this.transform.rot.getZ();
    }
    setRot(x, y, z){
        this.transform.rot.set(x, y, z);
        return this;
    }
    getRot(){
        return this.transform.rot;
    }

    //scale
    getScale(){
        return this.transform.scale;
    }
    setScale(scale){
        this.transform.scale = scale;
        this.__updateAABB();
        this.__triggerScaleChange();
        return this;
    }
    onScaleChange(func){
        var index = this.transform.scaleListeners.indexOf(func);
        if(index==-1) this.transform.scaleListeners.push(func);
        return this;
    }
    offScaleChange(func){
        var index = this.transform.scaleListeners.indexOf(func);
        if(index!=-1) this.transform.scaleListeners.splice(index, 1);
        return this;
    }
    __triggerScaleChange(){
        for(var i=0; i<this.transform.scaleListeners.length; i++){
            this.transform.scaleListeners[i].call(this, this.transform.scale);
        }
    }


    //velocity
    getVelo(){
        return this.velo.loc;
    }
    getRotVelo(){
        return this.velo.rot;
    }
    getScaleVelo(){
        return this.velo.scale;
    }
    setScaleVelo(scaleVelo){
        this.velo.scale = scaleVelo;
        return this;
    }

    //targetting
    setTargetLoc(loc, friction, speed, onReach){
        if(typeof(friction)=="function"){
            onReach = friction;
            friction = null;
        }else if(typeof(speed)=="function"){
            onReach = speed;
            speed = null;
        }
        this.getVelo().setLength(0);

        this.target.loc = loc;
        if(friction!=null)
            this.target.friction.loc = friction;
        if(speed)
            this.target.speed.loc = speed;
        if(onReach)
            this.target.callback.loc = onReach;
        return this;
    }
    setTargetRot(rot, friction, speed, onReach){
        if(typeof(friction)=="function"){
            onReach = friction;
            friction = null;
        }else if(typeof(speed)=="function"){
            onReach = speed;
            speed = null;
        }

        this.target.rot = rot;
        if(friction!=null)
            this.target.friction.rot = friction;
        if(speed)
            this.target.speed.rot = speed;
        if(onReach)
            this.target.callback.rot = onReach;
        return this;
    }
    setTargetScale(scale, friction, speed, onReach){
        if(typeof(friction)=="function"){
            onReach = friction;
            friction = null;
        }else if(typeof(speed)=="function"){
            onReach = speed;
            speed = null;
        }

        this.target.scale = scale;
        if(friction!=null)
            this.target.friction.scale = friction;
        if(speed)
            this.target.speed.scale = speed;
        if(onReach)
            this.target.callback.scale = onReach;
        return this;
    }

    //color
    setColor(color){
        this.color = color;
        this.setAlpha(1-(Math.floor(color/0xffffff))/255);
        return this;
    }
    getColor(){
        return this.color;
    }
    setAlpha(alpha){
        this.alpha = alpha;
        return this;
    }
    getAlpha(){
        return this.alpha;
    }

    //event handlers
    __registerListener(type, listener){
        if(this.listeners[type].indexOf(listener)==-1)
            this.listeners[type].push(listener);
        this.__updateInteraction();
        return this;
    }
    __deregisterListener(type, listener){
        var index = this.listeners[type].indexOf(listener);
        if(index!=-1)
            this.listeners[type].splice(index, 1);
        this.__updateInteraction();
        return this;
    }
    __triggerListener(type){
        var args = Array.from(arguments);
        args.shift();
        var ls = this.listeners[type];
        for(var i=0; i<ls.length; i++)
            if(ls[i].apply(this, args))
                return true;
    }

    onClick(func){ return this.__registerListener("mouseClick", func); }
    offClick(func){ return this.__deregisterListener("mouseClick", func); }
    __triggerClick(event){ return this.__triggerListener("mouseClick", event); }

    onHover(func){ return this.__registerListener("mouseHover", func); }
    offHover(func){ return this.__deregisterListener("mouseHover", func); }
    __triggerHover(hover, event){ return this.__triggerListener("mouseHover", hover, event); }

    onMousePress(func){ return this.__registerListener("mousePress", func); }
    offMousePress(func){ return this.__deregisterListener("mousePress", func); }
    __triggerMousePress(down, event){ return this.__triggerListener("mousePress", down, event); }

    onMouseScroll(func){ return this.__registerListener("mouseScroll", func); }
    offMouseScroll(func){ return this.__deregisterListener("mouseScroll", func); }
    __triggerMouseScroll(amount, event){ return this.__triggerListener("mouseScroll", amount, event); }

    onMouseMove(func){ return this.__registerListener("mouseMove", func); }
    offMouseMove(func){ return this.__deregisterListener("mouseMove", func); }
    __triggerMouseMove(pos, event){ return this.__triggerListener("mouseMove", pos, event); }

    onKeyPress(func){ return this.__registerListener("keyPress", func); }
    offKeyPress(func){ return this.__deregisterListener("keyPress", func); }
    __triggerKeyPress(down, key, event){ return this.__triggerListener("keyPress", down, key, event); }

    //enable/disable interaction
    __updateInteraction(internally){
        if(!this.interactionDisabled)
            if(this.listeners.mouseClick.length==0 && this.listeners.mouseHover.length==0 && this.listeners.mousePress.length==0 && this.listeners.mouseScroll.length==0 && this.listeners.mouseMove.length==0 && this.listeners.keyPress.length==0)
                this.disableInteraction(true);
            else
                this.enableInteraction(true);
    }
    enableInteraction(internally){
        if(!internally) this.interactionsDisabled = false;
    }
    disableInteraction(internally){
        if(!internally) this.interactionsDisabled = true;
    }


    //update
    onUpdate(listener){
        if(this.listeners.update.indexOf(listener)==-1)
            this.listeners.update.push(listener);
        this.__updateUpdates();
        return this;
    }
    offUpdate(listener){
        var index = this.listeners.update.indexOf(listener);
        if(index!=-1)
            this.listeners.update.splice(index, 1);
        this.__updateUpdates();
        return this;
    }
    __triggerUpdate(){
        for(var i=0; i<this.listeners.update.length; i++)
            this.listeners.update[i].apply(this, arguments);
        return this;
    }

    //enable/disable updates
    __updateUpdates(){
        if(!this.updatesDisabled)
            if(this.listeners.update.length==0)
                this.disableUpdates(true);
            else
                this.enableUpdates(true);
    }
    enableUpdates(internally){
        if(!internally) this.updatesDisabled = false;
        this.graphics.activateShape(this);
        return this;
    }
    disableUpdates(internally){
        if(!internally) this.updatesDisabled = true;
        this.graphics.deactivateShape(this);
        return this;
    }

    //parent shape
    __setParentShape(parent){
        this.parentShape = parent;
        this.__triggerRenderChange();


        var tree = this.__getTree();
        if(parent){
            this.__updateAABB();
            if(tree && this.storeInSpatialTree)
                tree.insert(this);
        }else{
            if(tree && this.storeInSpatialTree)
                tree.remove(this);
        }

        return this;
    }
    getParentShape(){
        return this.parentShape;
    }
    getWorldLoc(){
        return this.getLoc();
    }
    getWorldScale(){
        return this.getScale();
    }
    getWorldAngle(){
        return this.getAngle();
    }

    //add or remove from graphics
    getGraphics(){
        return this.graphics;
    }
    add(){
        this.graphics.__registerShape(this);
        this.__updateUpdates();

        var tree = this.__getTree();
        if(tree && this.storeInSpatialTree)
            tree.insert(this);

        this.isRendered = true;
        this.isAlive = true;
        this.__triggerRenderChange();
        return this;
    }
    remove(dontDelete){
        this.graphics.__deregisterShape(this);  //indicate that the node is being removed
        this.isAlive = false;
        if(dontDelete) return this;
        return this.__delete();                 //fully remove it without an animation
    }
    __delete(){
        if(!this.isAlive){
            this.graphics.__deregisterShape(this, true); //remove the node entirely
            this.disableUpdates(true);

            var tree = this.__getTree();
            if(tree && this.storeInSpatialTree)
                tree.remove(this);

            this.isRendered = false;
            this.__triggerRenderChange();
            return this;
        }
    }
    getIsRendered(){
        return this.isRendered;
    }
    getIsAlive(){
        return this.isAlive;
    }

    //add render listener
    onRendererChange(func){
        var index = this.isRenderedListeners.indexOf(func);
        if(index==-1) this.isRenderedListeners.push(func);
        return this;
    }
    offRendererChange(func){
        var index = this.isRenderedListeners.indexOf(func);
        if(index!=-1) this.isRenderedListeners.splice(index, 1);
        return this;
    }
    __triggerRenderChange(){
        if(this.parentShape){
            this.isRendered = this.parentShape.isRendered;
            this.isAlive = this.isRendered;
        }
        if(window.debugging==2)    //show AABB iff rendering now
            this.__updateAABB();
        for(var i=0; i<this.isRenderedListeners.length; i++){
            this.isRenderedListeners[i].call(this, this.isRendered);
        }
    }

    //physics methods
    getVecTo(x, y, z){
        if(x instanceof AbstractShape)
            x = x.getLoc();
        return new Vec(x, y, z).sub(this.getLoc());
    }

    //spatial tree methods
    __getRadius(){
        return 0;
    }
    __getRadiusPadding(){
        return this.__getRadius() * this.getWorldScale() /2;
    }
    __getTree(){
        return this.graphics.getSpatialTree();
    }
    __updateAABB(){
        if(this.storeInSpatialTree){
            var minRad = this.__getRadius() * this.getWorldScale();
            var loc = this.getWorldLoc();
            //check whether the shape moved outside of the loose bounding box
            if( this.aabb.minX > loc.getX()-minRad||
                this.aabb.minY > loc.getY()-minRad||
                this.aabb.minZ > loc.getZ()-minRad||
                this.aabb.maxX < loc.getX()+minRad||
                this.aabb.maxY < loc.getY()+minRad||
                this.aabb.maxZ < loc.getZ()+minRad){

                //remove data from the tree
                var tree = this.__getTree();
                if(tree) tree.remove(this);

                //update the bounding box
                var maxRad = minRad + this.__getRadiusPadding();
                this.aabb = {
                    minX: loc.getX() - maxRad,
                    minY: loc.getY() - maxRad,
                    minZ: loc.getZ() - maxRad,
                    maxX: loc.getX() + maxRad,
                    maxY: loc.getY() + maxRad,
                    maxZ: loc.getZ() + maxRad,
                };

                //reinsert the data into the tree
                if(tree) tree.insert(this);
            }

            //just visualize the aabb for debugging
            if(window.debugging==2){
                if(!this.aabbCube){
                    if(this instanceof Shape3d)
                        this.aabbCube = new Cuboid3d(this.graphics, 0, 0, 0, 0x0000ff).setAlpha(0.15);
                    if(this instanceof Shape2d)
                        this.aabbCube = new Rectangle2d(this.graphics, 0, 0, 0x0000ff).setAlpha(0.15);
                }

                if(this instanceof Shape3d)
                    this.aabbCube.setSize(
                        this.aabb.maxX-this.aabb.minX,
                        this.aabb.maxY-this.aabb.minY,
                        this.aabb.maxZ-this.aabb.minZ
                    ).setLoc(
                        (this.aabb.maxX+this.aabb.minX)/2,
                        (this.aabb.maxY+this.aabb.minY)/2,
                        (this.aabb.maxZ+this.aabb.minZ)/2
                    ).updateTransform();
                // if(this instanceof Shape2d)

                //visualize aabb
                if(this instanceof Shape3d){
                    if(!this.aabbCube.isRendered && this.isRendered)
                        this.graphics.__getScene().add(this.aabbCube.mesh);
                    if(this.aabbCube.isRendered && !this.isRendered)
                        this.graphics.__getScene().remove(this.aabbCube.mesh);
                }
            }
        }
        return this;
    }
    search(radius, filter){
        var tree = this.__getTree();
        if(tree){
            //search the tree
            var loc = this.getWorldLoc();
            var results = tree.search({
                minX: loc.getX() - radius,
                minY: loc.getY() - radius,
                minZ: loc.getZ() - radius,
                maxX: loc.getX() + radius,
                maxY: loc.getY() + radius,
                maxZ: loc.getZ() + radius,
            });

            var This = this;
            if(filter) //apply the filter and make sure to not include 'this'
                return results.filter(function(val){
                    return val!=This && filter.call(val, val);
                });

            //only filter such that 'this' isn't returned
            return results.filter(function(val){ return val!=This; });
        }
        return [];
    }
}
