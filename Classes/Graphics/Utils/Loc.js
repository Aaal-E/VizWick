var getXYZ = function(x, y, z){
    if(x._x!=null ||
       x._y!=null ||
       x._z!=null){
        return {
            x: x._x||0,
            y: x._y||0,
            z: x._z||0
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


class Loc{
    constructor(x, y, z){
        this.l = []; //change listeners
        this.set(x||0, y, z);
    }
    
    //listeners
    listen(func){
        var index = this.l.indexOf(func);
        if(index==-1){
            this.l.push(func);
        }else{
            this.l.splice(index, 1);
        }
    }
    
    //set
    set(x, y, z){
        var old = {x:this._x, y:this._y, z:this._z};
        
        var xyz = getXYZ(x, y, z);
        this._x = xyz.x;
        this._y = xyz.y;
        this._z = xyz.z;
        
        for(var i=0; i<this.l.length; i++) //notify all listeners
            this.l[i].call(this, this, old);
            
        return this;
    }
    x(x){
        if(x!=null){
            return this.set(x, this._y, this._z);
        }else{
            return this._x;
        }
    }
    y(y){
        if(y!=null){
            return this.set(this._x, y, this._z);
        }else{
            return this._y;
        }
    }
    z(z){
        if(z!=null){
            return this.set(this._x, this._y, z);
        }else{
            return this._z;
        }
    }
    
    //alter
    add(x, y, z){
        var xyz = getXYZ(x, y, z);
        return this.set(
            this._x + xyz.x,
            this._y + xyz.y,
            this._z + xyz.z
        );
    }
    sub(x, y, z){
        var xyz = getXYZ(x, y, z);
        return this.set(
            this._x - xyz.x,
            this._y - xyz.y,
            this._z - xyz.z
        );
    }
    mul(x, y, z){
        var xyz = getXYZ(x, y, z);
        return this.set(
            this._x * xyz.x,
            this._y * xyz.y,
            this._z * xyz.z
        );
    }
    div(x, y, z){
        var xyz = getXYZ(x, y, z);
        return this.set(
            this._x / xyz.x,
            this._y / xyz.y,
            this._z / xyz.z
        );
    }
    
    //create
    getVec(x, y, z){
        return new Vec(this).sub(x, y, z);
    }
}