/*
    An object containing all classes for 2d graph IO
    Author: Tar van Krieken
    Starting Date: 28/04/2018
*/
window.IO2d = {
    // utils
    XYZ: XYZ,
    Vec: Vec,
    
    //base classes
    Camera: Camera2d,
    Graphics: Graphics2d,
    Shape: Shape2d,
    
    //shapes
    Sphere: Circle2d,
    Circle: Circle2d,
    CompoundShape: CompoundShape2d,
    ShapeGroup: ShapeGroup2d,
    NodeShape: NodeShape2d,
};