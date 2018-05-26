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
        this.setDistance(1.5);

        // //update camera on pos/rot change
        // var This = this;

        //listen for location/rotation changes
        var This = this;
        this.getLoc().onChange(function(){
            This.__updateLoc();
        });
        this.getRot().onChange(function(){
            This.camera.rotation.set(
                This.getXRot(),
                This.getYRot(),
                This.getZRot(),
                "YZX",
            );
            This.__updateLoc();
        });

        this.rayCaster = new THREE.Raycaster();
    }

    __updateLoc(){
        var vec = new Vec(this.getLoc());
        vec.add(this.getRot().getLookAt().addYaw(Math.PI/2).setLength(this.distance));
        // console.log(this.getRot().getLookAt().addYaw(Math.PI/2).setLength(this.distance));
        this.camera.position.set(
            vec.getX(),
            vec.getY(),
            vec.getZ(),
        );
    }

    //distance away from the location (handy for rotating around a point)
    setDistance(distance){
        this.distance = distance;
        return this;
    }
    getDistance(){
        return this.distance;
    }

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
