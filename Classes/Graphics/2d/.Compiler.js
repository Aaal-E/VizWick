var Compiler = require("../../../Compiler/Compiler.js");
Compiler.compile([
    "../../../Libraries/pixi.min.js",
    "../../../Libraries/stats.js",
    "../../../Libraries/RBush-3d.js",
    
    "../Utils/XYZ.js",
    "../Utils/Vec.js",
    "../AbstractCamera.js",
    "../AbstractGraphics.js",
    "../AbstractShape.js",
    
    "Camera.js",
    "Graphics.js",
    "Shape.js",
    
    "Shapes/Circle.js",
    "Shapes/CompoundShape.js",
    "Shapes/ShapeGroup.js",
    "Shapes/NodeShape.js",
    
    "IO2d.js",
], ".Compiled.js");