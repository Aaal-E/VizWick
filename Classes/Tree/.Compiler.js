var Compiler = require("../../Compiler/Compiler.js");
Compiler.compile([
    "Tree.js",
    "TreeNode.js",
], [".Compiled.js", "../../Tests/Visualisations/Test environment/tree.js"]);