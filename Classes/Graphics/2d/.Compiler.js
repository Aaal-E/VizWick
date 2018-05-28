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

    "Shapes/CompoundShape.js",
    "Shapes/ShapeGroup.js",
    "Shapes/NodeShape.js",
    "Shapes/HtmlShape.js",

    "Shapes/Circle.js",
    "Shapes/Line.js",
    "Shapes/TextShape.js",
    "Shapes/ImageShape.js",
    "Shapes/Rectangle.js",
    "Shapes/RoundedRectangle.js",
    "Shapes/Polygon.js",
    "Shapes/Ellipse.js",

    "Visualisation.js",
], [".Compiled.js", "../../../Tests/Visualisations/Test environment/visualisation.js"]);
