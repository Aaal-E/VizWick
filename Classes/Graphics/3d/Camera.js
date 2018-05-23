/*
    3d camera class
    Author: Tar van Krieken
    Starting Date: 16/05/2018
*/
class Camera3d extends AbstractCamera{
    constructor(graphics, threeCamera){
        super(graphics, threeCamera);
        
        this.camera = threeCamera;
        this.setFOV(50);
        
        // //update camera on pos/rot change
        // var This = this;
        
        //listen for location/rotation changes
        var This = this;
        this.getLoc().onChange(function(){
            This.camera.position.set(
                This.getX(),
                This.getY(),
                This.getZ(),
            );
        });
        this.getRot().onChange(function(){
            This.camera.rotation.set(
                This.getXRot(),
                This.getYRot(),
                This.getZRot(),
                "YZX",
            );
        });
        
        this.rayCaster = new THREE.Raycaster();
        // //update camera pos
        // this.loc.set(0, 0, 0);
    }
    // __updateLoc(){
    //     var angle = -this.getZRot();
    //     var vec = new Vec(this.loc).mul(-this.getScale()).addAngle(angle).add(this.graphics.getWidth()/2, this.graphics.getHeight()/2);
    //     this.stage.rotation = angle;
    //     this.stage.x = vec.getX();
    //     this.stage.y = vec.getY();
    //     // this.stage.x = -this.loc.getX()*this.scale;
    //     // this.stage.y = this.graphics.getHeight()/2-this.loc.getY()*this.scale;
    // }
    // setScale(scale){
    //     this.stage.scale.set(scale);
    //     super.setScale(scale);
    //     this.__updateLoc();
    //     return this;
    // }
    
    //scale
    setScale(scale){
        var ret = super.setScale(scale);
        this.setFOV(this.getFOV());
        return ret;
    }
    
    //FOV
    setFOV(fov){
        this.fov = fov;
        this.camera.fov = fov/this.scale;
        this.camera.updateProjectionMatrix();
        return this;
    }
    getFOV(){
        return this.fov;
    }
    
    //position translations
    rayTrace(x, y, getAllData){
        if(typeof(y)!="number"){
            getAllData = y;
            y = null;
        }
        
        var vec = new Vec(x, y);
        var vec2 = new THREE.Vector2(vec.getX()/this.graphics.getWidth()*2-1, -(vec.getY()/this.graphics.getHeight()*2-1));
        
        this.rayCaster.setFromCamera(vec2, this.camera);
        var intersects = this.rayCaster.intersectObjects(this.graphics.__getScene().children, true);
        
        //order stuff if needed
        // intersects.sort(function(a, b){
        //     return a.distance>b.distance;
        // });
        
        var ret = [];
        for(var i=0; i<intersects.length; i++){
            var intersect = intersects[i];
            var mesh = intersect.object;
            
            //extract the usefful information
            if(getAllData){ 
                if(mesh.userData && mesh.userData.shape)
                    intersect.shape = mesh.userData.shape;
                    
                ret.push(intersect);
            }else if(mesh.userData && mesh.userData.shape)
                ret.push(mesh.userData.shape);
        }
        
        return ret;
    }
    translateScreenToWorldLoc(x, y, z){
        var vec = new Vec(x, y, z);
        var vec2 = new THREE.Vector2(vec.getX()/this.graphics.getWidth()*2-1, -(vec.getY()/this.graphics.getHeight()*2-1));
        
        this.rayCaster.setFromCamera(vec2, this.camera);
        var vector = new THREE.Vector3();
        this.rayCaster.ray.at(vec.getZ()/Math.max(this.graphics.getWidth(), this.graphics.getHeight()), vector);
        
        return new Vec(vector);
    }
    translateWorldToScreenLoc(x, y, z){
        var vec = new Vec(x, y, z);
        var size = new XYZ(this.graphics.getWidth(), this.graphics.getHeight());
        
        var vector = new THREE.Vector3(vec.getX(), vec.getY(), vec.getZ());
        vector.project(this.camera);
        
        return new Vec((vector.x*0.5+0.5)*size.getX(), (-vector.y*0.5+0.5)*size.getY(), 0);
    }
}