/*
    A node shape that manages sub shapes
    Author: Tar van Krieken
    Starting Date: 31/05/2018
*/
class NodeShape3d extends ShapeGroup3d{
    constructor(graphics, node, preInit){ //attributes will just be stored in the object
        super(graphics, preInit);
        this.__setupNodeShape(node);
    }


    //relation maintenance (needs super)
    add(){
        var ret = super.add();
        this.__addNode();
        return ret;
    }
    remove(){
        return super.remove(this.__removeNode());
    }
    __delete(){
        this.__deleteNode();
        return super.__delete();
    }
}
//copy methods of abstractNodeShape
var keys = Object.getOwnPropertyNames(AbstractNodeShape.prototype);
for(var i=0; i<keys.length; i++)
    NodeShape3d.prototype[keys[i]] = AbstractNodeShape.prototype[keys[i]];
