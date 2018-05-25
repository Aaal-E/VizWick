/*
    A shape that manages sub shapes
    Author: Tar van Krieken
    Starting Date: 30/04/2018
*/
class ShapeGroup2d extends Shape2d{
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

        //create group (not sure why, but it seems to work)
        this.group = new PIXI.display.Group(1, true);
    }
    __createGfx(){
        return new PIXI.display.Layer(this.group);
    }
    __getGroup(){
        return this.group;
    }

    //shape interaction
    getShapes(){
        return this.shapes;
    }
    addShape(shape){
        for(var i=0; i<arguments.length; i++){
            var shape = arguments[i];
            if(this.shapes.indexOf(shape)==-1){
                this.gfx.addChild(shape.gfx);
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
            this.gfx.removeChild(shape.gfx);
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
            this.radius = Math.max(this.radius, new Vec(shape.getLoc()).getLength()+shape.__getRadius()*shape.getScale());
        }
    }
    __getRadius(){
        return this.radius;
    }

    //forward scale events
    __triggerScaleChange(){
        super.__triggerScaleChange();
        for(var i=0; i<this.shapes.length; i++)
            this.shapes[i].__triggerScaleChange();
    }
}
