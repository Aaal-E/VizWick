/*
    3d cube class
    Author: Tar van Krieken
    Starting Date: 16/05/2018
*/
class Cuboid3d extends Shape3d{
    constructor(graphics, color, width, height, depth, preInit){
        super(graphics, color, function(){
            this.size = new XYZ(width, height, depth);
            
            if(height && height.call) height.call(this);
            if(preInit && preInit.call) preInit.call(this);
        });
        
        
        //listen for size changes
        var This = this;
        this.size.onChange(function(){
            This.mesh.scale.x = This.transform.scale*This.size.getX();
            This.mesh.scale.y = This.transform.scale*This.size.getY();
            This.mesh.scale.z = This.transform.scale*This.size.getZ();
        });
        
        //update size
        this.setScale(1);
    }
    __createShape(){
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
    }
    
    setScale(scale){
        super.setScale(scale);
        this.setSize(this.getSize());
        return this;
    }
    getWorldScale(){
        cube.mesh.getWorldScale(vec3);
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
        return Math.sqrt(x*x + y*y + z*z)*this.getScale();
    }
}