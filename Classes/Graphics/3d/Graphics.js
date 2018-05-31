/*
    3d graphics class
    Author: Tar van Krieken
    Starting Date: 16/05/2018
*/
class Graphics3d extends AbstractGraphics{
    constructor(width, height, container){
        super(width, height, container);

        this.container.on("finishResize", function(event, size){
            var newSize = {
                width:This.container.width(),
                height:This.container.height()
            };
            This.renderer.setSize(newSize.width, newSize.height);
            This.camera.camera.aspect = newSize.width/newSize.height;
            This.camera.camera.updateProjectionMatrix();

            This.size = newSize;

            // This.camera.__updateLoc();
        });

        //create an empty scene
        this.scene = new THREE.Scene();

        //create a basic perspective camera
        var camera = new THREE.PerspectiveCamera( 75, this.getWidth()/this.getHeight(), 0.1, 1000 );

        //create a renderer with Antialiasing
        this.renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
        this.renderer.setClearColor("#000000", 0);
        this.renderer.setSize(this.getWidth(), this.getHeight());
        // this.renderer.vr.enabled = true;
        this.container.append($(this.renderer.domElement).addClass("three"));

        //render Loop
        var This = this;
        this.renderListeners = [];
        this.updating = true;
        this.rendering = 1;
        this.lastUpdate = Date.now();
        this.lastRender = Date.now();
        this.deltaTime = 1/30;
        this.tick = 0;
        this.renderFunc = function(){
            if(This.rendering==1)
                requestAnimationFrame(This.renderFunc);
            if(This.rendering==2)   //indicate that there is no longer an animation frame request waiting
                This.rendering = 0;

            var now = Date.now();
            if((now-This.lastUpdate)/1000>This.deltaTime){  //update tick
                //reset world transform that might have been done by VR camera
                This.__resetTransform();

                //track the time /steps
                This.tick++;//increase the tick
                This.lastUpdate += This.deltaTime*1000;
                if(now-This.lastUpdate>2000) //skip some if needed
                    This.lastUpdate = now;

                //interpolate images
                This.__interpolate();

                //update the world
                if(This.updating)
                    This.__onUpdate(This.deltaTime);

                //actually render the frame
                This.renderer.render(This.scene, camera);
            }else{                                 //render new interpolated frame
                // create interpolated frame
                /*
                    This.__resetTransform();
                    This.__interpolate();
                    This.__onRender(now-This.lastRender, (now-This.lastUpdate)/This.deltaTime);
                    This.renderer.render(This.scene, camera);
                 */
            }
            This.lastRender = now;
        };
        this.renderFunc();

        //lighting
        this.ambientLight = {
            color: 0xffffff,
            intensity: 0.3,
            light: new THREE.AmbientLight(0xffffff),
        };
        this.ambientLight.light.intensity = this.ambientLight.intensity;
        this.scene.add(this.ambientLight.light);

        //connect a camera and setup VR properties
        this.camera = new Camera3d(this, camera);
        this.VRproperties = {
            enabled: true,
            scale: 1.5,
            offset: new XYZ(0.2, 0.2, 0.2)
        };

        //interaction data
        this.pointers = {
            types: ["mouse"],
            mouse: new XYZ(),
            hand1: new XYZ(),
            hand2: new XYZ()
        };
        for(var i=0; i<3; i++){
            var pointer = this.pointers[["mouse", "hand1", "hand2"][i]];
            pointer.pressed = false;
            pointer.hoverShapes = [];
        }

        //set up event listeners
        {
            var canvas = this.getCanvas();
            this.DOMEventListeners.mousemove = function(event){
                This.__resetTransform();
                var offset = canvas.offset();
                This.pointers.mouse.x = event.pageX - offset.left;
                This.pointers.mouse.y = event.pageY - offset.top;

                var pos = new Vec(This.mouse);

                //send event to shapes
                This.__dispatchEvent(function(){
                    this.__triggerMouseMove(pos, event);
                });
                This.__triggerMouseMove(pos, event);

                //hover events
                var shape = This.camera.rayTrace(This.pointers.mouse.x, This.pointers.mouse.y)[0];
                This.__dispatchHoverEvent(shape, "mouse", event);
            };
            this.DOMEventListeners.scroll = function(event){
                This.__resetTransform();
                var delta = event.originalEvent.wheelDeltaY         //chrome
                            || event.originalEvent.deltaY*-40;      //firefox

                //send event to shapes
                var caught = This.__dispatchEvent(function(){
                    return this.__triggerMouseScroll(delta, event);
                });

                var m = This.pointers.mouse;
                if(!caught && m.x>=0 && m.y>=0 && m.x<=This.getWidth() && m.y<=This.getHeight())
                    This.__triggerMouseScroll(delta, event);
            };
            this.DOMEventListeners.keypress = function(event){
                This.__resetTransform();
                if(event.type=="keyup") //remove keys even if released outside of visualisation
                    delete This.pressedKeys[event.key.toLowerCase()];

                var isKeyDown = event.type=="keydown";
                var key = event.key;
                var keyCode = key?key.toLowerCase():key;

                //send event to shapes
                var caught = This.__dispatchEvent(function(){
                    return this.__triggerKeyPress(isKeyDown, keyCode, event);
                });

                var m = This.pointers.mouse;
                if(!caught && m.x>=0 && m.y>=0 && m.x<=This.getWidth() && m.y<=This.getHeight())
                    This.__triggerKeyPress(isKeyDown, keyCode, event);
            };
            this.DOMEventListeners.mousepress = function(event){
                This.__resetTransform();
                var isMouseDown = event.type=="mousedown";

                //send event to shapes
                var caught = This.__dispatchEvent(function(){
                    if(!isMouseDown) this.__triggerClick(event);
                    return this.__triggerMousePress(isMouseDown, event);
                });

                var m = This.pointers.mouse;
                if(!caught && m.x>=0 && m.y>=0 && m.x<=This.getWidth() && m.y<=This.getHeight()){
                    if(!isMouseDown) This.__triggerClick(event);
                    This.__triggerMousePress(isMouseDown, event);
                }
            };
            $(window).on('wheel', this.DOMEventListeners.scroll);
            $(window).on('keydown', this.DOMEventListeners.keypress);
            $(window).on('keyup', this.DOMEventListeners.keypress);
            $(window).on("mousemove", this.DOMEventListeners.mousemove);
            $(window).on('mousedown', this.DOMEventListeners.mousepress);
            $(window).on('mouseup', this.DOMEventListeners.mousepress);

        }
    }
    getRenderer(){
        return this.renderer;
    }
    getCanvas(){
        return this.getContainer().find("canvas.three");
    }
    __resetTransform(){
        //resets the transform that might have been applied by the VR camera
        this.scene.position.set(0, 0, 0);
        this.scene.scale.set(1, 1, 1);
        this.scene.rotation.set(0, 0, 0);
        this.scene.updateMatrixWorld();
    }


