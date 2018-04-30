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
}