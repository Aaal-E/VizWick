/*
    2d Visualisation class
    Author: Tar van Krieken
    Starting Date: 08/05/2018
*/
class Visualisation2d extends Graphics2d{
    constructor(container, tree, options, extraFields){
        super(container);
        
        this.tree = tree;
        this.options = options;
        
        this.focusedShape = null;   //the shape in the center
        this.selectedShape = null;  //the highlighted shape
        
        this.__setupRoot();
        this.__setupOptions(options);
    }
    //setup
    __setupOptions(options){}
    __setupRoot(){
        var node = this.tree.getRoot();
        var clas = this.__getNodeShapeClass(Visualisation2d.classes, node);
        var shape = new clas(this, node);
        return shape.add();
    }
    
    selectShape(shape){
        if(this.selectedShape)
            this.selectedShape.__changeState("selected", false);
        this.selectedShape = shape;
        if(shape)
            shape.__changeState("selected", true);
        return this;
    }
    focusShape(shape){
        if(this.focusedShape)
            this.focusedShape.__changeState("focused", false);
        this.focusedShape = shape;
        if(shape)
            shape.__changeState("focused", true);
        return this;
    }
    
    //classes
    __getNodeShapeClass(VIZ, node){}
}
window.Visualisation2d = window.VIZ2D = Visualisation2d;
Visualisation2d.classes = {
    //general classes
    XYZ: XYZ,
    Vec: Vec,
    
    //shapes
    Shape: Shape2d,
    CompoundShape: CompoundShape2d,
    ShapeGroup: ShapeGroup2d,
    NodeShape: NodeShape2d,
    
    Circle: Circle2d
};