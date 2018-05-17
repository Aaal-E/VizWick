/*
    Generalized graphics abstract class
    Author: Tar van Krieken
    Starting Date: 28/04/2018
*/
class AbstractGraphics{
    constructor(width, height, container){
        this.updateListeners = [];
        this.background = 0;
        
        //if no height and width is defined, use size of container instead
        if(!height){
            if(!width) width = $("body");
            container = width;
            width = $(container).width();
            height = $(container).height();
        }
        
        this.size = {
            width: width,
            height: height
        };
        
        if(!container) container=$("body");
        this.container = $(container);
        
        //event listeners
        this.listeners = {
            mouseClick: [],
            mousePress: [],
            mouseScroll: [],
            mouseMove: [],
            keyPress: []
        };
        this.DOMEventListeners = {  //tracked for when destroying the graphics
            
        };
        this.pressedKeys = {};
        
        //shape data storage
        this.shapes = {
            visible: [],    //all shapes that are rendered
            alive: [],      //shapes that are visible, and aren't in the process of being deleted
            active: [],     //shapes that receive update events
            root: [],       //shapes that don't have visible parents
            leave: [],      //shapes that don't have any children
            collapsed: [],  //shapes that don't show all their children
            html:[]         //html shapes that aren't part of pixi
        };
        this.maxNodeCount = 12;  //the max number of nodes that can be visible at any point
        this.spatialTree = new rbush3d(16, ['.aabb.minX', '.aabb.minY', '.aabb.minZ', '.aabb.maxX', '.aabb.maxY', '.aabb.maxZ']);;
        
        //create an UID to be used when searching for shapes in the tree
        this.UID = Math.floor(Math.random()*Math.pow(10, 10));
        
        
        if(window.debug) this.__setupFpsCounter();
    }
    getCamera(){
        return this.camera;
    }
    getSpatialTree(){
        return this.spatialTree;
    }
    getUID(){
        return this.UID;
    }
    
    __setupFpsCounter(){
        var stats = this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        this.getContainer().append(stats.domElement);
        $(stats.domElement).css("position", "absolute");
    }
    
    //tree search
    search(loc, radius, filter){
        var tree = this.getSpatialTree();
        if(tree){
            //search the tree
            var results = tree.search({
                minX: loc.getX() - radius,
                minY: loc.getY() - radius,
                minZ: loc.getZ() - radius,
                maxX: loc.getX() + radius,
                maxY: loc.getY() + radius,
                maxZ: loc.getZ() + radius,
            });
            
            if(filter) //apply the filter and make sure to not include 'this'
                return results.filter(filter);
                
            return results;
        }
        return [];
    }
    
    //start/stop rendering
    pause(fully){}
    start(){}
    destroy(){ //dispose the graphics completely
        for(var i=0; i<this.shapes.html.length; i++)
            this.shapes.html[i].remove();
    } 
    
    //just retrieve some container info
    getWidth(canvas){
        if(canvas) //tthe actual width instead of resolution width (should be the same)
            return this.getCanvas().width();
        return this.size.width;
    }
    getHeight(canvas){
        if(canvas) //tthe actual height instead of resolution height (should be the same)
            return this.getCanvas().height();
        return this.size.height;
    }
    getContainer(){
        return this.container;
    }
    getCanvas(){
        return this.getContainer().find("canvas");
    }
    
    //a method to add an event that fires whenever the screen is rendered
    onUpdate(listener){
        this.updateListeners.push(listener);
        return this;
    }
    offUpdate(listener){
        var index = this.updateListeners.indexOf(listener);
        if(index!=-1) this.updateListeners.splice(index, 1);
        return this;
    }
    __onUpdate(delta){
        if(this.stats) this.stats.begin();
        
        //general listeners
        for(var i=0; i<this.updateListeners.length; i++)
            this.updateListeners[i].apply(this, arguments);
        //active shape listeners
        for(var i=0; i<this.shapes.active.length; i++)
            this.shapes.active[i].__triggerUpdate(delta);
            
        if(this.stats) this.stats.end();
        return this;
    }
    
