/*
    Generalized shape abstract class
    Author: Tar van Krieken
    Starting Date: 28/04/2018
*/
class AbstractShape{
    constructor(graphics, extraFields){
        //setup extra fields that get passed
        if(extraFields){
            var keys = Object.keys(extraFields);
            for(var i=0; i<keys.length; i++)
                this[keys[i]] = extraFields[keys[i]];
        }
            
        //set fields
        this.graphics = graphics; 
        
        this.loc = new XYZ(0, 0, 0);                                    //location
        this.rot = new XYZ(0, 0, 0);                                    //rotation
        this.velo = new Vec(0, 0, 0);                                   //velocity for 'physics'
        this.speedFactor = 1;                                           //a constant to multiply the velo with
        this.aabb = {minX:0, maxX:0, minY:0, maxY:0, minZ:0, maxZ:0};   //loose bounding box
        this.color = 0;                                                 //int color
        this.isRendered = false;                                        //whether or not the shape is being rendered
        
        //interaction listeners
        this.hoverListeners = [];
        this.clickListeners = [];
        this.mouseListeners = [];
        this.updateListeners = [];
        
        //whether updates and interactions are disabled
        this.updatesDisabled = false;
        this.interactionsDisabled = false;
        
        //add listener to loc changes in order to update aabb
        var This = this;
        this.loc.onChange(function(){
            This.__updateAABB();
        });
        
        //velo listeners
        this.velo.onChange(function(){
             This.__updateUpdates();
        });
        this.onUpdate(function(delta){
            this.loc.add(new Vec(this.velo).mul(delta*this.speedFactor));
        });
    }
    
    //position
    setX(x){
        this.loc.setX(x);
        return this;
    }
    getX(){
        return this.loc.getX();
    }
    setY(y){
        this.loc.setY(y);
        return this;
    }
    getY(){
        return this.loc.getY();
    }
    setZ(z){
        this.loc.setZ(z);
        return this;
    }
    getZ(){
        return this.loc.getZ();
    }
    setLoc(x, y, z){
        this.loc.set(x, y, z);
        return this;
    }
    getLoc(){
        return this.loc;
    }
    
    //absolute position
    getAbsoluteX(){}
    getAbsoluteY(){}
    getAbsoluteZ(){}
    
    //rotation
    setXRot(x){
        this.rot.setX(x);
        return this;
    }
    getXRot(){
        return this.rot.getX();
    }
    setYRot(y){
        this.rot.setY(y);
        return this;
    }
    getYRot(){
        return this.rot.getY();
    }
    setZRot(z){
        this.rot.setZ(z);
        return this;
    }
    getZRot(){
        return this.rot.getZ();
    }
    setRot(x, y, z){
        this.rot.set(x, y, z);
        return this;
    }
    getRot(){
        return this.rot;
    }
    
    
    //velocity
    getVelo(){
        return this.velo;
    }
    
    //color
    setColor(color){
        this.color = color;
        return this;
    }
    getColor(){
        return this.color;
    }
    
    //event handlers
    //hover
    onHover(listener){
        this.hoverListeners.push(listener);
        this.__updateInteraction();
        return this;
    }
    offHover(listener){
        var index = this.hoverListeners.indexOf(listener);
        if(index!=-1) this.hoverListeners.splice(index, 1);
        this.__updateInteraction();
        return this;
    }
    __triggerHover(){
        var ret = false;
        for(var i=0; i<this.hoverListeners.length; i++)
            if(this.hoverListeners[i].apply(this, arguments))
                ret = true;
        return ret;
    }
    
    //click
    onClick(listener){
        this.clickListeners.push(listener);
        this.__updateInteraction();
        return this;
    }
    offClick(listener){
        var index = this.clickListeners.indexOf(listener);
        if(index!=-1) this.clickListeners.splice(index, 1);
        this.__updateInteraction();
        return this;
    }
    __triggerClick(){
        var ret = false;
        for(var i=0; i<this.clickListeners.length; i++)
            if(this.clickListeners[i].apply(this, arguments))
                ret = true;
        return ret;
    }
    
    //mouse events
    /*
        Types:
        -down
        -up
        -move
    */
    onMouseEvent(listener){
        this.mouseListeners.push(listener);
        this.__updateInteraction();
        return this;
    }
    offMouseEvent(listener){
        var index = this.mouseListeners.indexOf(listener);
        if(index!=-1) this.mouseListeners.splice(index, 1);
        this.__updateInteraction();
        return this;
    }
    __triggerMouseEvent(){
        var ret = false;
        for(var i=0; i<this.mouseListeners.length; i++)
            if(this.mouseListeners[i].apply(this, arguments))
                ret = true;
        return ret;
    }
    
