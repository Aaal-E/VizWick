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
        this.rotVelo = new Vec(0, 0, 0);
        this.scale = 1;
        this.scaleVelo = 0;
        
        this.target = {};
        
        //some constants to alter the targetting system
        this.speed = {
            scale: 600,
            rot: 600,
            loc: 600
        }
        this.targetForce = {
            scale: 2,
            rot: 3,
            loc: 3
        }
        this.targetFriction = {
            scale: 0.8,
            rot: 0.8,
            loc: 0.8
        }
        
        var This = this;
        graphics.onUpdate(function(time){
            //move to target pos if defined
            if(This.target.loc){
                var delta = This.target.loc.getVec(This.loc);
                This.velo.add(delta.mul(time * This.targetForce.loc));
            }
            
            //move to target pos if defined
            if(This.target.rot){
                var delta = This.target.rot.getVec(This.rot);
                This.rotVelo.add(delta.mul(time * This.targetForce.rot));
            }
            
            //move to target pos if defined
            if(This.target.scale){
                var delta = This.target.scale-This.scale;
                This.scaleVelo += delta * time * This.targetForce.scale;
            }
            
            
            //apply velocity
            This.velo.mul(1-Math.pow(This.targetFriction.loc, time*60));   //drag
            This.rotVelo.mul(1-Math.pow(This.targetFriction.rot, time*60));   
            This.scaleVelo *= 1-Math.pow(This.targetFriction.scale, time*60);   
            
            This.loc.add(new Vec(This.velo).mul(time * This.speed.loc));
            This.rot.add(new Vec(This.rotVelo).mul(time * This.speed.rot));
            This.setScale(This.scale + This.scaleVelo*time * This.speed.scale);
        });
    }
    __updateLoc(){}
    
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
    getRotVelo(){
        return this.rotVelo();
    }
    setScaleVelo(scaleVelo){
        this.scaleVelo = scaleVelo;
        return this;
    }
    getScaleVelo(){
        return this.scaleVelo;
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
            x = x.getRot();
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