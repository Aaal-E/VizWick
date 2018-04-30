/*
    A node shape that manages sub shapes
    Author: Tar van Krieken
    Starting Date: 29/04/2018
*/
class ShapeGroup2d extends Shape2d{
    constructor(){
        super();
        this.shapes = [];
    }
    __createGfx(){
        return new PIXI.Container();
    }
    
    getShapes(){
        return this.shapes;
    }
    addShape(){
        for(var i=0; i<arguments.length; i++){
            var shape = arguments[i];
            this.gfx.addChild(shape.gfx);
            this.shapes.push(shape);
        }
        return this;
    }
    removeShape(){
        for(var i=0; i<arguments.length; i++){
            var shape = arguments[i];
            this.gfx.removeChild(shape.gfx);
            var index = this.shapes.indexOf(shape);
            if(index!=-1) this.shapes.splice(index, 1);
        }
        return this;
    }
}