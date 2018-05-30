(function(){
    class Test extends Visualisation2d{
        constructor(container, tree, options){
            super(container, tree, options);
            this.mouseSelected = null;
        }
        __onUpdate(deltaTime){
            super.__onUpdate(deltaTime);
            var range = 30;

            var camera = this.getCamera();
            var scale = camera.getScale();
            var mouseLoc = this.getMouseLoc();

            var nodeShapes = this.search(mouseLoc, range/scale);

            var closest = {shape:null, dist:Infinity};
            for(var i=0; i<nodeShapes.length; i++){
                var nodeShape = nodeShapes[i];
                var dist = nodeShape.targetLoc.getVecTo(mouseLoc).getLength();
                if(dist<closest.dist && dist<=range/scale)
                    closest = {shape:nodeShape, dist:dist};
            }

            if(this.mouseSelected != closest.shape){
                if(this.mouseSelected)
                    this.mouseSelected.setTargetLoc(this.mouseSelected.targetLoc, 0.6, 10, function(){
                        this.__deregisterUpdateListener();
                    }).__registerUpdateListener();

                this.mouseSelected = closest.shape;

                if(this.mouseSelected)
                    this.mouseSelected.setTargetLoc(function(){
                        return this.getGraphics().getMouseLoc();
                    }, 0.6, 10).__registerUpdateListener();
            }
        }
        __getNodeShapeClass(VIZ){
            var camera = this.getCamera();
            var gfx = this;
            var initWidth = 400;
            return class NodeShape extends VIZ.NodeShape{
                constructor(gfx, node, scale){
                    super(gfx, node, function(){
                        this.scale = scale||1;

                        this.line = new VIZ.Line(gfx, new VIZ.XYZ(0, 0), new VIZ.XYZ(0, 0), 10, 0xffffff).setZ(-1);
                    });
                    this.setScale(this.scale);

                    //create primary circle shape
                    this.addShape(this.line);
                    var This = this;
                    this.getLoc().onChange(function(){
                        if(!This.getParent()) This.line.setEndPoint(This.getLoc());
                    });

                    this.circle = new VIZ.Circle(gfx, 30, 0xff0000);
                    this.addShape(this.circle);
                    this.circle.onHover(function(over){
                        if(over) This.highlight();
                        else     This.dehighlight();
                    });

                    this.setAngle(Math.random()-0.1);

                    //mouse events
                    this.onClick(function(){
                        this.focus();
                    });
                    this.onMousePress(function(type, data){
                        var button = data.data.button;
                        if(button==1){
                            this.createParent();
                            var p = this.getParent();
                            if(p) p.focus();
                            return true;
                        }
                    });

                    //hover event
                    this.text = new VIZ.HtmlShape(gfx, node.getName());
                    this.text.setScale(2);
                    this.onHover(function(over){
                        if(over)
                            this.addShape(this.text);
                        else{
                            this.removeShape(this.text);
                        }
                    });

                    //update aabb
                    this.storeInSpatialTree = true;
                    this.__updateAABB();
                }
                __stateChanged(field, val, oldState){
                    if(field=="focused" && val==true){
                        camera.setTarget(this.targetLoc, this, this);

                        this.createDescendants(2);      //creates 2 layers of descendants
                        this.destroyDescendants(2);     //destroys any descendants above those 2 layers

                        this.createAncestors(2);        //creates 2 layers of ancestors
                        this.destroyAncestors(2, true); //destroys any ancestors below those 2 layers
                    }

                    if(this.circle)
                        // this.circle.setColor(this.state.expanded?0x900000ff:0xff0000); //has alpha
                        this.circle.setColor(this.state.highlighted?0xff00ff:this.state.expanded?0x0000ff:0xff0000);
                }
                __connectParent(parent){
                    if(parent){
                        var w = (-parent.scale/2 + (this.getIndex()+0.5)*this.scale)*initWidth;
                        this.targetLoc = new VIZ.XYZ(parent.targetLoc).add(w, -130*parent.scale, this.getZ());
                        var This = this;
                        parent.getLoc().onChange(function(){
                            This.line.getEndPoint().set(this);
                        }).__fireEvent();
                    }else{
                        this.targetLoc = new VIZ.XYZ();
                    }
                }
                __show(){
                    var connectedNode = this.getConnectedNodeShape();
                    //set initial location
                    if(connectedNode){  //copy connected node if available
                        this.getLoc().set(connectedNode.getLoc()).sub(0, 0, (connectedNode==this.getParent()?1:-1)*1e-4);
                        // this.getLoc().set(connectedNode.getLoc()).sub(0, 0, 1e-4);
                        this.setScale(connectedNode.getScale());
                    }else{
                        this.setLoc(this.targetLoc);
                        this.setScale(0);
                    }

                    //set location to move to
                    var c = 2;
                    var complete = function(){
                        if(--c==0)  //count wheteher both events are finished
                            this.__deregisterUpdateListener();
                    };
                    this.setTargetLoc(this.targetLoc, 0.6, 10, complete)
                        .setTargetScale(this.scale, 0.6, 7, complete)
                        .__registerUpdateListener();
                }
                __hide(){
                    //set target position and scale
                    var target = this.getLoc();
                    var targetScale = 0;

                    //attempt to move to a connected shape instead
                    var connectedShape = this.getConnectedNodeShape(true); //'true' to not go to dead shapes
                    if(connectedShape){
                        target = connectedShape.getLoc();
                        targetScale = function(){
                            return connectedShape.getScale()
                        };
                        // this.setZ(connectedShape.getZ()-1e-4);
                        // console.log(this.getZ(), connectedShape.getZ());
                    }

                    //set location and scale to move to
                    var c = 2;
                    var complete = function(){
                        if(--c==0)
                            this.__deregisterUpdateListener().__delete();
                    }
                    this.setTargetLoc(target, 0, 12, complete)
                        .setTargetScale(targetScale, 0, 8, complete)
                        .__registerUpdateListener();
                }

                __createChildNodeShape(node, parent){
                    //Calculate the scale we want the node shape to have:
                    var scale = parent.scale/parent.getNode().getChildren().length;

                    //Create a new instance of your NodeShape and pass the scale
                    return new (this.__getClass())(this.getGraphics(), node, scale);
                }
            }
        }
    }


    //attach some data to be displayed on the webpage
    Test.description = {
        name: "test",
        description: "Some test visualisation",
        image: ""   //should contain some image path relative to the page
    };

    //register the class
    VisualisationHandler.registerVisualisation(Test);
})();   //all encased in a function in order to keep variables hidden/local
