/*
    Tree visualisation by Tar van Krieken
    Date: 06-06-2018
 */
(function(){
    var radius = 0.1;   //size of the sphere
    var colors = {
        branch: 0xD2691E,
        labelBG: 0xD2691E,
        labelBorder: 0x5b2b09,
        leaf: 0x00ff00,
        leafHighlighted: 0x88ff88,
        leafCollapsed: 0x55ff55,
    }

    //the visualisation class that you create
    class NodeShape extends VIZ3D.NodeShape{
        //Note an extra 'scale' argument got added to the constructor, this isn't necessary
        constructor(gfx, node, scale){
            if(!scale) scale = 1; //if scale is abscent, set it to 1

            //We forward the it in the constructor, in order to save it as an object field
            super(gfx, node, function(){
                this.scale = scale //From now on, we can use this.scale

                this.leafColor = VIZ3D.Color.fromInt(colors.leaf)
                                .setValue(0.3+node.getDepth()/gfx.getTree().getHeight()*0.7)
                                .getInt();
                this.sphere = new VIZ3D.Sphere(gfx, radius, this.leafColor);
                this.branch = new VIZ3D.Line(gfx, null, null, 0.03, colors.branch);

                // this.label = new VIZ3D.TextShape(gfx, node.getName());
                this.branch.storeInSpatialTree = true;
            });
            this.setScale(this.scale); //set the actual scale after set up (its appearance)


            //A nodeshape doesn't render anything, so we must add shapes to it to display
            this.addShape(this.sphere);
            this.addShape(this.branch);

            //Focus on the shape on a click event
            this.onMousePress(function(down, data){
                if(!down && this.graphics.dragging<10 && (!data || data.button==0)){
                    this.focus();
                    this.graphics.dragging = false;
                    return true;
                }
            });
            var This = this;
            this.dragDist = 0;
            this.sphere.onHover(function(over){
                if(over)    This.highlight();
                else        This.dehighlight();
            }).onMousePress(function(down, event){
                if(down && event && event.button==2){
                    //check if this shape is not in the chain upto the focused shape
                    var focusedShape = this.graphics.getShape("focused");
                    if(focusedShape){
                        var shapes = focusedShape.getAncestors();
                        if(shapes.indexOf(This)!=-1 || focusedShape==This)
                            return;
                    }

                    //set shape to be dragged and store the depth to the camera
                    This.dragDist = this.graphics.getCamera().translateWorldToScreenLoc(This.getLoc()).getZ();
                    this.graphics.dragShape(This);
                    return true; //catch event
                }
            });
        }
        getRadius(){
            return this.scale*radius;
        }

        __onDrag(loc, pointer){
            if(pointer=="mouse"){
                var mouseLoc = this.graphics.getMouseScreenLoc();
                var loc = this.graphics.getCamera().translateScreenToWorldLoc(mouseLoc.getX(), mouseLoc.getY(), this.dragDist);
                this.setLoc(loc).updateTransform();
            }else{
                this.setLoc(loc).updateTransform();
            }
            if(this.getParent())
                this.relativeLoc = new VIZ3D.Vec(this.getLoc()).sub(this.getParent().getLoc());

            var children = this.getChildren();
            for(var i=0; i<children.length; i++){
                children[i].updateLoc();
            }
        }

        //This method gets called when either a parent or child node is created
        //In the visualisation
        __createChildNodeShape(node, parent){
            //Calculate the scale we want the node shape to have:
            // var scale = parent.scale/parent.getNode().getChildren().length;
            var parentDescCount = (node.getParent() && node.getParent().getSubtreeNodeCount()) || node.getSubtreeNodeCount();
            var descPer = node.getSubtreeNodeCount()/parentDescCount;
            var scale = parent.scale/1.6/(1-Math.log(descPer)/Math.log(30));

            //Create a new instance of your NodeShape and pass the scale
            return new (this.__getClass())(this.getGraphics(), node, scale);
        }

        __connectParent(parent){
            parent = parent || this.getParent();
            var length = this.graphics.branchLength.getValue()/100;
            var pitch = this.graphics.branchAngle.getValue()/180*Math.PI;
            if(parent){
                var nodeCount = parent.getNode().getChildren().length;

                this.setLoc(parent.getLoc());

                var f = this.scale;
                var vec = new VIZ3D.Vec().setLength(length*f*Math.sqrt(1+nodeCount/40));
                vec.setYaw(Math.PI*2*(this.getIndex()+0.5)/nodeCount+parent.getRot().getY())
                    .setPitch(pitch).add(0, length*0.2*f*Math.sqrt(nodeCount/60), 0);

                // options:
                vec.setLength(vec.getLength()*(1+1*this.getIndex()/nodeCount));
                // vec.setLength(vec.getLength()*(1+1*this.getIndex()%4/4));

                if(nodeCount==1) vec.setX(0).setZ(0);

                vec.addLength(parent.getRadius()); //make sure it is not in the parent's sphere

                this.getRot().setY(vec.getRot().getY());
                this.getLoc().add(vec);
                this.relativeLoc = vec;

                this.branch.setEndPoint(parent.getLoc()).updateTransform();
                var This = this;
                parent.getLoc().onChange(function(){
                    This.branch.setEndPoint(parent.getLoc());
                });
            }else{
                this.branch.setEndPoint(new VIZ3D.XYZ(0, -length, 0));
                this.relativeLoc = new VIZ3D.Vec(0,0,0);
            }
            this.version = this.graphics.version;
        }

        updateLoc(parent){
            if(this.getParent())
                this.setLoc(this.getParent().getLoc())
            else
                this.setLoc(0,0,0);
            this.getLoc().add(this.relativeLoc);

            this.updateTransform();
            this.branch.updateTransform();
            this.branch.getEndPoint();


            var children = this.getChildren();
            for(var i=0; i<children.length; i++){
                children[i].updateLoc();
            }
        }
        __show(){
            if(this.version!=this.graphics.version){ //keeps track of any scale related changes
                var parent = this.node.getParent();
                this.__connectParent(parent && parent.getShape(this.graphics.getUID()));
            }
            this.updateLoc();
        }

        __stateChanged(field, val, oldState){
            if(field=="focused" && val==true){
                this.getGraphics().getCamera().setTargetLoc(this).setTargetScale(this); //focus on shape on focus

                this.showFamily(Infinity, this.graphics.layers);
            }

            this.sphere.setColor(this.state.highlighted?colors.leafHighlighted:this.state.expanded?this.leafColor:colors.leafCollapsed);
            if(field=="highlighted"){
                if(!this.label)
                    this.createLabel();
                if(val==true) this.addShape(this.label);
                else          this.removeShape(this.label);
            }
        }

        createLabel(){
            var bg = colors.labelBG.toString(16);
            var border = colors.labelBorder.toString(16);

            this.label = new VIZ3D.HtmlShape(this.graphics,
                "<span style='"+
                    "background-color: #"+bg+";"+
                    "padding: 5px;"+
                    "display: inline-block;"+
                    "border: 2px solid #"+border+";"+
                    "border-radius: 10px;"+
                    "'>"+
                    this.getNode().getName()+
                "</span>"
            );
            this.label.getVRoffset().add(0, this.sphere.getRadius()*2, 0);
            this.label.setVRhitboxEnabled(false);
        }
    }
    class Tree extends VIZ3D.Visualisation{
        constructor(container, tree, options){
            // window.debugging = true;//for testing
            super(container, tree, options);
            var This = this;

            //manage the camera
            var camera = this.getCamera();
            camera.setDistance(1.2);

            //rotate the camera by default i the mouse is not in the screen
            var autoRotate = true;
            this.onUpdate(function(){
                if(autoRotate && options.getValue("Auto rotation"))
                    camera.getRot().add(0, options.getValue("Rotation speed")/30, 0);
            });

            //allow for camera rotation by dragging, and zooming by scrolling
            This.dragging = false;
            this.onMousePress(function(down, event){
                if(event && event.button==0)
                    This.dragging = down?1:false;
            });
            This.oldMousePos = {x:0, y:0};
            this.onMouseMove(function(pos){
                if(This.dragging){
                    This.dragging++;
                    var dx = pos.x-This.oldMousePos.x;
                    var dy = pos.y-This.oldMousePos.y;

                    camera.getRot().add(-dy/100, -dx/100, 0);
                }
                This.oldMousePos.x = pos.x;
                This.oldMousePos.y = pos.y;

                autoRotate = pos.x<0 || pos.y<0 || pos.x>this.getWidth() || pos.y>this.getHeight();
            });
            var distObj = $({dist:camera.getDistance()});
            var targetDist = camera.getDistance();
            this.onMouseScroll(function(scroll, event){
                if(event){  //not emitted by controller in VR
                    targetDist -= scroll/1000;
                    targetDist = Math.max(targetDist, 0.2);
                    distObj.stop(true).animate({dist:targetDist}, {easing:"linear", duration:200, step:function(val){
                        camera.setDistance(val);
                    }});
                }
            });

            //add lights
            var lights = [];
            for(var i=0; i<6; i++){
                var light = new VIZ3D.PointLight(this, 0xffffff, 0.1, 500).setLoc(Math.random()-0.5, Math.random()*0.5, Math.random()-0.5).add();
                light.getVelo().set(
                    (Math.random()-0.5)*0.5,
                    (Math.random()-0.5)*0.5,
                    (Math.random()-0.5)*0.5
                );
                light.__registerUpdateListener();

                lights.push(light);
            }
            this.onUpdate(function(){
                for(var i=0; i<lights.length; i++){
                    var light = lights[i];
                    if(light.getX()>0.5) light.getVelo().add(-0.005, 0, 0);
                    if(light.getX()<-0.5)light.getVelo().add(0.005, 0, 0);
                    if(light.getY()>0.5) light.getVelo().add(0, -0.005, 0);
                    if(light.getY()<-0)light.getVelo().add(0, 0.005, 0);
                    if(light.getZ()>0.5) light.getVelo().add(0, 0, -0.005);
                    if(light.getZ()<-0.5)light.getVelo().add(0, 0, 0.005);
                }
            });
            //add 1 main light:
            new VIZ3D.PointLight(this, 0xffffff, 0.6, 500).setLoc(0.5, 3, 0).add();


            //focus on root
            var focused = VisualisationHandler.getSynchronisationData().focused||this.getShapesRoot()[0].getNode();
            this.synchronizeNode("focused", focused);
        }
        __getNodeShapeClass(){
            return NodeShape;
        }
        __setupOptions(options){
            var This = this;

            this.version = 0; //a veriable that allows nodes to be marked dirty
            var refocus = function(){
                var focused = This.getShape("focused");
                if(focused){
                    focused.__show();
                    This.setShapeState("focused", focused);
                }
            };


            //add button to go back to the parent
            options.add(new Options.Button("parent").setIcon("arrow-up").setDescription("Go to the parent of the current node").onClick(function(){
                var current = This.getShape("focused");
                var parent = current.getNode().getParent();
                if(parent) This.synchronizeNode("focused", parent);
            }));


            //add option to stop rotation completely
            options.add(new Options.Boolean("Auto rotation").setDescription("Whether or not to auto rotate the visualisation when not focused").setValue(true));

            //add rotation speed option
            options.add(new Options.Number("Rotation speed").setDescription("The rotation speed when the mouse is not in the window").setValue(0.5));



            //add option for maximum node count
            options.add(new Options.Number("Maximum node count", 1, 50, 20000).setDescription("The maximum number of nodes to show at once").onChange(function(val){
                This.maxNodeCount = val;
                refocus();
            }).setValue(200));

            //add option for how many layers to show
            options.add(new Options.Number("Layer count", 1, 1, 20).setDescription("The number of descendant layers to show of the focused node").onChange(function(val){
                This.layers = val;
                refocus();
            }).setValue(4));

            //add option to alter the branch length
            this.branchLength = new Options.Number("Branch length", 1, 1, 100).setDescription("The length o the branch lengths in the visualization").onChange(function(val){
                This.version += 1;
                refocus();
            }).setValue(30);
            options.add(this.branchLength);

            //add option for child size decrease
            this.branchAngle = new Options.Number("Branch angle", 1, -90, 90).setDescription("The upwards angle that a branch has").onChange(function(val){
                This.version += 1;
                refocus();
            }).setValue(18);
            options.add(this.branchAngle);


            window.options = options; //for debugging
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
        name: "Acacia Tree",
        description: "Acacia tree is a simple visualisation that makes use of 3d space. Each node is displayed as a green sphere, and its children are connected to it using brown cylinders. The size of the sphere is proportional to a logarithm of its subtree size, so you can get an idea of which nodes contain more descendants. If the sphere is bright green, that means it is currently not showing all of its children. When clicking on a node, it will be focused and move to the center of the screen. This will also reveal all of its children if they weren't visible already. When hovering over a sphere, its name will appear in the visualization and statistics will appear in the statistics side-bar. If a node happens to overlap with an other node, you can right click it and drag it to a new location. If a node is merely behind an other node, you can simply left click and drag in order to rotate the whole view point. If you aren't able to reach the parent node of the focused node, a special button in the top right can be used to focus on this node. The options tab itself also offers several options to slightly customize the visualization. You can also click the VR button in order to use it in VR. This has however only been tested with the oculus rift + touch system, so other systems might not work properly.", //is now some stuff copied from the report, should be a description on usage
        image: "Resources/Images/Visualizations/Acacia Tree.png" 
    };

    //register the class
    VisualisationHandler.registerVisualisation(Tree);
})();   //all encased in a function in order to keep variables hidden/local
