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
        this.cont = $(container);
        
        //shape data storage
        this.shapeList = [];
        this.activeShapeList = []; //the shapes that are currently actively updated
        this.rbush = new rbush3d(16, ['.aabb.minX', '.aabb.minY', '.aabb.minZ', '.aabb.maxX', '.aabb.maxY', '.aabb.maxZ']);;
        
        //update active shapes
        this.update(function(delta){
            for(var i=0; i<this.activeShapeList.length; i++){
                this.activeShapeList[i].update(delta);
            }
        });
    }
    camera(){
        return this.cam;
    }
    spatialTree(){
        return this.rbush;
    }
    
    //just retrieve some container info
    width(){
        return this.size.width;
    }
    height(){
        return this.size.height;
    }
    container(){
        return this.cont;
    }
    
    //a method to add an event that fires whenever the screen is rendered
    update(listener){
        if(listener instanceof Function){
            var index = this.updateListeners.indexOf(listener);
            if(index==-1)
                this.updateListeners.push(listener);
            else
                this.updateListeners.splice(index, 1);
        }else{
            for(var i=0; i<this.updateListeners.length; i++)
                this.updateListeners[i].apply(this, arguments);
        }
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
            this.activeShapeList.push(arguments[i]);
        return this;
    }
    deactivateShape(shape){
        for(var i=0; i<arguments.length; i++){
            var shape = arguments[i];
            var index = indexOf(shape);
            if(index!=-1) this.activeShapeList.splice(index, 1);
        }
        return this;
    }
    
    //background color
    background(color){
        if(color!=null){
            this.background = color;
            return this;
        }
        return this.background;
    }
    
    //get all shapes
    shapes(){
        return this.shapeList;
    }
}