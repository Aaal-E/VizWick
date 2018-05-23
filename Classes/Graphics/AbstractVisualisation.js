/*
    Generalized Visualisation abstract class that manages visualisation aspects of the graphics
    Author: Tar van Krieken
    Starting Date: 16/5/2018, but the content was initially part of 2d/Visualisation.js
*/
class AbstractVisualisation extends AbstractGraphics{    //will 'extend' concrete graphics
    constructor(){ super(); } //constructor will never be used
    __setupVisualisation(tree, options){  //acts as the constructor
        this.tree = tree;
        this.options = options;
        this.name = "VIS"+Math.floor(Math.random()*Math.pow(10, 6));    //just generate a random name for if none is provided
        
        this.shapes.root = [];      //shapes that don't have visible parents
        this.shapes.leave = [];     //shapes that don't have any children
        this.shapes.collapsed = []; //shapes that don't show all their children
        this.shapes.node = [];     //all nodes ever created (for disposal usage)
        this.shapes.unique = {
            focused: null,     //the shape in the center
            selected: null,    //the highlighted shape
            dragging: null,    //the shape that is being dragged around
        };
        
        this.__setupRoot();
        this.__setupOptions(options);
        
        this.DOMEventListeners.mouseUp = (function(){
            if(this.shapes.unique.dragging)
                this.shapes.unique.dragging.__changeState("dragged", false);
            this.shapes.unique.dragging = null;
        }).bind(this);
        $(document).on("mouseup", this.DOMEventListeners.mouseUp);
    }
    getName(){
        return this.name;
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
    
    //destroy
    __destroy(callback){
        var This = this;
        var finish = function(){
            This.getCanvas().remove();
            if(callback) callback.call(This);
        };
        
        var nodes = this.getShapesNode();
        var destroyLeft = nodes.length;
        
        var countFunc = function(){
            if(--destroyLeft==0)
                finish();
        };
        
        for(var i=nodes.length-1; i>=0; i--)
            nodes[i].destroy(countFunc);
    }
    
    
    //dynamic tree growing/shrinking methods
    __registerShapeType(type, shape){
        var shapes = this.__getShapesType(type);
        var index = shapes.indexOf(shape);
        if(index==-1) shapes.push(shape);
        return this;
    }
    __deregisterShapeType(type, shape){
        var shapes = this.__getShapesType(type);
        var index = shapes.indexOf(shape);
        if(index!=-1) shapes.splice(index, 1);
        return this;
    }
    __getShapesType(type){
        return this.shapes[type];
    }
    
    __registerShapeRoot(shape){ return this.__registerShapeType("root", shape); }
    __deregisterShapeRoot(shape){ return this.__deregisterShapeType("root", shape); }
    getShapesRoot(){ return this.__getShapesType("root"); }
    
    __registerShapeLeave(shape){return this.__registerShapeType("leave", shape); }
    __deregisterShapeLeave(shape){return this.__deregisterShapeType("leave", shape); }
    getShapesLeave(){return this.__getShapesType("leave"); }
    
    __registerShapeCollapsed(shape){ return this.__registerShapeType("collapsed", shape); }
    __deregisterShapeCollapsed(shape){ return this.__deregisterShapeType("collapsed", shape); }
    getShapesCollapsed(){ return this.__getShapesType("collapsed"); }
    
    __registerShapeNode(shape){ return this.__registerShapeType("node", shape); }
    __deregisterShapeNode(shape){ return this.__deregisterShapeType("node", shape); }
    getShapesNode(){ return this.__getShapesType("node"); }
    
    growTree(growNodes, shrinkNodes){ //grows towards the leaves
        //clean up input data, making sure it is an array of nodes
        if(!(growNodes instanceof Array))
            if(!growNodes)  growNodes = this.getShapesCollapsed();
            else            growNodes = [growNodes];
        
        if(!(shrinkNodes instanceof Array))
            if(!shrinkNodes)    shrinkNodes = this.getShapesRoot();
            else                shrinkNodes = [shrinkNodes];
        
        var ret;
        
        //find min depth node to grow
        var growNode = growNodes[0];
        for(var j=1; j<growNodes.length; j++){
            var gn = growNodes[j];
            if(gn.getDepth()<growNode.getDepth()) 
                growNode = gn;
        }
        if(growNode) ret= growNode.createChild();
        
        //remove some node if there are too many
        if(this.getShapes().length>this.maxNodeCount){
            //find min depth node to remove
            var shrinkNode = shrinkNodes[0];
            for(var j=1; j<shrinkNodes.length; j++){
                var sn = shrinkNodes[j];
                if(sn.getDepth()<shrinkNode.getDepth()) 
                    shrinkNode = sn;
            }
            
            if(shrinkNode) shrinkNode.remove();
        }
        return ret;
    }
    shrinkTree(growNodes, shrinkNodes){ //grows towards the root
        //clean up input data, making sure it is an array of nodes
        if(!(growNodes instanceof Array))
            if(!growNodes)  growNodes = this.getShapesRoot()
            else            growNodes = [growNodes];
        
        if(!(shrinkNodes instanceof Array))
            if(!shrinkNodes)    shrinkNodes = this.getShapesLeave();
            else                shrinkNodes = [shrinkNodes];
        
        var ret;
        
        //find max depth node to grow
        var growNode = growNodes[0];
        for(var j=1; j<growNodes.length; j++){
            var gn = growNodes[j];
            if(gn.getDepth()>growNode.getDepth()) 
                growNode = gn;
        }
        if(growNode) ret = growNode.createParent();
        
        //remove some node if there are too many
        if(this.getShapes().length>this.maxNodeCount){
            //find max depth node to remove
            var shrinkNode = shrinkNodes[0];
            for(var j=1; j<shrinkNodes.length; j++){
                var sn = shrinkNodes[j];
                if(sn.getDepth()>shrinkNode.getDepth()) 
                    shrinkNode = sn;
            }
            
            if(shrinkNode) shrinkNode.remove();
        }
        return ret;
    }
}