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
        
        //update size
        this.setScale(1);
    }
    __createShape(){
        this.geometry = new THREE.SphereGeometry(1, 32, 32); //32 is accuracy of sorts
    }
    
    setScale(scale){
        super.setScale(scale);
        this.setRadius(this.getRadius());
        return this;
    }
    getWorldScale(){
        this.mesh.getWorldScale(vec3);
        return vec3.x/this.radius;
    }
    
    //change size
    setRadius(radius){
        this.radius = radius;
        var scale = this.mesh.scale;
        scale.x = scale.y = scale.z = this.getScale()*radius;
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