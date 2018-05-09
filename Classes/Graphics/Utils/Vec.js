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
    
    //angles
    setAngle(angle){
        return this.setPitch(angle);
    }
    getAngle(){
        var pitch = this.getPitch();    //pitch is bounded to -PI/2 and PI/2
        var yaw = this.getYaw();        //yaw will switch between 0 and PI in 2d
        if(yaw>0)           
            pitch = yaw-pitch           //invert pitch if it is in opposite direction
        return pitch;
    }
    addAngle(angle){
        return this.addPitch(angle);
    }
    
    setYaw(yaw){
        var pitch = this.getPitch();
        var length = this.getLength();
        return this.set(
            Math.cos(yaw)*Math.cos(pitch)*length,
            Math.sin(pitch)*length,
            Math.sin(yaw)*Math.cos(pitch)*length
        );
    }
    getYaw(){
        return Math.atan2(this.z, this.x); 
    }
    addYaw(yaw){
        return this.setYaw(this.getYaw()+yaw);
    }
    
    setPitch(pitch){
        var yaw = this.getYaw();
        var length = this.getLength();
        return this.set(
            Math.cos(yaw)*Math.cos(pitch)*length,
            Math.sin(pitch)*length,
            Math.sin(yaw)*Math.cos(pitch)*length
        );
    }
    getPitch(){
        var yAxisDist = Math.sqrt(this.x*this.x + this.z*this.z);
        return Math.atan2(this.y, yAxisDist);
    }
    addPitch(pitch){
        return this.setPitch(this.getPitch()+pitch);
    }
    
    setLength(length){
        return this.mul(length/this.getLength());
    }
    getLength(){
        return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
    }
    addLength(length){
        return this.setLength(this.getLength()+length);
    }
}