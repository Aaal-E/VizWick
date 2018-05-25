/*
    3d line class
    Author: Tar van Krieken
    Starting Date: 23/05/2018
*/
class Line3d extends Shape3d{
    constructor(graphics, startPoint, endPoint, width, color, preInit){
        super(graphics, color, preInit);
        
        this.line = this.mesh;
        this.mesh = new THREE.Object3D();
        this.mesh.add(this.line);
        this.line.rotation.set(Math.PI/2, Math.PI/2, 0, "YZX");
        
        this.setWidth(width);
        this.startPoint = this.getLoc();
        this.endPoint = new XYZ(0,0,0);

        var This = this;
        this.startPoint.onChange(function() {
            This.__updateRot();
        });

        this.endPoint.onChange(function() {
            This.__updateRot();
        });
        
        if(startPoint) this.setStartPoint(startPoint);
        if(endPoint) this.setEndPoint(endPoint);
    }
    __createShape(){
        this.geometry = new THREE.CylinderGeometry(1, 1, 1, 32); //32 is accuracy of sorts
        this.geometry.translate(0, 0.5, 0); //shift line upwards
    }
    __updateRot(){
        var loc = this.getWorldLoc();
        var rot = this.getWorldRot();
        var scale = this.getWorldScale();
        
        //update the rotation
        var vec = new Vec(this.endPoint).sub(loc);
        var rot = vec.getRot();
        console.log(rot, vec);
        var v = new THREE.Vector3(rot.x, rot.y, rot.z);
        // v.add(, -Math.PI/2, 0);
        if(this.parentShape){
            this.parentShape.mesh.getWorldQuaternion(quaternion);
            euler.setFromQuaternion(quaternion);
            // vec3.set(1, 0, 0);
            // v.applyQuaternion(quaternion.inverse());
            v.sub(euler); 
            console.log(v, euler);
            // vec3.sub()
            // rot.sub(this.parentShape.getWorldRot());
            // console.log(this.parentShape.getWorldRot());
        }
        this.setRot(v);
        // console.log(this.getRot());
        
        //update the length
        var length = vec.getLength(); //scale;
        this.line.scale.y = length;
    }
    
    //update line when parent changes
    __setParentShape(parent){
        super.__setParentShape(parent);
        this.__updateRot();
        return this;
    }
    
    //scale fix
    setScale(scale){
        super.setScale(scale);
        this.__updateRot();
        return this;
    }
    
    //width, end and start point getter and setter
    setWidth(width){
        this.width = width;
        this.line.scale.x = this.line.scale.z = width;
        return this;
    }
    setStartPoint(startX, startY, startZ){
        this.startPoint.set(startX, startY, startZ);
        return this;
    }
    setEndPoint(endX, endY, endZ){
        this.endPoint.set(endX, endY, endZ);
        return this;
    }

    getWidth(){
        return this.width;
    }
    getStartPoint(){
        return this.startPoint;
    }
    getEndPoint(){
        return this.endPoint;
    }
}