/*
    3d shape class
    Author: Tar van Krieken
    Starting Date: 16/05/2018
*/
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
    }
    
    //shape creation
    __createShape(){}
    __createMaterial(){
        this.material = new THREE.MeshPhongMaterial({color:"#000000"}); 
        return this;
    }
    __createMesh(){
        if(this.geometry)
            this.mesh = new THREE.Mesh(this.geometry, this.material);
    }
    
    //properties
    setColor(color){
        this.material.color.setHex(color);
        return super.setColor(color);
    }
    
    
    //add to/remove from graphics
    add(){
        super.add();
        this.graphics.__getScene().add(this.mesh);
        return this;
    }
    __delete(){
        this.graphics.__getScene().remove(this.mesh);
        super.__delete();
    }
}