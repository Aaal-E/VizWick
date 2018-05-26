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
            This.mesh.position.set(
                This.getX(),
                This.getY(),
                This.getZ(),
            );
        });
        this.getRot().onChange(function(){
            This.mesh.rotation.set(
                This.getXRot(),
                This.getYRot(),
                This.getZRot(),
                "YZX",
            );
        });

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
        if(this.mesh)
            this.mesh.scale.set(scale, scale, scale);
        super.setScale(scale);
        return this;
    }

    //add to/remove from graphics
    add(){
        super.add();
        this.graphics.__getScene().add(this.mesh);
        this.mesh.updateMatrixWorld();
        return this;
    }
    __delete(){
        this.graphics.__getScene().remove(this.mesh);
        super.__delete();
    }
    __setParentShape(parent){
        super.__setParentShape(parent);
        this.mesh.updateMatrixWorld();
        return this;
    }
}
