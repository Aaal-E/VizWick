/*
    Generalized graphics abstract class
    Author: Tar van Krieken
    Starting Date: 28/04/2018
*/
class AbstractCamera{
    constructor(graphics){
        this.graphics = graphics;
        this.loc = new XYZ(0, 0, 0);
        this.rot = new XYZ(0, 0, 0);
        this.velo = new Vec(0, 0, 0);
        this.scale = 1;
        
        this.target = {};
        this.targetTrailingSpeed = {
            scale: 0.1,
            rot: 0.1,
            loc: 0.1,
        };
        
        var This = this;
        graphics.onUpdate(function(delta){
            This.loc.add(new Vec(This.velo).mul(delta)); 
            
            //move to target pos if defined
            if(This.target.loc){
                var delta = This.target.loc.getVec(This.loc);
                This.loc.add(delta.mul(This.targetTrailingSpeed.loc));
            }
            
            //move to target pos if defined
            if(This.target.rot){
                var delta = This.target.loc.getVec(This.rot);
                This.rot.add(delta.mul(This.targetTrailingSpeed.rot));
            }
            
            //move to target pos if defined
            if(This.target.scale){
                var delta = This.target.scale-This.scale;
                setScale(This.scale+delta*This.targetTrailingSpeed.scale);
            }
        });
    }
    //position
    setX(x){
        this.loc.setX(x);
        return this;
    }
    getX(){
        return this.loc.getX();
    }
    setY(y){
        this.loc.setY(y);
        return this;
    }
    getY(){
        return this.loc.getY();
    }
    setZ(z){
        this.loc.setZ(z);
        return this;
    }
    getZ(){
        return this.loc.getZ();
    }
    setLoc(x, y, z){
        this.loc.set(x, y, z);
        return this;
    }
    getLoc(){
        return this.loc;
    }
    
    //rotation
    setXRot(x){
        this.rot.setX(x);
        return this;
    }
    getXRot(){
        return this.rot.getX();
    }
    setYRot(y){
        this.rot.setY(y);
        return this;
    }
    getYRot(){
        return this.rot.getY();
    }
    setZRot(z){
        this.rot.setZ(z);
        return this;
    }
    getZRot(){
        return this.rot.getZ();
    }
    setRot(x, y, z){
        this.rot.set(x, y, z);
        return this;
    }
    getRot(){
        return this.rot;
    }
    
    //scaling
    setScale(scale){
        this.scale = scale;
        return this;
    }
    getScale(){
        return this.scale;
    }
    
    //velocity
    getVelo(){
        return this.velo;
    }
    
    //targetting methods
    setTargetLoc(x, y, z){
        if(x instanceof AbstractShape)
            x = x.getLoc();
        if(x.x==null)
            x = new XYZ(x, y, z);
        this.target.loc = x;
        return this;
    }
    setTargetRot(x, y, z){
        if(x instanceof AbstractShape)
            x = x.getLoc();
        if(x.x==null)
            x = new XYZ(x, y, z);
        this.target.rot = x;
        return this;
    }
    setTargetScale(scale){
        this.target.scale = scale;
        return this;
    }
    setTarget(loc, rot, scale){
        this.setTargetLoc(loc);
        this.setTargetRot(rot);
        this.setTargetScale(scale);
        return this;
    }
}