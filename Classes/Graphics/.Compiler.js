var Compiler = require("../../Compiler/Compiler.js");
Compiler.compile([
    //options for visualisations
    "Options/Option.js",
    "Options/Types/Boolean.js",
    "Options/Types/Button.js",
    "Options/Types/Label.js",
    "Options/Types/Number.js",
    "Options/Types/State.js",
    "Options/Types/Text.js",
    "Options/Options.js",

    //general visualisation classes
    "Utils/XYZ.js",
    "Utils/Vec.js",
    "AbstractCamera.js",
    "AbstractGraphics.js",
    "AbstractShape.js",
    "AbstractNodeShape.js",
    "AbstractVisualisation.js",

    //2d visualisation classes
        "2d/Camera.js",
        "2d/Graphics.js",
        "2d/Shape.js",

        //special 2d shapes
        "2d/Shapes/CompoundShape.js",
        "2d/Shapes/ShapeGroup.js",
        "2d/Shapes/NodeShape.js",
        "2d/Shapes/HtmlShape.js",

        //normal 2d shapes
        "2d/Shapes/Circle.js",
        "2d/Shapes/Line.js",
        "2d/Shapes/TextShape.js",
        "2d/Shapes/ImageShape.js",
        "2d/Shapes/Rectangle.js",
        "2d/Shapes/RoundedRectangle.js",
        "2d/Shapes/Polygon.js",
        "2d/Shapes/Ellipse.js",

        //all 2d visualisation data coming together
        "2d/Visualisation.js",



    //3d visualisation classes
        "3d/Camera.js",
        "3d/VRCamera.js",
        "3d/Graphics.js",
        "3d/Shape.js",

        //normal 3d shapes
        "3d/Shapes/Cuboid.js",
        "3d/Shapes/Line.js",
        "3d/Shapes/ImageShape.js",
        "3d/Shapes/TextShape.js",
        "3d/Shapes/Sphere.js",

        //special 3d shapes
        "3d/Shapes/ShapeGroup.js",
        "3d/Shapes/NodeShape.js",
        "3d/Shapes/HtmlShape.js",
        "3d/Shapes/PointLight.js",

        //all 3d visualisation data coming together
        "3d/Visualisation.js",
], [".Compiled.js", "../../Tests/Visualisation/Scripts/Visualisation.js"]);
