var Compiler = require("../Compiler/Compiler.js");
Compiler.compile([
    "jQuery.js",
    "pixi.min.js",
    "pixiLayers.js",
    "stats.js",
    "RBush-3d.js",
], [".Compiled.js", "../Tests/Visualisation/Scripts/Libraries.js"]);
