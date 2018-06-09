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

    //distance methods
    getVecToLineSegment(xStart, yStart, zStart, xEnd, yEnd, zEnd){
        if(xStart instanceof XYZ){  //parameters can shift if xStart is XYZ object
            var dir = v3.set(yStart, zStart, xEnd).sub(xStart);
            var lineVec = this.getVecToLine(dir, xStart, dir.getLength());
            if(lineVec!==null) return lineVec;

            var startVec = this.getVecToPoint(xStart);
            var endVec = this.getVecToPoint(yStart, zStart, xEnd);
            return startVec.getLength()<endVec.getLength()?startVec:endVec;
        }else{
            var dir = v3.set(xEnd, yEnd, zEnd).sub(xStart, yStart, zStart);
            var lineVec = this.getVecToLine(dir, xStart, yStart, zStart, dir.getLength());
            if(lineVec!==null) return lineVec;

            var startVec = this.getVecToPoint(xStart, yStart, zStart);
            var endVec = this.getVecToPoint(xEnd, yEnd, zEnd);
            return startVec.getLength()<endVec.getLength()?startVec:endVec;
        }
    }
    getVecToLine(xDir, yDir, zDir, xOffset, yOffset, zOffset, end){
        //declare the main data variables
        var vec = v1.set(xDir, yDir, zDir);
        var point = new Vec(this);

        //subtract position of the line
        if(xDir instanceof XYZ){    //consider all possible combinations of passed arguments (x,y,z might be XYZ object)
            if(yDir instanceof XYZ){
                point.sub(yDir);
                end = zDir;
            }else if(yDir!=null && zDir!=null){
                point.sub(yDir, zDir, xOffset);
                end = yOffset;
            }else{
                end = yDir;
            }
        }else{
            if(xOffset instanceof XYZ){
                point.sub(xOffset);
                end = yOffset;
            }else if(xOffset!=null && yOffset!=null){
                point.sub(xOffset, yOffset, zOffset);
            }else{
                end = xOffset;
            }
        }

        //declare some variables to be used
        var yaw = vec.getYaw();
        var pitch = vec.getPitch();
        var projection = v2.set(point);

        //rotate around y axis to make the line point right/up, cancel out the z axis
        projection.addYaw(-yaw);
        projection.setZ(0);

        //rotate around z axis to make the line point right, cancel out the y axis
        projection.addPitch(-pitch);
        projection.setY(0);


        //if an end was defined, make the line act as a line segment,
        //and return null when the projection falls of the segment
        if(end!=null){
            if(projection.getX()<0)  return null;
            if(projection.getX()>end)return null;
        }

        //rotate the line back now that the axes that aren't aligned with line are canceld out
        projection.addPitch(pitch).addYaw(yaw);

        //subtract this projection from the point in order to get the remaning vector
        return point.sub(projection).mul(-1); //mul by -1 to get vector towards instead of away
    }
    getVecToPoint(x, y, z){
        return new Vec(x, y, z).sub(this);
    }

    getProjectionOnLine(xDir, yDir, zDir, xOffset, yOffset, zOffset, end){
        //declare the main data variables
        var vec = new Vec(xDir, yDir, zDir);
        var point = new Vec(this);

        //subtract position of the line
        if(xDir instanceof XYZ){    //consider all possible combinations of passed arguments (x,y,z might be XYZ object)
            if(yDir instanceof XYZ){
                point.sub(yDir);
                end = zDir;
            }else if(yDir!=null && zDir!=null){
                point.sub(yDir, zDir, xOffset);
                end = yOffset;
            }else{
                end = yDir;
            }
        }else{
            if(xOffset instanceof XYZ){
                point.sub(xOffset);
                end = yOffset;
            }else if(xOffset!=null && yOffset!=null){
                point.sub(xOffset, yOffset, zOffset);
            }else{
                end = xOffset;
            }
        }

        //declare some variables to be used
        var yaw = vec.getYaw();
        var pitch = vec.getPitch();
        var projection = v2.set(point);

        //rotate around y axis to make the line point right/up, cancel out the z axis
        projection.addYaw(-yaw);
        projection.setZ(0);

        //rotate around z axis to make the line point right, cancel out the y axis
        projection.addPitch(-pitch);
        projection.setY(0);


        //if an end was defined, make the line act as a line segment,
        //and return null when the projection falls of the segment
        if(end!=null){
            if(projection.getX()<0)  return null;
            if(projection.getX()>end)return null;
        }

        //rotate the line back now that the axes that aren't aligned with line are canceld out
        return vec.setLength(projection.getLength()).mul(projection.getX()<0?-1:1);
    }

    //translate to shape rotation
    getRot(){
        return new Vec(0, this.getYaw(), this.getPitch());
    }
    getLookAt(){
        return new Vec(1, 0, 0).setPitch(this.getX()).setYaw(this.getY());
    }
}

//some vectors for internal calculation
var v1 = new Vec();
var v2 = new Vec();
var v3 = new Vec();
