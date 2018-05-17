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
            var newSize = {
                width:This.container.width(), 
                height:This.container.height()
            };
            This.app.renderer.resize(newSize.width, newSize.height);
            
            This.size = newSize;
            
            This.camera.__updateLoc();
        });
        
        //fix interaction bugs when hovering over an html shape
        var m = this.app.renderer.plugins.interaction;
        m.interactionDOMElement.removeEventListener("pointerleave", m.onPointerOut, true);
        
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
        
        //add event handlers
        {
            this.mouse = {x:0, y:0, pressed:false};
            var mouseMove = function(data){
                This.mouse.x = data.data.global.x;
                This.mouse.y = data.data.global.y;
                This.mouse.clientX = data.data.originalEvent.clientX;
                This.mouse.clientY = data.data.originalEvent.clientY;
                This.__triggerMouseMove(new XYZ(data.data.global.x, data.data.global.y), data);
            };
            var mouseDown = function(data){
                This.mouse.pressed = true;
                This.__triggerMousePress(true, data);
            };
            var mouseUp = function(data){
                This.mouse.pressed = false;
                This.__triggerMousePress(false, data);
                This.__triggerClick(data);
            };
            var mouseScroll = function(data){
                This.__triggerMouseScroll(data.data.originalEvent.originalEvent.wheelDeltaY, data);
            };
            var keyPress = function(data){
                This.__triggerKeyPress(data.data.originalEvent.type=="keydown", data.data.originalEvent.key, data);
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
                .on('touchmove', mouseMove)
                .on('scroll', mouseScroll)
                .on('keypress', keyPress);
        }
            
        //create scroll event and key events
        {
            this.DOMEventListeners.scroll = function(event){
                var interactionData = m.getInteractionDataForPointerId(event);
                
                var interactionEvent = m.configureInteractionEventForDOMEvent(m.eventData, event, interactionData);
                m.processInteractive(interactionEvent, m.renderer._lastObjectRendered, function(interactionEvent, displayObject, hit){
                    if(hit){
                        m.dispatchEvent(displayObject, 'scroll', interactionEvent);
                    }
                }, true);
            };
            this.DOMEventListeners.keypress = function(event){
                var interactionData = m.getInteractionDataForPointerId(event);
                
                if(event.type=="keyup") //remove keys even if released outside of visualisation
                    delete This.pressedKeys[event.key.toLowerCase()];
                
                //set target location
                event.clientX = This.mouse.clientX;
                event.clientY = This.mouse.clientY;
                
                var interactionEvent = m.configureInteractionEventForDOMEvent(m.eventData, event, interactionData);
                m.processInteractive(interactionEvent, m.renderer._lastObjectRendered, function(interactionEvent, displayObject, hit){
                    if(hit){
                        m.dispatchEvent(displayObject, 'keypress', interactionEvent);
                    }
                }, true);
            };
            $(window).on('mousewheel', this.DOMEventListeners.scroll);
            $(window).on('keydown', this.DOMEventListeners.keypress);
            $(window).on('keyup', this.DOMEventListeners.keypress);
        }
        
        //connect a camera
        this.camera = new Camera2d(this);
    }
    
    //disposal
    destroy(){
        $(window).off('mousewheel', this.DOMEventListeners.scroll);
        $(window).off('keydown', this.DOMEventListeners.keypress);
        $(window).off('keyup', this.DOMEventListeners.keypress);
        super.destroy();
    }
    
    getCanvas(){
        return this.getContainer().find("canvas.pixi");
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