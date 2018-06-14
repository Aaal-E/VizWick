var Path = require("path");
var Fs = require("fs");

var dir = process.argv[2];
if(dir)
    dir = Path.join(process.cwd(), dir);
else
    dir = process.cwd();

var cleanName = function(name){
    return name.replace(/\s/g, "_").replace(/\,/g, ".");
}
var createNewick = function(callback, dirs, out, filter){
    if(!(dirs instanceof Array)) dirs = [{path:dirs, name:dirs}];
    if(!out) out = "";
    var dir = dirs[dirs.length-1];
    if(!dir){
        callback(out);
        return;
    }
    Fs.stat(dir.path, function(err, stats){
        var isDir = stats.isDirectory();
        if(!dir.handled){
            dir.handled = true;
            if(isDir){
                out += "(";
                Fs.readdir(dir.path, function(err, files){
                    files.reverse().forEach(function(file){
                        var p = Path.join(dir.path, file);
                        if(!filter || !filter(p))
                            dirs.push({path:p, name:file});
                    });
                    createNewick(callback, dirs, out, filter);
                });
            }else{
                createNewick(callback, dirs, out, filter);
            }
        }else{
            dirs.pop();
            if(!isDir) out += cleanName(dir.name)+",";
            else  out = out.substring(0, out.length-1)+")"+cleanName(dir.name)+",";
            createNewick(callback, dirs, out, filter);
        }
    });
};
createNewick(function(res){
    // console.log(res);
    Fs.writeFile("directory newick.txt", res, function(err){
        if(err)
            return console.log("\n Could not write to file");

        console.log("\n File saved");
    });
}, dir, null, function(path){
    return path.match(/node_modules|\.git/);
});