    //a method to add an event that fires whenever the screen is rendered
    onRender(listener){
        var index = this.renderListeners.indexOf(listener);
        if(index==-1) this.renderListeners.push(listener);
        return this;
    }
    offRender(listener){
        var index = this.renderListeners.indexOf(listener);
        if(index!=-1) this.renderListeners.splice(index, 1);
        return this;
    }
    __onRender(delta, per){
        //general listeners
        for(var i=0; i<this.renderListeners.length; i++)
            this.renderListeners[i].apply(this, arguments);
        return this;
    }

    //frame intpolation for VR
    __interpolate(){
        var delta = (Date.now()-this.lastUpdate)/this.deltaTime/1000;

        var shapes = this.getShapes();
        for(var i=0; i<shapes.length; i++){
            var shape = shapes[i];
            shape.__interpolate(delta);
        }
    }

    //disposal
    destroy(){
        $(window).off('wheel', this.DOMEventListeners.scroll);
        $(window).off('keydown', this.DOMEventListeners.keypress);
        $(window).off('keyup', this.DOMEventListeners.keypress);
        $(window).off('mousemove', this.DOMEventListeners.mousemove);
        $(window).off('mousedown', this.DOMEventListeners.mousepress);
        $(window).off('mouseup', this.DOMEventListeners.mousepress);
        super.destroy();
    }

