/*
    Generalized Visualisation abstract class that manages visualisation aspects of the graphics
    Author: Tar van Krieken
    Starting Date: 16/5/2018, but the content was initially part of 2d/Visualisation.js
*/
class AbstractVisualisation extends AbstractGraphics{    //will 'extend' concrete graphics
    constructor(){} //constructor will never be used
    __setupVisualisation(tree){  //acts as the constructor
        this.tree = tree;
        this.options = options;
        
        this.shapes.unique = {
            focusedShape: null,   //the shape in the center
            selectedShape: null,  //the highlighted shape
            draggingShape: null,  //the shape that is being dragged around
        };
        
        this.__setupRoot();
        this.__setupOptions(options);
        
        this.DOMEventListeners.mouseUp = (function(){
            if(this.draggingShape)
                this.draggingShape.__changeState("dragged", false);
            this.draggingShape = null;
        }).bind(this);
        $(window).on("mouseup", this.DOMEventListeners.mouseUp);
    }
    
    
    //setup
    __setupOptions(options){}
    
    selectShape(shape){
        if(this.shapes.unique.selected)
            this.shapes.unique.selected.__changeState("selected", false);
        this.shapes.unique.selected = shape;
        if(shape)
            shape.__changeState("selected", true);
        return this;
    }
    focusShape(shape){
        if(this.shapes.unique.focused)
            this.shapes.unique.focused.__changeState("focused", false);
        this.shapes.unique.focused = shape;
        if(shape)
            shape.__changeState("focused", true);
        return this;
    }
    dragShape(shape){
        if(this.shapes.unique.dragging)
            this.shapes.unique.dragging.__changeState("dragged", false);
        this.shapes.unique.dragging = shape;
        if(shape)
            shape.__changeState("dragged", true);
        return this;
    }
    
    //shape dragging
    __onUpdate(deltaTime){
        if(this.shapes.unique.dragging)
            this.shapes.unique.dragging.__onDrag(this.getMouseLoc());
        super.__onUpdate(deltaTime);
    }
    
    //classes
    __getNodeShapeClass(VIZ, node){}
    
    //create node shape
    createNodeShape(node){
        var UID = this.getUID();
        var shape = node.getShape(UID);
        if(shape){  //a node shape already exists, simply return that one
            return shape;
        }else{
            //find closest ancestor for which a shape does exists:
            var path = [node];
            var p = node.getParent();
            while(!p.getShape(UID)){
                path.unshift(p);
                p = p.getParent();
            }
            
            //create entire path from parent to node
            for(var i=0; i<path.length; i++){
                var node = path[i];
                var parentShape = node.getParent().getShape(UID);
                var nodeShape = parentShape.createChild(node, true);
                // nodeShape.add().remove();   //connect the shape, but stop rendering immediately after
                path.splice(i, 1, nodeShape); //replace node with nodeShape in path
            }
            
            return path[path.length-1];
        }
    }
}