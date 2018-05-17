/*
    2d Visualisation class
    Author: Tar van Krieken
    Starting Date: 08/05/2018
*/
class Visualisation2d extends Graphics2d{
    constructor(container, tree, options, preInit){
        if(preInit) preInit.call(this);
        super(container);
        this.__setupVisualisation(tree, options);
    }
    
    //disposal
    destroy(){
        $(window).off("mouseup", this.DOMEventListeners.mouseUp);
        super.destroy();
    }
    
    //setup
    __setupRoot(){
        var node = this.tree.getRoot();
        var clas = this.__getNodeShapeClass(Visualisation2d.classes, node);
        var shape = new clas(this, node);
        return shape.add();
    }
    
}

//copy methods of abstractVisualisation
var keys = Object.getOwnPropertyNames(AbstractVisualisation.prototype);
for(var i=0; i<keys.length; i++)
    Visualisation2d.prototype[keys[i]] = AbstractVisualisation.prototype[keys[i]];

//make the visualisation system public
window.Visualisation2d = Visualisation2d;
Visualisation2d.classes = window.VIZ2D = {
    Visualisation: Visualisation2d,
    
    //general classes
    XYZ: XYZ,
    Vec: Vec,
    
    //special shapes
    Shape: Shape2d,
    CompoundShape: CompoundShape2d,
    ShapeGroup: ShapeGroup2d,
    NodeShape: NodeShape2d,
    HtmlShape: HtmlShape2d,
    
    //normal shapes
    Circle: Circle2d
};