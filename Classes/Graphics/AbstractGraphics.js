/*
    Generalized graphics abstract class
    Author: Tar van Krieken
    Starting Date: 28/04/2018
*/
class AbstractGraphics{
    constructor(width, height, container){
        this.updateListeners = [];
        this.background = 0;
        
        //if no height and width is defined, use size of container instead
        if(!height){
            if(!width) width = $("body");
            container = width;
            width = $(container).width();
            height = $(container).height();
        }
        
        this.size = {
            width: width,
            height: height
        };
        
        if(!container) container=$("body");
        this.container = $(container);
        
        //shape data storage
        this.shapes = [];
        this.activeShapes = []; //the shapes that are currently actively updated
        this.spatialTree = new rbush3d(16, ['.aabb.minX', '.aabb.minY', '.aabb.minZ', '.aabb.maxX', '.aabb.maxY', '.aabb.maxZ']);;
        
        //update active shapes
        this.onUpdate(function(delta){
            for(var i=0; i<this.activeShapes.length; i++){
                this.activeShapes[i].__triggerUpdate(delta);
            }
        });
    }
    getCamera(){
        return this.camera;
    }
    getSpatialTree(){
        return this.spatialTree;
    }
    
    //just retrieve some container info
    getWidth(){
        return this.size.width;
    }
    getHeight(){
        return this.size.height;
    }
    getContainer(){
        return this.container;
    }
    
    //a method to add an event that fires whenever the screen is rendered
    onUpdate(listener){
        this.updateListeners.push(listener);
        return this;
    }
    offUpdate(listener){
        var index = this.updateListeners.indexOf(listener);
        if(index!=-1) this.updateListeners.splice(index, 1);
        return this;
    }
    __triggerUpdate(){
        for(var i=0; i<this.updateListeners.length; i++)
            this.updateListeners[i].apply(this, arguments);
        return this;
    }
    
    //methods to add and remove shapes from the window
    add(shape){
        for(var i=0; i<arguments.length; i++)
            arguments[i].addTo(this);
        return this;
    }
    remove(shape){
        for(var i=0; i<arguments.length; i++)
            arguments[i].removeFrom(this);
        return this;
    }
    
    //methods to active or deactive shapes
    activateShape(shape){
        for(var i=0; i<arguments.length; i++)
            this.activeShapes.push(arguments[i]);
        return this;
    }
    deactivateShape(shape){
        for(var i=0; i<arguments.length; i++){
            var shape = arguments[i];
            var index = indexOf(shape);
            if(index!=-1) this.activeShapes.splice(index, 1);
        }
        return this;
    }
    
    //background color
    setBackground(color){
        this.background = color;
        return this;
    }
    getBackground(){
        return this.background;
    }
    
    //get all shapes
    getShapes(){
        return this.shapes;
    }
}