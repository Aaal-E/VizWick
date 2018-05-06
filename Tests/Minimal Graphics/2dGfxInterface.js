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
        
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.xRot = 0;
        this.yRot = 0;
        this.zRot = 0;
        
    }
    create(){}
    setX(x){
        this.graphics.x = x;
        return this;
    }
    getX(x){
        return this.graphics.x;
    }
    setY(y){
        this.graphics.y = y;
        return this;
    }
    getY(y){
        return this.graphics.y;
    }
    setRot(angle){
        this.graphics.rotation = angle;
        return this;
    }
    getRot(angle){
        return this.graphics.rotation;
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
class Circle extends Shape{
    create(radius, color){
        this.graphics.beginFill(color);
        this.graphics.drawCircle(0, 0, radius);
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