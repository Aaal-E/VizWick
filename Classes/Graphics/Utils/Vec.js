/*
    A 3d vector class
    Author: Tar van Krieken
    Starting Date: 30/04/2018
*/
var getXYZ = function(x, y, z){
    if(x.x!=null ||
       x.y!=null ||
       x.z!=null){
        return {
            x: x.x||0,
            y: x.y||0,
            z: x.z||0
        };
    }
    if(x.x!=null ||
       x.y!=null ||
       x.z!=null){
        return {
            x: x.x||0,
            y: x.y||0,
            z: x.z||0
        };
    }
    if( x!==undefined &&
        y===undefined &&
        z===undefined){
        return {
            x: x,
            y: x,
            z: x
        }
    }
    return {
        x: x||0,
        y: y||0,
        z: z||0
    };
};


class Vec extends XYZ{
    constructor(x, y, z){
        super(x, y, z);
    }

    //check if it is non zero
    isNonZero(modifier){
        modifier = modifier||1
        return Math.abs(this.x)>1e-3*modifier || Math.abs(this.y)>1e-3*modifier || Math.abs(this.z)>1e-3*modifier;
    }

    //angles (for 2d)
    setAngle(angle){
        var zAxisDist = Math.sqrt(this.x*this.x + this.y*this.y);
        var p = Math.atan2(this.z, zAxisDist);
        var length = this.getLength();
        return this.set(
            Math.cos(angle)*Math.cos(p)*length,
            Math.sin(angle)*Math.cos(p)*length,
            Math.sin(p)*length
        );
    }
    getAngle(){
        return Math.atan2(this.y, this.x);
    }
    addAngle(angle){
        return this.setAngle(this.getAngle()+angle);
    }

    //set angles
    setPYL(pitch, yaw, length){
        return this.set(
            Math.cos(yaw)*Math.cos(pitch)*length,
            Math.sin(pitch)*length,
            -Math.sin(yaw)*Math.cos(pitch)*length
        );
    }

    //yaw
    setYaw(yaw){
        var pitch = this.getPitch();
        var length = this.getLength();
        return this.setPYL(pitch, yaw, length);
    }
    getYaw(){
        return Math.atan2(-this.z, this.x);
    }
    addYaw(yaw){
        return this.setYaw(this.getYaw()+yaw);
    }

    //pitch
    setPitch(pitch){
        var yaw = this.getYaw();
        var length = this.getLength();
        return this.setPYL(pitch, yaw, length);
    }
    getPitch(){
        var yAxisDist = Math.sqrt(this.x*this.x + this.z*this.z);
        return Math.atan2(this.y, yAxisDist);
    }
    addPitch(pitch){
        return this.setPitch(this.getPitch()+pitch);
    }

    //length
    setLength(length){
        var yaw = this.getYaw();
        var pitch = this.getPitch();
        return this.setPYL(pitch, yaw, length);
    }
    getLength(){
        return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
    }
    addLength(length){
        return this.setLength(this.getLength()+length);
    }
    subLength(length){
        return this.setLength(Math.max(0, this.getLength()-length));
    }

    //rotate around rotation vector
    rotate(x, y, z){
        var XYZ = getXYZ(x, y, z);
        this.addYaw(XYZ.y);
        this.addPitch(XYZ.z);
        return this;
    }

    //translate to shape rotation
    getRot(){
        return new Vec(0, this.getYaw(), this.getPitch());
    }
    getLookAt(){
        return new Vec(1, 0, 0).setPitch(this.getX()).setYaw(this.getY());
    }
}
