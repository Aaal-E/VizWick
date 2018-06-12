var Compiler = require("../../Compiler/Compiler.js");
Compiler.compile([
    "../InputReader/inputReader.js",
    "VisualisationArea.js",
    "VisualisationHandler.js",
], [".Compiled.js", "../../../Tests/Visualisation/Scripts/VisualisationHandler.js", "../../../Resources/Scripts/VisualisationHandler.js"]);
