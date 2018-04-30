var fs = require('fs');
var path = require('path');
var babel = require("babel-core");

exports.compile = function(data, outputFile){
    if(!(data instanceof Array) || typeof(outputFile)!="string"){
        throw Error("Incorrect arguments, please provide a list of files and an output file name");
        return;
    }
    
    var concatenated = "";
    for(let i=0; i<data.length; i++){
        var file = data[i];
        var filePath = path.join(process.cwd(), file);
        
        var fileContent = fs.readFileSync(filePath, 'utf8');
        if(typeof(fileContent)!="string"){
            throw Error("File "+file+" couldn't be found");
            return;
        }
        
        concatenated += fileContent;
    }
    var compiled = babel.transform(concatenated, {filename:outputFile, presets:["env"]}).code;
    
    outputFile = path.join(process.cwd(), outputFile);
    fs.writeFile(outputFile, "(function(){"+compiled+"})();", function(err) {
        if(err) {
            return console.log(err);
        }
    
        console.log("The file was saved!");
    });
}