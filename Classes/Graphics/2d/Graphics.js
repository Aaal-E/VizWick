/*
    2d graphics class
    Author: Tar van Krieken
    Starting Date: 28/04/2018
*/
class Graphics2d extends AbstractGraphics{
    constructor(width, height, container){
        super(width, height, container);
        
        //create the graphics environment
        this.app = new PIXI.Application(this.getWidth(), this.getHeight(), {transparent: true, antialias:true});
        
        //add graphics to the screen
        var This = this;
        $(this.app.view).addClass("pixi");
        this.container.append(this.app.view);
        this.container.on("finishResize", function(event, size){
            var view = $(This.__getRenderer().view);
            var ratio = view.width()/view.height();
            
            size.width += 1;    //prevent some background leakage by rounding errors
            size.height += 1;
            if(size.width/size.height <= ratio){
                var w = size.height*ratio;
                var h = size.height;
            }else{
                var w = size.width;
                var h = size.width/ratio;
            }
            view.width(w).height(h);
            
            var scale = This.size.width/w;
            This.camera.__setStretchScale(scale);
            
            This.camera.__updateLoc();
        });
        
        //register update listener, set to 30fps
        this.updating = true;
        var last = Date.now();
        var delta = 1/30;
        this.app.ticker.add(function(){
            var now = Date.now();
            if((now-last)/1000>delta){
                if(This.updating)
                    This.__onUpdate(delta);
                last += delta*1000;
                if(now-last>2000)
                    last = now;
            }
        });
        // PIXI.settings.TARGET_FPMS = 30/1000;    //set target fps to 30
        
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
    getMouseScreenLoc(){
        return this.mouse;
    }
    getMouseLoc(){
        return this.camera.translateScreenToWorldLoc(this.getMouseScreenLoc());
    }
    getMouseVec(x, y){
        var xyz;
        if(x instanceof AbstractShape)
            xyz = new Vec(x.getWorldLoc());
        else
            xyz = new Vec(x, y);
        var pos = this.getMouseLoc();
        return xyz.sub(pos);
    }
    getMousePressed(){
        return this.mouse.pressed;
    }
}