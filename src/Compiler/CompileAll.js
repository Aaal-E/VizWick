/*
    A file to compile all of the .Compiler.js files at once
 */

var fs = require("fs");
var path = require("path");

var files = [path.join(process.cwd(), "../")];
function next(){
    var file = files.pop();
    if(file){
        var stats = fs.statSync(file);
        if(stats.isDirectory()){
            fs.readdir(file, function(error, children){
                children.forEach(function(child){
                    files.push(path.join(file, child));
                });
                next();
            });
        }else if(path.basename(file)==".Compiler.js"){
            console.log("\n Compiling: "+path.dirname(file));
            process.chdir(path.dirname(file));
            require(file);
        }else{
            next();
        }
    }
}
global.compiled = next;

next();
