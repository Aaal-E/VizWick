/*
    2d graphics class
    Author: Tar van Krieken
    Starting Date: 28/04/2018
*/
class Graphics2d extends AbstractGraphics{
    constructor(width, height, container){
        super(width, height, container);
        
        //create the graphics environment
        this.app = new PIXI.Application(this.getWidth(), this.getHeight(), {backgroundColor:this.background, antialias:true});
        
        //add graphics to the screen
        this.container.append(this.app.view);
        
        //register update listener
        var This = this;
        this.updating = true;
        this.app.ticker.add(function(delta){
            if(This.updating)
                This.__triggerUpdate(1/60/delta);
        });
        
        //setup layered container
        this.app.stage = new PIXI.display.Stage();
        this.app.stage.group.enableSort = true;
        
        this.group = new PIXI.display.Group(1, true);
        this.stage = new PIXI.display.Layer(this.group);
        this.stage.hitArea = new PIXI.Rectangle(-this.getWidth()/2, -this.getHeight()/2, this.getWidth(), this.getHeight()); //setup hitbox for mouse interaction
        this.app.stage.addChild(this.stage);
        
        //add mouse listener
        this.mouse = {x:0, y:0, pressed:false};
        var mouseMove = function(data){
            This.mouse.x = data.data.global.x;
            This.mouse.y = data.data.global.y;
        };
        var mouseDown = function(){
            This.mouse.pressed = true;
        };
        var mouseUp = function(){
            This.mouse.pressed = false;
        };
        this.app.stage.interactive = true;
        this.app.stage
            .on('mousedown', mouseDown)
            .on('touchstart', mouseDown)
            .on('mouseup', mouseUp)
            .on('mouseupoutside', mouseUp)
            .on('touchend', mouseUp)
            .on('touchendoutside', mouseUp)
            .on('mousemove', mouseMove)
            .on('touchmove', mouseMove);
        
        
        //connect a camera
        this.camera = new Camera2d(this);
    }
    
    //start/stop rendering
    pause(fully){
        if(!fully){
            this.updating = false;
        }else{
            this.app.stop();
        }
    }
    start(){
        this.updating = true;
        this.app.start();
    }
    
    //pixi specific methods
    __getStage(){
        return this.app.stage;
    }
    __getGroup(){
        return this.group;
    }
    __getRenderer(){
        return this.app.renderer;
    }
    
    //mouse  methods
    __getMousePos(){
        return this.mouse;
    }
    getMouseVec(x, y){
        var xyz;
        if(x instanceof AbstractShape)
            xyz = new Vec(x.getAbsoluteX(), x.getAbsoluteY());
        else
            xyz = new Vec(x, y);
        var pos = this.__getMousePos();
        return xyz.sub(pos.x, pos.y);
    }
    getMousePressed(){
        return this.mouse.pressed;
    }
}