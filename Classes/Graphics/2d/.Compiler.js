var Compiler = require("../../../Compiler/Compiler.js");
Compiler.compile([
    "../../../Libraries/jQuery.js",
    "../../../Libraries/pixi.min.js",
    "../../../Libraries/pixiLayers.js",
    "../../../Libraries/stats.js",
    "../../../Libraries/RBush-3d.js",
    
    "../Utils/XYZ.js",
    "../Utils/Vec.js",
    "../Options.js",
    "../AbstractCamera.js",
    "../AbstractGraphics.js",
    "../AbstractShape.js",
    "../AbstractNodeShape.js",
    "../AbstractVisualisation.js",
    
    "Camera.js",
    "Graphics.js",
    "Shape.js",
    
    "Shapes/Circle.js",
    "Shapes/CompoundShape.js",
    "Shapes/ShapeGroup.js",
    "Shapes/NodeShape.js",
    "Shapes/HtmlShape.js",
    
    "Visualisation.js",
], [".Compiled.js", "../../../Tests/Visualisations/Test environment/visualisation.js"]);