/*
    Tree visualisation by Tar van Krieken
    Date: 06-06-2018
 */
(function(){
    var radius = 0.1;   //size of the sphere
    var length = 0.3;   //size of the branch
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
                // console.log(down, event);
            });

            //allow for physics
            // this.__registerUpdateListener();
            // this.storeInSpatialTree = true;
            // this.__updateAABB();
        }
        getRadius(){
            return this.scale*radius;
        }
        // __onUpdate(time){
        //     if(!this.state.dragged){
        //         var shapes = this.search(this.getScale()*0.1);
        //
        //         var force = new VIZ3D.Vec();
        //
        //         var vec = new VIZ3D.Vec();
        //         for(var i=0; i<shapes.length; i++){
        //             var shape = shapes[i];
        //
        //             if(shape instanceof VIZ3D.Line){
        //
        //             }else if(shape instanceof NodeShape){
        //                 var dist = radius*(this.getScale()+shape.getScale());
        //                 vec.set(this.getLoc()).sub(shape.getLoc());
        //                 if(vec.getLength()<dist){
        //                     force.add(vec.mul(0.1));
        //                 }
        //             }
        //         }
        //
        //         vec.set(this.homeLoc).sub(this.getLoc());
        //         force.add(vec.mul(0.2));
        //
        //         this.getVelo().add(force.mul(0.1));
        //         // console.log(shapes.length);
        //         super.__onUpdate(time);
        //     }
        // }

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
            if(parent){
                var nodeCount = parent.getNode().getChildren().length;

                this.setLoc(parent.getLoc());

                var f = this.scale;
                var vec = new VIZ3D.Vec().setLength(length*f*Math.sqrt(1+nodeCount/40));
                vec.setYaw(Math.PI*2*(this.getIndex()+0.5)/nodeCount+parent.getRot().getY())
                    .setPitch(0.3).add(0, length*0.2*f*Math.sqrt(nodeCount/60), 0);

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
            this.updateLoc();
        }

        __stateChanged(field, val, oldState){
            if(field=="focused" && val==true){
                this.getGraphics().getCamera().setTargetLoc(this).setTargetScale(this); //focus on shape on focus

                this.showFamily(Infinity, 4);
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

            this.random = Math.seed(10);

            //rotate the camera for fun
            var camera = this.getCamera();
            var autoRotate = true;
            this.onUpdate(function(){
                if(autoRotate)
                    camera.getRot().add(0, options.getValue("rotation")/30, 0);
            });
            camera.setXRot(-0.6).setYRot(0.5*Math.PI);
            camera.setDistance(1.2);
            var This = this;
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
                    }})
                }
            });

            // this.setAmbientLightIntensity(0.1); //for testing

            this.maxNodeCount = 200;

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

            window.vis = this;//for debugging
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
            options.add(new Options.Number("rotation").setValue(0.5));
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
