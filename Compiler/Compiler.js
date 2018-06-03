/*
    A file to be used to compile a set of javascript files into 1 file, see any of the .Compiler.js files for usage
 */

var fs = require('fs');
var path = require('path');
var babel = require("babel-core");

exports.compile = function(data, outputFiles){
    if(!(data instanceof Array) || (typeof(outputFiles)!="string" && !(outputFiles instanceof Array))){
        throw Error("Incorrect arguments, please provide a list of files and one or more names for output files");
        return;
    }
    if(!(outputFiles instanceof Array))
        outputFiles = [outputFiles];

    var nonCompiled = "";
    var concatenated = "";
    for(let i=0; i<data.length; i++){
        var file = data[i];

        var raw = file.match(/raw\:(.*)/);
        if(raw) file = raw[1];

        var filePath = path.join(process.cwd(), file);

        var fileContent = fs.readFileSync(filePath, 'utf8');
        if(typeof(fileContent)!="string"){
            throw Error("File "+file+" couldn't be found");
            return;
        }

        if(raw){
            nonCompiled += fileContent+";\n";
        }else{
            concatenated += fileContent;
        }
    }
    var compiled = babel.transform(concatenated, {filename:outputFile, presets:["env"], minified:true}).code;
    compiled = nonCompiled+compiled;

    var finishedCount = 0;
    for(var i=0; i<outputFiles.length; i++){
        let fileName = outputFiles[i];
        var outputFile = path.join(process.cwd(), fileName);
        fs.writeFile(outputFile, "(function(){"+compiled+"})();", function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("The file '"+fileName+"' was saved!");

            if(++finishedCount==outputFiles.length && global.compiled){
                global.compiled();
            }
        });
    }
}
