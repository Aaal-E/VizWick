/*
    3d cube class
    Author: Tar van Krieken
    Starting Date: 16/05/2018
*/
class Cuboid3d extends Shape3d{
    constructor(graphics, width, height, depth, color, preInit){
        super(graphics, color, function(){
            this.size = new XYZ(width, height, depth);

            if(height && height.call) height.call(this);
            if(preInit && preInit.call) preInit.call(this);
        });


        //listen for size changes
        this.prevTransform.size = new XYZ();

        var This = this;
        this.size.onChange(function(){
            This.__markDirty();
        });

        //update size
        this.setScale(1);
        this.updateTransform(); //don't interpolate size on creation
    }
    __createShape(){
        this.geometry = Cuboid3d.geometry;
    }

    //interpolation
    __setMeshScale(per){
        var scale = this.prevTransform.scale*(1-per) + this.transform.scale*per;
        var oldSize = this.prevTransform.size;
        var size = this.size;

        this.mesh.scale.x = scale* (oldSize.x*(1-per) + size.x*per);
        this.mesh.scale.y = scale* (oldSize.y*(1-per) + size.y*per);
        this.mesh.scale.z = scale* (oldSize.z*(1-per) + size.z*per);
    }
    updateTransform(){
        this.prevTransform.size.set(this.size);
        return super.updateTransform();
    }

    //scale functions
    setScale(scale){
        super.setScale(scale);
        this.setSize(this.getSize());
        return this;
    }
    getWorldScale(){
        this.mesh.getWorldScale(vec3);
        return vec3.x/this.size.getX();
    }

    //change size
    setSize(width, height, depth){
        this.size.set(width, height, depth);
        return this;
    }
    getSize(){
        return this.size;
    }

    //the radius to be used for the AABB
    __getRadius(){
        var x = this.size.getX()/2;
        var y = this.size.getY()/2;
        var z = this.size.getZ()/2;
        return Math.sqrt(x*x + y*y + z*z);
    }
}
Cuboid3d.geometry = new THREE.BoxGeometry(1, 1, 1);
