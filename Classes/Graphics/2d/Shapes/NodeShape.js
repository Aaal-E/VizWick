/*
    A node shape that manages sub shapes
    Author: Tar van Krieken
    Starting Date: 30/04/2018
*/
class NodeShape2d extends ShapeGroup2d{
    constructor(graphics, node, preInit){ //attributes will just be stored in the object
        super(graphics, preInit);
        this.__setupNodeShape(node);
    }
    
    
    //relation maintenance
    add(){
        var ret = super.add();
        
        //register shape as root and leave, as no parent or children are set up yet
        this.graphics.__registerShapeLeave(this);
        this.graphics.__registerShapeRoot(this);
        if(this.__getChildNodes().length!=this.children.length)
            this.graphics.__registerShapeCollapsed(this);
        
        //connect the parent and child nodes
        var parent = this.__getParentFromNode(true);
        if(parent) this.__setParent(parent);
        
        var children = this.__getChildrenFromNode(true);
        for(var i=0; i<children.length; i++)
            this.__addChild(children[i]);
            
        // //setup connection
        // if(!this.__setupConnection(this.getParent(), this.getChildren()[0], !this.connectionHasBeenSetup))   //with argument true the first time
        //     this.connectionHasBeenSetup = true;
            
        //update visuals for the state
        this.__stateChanged(null, null, this.state);
        this.__show();
        return ret;
    }
    remove(){
        var notFully = !this.__hide();
        
        //collapse the parent as not all its child nodes are shown anymore
        parent = this.getParent();
        if(parent) parent.__removeChild(this);
        
        //remove fron children
        for(var i=0; i<this.children.length; i++)
            this.children[i].__setParent(null);
            
        //clean up own relations
        this.__setParent(null);
        this.children = [];
        
        return super.remove(notFully);
    }
    __delete(){
        //test: keep the node around, but don't render it
        // //if the shape is deleted from the visualisation, disconnect it from the tree
        // if(this.graphics && this.node)
        //     this.node.removeShape(this.graphics.getUID());
            
        
            
        //indicate that this shape is no longer anything in tree
        this.graphics.__deregisterShapeRoot(this);  
        this.graphics.__deregisterShapeCollapsed(this);
        this.graphics.__deregisterShapeLeave(this);
        return super.__delete();
    }
}
//copy methods of abstractNodeShape
var keys = Object.getOwnPropertyNames(AbstractNodeShape.prototype);
for(var i=0; i<keys.length; i++)
    NodeShape2d.prototype[keys[i]] = AbstractNodeShape.prototype[keys[i]];