    //event handeling
    __dispatchEvent(func, pos){
        var que;
        if(pos instanceof AbstractShape){
            que = [pos];
        }else{
            if(!pos) pos = this.pointers.mouse;

            que = this.camera.rayTrace(pos.x, pos.y);
        }

        while(que.length>0){
            var shape = que.pop();

            var parentShape = shape.getParentShape();
            if(parentShape)
                que.push(parentShape);

            //execute event
            if(!shape.interactionsDisabled && func.call(shape))
                return true;
        }
        return false;
    }
    __dispatchHoverEvent(shape, pointer, event){
        if(this.pointers.types.indexOf(pointer)==-1)
            pointer="mouse";
        pointer = this.pointers[pointer];

        //create some hover codes to recognize old and new hover states from pointers
        var oldHoverCode = pointer.hoverCode;
        var newHoverCode = Math.floor(Math.pow(10, 6)*Math.random())+"";
        pointer.hoverCode = newHoverCode;

        //get the list of shapes that the pointer was hovering over in the previous cycle
        var shapes = pointer.hoverShapes;

        //select new hover shape and parents
        while(shape){
            shape.__hoverCodes.push(newHoverCode);
            if(shapes.indexOf(shape)==-1){
                shapes.push(shape);
                shape.__triggerHover(true, event);
            }

            shape = shape.getParentShape();
        }

        //remove old hover shapes if needed
        for(var i=shapes.length-1; i>=0; i--){
            var shape = shapes[i];

            //get rid of the old code that identified that this pointer hovers over the shape
            var oldCodeIndex = shape.__hoverCodes.indexOf(oldHoverCode);
            if(oldCodeIndex!=-1) shape.__hoverCodes.splice(oldCodeIndex, 1);

            //if new code isn't set, this pointer no longer hovers over it
            if(shape.__hoverCodes.indexOf(newHoverCode)==-1){
                var index = shapes.indexOf(shape);
                if(index!=-1) shapes.splice(index, 1);

                //if the hoverCodes array is empty, no poijnter hovers over it anymore
                if(shape.__hoverCodes.length==0)
                    shape.__triggerHover(false, event);
            }
        }
    }

    //start/stop rendering
    pause(fully){
        if(!fully){
            this.updating = false
        }else{
            if(this.rendering==1)
                this.rendering = 2;
        }
        return this;
    }
    start(){
        this.updating = true;
        var wasNotRendering = this.rendering==0;
        this.rendering = 1;
        if(wasNotRendering)
            this.renderFunc();
        return this;
    }

    //pixi specific methods
    __getScene(){
        return this.scene;
    }
    __getRenderer(){
        return this.renderer;
    }

    //light
    setAmbientLightIntensity(intensity){
        this.ambientLight.intensity = intensity;
        this.ambientLight.light.intensity = intensity;
        return this;
    }
    getAmbientLightIntensity(){
        return this.ambientLight.intensity;
    }
    setAmbientLightColor(color){
        this.ambientLight.color = color;
        this.ambientLight.light.color.set(color);
        return this;
    }
    getAmbientLightColor(){
        return this.ambientLight.color;
    }

    //mouse  methods
    getMouseScreenLoc(){
        return this.pointers.mouse;
    }
    getMouseLoc(distance, pointer){
        if(typeof(distance)=="string"){
            pointer = distance;
            distance = null;
        }

        //check if given pointer is allowed
        if(this.pointers.types.indexOf(pointer)==-1)
            pointer="mouse";

        //if pointer isn't mouse, just straight up return the value
        if(pointer!="mouse")
            return this.pointers[pointer];

        //translate mouse position to world coordinate
        return this.camera.translateScreenToWorldLoc(this.getMouseScreenLoc().setZ(distance!=null?distance:0));
    }
    getMouseVec(x, y, z){
        var xyz;
        if(x instanceof AbstractShape)
            xyz = new Vec(x.getWorldLoc());
        else
            xyz = new Vec(x, y, z);

        //go through all pointers to find the closest one
        var closest = new Vec(xyz).sub(this.getMouseLoc());
        for(var i=1; i<this.pointers.types.length; i++){
            var type = this.pointers.types[i];
            var pos = this.getMouseLoc(null, type);
            var vec = new Vec(xyz).sub(pos);
            if(vec.getLength()<closest.getLength())
                closest = vec;
        }

        return vec;
    }
    getMousePressed(pointer){
        if(this.pointers.types.indexOf(pointer)==-1)
            pointer="mouse";
        return this.pointers[pointer].pressed;
    }

    //VR specific stuff
    __enableVR(){
        this.pointers.types = ["mouse", "hand1", "hand2"];
    }
    __disableVR(){
        this.pointers.types = ["mouse"];
    }
    __setHand(pointer, pos, pressed){
        var p = this.pointers[pointer];
        p.set(pos);
        p.pressed = pressed;
    }
}
