// var data = ``;
// var obj = makeTreeObj(data);

var createTree = function(name, height, width){
    width = width||3;
    var children = [];
    if(height>0){
        var childCount = Math.floor(Math.random()*width)+1;
        for(var i=0; i<childCount; i++){
            children.push(createTree(name+"-"+i, height-1));
        }
    }
    return {
        name: name,
        children: children
    };
}

obj = createTree("tree", 9, 6);
VisualisationHandler.setTree(new Tree(obj));
