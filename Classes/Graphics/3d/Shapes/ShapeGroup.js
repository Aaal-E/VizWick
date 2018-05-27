/*
    A shape that manages sub shapes
    Author: Tar van Krieken
    Starting Date: 20/5/2018
*/
class ShapeGroup3d extends Shape3d{
    constructor(graphics, preInit){
        super(graphics, null, preInit);
        this.shapes = [];
        this.radius = 0;

        //forward location change to children (world location)
        var This = this;
        this.getLoc().onChange(function(){
            for(var i=0; i<This.shapes.length; i++)
                This.shapes[i].getLoc().__fireEvent();
        });
        this.getRot().onChange(function(){
            for(var i=0; i<This.shapes.length; i++)
                This.shapes[i].getLoc().__fireEvent();
        });
    }
    __createMesh(){
        this.mesh = new THREE.Object3D();
        this.mesh.userData = {shape: this};
    }

    //shape interaction
    getShapes(){
        return this.shapes;
    }
    addShape(shape){
        for(var i=0; i<arguments.length; i++){
            var shape = arguments[i];
            if(this.shapes.indexOf(shape)==-1){
                this.mesh.add(shape.mesh);
                this.shapes.push(shape);
                shape.__setParentShape(this);
            }
        }
        this.__updateRadius();
        return this;
    }
    removeShape(shape){
        for(var i=0; i<arguments.length; i++){
            var shape = arguments[i];
            this.mesh.remove(shape.mesh);
            var index = this.shapes.indexOf(shape);
            if(index!=-1){
                this.shapes.splice(index, 1);
                shape.__setParentShape(null);
            }
        }
        this.__updateRadius();
        return this;
    }

    //manage the radius
    __updateRadius(){
        this.radius = 0;
        for(var i=0; i<this.shapes.length; i++){
            var shape = this.shapes[i];
            this.radius = Math.max(this.radius, new Vec(shape.getLoc()).getLength()+shape.__getRadius());
        }
    }
    __getRadius(){
        return this.radius*this.getScale();
    }


    //forward events
    __triggerScaleChange(){
        super.__triggerScaleChange();
        for(var i=0; i<this.shapes.length; i++)
            this.shapes[i].__triggerScaleChange();
    }
    __triggerRenderChange(){
        super.__triggerRenderChange();
        for(var i=0; i<this.shapes.length; i++)
            this.shapes[i].__triggerRenderChange();
    }
    __interpolate(per){
        super.__interpolate(per);
        for(var i=0; i<this.shapes.length; i++)
            this.shapes[i].__interpolate(per);
    }
    updateTransform(dontCarry){
        super.updateTransform();
        if(!dontCarry)
            for(var i=0; i<this.shapes.length; i++)
                this.shapes[i].updateTransform();
        return this;
    }
}
