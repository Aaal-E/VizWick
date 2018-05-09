/*
    2d Visualisation class
    Author: Tar van Krieken
    Starting Date: 08/05/2018
*/
class Visualisation2d extends AbstractVisualisation{
    constructor(container, tree, options, extraFields){
        super(container, tree, options, extraFields);
    }
    //clases
    __getGraphicsClass(){
        return Graphics2d;
    }
    __setupShapeClasses(){
        this.c = {
            //general classes
            XYZ: XYZ,
            Vec: Vec,
            
            //shapes
            Shape: Shape2d,
            CompoundShape: CompoundShape2d,
            ShapeGroup: ShapeGroup2d,
            NodeShape: NodeShape2d,
            
            Circle: Circle2d,
        }
    }
}
window.Visualisation2d = Visualisation2d;