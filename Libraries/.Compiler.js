var Compiler = require("../Compiler/Compiler.js");
Compiler.compile([
    "raw:Three/three.min.js",
    "Polyfills.js",
    "jQuery.js",
    "Three/VRController.js",
    "pixi.min.js",
    "pixiLayers.js",
    "stats.js",
    "RBush-3d.js",
], [".Compiled.js", "../Tests/Visualisation/Scripts/Libraries.js"]);
