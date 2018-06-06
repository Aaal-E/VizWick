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
            });
            this.setScale(this.scale); //set the actual scale after set up (its appearance)


            //A nodeshape doesn't render anything, so we must add shapes to it to display
            this.circle = new VIZ3D.Sphere(gfx, 0.1, 0xff0000);
            this.addShape(this.circle);

            //Focus on the shape on a click event
            this.onClick(function(data){
                this.focus();
            });
        }

        //This method gets called when either a parent or child node is created
        //In the visualisation
        __createChildNodeShape(node, parent){
            //Calculate the scale we want the node shape to have:
            // var scale = parent.scale/parent.getNode().getChildren().length;
            var scale = parent.scale/1.2;

            var children = this.getNode().getChildren();
            var firstChild = children[children.length-1]==node;

            //Create a new instance of your NodeShape and pass the scale
            return new (this.__getClass())(this.getGraphics(), node, scale, firstChild && this.isBranch);
        }

        __connectParent(parent){
            if(parent){
                if(this.isBranch){
                    this.getLoc().set(parent.getLoc()).add(0, 0.4*parent.getScale(), 0);
                }else if(parent.isBranch){
                    var nodeCount = parent.getNode().getChildren().length;

                    var vec = new VIZ3D.Vec().setLength(0.8*parent.getScale());
                    var index = this.getIndex();

                    vec.setYaw(Math.PI*2*index/nodeCount); //divide circle over children

                    vec.rotate(parent.getRot());
                    this.getLoc().set(parent.getLoc()).add(vec);
                    this.setRot(vec.getRot());
                }else{
                    var nodeCount = parent.getNode().getChildren().length+1;
                    if(parent.isBranch) nodeCount-=2;

                    var vec = new VIZ3D.Vec().setLength(0.8*parent.getScale());
                    var index = this.getIndex();

                    vec.setYaw(Math.PI*0.5*(-0.5+(index+1)/nodeCount)); //divide circle over children

                    vec.rotate(parent.getRot());
                    this.getLoc().set(parent.getLoc()).add(vec);
                    this.setRot(vec.getRot());
                }
            }
        }

        __stateChanged(field, val, oldState){
            if(field=="focused" && val==true){
                this.getGraphics().getCamera().setTargetLoc(this).setTargetScale(this); //focus on shape on focus

                this.showFamily(2, 2);
            }
        }
    }
    class Tree extends VIZ3D.Visualisation{
        constructor(container, tree, options){
            super(container, tree, options);

            this.random = Math.seed(10);

            //rotate the camera for fun
            var camera = this.getCamera();
            this.onUpdate(function(){
                camera.getRot().add(0, 0.04, 0);
            });
            camera.setXRot(-0.3);

            //add light
            var light = new VIZ3D.PointLight(this, 0xffffff).setLoc(0.1, 0.4, 0).add();
        }
        __getNodeShapeClass(){
            return NodeShape;
        }
        __setupOptions(options){
            var This = this;
            options.add(new Options.Button("center").onClick(function(){
                This.synchronizeNode("focused", This.getTree().getRoot());
            }));
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
