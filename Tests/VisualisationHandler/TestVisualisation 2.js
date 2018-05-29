this.debug = true; //shows the fps coounter

//the visualisation class that you create
class NodeShape2 extends VIZ2D.NodeShape{
    //Note an extra 'scale' argument got added to the constructor
    constructor(gfx, node, scale){
        if(!scale) scale = 1; //if scale is abscent, set it to 1
        //We forward the it in the constructor, in order to save it as an object field
        super(gfx, node, function(){
            this.scale = scale
        });
        this.setScale(this.scale); //set the actual scale after set up
        //From now on, we can use this.scale


        //A nodeshape doesn't render anything, so we must add shapes to it to display
        this.circle = new VIZ2D.Circle(gfx, 30, 0xff0000);
        this.addShape(this.circle);

        //Focus on the shape on a click event
        this.onClick(function(data){
            this.focus();
        });
    }

    //This method gets called when either a parent or child node is created
    //In the visualisation
    __createNodeShape(node){
        //Calculate the scale we want the node shape to have:
        var scale = 1;  //just as a placeholder

        //First retrieve the scale of the parent
        var ID = this.graphics.getUID();
        var parent = node.getParent();  //this will be a node
        if(parent){                     //check if it isn't the root
            var parentScale = 1;        //default scale

            var parentShape = parent.getShape(ID); //get the nodeShape attached to parent
            if(parentShape)             //if such a shape exists
                parentScale = parentShape.scale; //copy its scale

            //Sets the scale n times as small as its parent, with n being the childcount
            scale = parentScale/parent.getChildren().length;
        }

        //Create a new instance of your NodeShape and pass the scale
        return new (this.__getClass())(this.getGraphics(), node, scale);
    }

    __connectParent(parent){
        if(parent){ //doesn't have a parent if root
            //Set up the correct location for your node
            //I will simply devide the space equally
            var spaceWidth = 600;   //with scale 1, the children have 600 pixels of space

            //Get the number of children of the parent
            //note parent.getChildren() would return the child shapes,
            //  and not all children have been created yet
            var nodeCount = parent.getNode().getChildren().length;

            //calculate the width for each of the children
            var widthPerChild = spaceWidth/nodeCount;

            //Start at the very left of this space
            //  (with the space being centered on the parent)
            var x = -spaceWidth/2;

            //GetIndex() returns the child index in the parent
            //So this will move the shape to the right, proportional to the index
            x += this.getIndex()*widthPerChild;

            //now we make sure that the node is centered on the space it has available
            x += widthPerChild*0.5;

            //Finally we make sure the offset is relative to the scale
            x *= parent.scale;

            //now that we determined an appropriate x coordinate, we can set the location
            this.setLoc(parent.getX() + x, parent.getY() - 200*this.scale);
        }
    }

    __stateChanged(field, val, oldState){
        if(field=="focused" && val==true){
            this.getGraphics().getCamera().setTarget(this, this, this); //focus on shape on focus

            //When we focus on a node, we might want to show more of its descendants
            //And perhaps fewer of the parents
            //Some simple methods are in place to achieve this.

            //We can create 4 levels of descendants with this simple function
            this.createDescendants(1);

            //We can also make sure that any connected descendants that are below
            //Those 4 levels, will get destroyed
            this.destroyDescendants(1);

            //We can then also show 2 levels of parents (without all their children)
            this.createAncestors(2);

            //And similarly destroy any ancestors that are above those 2 levels
            //Note that the argument 'true' makes sure that children of the
            // ancestors are also properly removed, and not left floating around
            this.destroyAncestors(2, true);
        }
    }
}
class a_Visualisation2 extends Visualisation2d{
    constructor(container, tree, options){
        super(container, tree, options);

        options.createOption("Test", "number", 4);
        options.createOption("Test2", "color", "red");
    }
    __getNodeShapeClass(){
        return NodeShape2;
    }
}
a_Visualisation2.description = {
    name: "something 2",
    description: "",
    image: ""
};
VisualisationHandler.registerClass(a_Visualisation2);
