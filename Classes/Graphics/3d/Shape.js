/*
    3d shape class
    Author: Tar van Krieken
    Starting Date: 16/05/2018
*/
var vec3 = new THREE.Vector3(); //vector to temporarely store data
var quaternion = new THREE.Quaternion(); //also temporary
var euler = new THREE.Euler(); //also temporary
class Shape3d extends AbstractShape{
    constructor(graphics, color, preInit){
        super(graphics, preInit);

        //setup mesh
        this.__createMaterial();
        this.__createShape();
        this.__createMesh();

        //setup properties
        this.setColor(color);

        //listen for location/rotation changes
        var This = this;
        this.getLoc().onChange(function(){
            This.__markDirty();
        });
        this.getRot().onChange(function(old){
            This.__markDirty();
        });

        //transform of the previous tick
        this.prevTransform = {
            loc: new XYZ(),
            rot: new Vec(),
            scale: 1,
        };

        //data used by the hover system to support multiple pointers
        this.__hoverCodes = [];
    }

    //shape creation
    __createShape(){}
    __createMaterial(){
        this.material = new THREE.MeshPhongMaterial({color:"#000000"});
        return this;
    }
    __createMesh(){
        if(this.geometry){
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.userData = {shape: this};
        }
    }

    //interpolate the animation
    __interpolate(delta){
        if(this.prevTransform.tick>=this.graphics.tick){ //movement has happened
            if(this.prevTransform.tick==this.graphics.tick)
                this.updateTransform();
            else{
                this.__setMeshRot(delta);
                this.__setMeshLoc(delta);
                this.__setMeshScale(delta);
            }
        }
    }
    updateTransform(){
        this.prevTransform.rot.set(this.transform.rot);
        this.prevTransform.loc.set(this.transform.loc);
        this.prevTransform.scale = this.transform.scale;

        this.__setMeshRot(0);
        this.__setMeshLoc(0);
        this.__setMeshScale(0);
        return this;
    }

    __setMeshRot(per){
        var prevRot = this.prevTransform.rot;
        var rot = this.transform.rot;
        this.mesh.rotation.set(
            prevRot.x*(1-per) + rot.x*per,
            prevRot.y*(1-per) + rot.y*per,
            prevRot.z*(1-per) + rot.z*per,
            "YZX",
        );
    }
    __setMeshLoc(per){
        var prevLoc = this.prevTransform.loc;
        var loc = this.transform.loc;
        this.mesh.position.set(
            prevLoc.x*(1-per) + loc.x*per,
            prevLoc.y*(1-per) + loc.y*per,
            prevLoc.z*(1-per) + loc.z*per
        );
    }
    __setMeshScale(per){
        var scale = this.prevTransform.scale*(1-per) + this.transform.scale*per;
        this.mesh.scale.set(scale, scale, scale);
    }

    __markDirty(){
        this.prevTransform.tick = this.graphics.tick+1;
    }


    //absolute coordinates, relative to the screen
    getAbsoluteX(){
        var camera = this.getGraphics().getCamera();
        return camera.translateWorldToScreenLoc(this.getWorldLoc()).getX();
    }
    getAbsoluteY(){
        var camera = this.getGraphics().getCamera();
        return camera.translateWorldToScreenLoc(this.getWorldLoc()).getY();
    }

    //world location (when in other shape)
    getWorldLoc(){
        this.mesh.getWorldPosition(vec3);
        return new XYZ(vec3);
    }
    getWorldScale(){
        this.mesh.getWorldScale(vec3);
        return vec3.x;
    }
    getWorldRot(){
        this.mesh.getWorldQuaternion(quaternion);
        euler.setFromQuaternion(quaternion);
        return new XYZ(euler._x, euler._y, euler._z);
    }
    getWorldAngle(){
        return this.getWorldRotation();
    }

    //properties
    setColor(color){
        this.material.color.setHex(color);
        return super.setColor(color);
    }
    setAlpha(alpha){
        this.material.opacity = alpha;
        this.material.transparent = alpha!=1;
        return super.setAlpha(alpha);
    }
    setScale(scale){
        this.__markDirty();
        super.setScale(scale);
        return this;
    }

    //add to/remove from graphics
    add(){
        super.add();
        this.graphics.__getScene().add(this.mesh);
        this.mesh.updateMatrixWorld();
        this.updateTransform(); //don't interpolate
        this.__updateAABB();
        return this;
    }
    __delete(){
        this.graphics.__getScene().remove(this.mesh);
        super.__delete();
    }
    __setParentShape(parent){
        super.__setParentShape(parent);
        this.mesh.updateMatrixWorld();
        this.updateTransform(); //don't interpolate
        return this;
    }

    //whether we can interact with the shape in VR
    setVRhitboxEnabled(enabled){
        this.mesh.userData.ignore = !enabled;
        return this;
    }
}
