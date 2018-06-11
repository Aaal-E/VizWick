/*
    Generalized graphics abstract class
    Author: Tar van Krieken
    Starting Date: 28/04/2018
*/
class AbstractCamera{
    constructor(graphics){
        this.graphics = graphics;
        this.loc = new XYZ(0, 0, 0);
        this.rot = new Vec(0, 0, 0);
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
        this.targetFullRotations = false;

        //location and rotation change
        var This = this;
        this.loc.onChange(function(){
            This.graphics.__updateHtmlShapesLoc();
        });
        this.rot.onChange(function(){
            This.graphics.__updateHtmlShapesLoc();
        });

        var This = this;
        graphics.onUpdate(function(time){
            //move to target pos if defined
            if(This.target.loc){
                var delta = This.loc.getVecTo(This.target.loc);
                This.velo.add(delta.mul(time * This.targetForce.loc));
            }

            //move to target pos if defined
            if(This.target.rot){
                var delta = This.rot.getVecTo(This.target.rot);

                if(!this.targetFullRotations)   //modulo centered around 0
                    delta.mod(Math.PI*2).add(Math.PI*3).mod(Math.PI*2).sub(Math.PI);

                This.rotVelo.add(delta.mul(time * This.targetForce.rot));
            }

            //move to target pos if defined
            if(This.target.scale){
                var delta = This.target.scale-This.scale;
                This.scaleVelo += delta * time * This.targetForce.scale;
            }


            //apply velocity
            This.velo.mul(1-This.targetFriction.loc);   //drag/friction
            This.rotVelo.mul(1-This.targetFriction.rot);
            This.scaleVelo *= 1-This.targetFriction.scale;

            if(This.velo.getLength()>1e-6/This.getScale())
                This.loc.add(new Vec(This.velo).mul(time * This.speed.loc));
            if(This.rotVelo.getLength()>1e-6)
                This.rot.add(new Vec(This.rotVelo).mul(time * This.speed.rot));
            if(Math.abs(This.scaleVelo)>1e-5)
                This.setScale(This.scale + This.scaleVelo*time * This.speed.scale);
        });

        this.windowSizeScaleFactor = 1; //some scaling factor that depands on the visualisation area size
    }
    __updateLoc(){}

    //some methods to take care of scaling on window resize
    setWindowSize(width, height){
        var ratio = width/height;
        if(ratio>16/9){
            this.windowSizeScaleFactor = height/1080;
        }else{
            this.windowSizeScaleFactor = width/1920;
        }
        this.setScale(this.getScale());
        return this;
    }
    getTotalScale(){
        return this.scale*this.windowSizeScaleFactor;
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
        this.graphics.__updateHtmlShapesLoc();
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
        if(scale instanceof AbstractShape)
            scale = 1/scale.getScale();
        this.target.scale = scale;
        return this;
    }
    setTarget(loc, rot, scale){
        this.setTargetLoc(loc);
        this.setTargetRot(rot);
        this.setTargetScale(scale);
        return this;
    }
    setTargetFullRotations(rotations){
        this.targetFullRotations = rotations;
        return this;
    }
    getTargetFullRotations(){
        return this.targetFullRotations;
    }

    //mouse interaction
    translateScreenToWorldLoc(x, y, z){}
    translateWorldToScreenLoc(x, y, z){}
}
