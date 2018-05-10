/*
    Generalized visualisation abstract class
    Author: Tar van Krieken
    Starting Date: 08/05/2018
*/
class AbstractVisualisation{
    constructor(container, tree, options, extraFields){
        //setup extra fields that get passed
        if(extraFields){
            var keys = Object.keys(extraFields);
            for(var i=0; i<keys.length; i++)
                this[keys[i]] = extraFields[keys[i]];
        }
            
        //set fields
        this.options = options;
        this.tree = tree;
        this.graphics = new (this.__getGraphicsClass())(container);
        this.camera = this.graphics.getCamera();
        
        this.__setupShapeClasses();
        this.__setupOptions();
        this.__setupRoot();
        
        if(window.debug) this.__setupFpsCounter();
    }
    //classes
    __getNodeShapeClass(){}
    __getGraphicsClass(){}
    
    //setup
    __setupOptions(options){}
    __setupRoot(){
        var node = this.tree.getRoot();
        var clas = this.__getNodeShapeClass(node);
        var shape = new clas(this.graphics, node);
        shape.add();
    }
    __setupFpsCounter(){
        var stats = new Stats();
        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        this.graphics.getContainer().append(stats.domElement);
        this.graphics.onUpdate(function(delta){
            stats.end();
            stats.begin();
        });
    }
}