    //update
    onUpdate(listener){
        this.updateListeners.push(listener);
        this.__updateUpdates();
        return this;
    }
    offUpdate(listener){
        var index = this.updateListeners.indexOf(listener);
        if(index!=-1)
            this.updateListeners.splice(index, 1);
        this.__updateUpdates();
        return this;
    }
    __triggerUpdate(){
        for(var i=0; i<this.updateListeners.length; i++)
            this.updateListeners[i].apply(this, arguments);
        return this;
    }
    
    //parent shape
    setParentShape(parent){
        this.parentShape = parent;
        return this;
    }
    getParentShape(){
        return this.parentShape;
    }
    
    //add or remove from graphics
    getGraphics(){
        return this.graphics;
    }
    add(){
        this.graphics.__registerShape(this);
        this.__updateUpdates();
        
        var tree = this.__getTree();
        if(tree)
            tree.insert(this);
            
        this.isRendered = true;
        return this;
    }
    remove(){
        this.graphics.__deregisterShape(this);  //indicate that the node is being removed
        return this.__delete();                 //fully remove it without an animation
    }
    __delete(){
        if(this.graphics){
            this.graphics.__deregisterShape(this, true); //remove the node entirely
            this.disableUpdates(true);
            
            var tree = this.__getTree();
            if(tree)
                tree.remove(this);
                
            this.isRendered = false;
        }
        return this;
    }
    getIsRendered(){
        return this.isRendered;
    }
    
    //enable/disable updates
    __updateUpdates(){
        if(!this.updatesDisabled)
            if(this.velo.getLength()<=0.001 && this.updateListeners.length<=1)
                this.disableUpdates(true);
            else
                this.enableUpdates(true);
    }
    enableUpdates(internally){
        if(!internally) this.updatesDisabled = false;
        if(this.graphics)
            this.graphics.activateShape(this);
        return this;
    }
    disableUpdates(internally){
        if(!internally) this.updatesDisabled = true;
        if(this.graphics)
            this.graphics.deactivateShape(this);
        return this;
    }
    
    //enable/disable interaction
    __updateInteraction(internally){
        if(!this.interactionDisabled)
            if(this.clickListeners.length==0 && this.hoverListeners.length==0 && this.mouseListeners.length==0)
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
    
    //physics methods
    getDelta(xyz){
        if(xyz instanceof AbstractShape)
            xyz = xyz.getLoc();
        return new Vec(this.getLoc()).sub(xyz);
    }
    
    //spatial tree methods
    __getRadius(){
        return 0;
    }
    __getRadiusPadding(){
        return this.__getRadius()/2;
    }
    __getTree(){
        if(this.graphics)
            return this.graphics.getSpatialTree();
    }
    __updateAABB(){
        var minRad = this.__getRadius();
        //check whether the shape moved outside of the loose bounding box
        if( this.aabb.minX > this.getX()-minRad||
            this.aabb.minY > this.getY()-minRad||
            this.aabb.minZ > this.getZ()-minRad||
            this.aabb.maxX < this.getX()-minRad||
            this.aabb.maxY < this.getY()-minRad||
            this.aabb.maxZ < this.getZ()-minRad){
                
            //remove data from the tree
            var tree = this.__getTree();
            if(tree) tree.remove(this);
            
            //update the bounding box
            var maxRad = this.__getRadius()+this.__getRadiusPadding();
            this.aabb = {
                minX: this.getX() - maxRad,
                minY: this.getY() - maxRad,
                minZ: this.getZ() - maxRad,
                maxX: this.getX() + maxRad,
                maxY: this.getY() + maxRad,
                maxZ: this.getZ() + maxRad,
            };
            
            //reinsert the data into the tree
            if(tree) tree.insert(this);
        }
        return this;
    }
    search(radius, filter){
        var tree = this.__getTree();
        if(tree){
            //search the tree
            var results = tree.search({
                minX: this.getX() - radius,
                minY: this.getY() - radius,
                minZ: this.getZ() - radius,
                maxX: this.getX() + radius,
                maxY: this.getY() + radius,
                maxZ: this.getZ() + radius,
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