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
            this.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.x));
            This.camera.rotation.set(
                This.getXRot(),
                This.getYRot(),
                This.getZRot(),
                "YZX",
            );
            This.__updateLoc();
        });

        this.rayCaster = new THREE.Raycaster();
        this.__updateLoc();
    }

    __updateLoc(){
        var vec = new Vec(this.getLoc());
        var dist = this.distance/this.getTotalScale();
        vec.sub(this.getRot().getLookAt().addYaw(Math.PI/2).setLength(dist));

        var n = 10; //half the range to focus on
        this.camera.far = dist+n/this.getScale();
        this.camera.near = Math.max(1e-3/this.getScale(), dist-n/this.getScale());
        this.camera.updateProjectionMatrix();

        this.camera.position.set(
            vec.getX(),
            vec.getY(),
            vec.getZ(),
        );
    }

    setWindowSize(width, height){
        super.setWindowSize(width, height);
        this.__updateLoc();
        return this;
    }

    //distance away from the location (handy for rotating around a point)
    setDistance(distance){
        this.distance = distance;
        this.__updateLoc();
        this.graphics.__updateHtmlShapesLoc();
        return this;
    }
    getDistance(){
        return this.distance;
    }

    //scale
    setScale(scale){
        var ret = super.setScale(scale);
        this.__updateLoc();
        this.graphics.__updateHtmlShapesLoc();
        return ret;
    }

    //FOV
    setFOV(fov){
        this.fov = fov;
        this.camera.fov = fov;
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
        this.rayCaster.ray.at(vec.getZ()-this.distance/this.getTotalScale(), vector);
        // this.rayCaster.ray.at((vec.getZ()), vector);

        return new Vec(vector);
    }
    translateWorldToScreenLoc(x, y, z){
        var vec = new Vec(x, y, z);
        var size = new XYZ(this.graphics.getWidth(), this.graphics.getHeight());

        var vector = new THREE.Vector3(vec.getX(), vec.getY(), vec.getZ());
        vector.project(this.camera);

        var depth = vec.sub(this.camera.position).getLength();
        return new Vec((vector.x*0.5+0.5)*size.getX(), (-vector.y*0.5+0.5)*size.getY(), depth+this.distance/this.getTotalScale());
    }
}