    //methods to add and remove shapes from the window
    add(shape){
        for(var i=0; i<arguments.length; i++)
            arguments[i].add();
        return this;
    }
    remove(shape){
        for(var i=0; i<arguments.length; i++)
            arguments[i].remove();
        return this;
    }
    addShape(shape){
        return this.add.apply(this, arguments);
    }
    removeShape(shape){
        return this.remove.apply(this, arguments);
    }
    __registerShape(shape){
        this.getShapes().push(shape);       //add to alive shapes
        this.getShapes(true).push(shape);   //add to all shapes
    }
    __deregisterShape(shape, fully){
        var shapes = this.getShapes();      //remove from alive shapes
        var index = shapes.indexOf(shape);
        if(index!=-1)   shapes.splice(index, 1);
        
        if(fully){                          //remove from all shapes
            var shapes = this.getShapes(true);
            var index = shapes.indexOf(shape);
            if(index!=-1)   shapes.splice(index, 1);
        }
    }
    getShapes(allShapes){   //all shapes indicates whether or not to include shapes that have tehnically been deleted, but are still in some deletion animation
        if(allShapes)
            return this.shapes.visible;
        return this.shapes.alive;
    }
    
    //methods to active or deactive shapes (meaning that they will or won't receive update events)
    activateShape(shape){
        for(var i=0; i<arguments.length; i++){
            var shape = arguments[i];
            var index = this.shapes.active.indexOf(shape);
            if(index==-1) this.shapes.active.push(shape);
        }
        return this;
    }
    deactivateShape(shape){
        for(var i=0; i<arguments.length; i++){
            var shape = arguments[i];
            var index = this.shapes.active.indexOf(shape);
            if(index!=-1) this.shapes.active.splice(index, 1);
        }
        return this;
    }
    
    //background color
    setBackground(color){
        this.background = color;
        return this;
    }
    getBackground(){
        return this.background;
    }
    
    //interactions
    getMouseScreenLoc(){}
    getMouseVec(x, y, z){}
    getMouseLoc(){}
    getMousePressed(){}
    isKeyPressed(key){
        return !!this.pressedKeys[key.toLowerCase()];
    }
    
    //dynamic tree growing/shrinking methods
    __registerShapeRoot(shape){
        var roots = this.getShapesRoot();
        var index = roots.indexOf(shape);
        if(index==-1) roots.push(shape);
        return this;
    }
    __deregisterShapeRoot(shape){
        var roots = this.getShapesRoot();
        var index = roots.indexOf(shape);
        if(index!=-1) roots.splice(index, 1);
        return this;
    }
    getShapesRoot(){
        return this.shapes.root;
    }
    
    __registerShapeLeave(shape){
        var leaves = this.getShapesLeave();
        var index = leaves.indexOf(shape);
        if(index==-1) leaves.push(shape);
        return this;
    }
    __deregisterShapeLeave(shape){
        var leaves = this.getShapesLeave();
        var index = leaves.indexOf(shape);
        if(index!=-1) leaves.splice(index, 1);
        return this;
    }
    getShapesLeave(){
        return this.shapes.leave;
    }
    
    __registerShapeCollapsed(shape){
        var collapsed = this.getShapesCollapsed();
        var index = collapsed.indexOf(shape);
        if(index==-1) collapsed.push(shape);
        return this;
    }
    __deregisterShapeCollapsed(shape){
        var collapsed = this.getShapesCollapsed();
        var index = collapsed.indexOf(shape);
        if(index!=-1) collapsed.splice(index, 1);
        return this;
    }
    getShapesCollapsed(){
        return this.shapes.collapsed;
    }
    
