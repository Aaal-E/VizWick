/*
    3d line class
    Author: Tar van Krieken
    Starting Date: 23/05/2018
*/
class Line3d extends Shape3d{
    constructor(graphics, startPoint, endPoint, width, color, ratio, preInit){
        super(graphics, color, function(){
            this.widthRatio = ratio||1;

            if(preInit) preInit.call(this);
        });

        var l = this.getLoc().l;
        l.splice(l.length-1, 1);    //remove the last listener

        //make the line point right by default
        this.line = this.mesh;
        this.mesh = new THREE.Object3D();
        this.mesh.add(this.line);
        this.line.rotation.set(Math.PI/2, Math.PI/2, 0, "YZX");

        //init attributes
        this.setWidth(width);
        this.startPoint = this.getLoc();
        this.endPoint = new XYZ(0,0,0);

        //setup listeners to indicate that something has changed
        var This = this;
        this.startPoint.onChange(function(){
            This.__markDirty();
        });
        this.endPoint.onChange(function(){
            This.__markDirty();
        });


        //pass init data if provided
        if(startPoint) this.setStartPoint(startPoint);
        if(endPoint) this.setEndPoint(endPoint);

        //keep track of previous version of these properties for interpolation
        this.prevTransform.startPoint = new XYZ(this.startPoint);
        this.prevTransform.width = this.width;
        this.prevTransform.endPoint = new XYZ(this.endPoint);
    }
    __createShape(){
        if(Line3d.geometry[this.widthRatio])
            this.geometry = Line3d.geometry[this.widthRatio];
        else{
            this.geometry = Line3d.geometry[this.widthRatio] = new THREE.CylinderGeometry(1, this.widthRatio, 1, 32); //32 is accuracy of sorts
            this.geometry.translate(0, 0.5, 0); //shift line upwards
        }
    }


    //interpolate the animation
    __interpolate(delta){
        if(this.prevTransform.tick>=this.graphics.tick){ //movement has happened
            if(this.prevTransform.tick==this.graphics.tick)
                this.updateTransform();
            else{
                this.__setPoints(delta);
                this.__setMeshScale(delta);
            }
        }
    }
    updateTransform(){
        this.prevTransform.startPoint.set(this.startPoint);
        this.prevTransform.endPoint.set(this.endPoint);
        this.prevTransform.scale = this.transform.scale;
        this.prevTransform.width = this.width;

        // this.__setEndPoint(0);
        this.__setPoints(0);
        this.__setMeshScale(0);
        return this;
    }

    __setPoints(per){
        var prevStart = this.prevTransform.startPoint;
        var start = this.startPoint;

        var prevEnd = this.prevTransform.endPoint;
        var end = this.endPoint;

        //transform shape to match points
        this.__updateTransform(new XYZ(
            prevStart.x*(1-per) + start.x*per,
            prevStart.y*(1-per) + start.y*per,
            prevStart.z*(1-per) + start.z*per
        ), new XYZ(
            prevEnd.x*(1-per) + end.x*per,
            prevEnd.y*(1-per) + end.y*per,
            prevEnd.z*(1-per) + end.z*per
        ));
    }
    __setMeshScale(per){
        var scale = this.prevTransform.scale*(1-per) + this.transform.scale*per;
        this.mesh.scale.set(scale, scale, scale);

        var width = this.prevTransform.width*(1-per) + this.width*per;
        if(this.parentShape)
            width*= this.parentShape.getWorldScale();
        this.line.scale.x = this.line.scale.z = width;
    }

    //calculate properties from start and end points
    __updateTransform(start, end){
        var vec = new Vec(start);

        if(this.parentShape)
            vec.add(this.parentShape.getWorldLoc());
        if(this.offsetShape)
            vec.sub(this.offsetShape.getWorldLoc());

        //position
        this.mesh.position.set(
            vec.getX(),
            vec.getY(),
            vec.getZ(),
        );

        //rotation
        vec.sub(end).mul(-1);
        this.setRot(vec.getRot());
        this.mesh.rotation.set(
            this.getXRot(),
            this.getYRot(),
            this.getZRot(),
            "YZX",
        );

        this.line.scale.y = vec.getLength()/this.getScale();
    }

    //update line when rendering state changes
    __setParentShape(parent){
        super.__setParentShape(parent);

        this.isRendered = parent.isRendered;
        this.__triggerRenderChange();

        return this;
    }
    __triggerRenderChange(){
        super.__triggerRenderChange();
        if(this.isRendered){
            this.graphics.__getScene().add(this.mesh);
        }else{
            this.graphics.__getScene().remove(this.mesh);
        }
    }

    //attribute getters and setters
    setWidth(width){
        this.width = width;
        this.__markDirty();
        return this;
    }
    setStartPoint(startX, startY, startZ){
        this.startPoint.set(startX, startY, startZ);
        return this;
    }
    setEndPoint(endX, endY, endZ){
        this.endPoint.set(endX, endY, endZ);
        return this;
    }
    setOffsetAncestor(shape){
        this.offsetShape = shape;
        return this;
    }

    getWidth(){
        return this.width;
    }
    getStartPoint(){
        return this.startPoint;
    }
    getEndPoint(){
        return this.endPoint;
    }
    getOffsetAncestor() {
        return this.offsetShape;
    }

    //redraw on scale change
    __triggerScaleChange() {
        super.__triggerScaleChange();
        this.setWidth(this.getWidth());
    }
}
Line3d.geometry = {};
