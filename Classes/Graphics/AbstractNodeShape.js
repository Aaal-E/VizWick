/*
    Generalized NodeShape abstract class that manages sub shapes
    Author: Tar van Krieken
    Starting Date: 16/5/2018, but the content was initially part of 2d/Shapes/NodeShape.js
*/
class AbstractNodeShape extends AbstractShape{    //will 'extend' a concrete shape
    constructor(){ super(); } //constructor will never be used
    __setupNodeShape(node){  //acts as the constructor
        this.node = node;

        this.connectionHasBeenSetup = false; //track if an initial connection has ever been made

        //keep track of some tree related properties to decide how to grow and shrink the visualisation
        this.parent = null;
        this.children = [];
        this.__init();      //seperate method in order to allow for it to be overwritten

        //save state data
        this.state = {
            expanded: this.node.getChildren().length==0,
            selected: false,
            highlighted: false,
            focused: false,
            dragged: false,
        };

        //setup connection
        var parent = this.__getParentFromNode();
        this.__connectParent(parent);
    }

    getNode(){
        return this.node;
    }
    destroy(callback){
        this.getNode().removeShape(this.graphics.getUID(), this);
        this.destroyCallback = callback;
        this.remove();
        this.graphics.__deregisterShapeNode(this);
        return this;
    }

    getVisualisation(){
        return this.getGraphics();
    }

    //rendering related methods
    __show(){}                                  //method to be extended to animate the appearance of the node
    __hide(){return true}                       //method to be extended to animate the dissapearance of the node
    __stateChanged(field, val, oldState){}      //method to be extended to update the visuals to represent the state
    __connectParent(parent){}                   //method to be extended to connect the parent shape

    __changeState(field, value){
        var oldState = Object.assign({}, this.state);
        this.state[field] = value;
        var changed = oldState[field]!=this.state[field];
        this.__stateChanged(changed?field:null, changed?value:null, oldState);
        return this;
    }

    //to be used when creating child or parent instances
    __getClass(node){
        //attempt to get from graphics
        var getFromGFX = this.graphics.__getNodeShapeClass;
        if(getFromGFX) return getFromGFX.call(this.graphics, Visualisation2d.classes, node);

        //otherwise return this class
        return this.__proto__.constructor;
    }

    __init(){  //initialise node connection
        var UID = this.graphics.getUID();
        var prevShape = this.node.getShape(UID);
        this.graphics.__registerShapeNode(this);

        if(prevShape==this) return; //this shape has already been set up

        if(prevShape!=null){ // it shouldn't occur that 1 node gets created twice
            console.warn("A shape in the tree got overwritten", prevShape);
            prevShape.remove();
        }


        this.node.addShape(UID, this);
    }

    //adding/removing
    __addNode(){
        if(this.children.length==0){    //otherwise it is already added
            //register shape as root and leave, as no parent or children are set up yet
            this.graphics.__registerShapeLeave(this);
            this.graphics.__registerShapeRoot(this);
            if(this.__getChildNodes().length!=this.children.length)
            this.graphics.__registerShapeCollapsed(this);

            //initially a node is never expanded upon creation
            this.__changeState("expanded", this.node.getChildren().length==0);

            //connect the parent and child nodes
            var parent = this.__getParentFromNode(true);
            if(parent) this.__setParent(parent);

            var children = this.__getChildrenFromNode(true);
            for(var i=0; i<children.length; i++)
            this.__addChild(children[i]);

            //update visuals for the state
            this.__stateChanged(null, null, this.state);
            this.__show();
        }
        return this;
    }
    __removeNode(){
        return !this.__hide();
    }
    __deleteNode(){
        //test: keep the node around, but don't render it
        // //if the shape is deleted from the visualisation, disconnect it from the tree
        // if(this.graphics && this.node)
        //     this.node.removeShape(this.graphics.getUID());

        //remove itself from parent
        parent = this.getParent();
        if(parent) parent.__removeChild(this);

        //remove fron children
        for(var i=0; i<this.children.length; i++)
            this.children[i].__setParent(null);

        //clean up own relations
        this.__setParent(null);
        this.children = [];

        //indicate that this shape is no longer anything in tree
        this.graphics.__deregisterShapeRoot(this);
        this.graphics.__deregisterShapeCollapsed(this);
        this.graphics.__deregisterShapeLeave(this);

        if(this.destroyCallback){ //a method that listens for the destroy method to finish
            this.destroyCallback();
            delete this.destroyCallback;
        }
        return this;
    }

