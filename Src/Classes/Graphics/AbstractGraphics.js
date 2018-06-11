/*
    Generalized graphics abstract class
    Author: Tar van Krieken
    Starting Date: 28/04/2018
*/
class AbstractGraphics{
    constructor(width, height, container, preInit){
        if(preInit instanceof Function) preInit.call(this);
        this.updateListeners = [];
        this.background = 0;

        //if no height and width is defined, use size of container instead
        if(!height){
            if(!width) width = $("body");
            if(!container) container = width;
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
            html: []        //html shapes that aren't part of pixi
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
        for(var i=this.shapes.html.length-1; i>=0; i--)
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
        var index = this.updateListeners.indexOf(listener);
        if(index==-1) this.updateListeners.push(listener);
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
AbstractGraphics.getDescription = function(){
    return this.description;
};
AbstractGraphics.description = {
    name: "VIS"+Math.floor(Math.random()*Math.pow(10, 6)),
    description: "",
    image: ""
};
