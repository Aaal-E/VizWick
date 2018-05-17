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
        camera.position.z = 4;
        
        //create a renderer with Antialiasing
        this.renderer = new THREE.WebGLRenderer({antialias:true});
        this.renderer.setClearColor("#000000");
        this.renderer.setSize(this.getWidth(), this.getHeight());
        this.container.append($(this.renderer.domElement).addClass("three"));
        
        //render Loop
        var This = this;
        this.updating = true;
        var last = Date.now();
        var delta = 1/30;
        var render = function () {
            requestAnimationFrame(render);
            
            var now = Date.now();
            if((now-last)/1000>delta){
                if(This.updating)
                    This.__onUpdate(delta);
                last += delta*1000;
                if(now-last>2000)
                    last = now;
                
                //actually render the frame
                This.renderer.render(This.scene, camera);
            }
        };
        render();
        
        this.ambientLight = {
            color: 0xffffff,
            intensity: 0.3,
            light: new THREE.AmbientLight(0xffffff),
        };
        this.ambientLight.light.intensity = this.ambientLight.intensity;
        this.scene.add(this.ambientLight.light);
        
        //connect a camera
        this.camera = new Camera3d(this, camera);
    }
    
    
    getCanvas(){
        return this.getContainer().find("canvas.three");
    }
    
    //start/stop rendering
    //TODO make pause start methods
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
    //TODO update mouse methods
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