    //relation methods
    __setParent(parentShape){
        if(this.parent!=parentShape){
            this.parent = parentShape;
            if(parentShape){
                parentShape.__addChild(this);   //will only be added if it wasn't already
                this.graphics.__deregisterShapeRoot(this);  //indicate that this shape is no longer a root
            }else{
                this.graphics.__registerShapeRoot(this);    //indicate that this shape is now a root
            }
        }
        return this;
    }
    __addChild(childShape){
        var index = this.children.indexOf(childShape);
        if(index==-1){
            this.children.push(childShape);
            childShape.__setParent(this);   //will only be set if it wasn't already
            if(this.children.length==1)
                this.graphics.__deregisterShapeLeave(this);    //indicate that this shape is no longer a leave
            if(this.__getChildNodes().length==this.children.length){
                this.graphics.__deregisterShapeCollapsed(this); //indicate that there is nothing left to expand
                this.__changeState("expanded", true);
            }
        }
        return this;
    }
    __removeChild(childShape){
        var index = this.children.indexOf(childShape);
        if(index!=-1){
            if(this.__getChildNodes().length==this.children.length)
                this.graphics.__registerShapeCollapsed(this);//indicate that there is something left to expand

            this.children.splice(index, 1);
            if(this.getIsAlive()){  //don't change to leave if it was only for the animating process
                if(this.children.length==0)
                    this.graphics.__registerShapeLeave(this);    //indicate that this shape is now a leave
                this.__changeState("expanded", false);
            }
        }
        return this;
    }

    getParent(onlyAlive){
        if(!onlyAlive || (this.parent && this.parent.getIsAlive()))
            return this.parent;
    }
    isParent(shape){
        return this.parent==shape;
    }
    isRoot(){
        return !this.parent;
    }
    isLeave(){
        return this.children.length==0;
    }
    getChildren(onlyAlive){
        if(!onlyAlive)
            return this.children;

        var ret = [];
        for(var i=0; i<this.children.length; i++){
            var child = this.children[i];
            if(child.getIsAlive()) ret.push(child);
        }
        return ret;
    }
    isChild(shape){
        return this.children.indexOf(shape)!=-1;
    }
    getAncestors(depth, onlyAlive){
        if(depth==null) depth=Infinity;
        if(depth<=0) return [];

        var ret = [];
        var p = this.getParent(onlyAlive);
        if(p){
            ret.push(p);
            ret.push.apply(p, p.getAncestors(depth-1));
        }
        return ret;
    }
    getAncestorsTo(shape){
        var ret = [];
        var p = this.getParent();
        if(p && p!=shape){
            ret.push(p);
            ret.push.apply(p, p.getAncestors(depth-1));
        }
        return ret;
    }
    getDescendants(depth, onlyAlive){
        if(depth==null) depth=Infinity;
        if(depth<=0) return [];

        var ret = [];
        var children = this.getChildren(onlyAlive);
        ret.push.apply(ret, children);
        for(var i=0; i<children.length; i++){
            var child = children[i];
            ret.push.apply(ret, child.getDescendants(depth-1));
        }
        return ret;
    }
    getConnectedNodeShape(onlyAlive){
        var parent = this.getParent(onlyAlive);
        if(parent) return parent;
        return this.getChildren(onlyAlive)[0];
    }

    __getParentFromNode(requiresRendered){  //get parent node through the tree, as it might not have been connected yet
        var parentNode = this.__getParentNode();
        if(parentNode){
            var shape = parentNode.getShape(this.graphics.getUID());
            return shape.getIsRendered()||!requiresRendered? shape: undefined;
        }
    }
    __getChildrenFromNode(requiresRendered){//get child nodes through the tree, as they might not have been connected yet
        var UID = this.graphics.getUID();
        var children = [];
        var nodeChildren = this.__getChildNodes();
        if(nodeChildren){
            for(var i=0; i<nodeChildren.length; i++){
                var shape = nodeChildren[i].getShape(UID);
                if(shape && (shape.getIsRendered() || !requiresRendered))
                    children.push(shape);
            }
        }
        return children;
    }

    //tree node retrieval methods (instead of shapes)
    __getMissingChildNodes(){
        var UID = this.graphics.getUID();
        var children = [];
        var nodeChildren = this.__getChildNodes();
        if(nodeChildren){
            for(var i=0; i<nodeChildren.length; i++){
                var shape = nodeChildren[i].getShape(UID);
                if(!shape || !shape.getIsRendered())
                    children.push(nodeChildren[i]);
            }
        }
        return children;
    }
    __getChildNodes(){
        return this.node.getChildren();
    }
    __getParentNode(){
        return this.node.getParent();
    }

    //tree statistics methods
    getDepth(){
        return this.node.getDepth();
    }
    getIndex(){
        return this.__getParentNode()?this.__getParentNode().getChildren().indexOf(this.node):0;
    }

