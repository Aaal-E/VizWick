/*
    Tar van Krieken
    24/4/2018
    ~1 hour of work (includes refreshing knowledge about how to work with pixi)
*/

/*
    The main Graphics class that will take care of our rendering needs
*/
class Graphics{
    constructor(width, height, container){
        this.camera = 
        
        var background = 0x000000;
        
        //if no height and width is defined, use size of container instead
        if(!height){
            if(!width) width = $("body");
            container = width;
            width = $(container).width();
            height = $(container).height();
        }
        
        //create the graphics environment
        this.app = new PIXI.Application(width, height, {backgroundColor:background, antialias:true});
        this.app.stage.x += width/2;
        this.app.stage.y += height/2;
        
        //move graphics to the specified container, or simply the body if none was provided
        if(!container) container=$("body");
        $(container).append(this.app.view);
    }
    //a method to add an event that fires whenever the screen is rendered
    addTickListener(func){
        this.app.ticker.add(func);
    }
    //methods to add and remove shapes from the window
    add(shape){
        if(shape.graphics) shape=shape.graphics;
        this.app.stage.addChild(shape);
    }
    remove(shape){
        if(shape.graphics) shape=shape.graphics;
        this.app.stage.removeChild(shape);
    }
}

/*
    A basic shape class that creates a drawing environment,
    and adds some basic functions to manipulate the shape
*/
class Shape{
    constructor(){
        this.graphics = new PIXI.Graphics();
        this.create.apply(this, arguments);
        
        this.loc = {x:0, y:0, z:0};
        this.rot = {x:0, y:0, z:0};
        this.color = 0;
        this.hoverListeners = [];
        this.clickListeners = [];
        this.updateListeners = [];
    }
    create(){}
    //position
    setX(x){
        this.loc.x = x;
        return this;
    }
    getX(){
        return this.loc.x;
    }
    setY(y){
        this.loc.y = y;
        return this;
    }
    getY(){
        return this.loc.y;
    }
    setZ(z){
        this.loc.z = z;
        return this;
    }
    getZ(){
        return this.loc.z;
    }
    //rotation
    setXRot(x){
        this.rot.x =  x;
        return this;
    }
    getXRot(){
        return this.rot.x;
    }
    setYRot(y){
        this.rot.y =  y;
        return this;
    }
    getYRot(){
        return this.rot.y;
    }
    setZRot(z){
        this.rot.z =  z;
        return this;
    }
    getZRot(){
        return this.rot.z;
    }
    //color
    setColor(color){
        this.color = color;
        return this
    }
    getColor(){
        return this.color;
    }
    //event handlers
    hover(listener){
        if(listener instanceof Function){
            var index = this.hoverListeners.indexOf(listener);
            if(index==-1)
                this.hoverListeners.push(listener);
            else
                this.hoverListeners.splice(index, 1);
        }else{
            for(var i=0; i<this.hoverListeners.length; i++)
                this.hoverListeners[i].apply(this, arguments);
        }
    }
    click(listener){
        if(listener instanceof Function){
            var index = this.clickListeners.indexOf(listener);
            if(index==-1)
                this.clickListeners.push(listener);
            else
                this.clickListeners.splice(index, 1);
        }else{
            for(var i=0; i<this.clickListeners.length; i++)
                this.clickListeners[i].apply(this, arguments);
        }
    }
    update(listener){
        if(listener instanceof Function){
            var index = this.updateListeners.indexOf(listener);
            if(index==-1)
                this.updateListeners.push(listener);
            else
                this.updateListeners.splice(index, 1);
        }else{
            for(var i=0; i<this.updateListeners.length; i++)
                this.updateListeners[i].apply(this, arguments);
        }
    }
}
/*
    Some rudimentary shapes to start off with
*/
class Rectangle extends Shape{
    create(width, height, color){
        this.graphics.beginFill(color);
        this.graphics.drawRect(-width/2, -height/2, width, height);
        this.graphics.endFill();
    }
}
class Triangle extends Shape{
    create(p1x, p1y, p2x, p2y, p3x, p3y, color){
        this.graphics.beginFill(color);
        this.graphics.drawPolygon([p1x, p1y, p2x, p2y, p3x, p3y]);
        this.graphics.endFill();
    }
}