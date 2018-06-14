/*
    3d Visualisation class
    Author: Tar van Krieken
    Starting Date: 31/05/2018
*/
class Visualisation3d extends Graphics3d{
    constructor(container, tree, options, preInit){
        super(null, null, container, preInit);
        this.__setupVisualisation(tree, options);
        this.shapes.unique.dragging = {
            hand1: null,
            hand2: null,
            mouse: null
        };

        //limit the node count
        this.maxNodeCount = 500;

        $(document).off("mouseup", this.DOMEventListeners.mouseUp);
        this.DOMEventListeners.mouseUp = (function(event){
            if(this.shapes.unique.dragging.mouse){
                this.shapes.unique.dragging.mouse.__changeState("dragged", false);
                event.preventDefault();
                event.stopImmediatePropagation();
            }
            this.shapes.unique.dragging.mouse = null;
        }).bind(this);
        $(document).on("mouseup", this.DOMEventListeners.mouseUp);

    }


    getShape(state, pointer){
        var s = this.shapes.unique[state];
        if(state=="dragging") s = s[pointer];
        return s;
    }

    //disposal, starts the removing of shapes, and removes the entire vis when done
    destroy(callback){
        this.__destroy(callback);
        super.destroy();
    }

    //setup
    __setupRoot(){
        var node = this.tree.getRoot();
        var clas = this.__getNodeShapeClass(Visualisation3d.classes, node);
        var shape = new clas(this, node);
        return shape.add();
    }


    dragShape(shape, pointer){
        if(this.pointers.types.indexOf(pointer)==-1)
            pointer="mouse";

        if(this.shapes.unique.dragging[pointer])
            this.shapes.unique.dragging[pointer].__changeState("dragged", false);
        this.shapes.unique.dragging[pointer] = shape;
        if(shape)
            shape.__changeState("dragged", true);
        return this;
    }

    //shape dragging
    __onUpdate(deltaTime){
        if(this.shapes.unique.dragging){
            if(this.shapes.unique.dragging.mouse)
            this.shapes.unique.dragging.mouse.__onDrag(this.getMouseLoc(), "mouse");

            if(this.shapes.unique.dragging.hand1 && this.pointers.hand1)
            this.shapes.unique.dragging.hand1.__onDrag(this.pointers.hand1, "hand1");

            if(this.shapes.unique.dragging.hand2 && this.pointers.hand2)
            this.shapes.unique.dragging.hand2.__onDrag(this.pointers.hand2, "hand2");
        }

        super.__onUpdate(deltaTime);
    }


    //add default options
    __setupOptions(options){
        var This = this;
    }
}

//copy methods of abstractVisualisation
var keys = Object.getOwnPropertyNames(AbstractVisualisation.prototype);
for(var i=0; i<keys.length; i++)
    if(!Visualisation3d.prototype[keys[i]])
        Visualisation3d.prototype[keys[i]] = AbstractVisualisation.prototype[keys[i]];

//make the visualisation system public
window.Visualisation3d = Visualisation3d;
Visualisation3d.classes = window.VIZ3D = {
    Visualisation: Visualisation3d,

    //general classes
    XYZ: XYZ,
    Vec: Vec,
    Color: Color,

    //special shapes
    Shape: Shape3d,
    ShapeGroup: ShapeGroup3d,
    NodeShape: NodeShape3d,
    HtmlShape: HtmlShape3d,
    PointLight: PointLight3d,

    //standard shapes
    Sphere: Sphere3d,
    Line: Line3d,
    TextShape: TextShape3d,
    ImageShape: ImageShape3d,
    Cuboid: Cuboid3d,
    // Polygon: Polygon2d,
};
