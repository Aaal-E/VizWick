/*
    2d Visualisation class
    Author: Tar van Krieken
    Starting Date: 08/05/2018
*/
class Visualisation2d extends Graphics2d{
    constructor(container, tree, options, preInit){
        super(null, null, container, preInit);
        this.__setupVisualisation(tree, options);
    }

    //disposal, starts the removing of shapes, and removes the entire vis when done
    destroy(callback){
        this.__destroy(callback);
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

    //standard shapes
    Circle: Circle2d,
    Line: Line2d,
    TextShape: TextShape2d,
    ImageShape: ImageShape2d,
    Rectangle: Rectangle2d,
    RoundedRectangle: RoundedRectangle2d,
    Polygon: Polygon2d,
    Ellipse: Ellipse2d,
    RadialBand: RadialBand2d
};
