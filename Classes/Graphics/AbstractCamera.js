/*
    Generalized graphics abstract class
    Author: Tar van Krieken
    Starting Date: 28/04/2018
*/
class AbstractCamera{
    constructor(graphics){
        this.graphics = graphics;
        this.loc = new Loc(0, 0, 0);
        this.rot = new Loc(0, 0, 0);
    }
    //position
    x(x){
        if(x!=null){
            this.loc.x(x);
            return this;
        }
        return this.loc.x();
    }
    y(y){
        if(y!=null){
            this.loc.y(y);
            return this;
        }
        return this.loc.y();
    }
    z(z){
        if(z!=null){
            this.loc.z(z);
            return this;
        }
        return this.loc.z();
    }
    setLoc(x, y, z){
        this.loc.set(x, y, z);
        return this;
    }
    getLoc(){
        return this.loc;
    }
    
    //rotation
    xRot(x){
        if(x!=null){
            this.rot.x(x);
            return this;
        }
        return this.rot.x();
    }
    yRot(y){
        if(y!=null){
            this.rot.y(y);
            return this;
        }
        return this.rot.y();
    }
    zRot(z){
        if(z!=null){
            this.rot.z(z);
            return this;
        }
        return this.rot.z();
    }
    setRot(x, y, z){
        this.rot.set(x, y, z);
        return this;
    }
    getRot(){
        return this.rot;
    }
}