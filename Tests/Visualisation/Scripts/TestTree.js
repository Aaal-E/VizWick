// var data = ``;
// var obj = makeTreeObj(data);

var createTree = function(name, height, width){
    width = width==null?3:width;
    var children = [];
    if(height>0){
        var childCount = Math.floor(Math.random()*width)+1;
        for(var i=0; i<childCount; i++){
            children.push(createTree(name+"-"+i, height-1, width));
        }
    }
    return {
        name: name,
        children: children
    };
}

obj = createTree("tree", 9, 6);
VisualisationHandler.setTree(new Tree(obj));
// VisualisationHandler.setTree(new Tree({
//     children: [{
//         children: [{
//             children: [{
//                 children: []
//             }]
//         },{
//             children: [{
//                 children: []
//             }]
//         }]
//     }, {
//         children: [{
//             children: []
//         }]
//     }]
// }));

// VisualisationHandler.setTree(new Tree({
//     name: "test",
//     children: [{
//         name: "test-0",
//         children: [{
//             name: "test-0-0"
//         },{
//             name: "test-0-1"
//         },{
//             name: "test-0-2"
//         }]
//     },{
//         name: "test-1",
//         children: [{
//             name: "test-1-0"
//         },{
//             name: "test-1-1"
//         },{
//             name: "test-1-2"
//         }]
//     },{
//         name: "test-2",
//         children: [{
//             name: "test-2-0"
//         },{
//             name: "test-2-1"
//         }]
//     },{
//         name: "test-3",
//         children: [{
//             name: "test-3-0"
//         },{
//             name: "test-3-1"
//         },{
//             name: "test-3-2"
//         },{
//             name: "test-3-3"
//         }]
//     }]
// }));
