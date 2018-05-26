/*
    3d line class
    Author: Tar van Krieken
    Starting Date: 23/05/2018
*/
class Line3d extends Shape3d{
    constructor(graphics, startPoint, endPoint, width, color, preInit){
        super(graphics, color, preInit);

        var l = this.getLoc().l;
        l.splice(l.length-1, 1);    //remove the last listener

        //make the line point right by default
        this.line = this.mesh;
        this.mesh = new THREE.Object3D();
        this.mesh.add(this.line);
        this.line.rotation.set(Math.PI/2, Math.PI/2, 0, "YZX");

        //init attributes
        this.setWidth(width);
        this.startPoint = this.getLoc();
        this.endPoint = new XYZ(0,0,0);

        //setup listeners
        var This = this;
        this.startPoint.onChange(function() {
            This.__updateTransform();
        });

        this.endPoint.onChange(function() {
            This.__updateTransform();
        });

        //pass init data if provided
        if(startPoint) this.setStartPoint(startPoint);
        if(endPoint) this.setEndPoint(endPoint);
    }
    __createShape(){
        this.geometry = new THREE.CylinderGeometry(1, 1, 1, 32); //32 is accuracy of sorts
        this.geometry.translate(0, 0.5, 0); //shift line upwards
    }
    __updateTransform(){
        var vec = new Vec(this.getLoc());

        if(this.parentShape)
            vec.add(this.parentShape.getWorldLoc());
        if(this.offsetShape)
            vec.sub(this.offsetShape.getWorldLoc());

        //position
        this.mesh.position.set(
            vec.getX(),
            vec.getY(),
            vec.getZ(),
        );

        //rotate and scale
        vec.sub(this.endPoint);
        this.setRot(vec.mul(-1).getRot());

        this.line.scale.y = vec.getLength()/this.getScale();

        //
        // //update the rotation
        // var vec = new Vec(this.endPoint).sub(loc);
        // var rot = vec.getRot();
        // // console.log(rot, vec);
        // var v = new THREE.Vector3(rot.x, rot.y, rot.z);
        // // v.add(, -Math.PI/2, 0);
        // if(this.parentShape){
        //     this.parentShape.mesh.getWorldQuaternion(quaternion);
        //     euler.setFromQuaternion(quaternion);
        //     // vec3.set(1, 0, 0);
        //     // v.applyQuaternion(quaternion.inverse());
        //     v.sub(euler);
        //     // console.log(v, euler);
        //     // vec3.sub()
        //     // rot.sub(this.parentShape.getWorldRot());
        //     // console.log(this.parentShape.getWorldRot());
        // }
        // this.setRot(v);
        // console.log(this.getRot());

        // //update the length
        // var length = vec.getLength(); //scale;
        // this.line.scale.y = length;
    }

    //update line when rendering state changes
    __setParentShape(parent){
        super.__setParentShape(parent);

        this.isRendered = parent.isRendered;
        this.__triggerRenderChange();

        return this;
    }
    __triggerRenderChange(){
        super.__triggerRenderChange();
        if(this.isRendered){
            this.graphics.__getScene().add(this.mesh);
        }else{
            this.graphics.__getScene().remove(this.mesh);
        }
    }

    //scale fix
    setScale(scale){
        super.setScale(scale);
        this.__updateTransform();
        return this;
    }

    //attribute getters and setters
    setWidth(width){
        this.width = width;
        if(this.parentShape){
            console.log(width, this.parentShape.getWorldScale(), this.parentShape.getScale());
            width*= this.parentShape.getWorldScale();
        }
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
    setOffsetAncestor(shape){
        this.offsetShape = shape;
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
    getOffsetAncestor() {
        return this.offsetShape;
    }

    //redraw on scale change
    __triggerScaleChange() {
        super.__triggerScaleChange();
        this.setWidth(this.getWidth());
    }
}
