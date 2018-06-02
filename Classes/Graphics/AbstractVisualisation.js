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

        this.shapes.root = [];      //shapes that don't have visible parents
        this.shapes.leave = [];     //shapes that don't have any children
        this.shapes.collapsed = []; //shapes that don't show all their children
        this.shapes.node = [];     //all nodes ever created (for disposal usage)
        this.shapes.unique = {
            focused: null,     //the shape in the center
            selected: null,    //the highlighted shape by clicking
            dragging: null,    //the shape that is being dragged around
            highlighted: null, //the highlighted shape by hovering
        };

        this.maxNodeCount = 1000;

        this.__setupRoot();
        this.__setupOptions(options);

        this.DOMEventListeners.mouseUp = (function(){
            if(this.shapes.unique.dragging)
                this.shapes.unique.dragging.__changeState("dragged", false);
            this.shapes.unique.dragging = null;
        }).bind(this);
        $(document).on("mouseup", this.DOMEventListeners.mouseUp);
    }

    getTree(){
        return this.tree;
    }
    getOptions(){
        return this.options;
    }

    //setup
    __setupOptions(options){}

    //max node count (this isn't a super strict value, it is only used by nodeShape.createDescendants)
    setMaxNodeCount(count){
        this.maxNodeCount = count;
        return this;
    }
    getMaxNodeCount(){
        return this.maxNodeCount;
    }

    //synchronization
    synchronizeNode(type, node, forwarded){
        var shape = node && node.getShape(this.getUID());
        if(this.shapes.unique[type])
            this.shapes.unique[type].__changeState(type, false);

        if(type=="focused" && (!shape || !shape.isRendered)){
            shape = this.createNodeShape(node).add();
            console.log(shape);
            if(!shape.getConnectedNodeShape()){ //shape is not connected with other existing shapes
                //get rid of all existing shapes, except shape
                for(var i=this.shapes.root.length-1; i>=0; i--){
                    var root = this.shapes.root[i];
                    if(root!=shape){
                        root.destroyDescendants(0, shape)
                        root.remove();
                    }
                }
            }
        }

        this.shapes.unique[type] = shape;
        if(shape)
            shape.__changeState(type, true);

        //forward to other visualizations, if this wasn't a forward of itself
        if(!forwarded)
            VisualisationHandler.synchronizeNode(type, node, this);
        return this;
    }
    setShapeState(type, shape){ //a method to synchonize nodes to be called from the nodeShape
        var node = shape && shape.getNode && shape.getNode();
        this.synchronizeNode(type, node);
        return this;
    }

    //dragging (not synchronized)
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
            console.log("create");
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

        //TODO make this work with visualisation handler
        var countFunc = function(){
            // if(--destroyLeft==0)
            //     finish();
        };

        for(var i=nodes.length-1; i>=0; i--)
            nodes[i].destroy(countFunc);

        this.options.destroy();

        finish();
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
