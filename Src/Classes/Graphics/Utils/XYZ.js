/*
    A 3d coordinate class
    Author: Tar van Krieken
    Starting Date: 28/04/2018
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


class XYZ{
    constructor(x, y, z){
        this.l = []; //change listeners
        this.set(x||0, y, z);
    }

    //listeners
    onChange(func){
        this.l.push(func);
        return this;
    }
    offChange(func){
        var index = this.l.indexOf(func);
        if(index!=-1) this.l.splice(index, 1);
        return this;
    }
    __fireEvent(old){
        for(var i=0; i<this.l.length; i++) //notify all listeners
            this.l[i].call(this, this, old||this);
    }

    //set
    set(x, y, z){
        var old = {x:this.x, y:this.y, z:this.z};

        var xyz = getXYZ(x, y, z);
        this.x = xyz.x;
        this.y = xyz.y;
        this.z = xyz.z;

        this.__fireEvent(old);
        return this;
    }
    setX(x){
        return this.set(x, this.y, this.z);
    }
    getX(){
        return this.x;
    }
    setY(y){
        return this.set(this.x, y, this.z);
    }
    getY(){
        return this.y;
    }
    setZ(z){
        return this.set(this.x, this.y, z);
    }
    getZ(){
        return this.z;
    }

    //alter
    add(x, y, z){
        var xyz = getXYZ(x, y, z);
        return this.set(
            this.x + xyz.x,
            this.y + xyz.y,
            this.z + xyz.z
        );
    }
    sub(x, y, z){
        var xyz = getXYZ(x, y, z);
        return this.set(
            this.x - xyz.x,
            this.y - xyz.y,
            this.z - xyz.z
        );
    }
    mul(x, y, z){
        var xyz = getXYZ(x, y, z);
        return this.set(
            this.x * xyz.x,
            this.y * xyz.y,
            this.z * xyz.z
        );
    }
    div(x, y, z){
        var xyz = getXYZ(x, y, z);
        return this.set(
            this.x / xyz.x,
            this.y / xyz.y,
            this.z / xyz.z
        );
    }
    mod(x, y, z){
        var xyz = getXYZ(x, y, z);
        return this.set(
            xyz.x==0? this.x: this.x%xyz.x,
            xyz.y==0? this.y: this.y%xyz.y,
            xyz.z==0? this.z: this.z%xyz.z
        );
    }

    //compare method
    equals(x, y, z){
        var xyz = getXYZ(x, y, z);
        return xyz.x==this.x && xyz.y==this.y && xyz.z==this.z;
    }

    //create
    getVecTo(x, y, z){
        return new Vec(x, y, z).sub(this);
    }
}