    //methods for creating parent/children nodes
    __createChildNodeShape(node, parent){
        return new (this.__getClass(node))(this.getGraphics(), node);
    }
    createParent(dontAdd){
        if(!this.getParent()){ //make sure there isn't already a parent shape
            var UID = this.graphics.getUID();
            var parentNode = this.__getParentNode();
            if(parentNode){
                var shape = parentNode.getShape(UID);
                if(!dontAdd)
                    shape.add();
                return shape;
            }
        }
    }
    createAncestors(depth, dontAdd){
        //depth indicates how many layers to create
        if(depth==null) depth = 1;

        var ret = [];
        if(depth>=1){
            var p = this.createParent(dontAdd);
            if(p) ret.push(p);  //only add p if it waas just created

            var p = this.getParent();
            if(p) ret.push.apply(ret, p.createAncestors(depth-1)); //recurse
        }
        return ret;
    }
    destroyParent(){
        var parent = this.getParent();
        if(parent){
            return parent.remove();
        }
    }
    destroyAncestors(depth, fully, keep){
        //depth indicates how many layers to keep
        //fully indicates whether to also destroy descendants
        if(depth==null) depth = 0;

        var ret = [];
        var parent = this.getParent();
        if(parent && parent!=keep){
            if(fully)
                ret.push.apply(ret, parent.destroyDescendants(0, [this])); //don't destroy this decendant
            ret.push.apply(ret, parent.destroyAncestors(depth-1, fully));
            if(depth<=0)
                ret.push(parent.remove());
        }
        return ret;
    }
    createChild(node, dontAdd){
        var UID = this.graphics.getUID();
        if(!node){
            var missingChildNodes = this.__getMissingChildNodes();
            node = missingChildNodes[0];
        }
        if(node){
            var shape = node.getShape(UID);
            if(!shape)
                shape = this.__createChildNodeShape(node, this);
            if(!dontAdd)
                shape.add();
            return shape;
        }
    }
    createChildren(dontAdd){
        var UID = this.graphics.getUID();
        var missingChildNodes = this.__getMissingChildNodes();

        var ret = [];
        for(var i=0; i<missingChildNodes.length; i++){
            var node = missingChildNodes[i];
            var shape = node.getShape(UID);
            if(!shape)
                shape = this.__createChildNodeShape(node, this);
            if(!dontAdd)
                shape.add();
            ret.push(shape);
        }
        return ret;
    }
    createDescendants(depth, dontAdd){
        //depth indicates how many layers to create
        if(depth==null) depth = 1;

        var ret = [];

        var UID = this.graphics.getUID();
        var shapes = this.graphics.getShapes(); //a list of all the rendered shapes
        var max = this.graphics.getMaxNodeCount();

        //use a que for a bfs kind of algorithm
        var que = [{depth:depth, shape:this}];
        outer:
        while(que.length>0){
            var data = que.shift();
            var pShape = data.shape;

            //create children of shape
            var children = pShape.__getChildNodes();
            for(var i=0; i<children.length; i++){
                var node = children[i];
                var shape = node.getShape(UID);
                if(!shape)
                    shape = pShape.__createChildNodeShape(node, pShape);
                if(!shape.getIsRendered()){
                    if(!dontAdd)
                        shape.add();
                    ret.push(shape);
                }

                //add children to que in order to create their children, or break if too many
                if(data.depth>1) que.push({depth:data.depth-1, shape:shape});
                if(shapes.length>max) break outer;
            }
        }

        return ret;
    }
    destroyChildren(keep){
        //keep is a list of shapes you don't want to destroy
        var children = this.getChildren();
        for(var i=children.length-1; i>=0; i--){
            var child = children[i];
            if(!keep || keep.indexOf(child)==-1)
                child.remove();
        }
        return children;
    }
    destroyDescendants(depth, keep){
        //depth indicates how many layers to keep
        //keep is a list of shapes you don't want to destroy
        if(depth==null) depth = 0;
        if(keep && !(keep instanceof Array)) keep = [keep];

        var ret = [];
        var children = this.getChildren();
        for(var i=0; i<children.length; i++){
            var child = children[i];
            if(!keep || keep.indexOf(child)==-1)
                ret.push.apply(ret, child.destroyDescendants(depth-1, keep));
        }

        if(depth<=0)
            ret.push.apply(ret, this.destroyChildren(keep));
        else{   //destroy shapes if there are too many as well
            var shapes = this.graphics.getShapes(); //a list of all the rendered shapes
            var max = this.graphics.getMaxNodeCount();

            var children = this.getChildren();
            while(shapes.length>max && children.length>0)
                children[0].remove();
        }
        return ret;
    }

    //methods for changing the state and synchronizing these changes
    highlight(){
        if(!this.state.highlighted)
            this.graphics.setShapeState("highlighted", this);
    }
    dehighlight(forwarded){
        if(this.state.highlighted)
            this.graphics.setShapeState("highlighted", null);
    }
    select(forwarded){
        if(!this.state.selected)
            this.graphics.setShapeState("selected", this);
    }
    deselect(forwarded){
        if(this.state.selected)
            this.graphics.setShapeState("selected", null);
    }
    focus(){
        if(!this.state.focused)
            this.graphics.setShapeState("focused", this);
    }
    defocus(){
        if(this.state.focused)
            this.graphics.setShapeState("focused", null);
    }
}