    growTree(growNodes, shrinkNodes){ //grows towards the leaves
        //clean up input data, making sure it is an array of nodes
        if(!(growNodes instanceof Array))
            if(!growNodes)  growNodes = this.getShapesCollapsed();
            else            growNodes = [growNodes];
        
        if(!(shrinkNodes instanceof Array))
            if(!shrinkNodes)    shrinkNodes = this.getShapesRoot();
            else                shrinkNodes = [shrinkNodes];
        
        var ret;
        
        //find min depth node to grow
        var growNode = growNodes[0];
        for(var j=1; j<growNodes.length; j++){
            var gn = growNodes[j];
            if(gn.getDepth()<growNode.getDepth()) 
                growNode = gn;
        }
        if(growNode) ret= growNode.createChild();
        
        //remove some node if there are too many
        if(this.getShapes().length>this.maxNodeCount){
            //find min depth node to remove
            var shrinkNode = shrinkNodes[0];
            for(var j=1; j<shrinkNodes.length; j++){
                var sn = shrinkNodes[j];
                if(sn.getDepth()<shrinkNode.getDepth()) 
                    shrinkNode = sn;
            }
            
            if(shrinkNode) shrinkNode.remove();
        }
        return ret;
    }
    shrinkTree(growNodes, shrinkNodes){ //grows towards the root
        //clean up input data, making sure it is an array of nodes
        if(!(growNodes instanceof Array))
            if(!growNodes)  growNodes = this.getShapesRoot()
            else            growNodes = [growNodes];
        
        if(!(shrinkNodes instanceof Array))
            if(!shrinkNodes)    shrinkNodes = this.getShapesLeave();
            else                shrinkNodes = [shrinkNodes];
        
        var ret;
        
        //find max depth node to grow
        var growNode = growNodes[0];
        for(var j=1; j<growNodes.length; j++){
            var gn = growNodes[j];
            if(gn.getDepth()>growNode.getDepth()) 
                growNode = gn;
        }
        if(growNode) ret = growNode.createParent();
        
        //remove some node if there are too many
        if(this.getShapes().length>this.maxNodeCount){
            //find max depth node to remove
            var shrinkNode = shrinkNodes[0];
            for(var j=1; j<shrinkNodes.length; j++){
                var sn = shrinkNodes[j];
                if(sn.getDepth()>shrinkNode.getDepth()) 
                    shrinkNode = sn;
            }
            
            if(shrinkNode) shrinkNode.remove();
        }
        return ret;
    }
    
    //manage html shapes, update their locations
    getShapesHtml(){
        return this.shapes.html;
    }
    __updateHtmlShapesLoc(){
        for(var i=0; i<this.shapes.html.length; i++){
            this.shapes.html[i].__updateLoc();
        }
    }
    
    //event listeners
    __registerListener(type, listener){
        if(this.listeners[type].indexOf(listener)==-1)
            this.listeners[type].push(listener);
        return this;
    }
    __deregisterListener(type, listener){
        var index = this.listeners[type].indexOf(listener);
        if(index!=-1)
            this.listeners[type].splice(index, 1);
        return this;
    }
    __triggerListener(type){
        var args = Array.from(arguments);
        args.shift();
        var ls = this.listeners[type];
        for(var i=0; i<ls.length; i++)
            ls[i].apply(this, args);
        return this;
    }
    
    onClick(func){ return this.__registerListener("mouseClick", func); }
    offClick(func){ return this.__deregisterListener("mouseClick", func); }
    __triggerClick(event){ return this.__triggerListener("mouseClick", event); }
    
    onMousePress(func){ return this.__registerListener("mousePress", func); }
    offMousePress(func){ return this.__deregisterListener("mousePress", func); }
    __triggerMousePress(down, event){ return this.__triggerListener("mousePress", down, event); }
    
    onMouseScroll(func){ return this.__registerListener("mouseScroll", func); }
    offMouseScroll(func){ return this.__deregisterListener("mouseScroll", func); }
    __triggerMouseScroll(amount, event){ return this.__triggerListener("mouseScroll", amount, event); }
    
    onMouseMove(func){ return this.__registerListener("mouseMove", func); }
    offMouseMove(func){ return this.__deregisterListener("mouseMove", func); }
    __triggerMouseMove(pos, event){ return this.__triggerListener("mouseMove", pos, event); }
    
    onKeyPress(func){ return this.__registerListener("keyPress", func); }
    offKeyPress(func){ return this.__deregisterListener("keyPress", func); }
    __triggerKeyPress(down, key, event){ 
        if(down)
            this.pressedKeys[key.toLowerCase()] = true;
        else
            delete this.pressedKeys[key.toLowerCase()];
        return this.__triggerListener("keyPress", down, key, event); 
    }
}