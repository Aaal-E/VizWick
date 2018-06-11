/*
    3d texture shape
    Author: Tar van Krieken
    Starting Date: 01/06/2018
*/
class ImageShape3d extends Shape3d{
    constructor(gfx, source, width, height, initFunc){
        super(gfx, 0xffffff, function(){
            this.size = new XYZ(width, height, 1);

            this.source = source;
            if(initFunc) initFunc.call(this);
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
    __createMaterial(){
        if(this.source)
            this.texture = new THREE.TextureLoader().load(this.source);
        this.material = new THREE.SpriteMaterial({map:this.texture, color:0xffffff, transparent:true, depthWrite:true});
    }
    __createMesh(){
        this.mesh = new THREE.Sprite(this.material);
        this.mesh.userData = {shape: this};
    }

    //property setters
    setTexture(texture){
        this.texture = texture;
        this.material.map = this.texture;
        return this;
    }
    setSource(source){
        this.source = source;
        return this.setTexture(new THREE.TextureLoader().load(source));
    }

    //property getters
    getTexture(){
        return this.texture;
    }
    getSource(){
        return this.source;
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
        return Math.sqrt(x*x + y*y);
    }
}
