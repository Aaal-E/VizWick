/*
    Generalized shape abstract class
    Author: Tar van Krieken
    Starting Date: 28/04/2018
*/
class AbstractShape{
    constructor(){
        this.loc = new XYZ(0, 0, 0);
        this.rot = new XYZ(0, 0, 0);
        this.aabb = {minX:0, maxX:0, minY:0, maxY:0, minZ:0, maxZ:0};
        this.color = 0;
        this.hoverListeners = [];
        this.clickListeners = [];
        this.updateListeners = [];
        
        //add listener to loc changes in order to update aabb
        var This = this;
        this.loc.onChange(function(){
            This.__updateAABB();
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
        for(var i=0; i<this.hoverListeners.length; i++)
            this.hoverListeners[i].apply(this, arguments);
        return this;
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
        for(var i=0; i<this.clickListeners.length; i++)
            this.clickListeners[i].apply(this, arguments);
        return this;
    }
    
    //update
    onUpdate(listener){
        this.updateListeners.push(listener);
        if(this.updateListeners.length==1) this.enableUpdates();
        return this;
    }
    offUpdate(listener){
        var index = this.updateListeners.indexOf(listener);
        if(index!=-1){
            this.updateListeners.splice(index, 1);
            if(this.updateListeners.length==0) this.disableUpdates();
        } 
        return this;
    }
    __triggerUpdate(){
        for(var i=0; i<this.updateListeners.length; i++)
            this.updateListeners[i].apply(this, arguments);
        return this;
    }
    
    //add or remove from graphics
    addTo(graphics){
        this.graphics = graphics;
        this.graphics.getShapes().push(this);
        
        var tree = this.__getTree();
        if(tree)
            tree.insert(this);
        return this;
    }
    removeFrom(graphics){
        if(this.graphics==graphics)
            this.remove();
        return this;
    }
    remove(){
        if(this.graphics){
            var shapes = this.graphics.getShapes();
            var index = shapes.indexOf(shapes);
            if(index!=-1) shapes.splice(index, 1);
            
            var tree = this.__getTree();
            if(tree)
                tree.remove(this);
        }
        this.graphics = null;
        return this;
    }
    
    //enable/disable updates
    enableUpdates(){
        if(this.graphics)
            this.graphics.activateShape(this);
        return this;
    }
    disableUpdates(){
        if(this.graphics)
            this.graphics.deactivateShape(this);
        return this;
    }
    
    //enable/disable interaction
    __updateInteraction(){
        if(this.clickListeners.length==0 && this.hoverListeners.length==0)
            this.disableInteraction();
        else
            this.enableInteraction();
    }
    enableInteraction(){}
    disableInteraction(){}
    
    //spatial tree methods
    __getRadius(){
        return 0;
    }
    __getRadiusPadding(){
        return 20;
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
    getDistance(shape){
        var dx = this.getX() - shape.getX();
        var dy = this.getY() - shape.getY();
        var dz = this.getZ() - shape.getZ();
        return Math.sqrt(dx*dx + dy*dy + dz*dz);
    }
    getSquaredDistance(shape){
        var dx = this.getX() - shape.getX();
        var dy = this.getY() - shape.getY();
        var dz = this.getZ() - shape.getZ();
        return dx*dx + dy*dy + dz*dz;
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