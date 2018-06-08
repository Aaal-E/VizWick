/*
    Tree visualisation by Tar van Krieken
    Date: 06-06-2018
 */
(function(){
    //the visualisation class that you create
    class NodeShape extends VIZ3D.NodeShape{
        //Note an extra 'scale' argument got added to the constructor, this isn't necessary
        constructor(gfx, node, scale, isBranch){
            if(!scale) scale = 1; //if scale is abscent, set it to 1

            //We forward the it in the constructor, in order to save it as an object field
            super(gfx, node, function(){
                this.scale = scale //From now on, we can use this.scale
                this.isBranch = isBranch;

                this.leafColor = new VIZ3D.Color(0, 255, 0)
                                .setValue(0.3+node.getDepth()/gfx.getTree().getHeight()*0.7)
                                .getInt();
                this.circle = new VIZ3D.Sphere(gfx, 0.1, this.leafColor);
                this.branch = new VIZ3D.Line(gfx, null, null, 0.03, 0xD2691E);
            });
            this.setScale(this.scale); //set the actual scale after set up (its appearance)


            //A nodeshape doesn't render anything, so we must add shapes to it to display
            this.addShape(this.circle);
            this.addShape(this.branch);

            //Focus on the shape on a click event
            this.onClick(function(data){
                this.focus();
            });
            this.onHover(function(over){
                if(over)    this.highlight();
                else        this.dehighlight();
            });

            //allow for physics
            this.__registerUpdateListener();
            this.storeInSpatialTree = true;
            this.__updateAABB();
        }
        __onUpdate(time){
            if(!this.state.dragged){
            }
        }

        //This method gets called when either a parent or child node is created
        //In the visualisation
        __createChildNodeShape(node, parent){
            //Calculate the scale we want the node shape to have:
            // var scale = parent.scale/parent.getNode().getChildren().length;
            var parentDescCount = (node.getParent() && node.getParent().getSubtreeNodeCount()) || node.getSubtreeNodeCount();
            var scale = parent.scale/(1+1.3*Math.pow(1-node.getSubtreeNodeCount()/parentDescCount, 1));

            var children = this.getNode().getChildren();
            var firstChild = children[children.length-1]==node;

            //Create a new instance of your NodeShape and pass the scale
            return new (this.__getClass())(this.getGraphics(), node, scale, firstChild && this.isBranch);
        }

        __connectParent(parent){
            var length = 0.4;
            if(parent){

                var nodeCount = parent.getNode().getChildren().length;

                this.setLoc(parent.getLoc());

                var f = parent.getScale();
                var vec = new VIZ3D.Vec().setLength(length*f*Math.sqrt(1+nodeCount/40));
                vec.setYaw(Math.PI*2*(this.getIndex()+0.5)/nodeCount+parent.getRot().getY())
                    .setPitch(0.3).add(0, length*0.2*f*Math.sqrt(nodeCount/60), 0);

                // options:
                vec.setLength(vec.getLength()*(1+1*this.getIndex()/nodeCount));
                // vec.setLength(vec.getLength()*(1+1*this.getIndex()%4/4));

                if(nodeCount==1) vec.setX(0).setZ(0);

                this.getLoc().add(vec);
                this.getRot().set(vec.getRot());

                this.branch.setEndPoint(parent.getWorldLoc());
            }else{
                this.branch.setEndPoint(new VIZ3D.XYZ(0, -length, 0));
            }
        }

        __stateChanged(field, val, oldState){
            if(field=="focused" && val==true){
                this.getGraphics().getCamera().setTargetLoc(this).setTargetScale(this); //focus on shape on focus

                this.showFamily(Infinity, 4);
            }

            this.circle.setColor(this.state.highlighted?0x88ff88:this.state.expanded?this.leafColor:0x55ff55);
        }
    }
    class Tree extends VIZ3D.Visualisation{
        constructor(container, tree, options){
            super(container, tree, options);

            this.random = Math.seed(10);

            //rotate the camera for fun
            var camera = this.getCamera();
            this.onUpdate(function(){
                camera.getRot().add(0, options.getValue("rotation")/30, 0);
            });
            camera.setXRot(-0.5);

            this.maxNodeCount = 200;

            //add light
            var light = new VIZ3D.PointLight(this, 0xffffff).setLoc(0.7, 0.4, 0).add();

            //focus on root
            this.getShapesRoot()[0].focus();
        }
        __getNodeShapeClass(){
            return NodeShape;
        }
        __setupOptions(options){
            var This = this;
            options.add(new Options.Button("center").onClick(function(){
                This.synchronizeNode("focused", This.getTree().getRoot());
            }));

            //add rotation speed option
            options.add(new Options.Number("rotation", 0.5));
        }
        __setupRoot(){
            var node = this.tree.getRoot();
            var clas = this.__getNodeShapeClass(Visualisation2d.classes, node);
            var shape = new clas(this, node, 1, true);
            return shape.add();
        }
    }

    //create seedable random number generator: (source: https://stackoverflow.com/a/23304189)
    Math.seed = function(s){
        return function(){
            s = Math.sin(s) * 10000; return s - Math.floor(s);
        };
    };

    //attach some data to be displayed on the webpage
    Tree.description = {
        name: "tree",
        description: "3D version of carreer tree",
        image: ""   //should contain some image path relative to the page
    };

    //register the class
    VisualisationHandler.registerVisualisation(Tree);
})();   //all encased in a function in order to keep variables hidden/local
