/*
    A node shape that manages sub shapes
    Author: Tar van Krieken
    Starting Date: 30/04/2018
*/
class ShapeGroup2d extends Shape2d{
    constructor(graphics){
        super(graphics);
        this.shapes = [];
    }
    __createGfx(){
        return new PIXI.Container();
    }
    
    //shape interaction
    getShapes(){
        return this.shapes;
    }
    addShape(shape){
        for(var i=0; i<arguments.length; i++){
            var shape = arguments[i];
            this.gfx.addChild(shape.gfx);
            this.shapes.push(shape);
            shape.setParentShape(this);
        }
        return this;
    }
    removeShape(shape){
        for(var i=0; i<arguments.length; i++){
            var shape = arguments[i];
            this.gfx.removeChild(shape.gfx);
            var index = this.shapes.indexOf(shape);
            if(index!=-1){
                this.shapes.splice(index, 1);
                shape.setParentShape(null);
            }
        }
        return this;
    }
}