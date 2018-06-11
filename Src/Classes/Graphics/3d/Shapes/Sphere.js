/*
    3d sphere class
    Author: Tar van Krieken
    Starting Date: 23/05/2018
*/
class Sphere3d extends Shape3d{
    constructor(graphics, radius, color, preInit){
        super(graphics, color, function(){
            this.radius = radius;
            if(preInit && preInit.call) preInit.call(this);
        });

        //keep track of radius change for interpolation
        this.prevTransform.radius = radius;

        //update size
        this.setScale(1);
    }
    __createShape(){
        this.geometry = Sphere3d.geometry;
    }

    //interpolation handler
    updateTransform(){
        this.prevTransform.radius = this.radius;
        super.updateTransform();
        return this;
    }
    __setMeshScale(per){
        var scale = this.prevTransform.scale*this.prevTransform.radius*(1-per) +
                    this.transform.scale*this.radius*per;
        this.mesh.scale.set(scale, scale, scale);
    }

    //scale handler
    getWorldScale(){
        this.mesh.getWorldScale(vec3);
        return vec3.x/this.radius;
    }

    //change size
    setRadius(radius){
        this.radius = radius;
        this.__markDirty();
        return this;
    }
    getRadius(){
        return this.radius;
    }

    //the radius to be used for the AABB
    __getRadius(){
        return this.getRadius();
    }
}
Sphere3d.geometry = new THREE.SphereGeometry(1, 32, 32); //32 is accuracy of sorts
