/*
    Generalized shape abstract class
    Author: Tar van Krieken
    Starting Date: 28/04/2018
*/
class AbstractShape{
    constructor(){
        this.loc = new Loc(0, 0, 0);
        this.rot = new Loc(0, 0, 0);
        this.aabb = {minX:0, maxX:0, minY:0, maxY:0, minZ:0, maxZ:0};
        this.color = 0;
        this.hoverListeners = [];
        this.clickListeners = [];
        this.updateListeners = [];
        
        //add listener to loc changes in order to update aabb
        var This = this;
        this.loc.listen(function(){
            This.__updateAABB();
        });
    }
    
    //position
    x(x){
        if(x!=null){
            this.loc.x(x);
            return this;
        }
        return this.loc.x();
    }
    y(y){
        if(y!=null){
            this.loc.y(y);
            return this;
        }
        return this.loc.y();
    }
    z(z){
        if(z!=null){
            this.loc.z(z);
            return this;
        }
        return this.loc.z();
    }
    setLoc(x, y, z){
        this.loc.set(x, y, z);
        return this;
    }
    getLoc(){
        return this.loc;
    }
    
    //rotation
    xRot(x){
        if(x!=null){
            this.rot.x(x);
            return this;
        }
        return this.rot.x();
    }
    yRot(y){
        if(y!=null){
            this.rot.y(y);
            return this;
        }
        return this.rot.y();
    }
    zRot(z){
        if(z!=null){
            this.rot.z(z);
            return this;
        }
        return this.rot.z();
    }
    setRot(x, y, z){
        this.rot.set(x, y, z);
        return this;
    }
    getRot(){
        return this.rot;
    }
    
    //color
    color(color){
        if(color!=null){
            this.color = color;
            return this;
        }
        return this.color;
    }
    
    //event handlers
    hover(listener){
        if(listener instanceof Function){
            var index = this.hoverListeners.indexOf(listener);
            if(index==-1)
                this.hoverListeners.push(listener);
            else
                this.hoverListeners.splice(index, 1);
        }else{
            for(var i=0; i<this.hoverListeners.length; i++)
                this.hoverListeners[i].apply(this, arguments);
        }
    }
    click(listener){
        if(listener instanceof Function){
            var index = this.clickListeners.indexOf(listener);
            if(index==-1)
                this.clickListeners.push(listener);
            else
                this.clickListeners.splice(index, 1);
        }else{
            for(var i=0; i<this.clickListeners.length; i++)
                this.clickListeners[i].apply(this, arguments);
        }
    }
    update(listener){
        if(listener instanceof Function){
            var index = this.updateListeners.indexOf(listener);
            if(index==-1){
                this.updateListeners.push(listener);
                if(this.updateListeners.length==1) this.activate();
            }else{
                this.updateListeners.splice(index, 1);
                if(this.updateListeners.length==0) this.deactivate();
            }
        }else{
            for(var i=0; i<this.updateListeners.length; i++)
                this.updateListeners[i].apply(this, arguments);
        }
    }
    
    //add or remove from graphics
    addTo(graphics){
        this.graphics = graphics;
        this.graphics.shapes().push(this);
        
        var tree = this.graphics.spatialTree();
        if(tree)
            tree.insert(this);
    }
    removeFrom(graphics){
        if(this.graphics==graphics)
            this.remove();
    }
    remove(){
        if(this.graphics){
            var shapes = this.graphics.shapes();
            var index = shapes.indexOf(shapes);
            if(index!=-1) shapes.splice(index, 1);
            
            var tree = this.graphics.spatialTree();
            if(tree)
                tree.remove(this);
        }
        this.graphics = null;
    }
    
    //activate /deactive the updating
    activate(){
        if(this.graphics)
            this.graphics.activateShape(this);
    }
    deactivate(){
        if(this.graphics)
            this.graphics.deactivateShape(this);
    }
    
    //spatial tree methods
    __getRadius(){
        return 0;
    }
    __getRadiusPadding(){
        return 20;
    }
    __getTree(){
        if(this.graphics)
            return this.graphics.spatialTree();
    }
    __updateAABB(){
        var minRad = this.__getRadius();
        //check whether the shape moved outside of the loose bounding box
        if( this.aabb.minX > this.x()-minRad||
            this.aabb.minY > this.y()-minRad||
            this.aabb.minZ > this.z()-minRad||
            this.aabb.maxX < this.x()-minRad||
            this.aabb.maxY < this.y()-minRad||
            this.aabb.maxZ < this.z()-minRad){
                
            //remove data from the tree
            var tree = this.__getTree();
            if(tree) tree.remove(this);
            
            //update the bounding box
            var maxRad = this.__getRadius()+this.__getRadiusPadding();
            this.aabb = {
                minX: this.x() - maxRad,
                minY: this.y() - maxRad,
                minZ: this.z() - maxRad,
                maxX: this.x() + maxRad,
                maxY: this.y() + maxRad,
                maxZ: this.z() + maxRad,
            };
            
            //reinsert the data into the tree
            if(tree) tree.insert(this);
        }
    }
    distance(shape){
        var dx = this.x() - shape.x();
        var dy = this.y() - shape.y();
        var dz = this.z() - shape.z();
        return Math.sqrt(dx*dx + dy*dy + dz*dz);
    }
    squaredDistance(shape){
        var dx = this.x() - shape.x();
        var dy = this.y() - shape.y();
        var dz = this.z() - shape.z();
        return dx*dx + dy*dy + dz*dz;
    }
    search(radius, filter){
        var tree = this.__getTree();
        if(tree){
            //search the tree
            var results = tree.search({
                minX: this.x() - radius,
                minY: this.y() - radius,
                minZ: this.z() - radius,
                maxX: this.x() + radius,
                maxY: this.y() + radius,
                maxZ: this.z() + radius,
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