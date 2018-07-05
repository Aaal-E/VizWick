(function(){
	var colors = {
        labelBG: 0xD2691E,
        labelBorder: 0x5b2b09,
    }
    //the visualisation class that you create
    var initWidth = 100;
    class NodeShape extends VIZ2D.NodeShape{
        constructor(gfx, node, scale){
            super(gfx, node, function(){
                this.scale = scale||1;
                this.angle = 0.75;
            });
            this.setScale(this.scale);  //update the actual shape scale

            //create primary circle shape
            this.lit = new VIZ2D.Circle(gfx, 36, 0xffff00);
            this.circle = new VIZ2D.Circle(gfx, 30, 0xff0000);
            this.addShape(this.circle);
			var bg = colors.labelBG.toString(16);
            var border = colors.labelBorder.toString(16);
            this.text = new VIZ2D.HtmlShape(gfx, "<span style='"+
                    "background-color: #"+bg+";"+
                    "padding: 5px;"+
                    "display: inline-block;"+
                    "border: 2px solid #"+border+";"+
                    "border-radius: 10px;"+
                    "'>"+
                    this.getNode().getName()+
                "</span>");
            this.text.setScale(1);


            this.setZ(-this.getNode().getDepth());

            this.onHover(
                function(enter){
                    if(enter){
						this.highlight();
					}else{
						this.dehighlight();
                    }
            });

            //create return button circle shape
            this.ret = new VIZ2D.Circle(gfx, 10, 0x00ff00);
            this.ret.setLoc(-20, 0);
            this.addShape(this.ret);
            var This = this;
            this.ret.onClick(function(){ //select parent when this is clicked
                This.createParent();
                var p = This.getParent();
                if(p){
                    this.getGraphics().setFocussed(p);
                    this.getGraphics().select(This);

                }
                return true;
            });

        //    this.onUpdate(function(){
        //        this.getLoc().add((Math.random()-0.5)*this.scale, (Math.random()-0.5)*this.scale);
        //    });
            this.onClick(function(){
                this.getGraphics().setFocussed(this);
                this.getGraphics().select(this.children[0]);
            });

            //update expanded (if there are no children to start with)
            this.__stateChanged("expanded");
        }

        __stateChanged(field, val, oldState){
            if(field=="focused" && val==true){
                this.getGraphics().getCamera().setTarget(this, this, 4/this.getWorldScale());

				this.showFamily(2, this.getVisualisation().layers); //2 ancestors, 3 layers of descendants
            }

            if(field=="expanded")
                this.circle.setColor(this.state.expanded?0x0000ff:0xff0000)

			if(field=="highlighted")
				if(val==true){
					this.text.setLoc(0,-40/(this.getGraphics().getCamera().scale*this.getWorldScale()),0);
                    this.addShape(this.text);
				} else {
					this.removeShape(this.text);
				}
        }
        __connectParent(parent){
            if(parent){
                var offset = 0;
                // parent.createChildren();
                var children = parent.getNode().getChildren();
                var UID = this.graphics.getUID();
                for (var i=0; i<this.getIndex(); i++){
                    var child = children[i];
                    var shape = child.getShape(UID);
                    if(!shape)
                        shape = parent.__createChildNodeShape(child, parent);
                    offset = offset + shape.scale;
                }

                this.angle = parent.angle - (0.3) + 0.6*((offset + 0.5*this.scale)/parent.scale)
                this.setAngle((this.angle*2+0.5)*Math.PI)
                var w = initWidth * parent.scale
                this.setLoc(new VIZ2D.Vec(parent.getLoc()).add(w*Math.cos(this.angle*2*Math.PI), w*Math.sin(this.angle*2*Math.PI), 0));

                //could have been: (though your sin and cos are swapped...)
                // this.setLoc(new VIZ.Vec(w, 0).setAngle(this.angle*2*Math.PI).add(parent.getLoc()));
                //so:
                // this.setLoc(new VIZ.Vec(w, 0).setAngle((-this.angle*2+0.5)*Math.PI).add(parent.getLoc()));

                var v = new VIZ2D.Vec(parent.getLoc()).sub(this.getLoc());
                v.setAngle(0);
                v.setLength(30*parent.scale/this.scale);
                var k = new VIZ2D.Vec(parent.getLoc()).sub(this.getLoc()).mul(1/this.scale).setAngle(0.5*Math.PI).add(v);
                var l = new VIZ2D.Vec(parent.getLoc()).sub(this.getLoc()).mul(1/this.scale).setAngle(0.5*Math.PI).sub(v);
                this.connection = new VIZ2D.Polygon(this.getGraphics(), [/*new VIZ2D.Vec(0,0,0)*/ 0, 0, k.x, k.y, l.x, l.y], 0x770000);
                this.connection.setZ(-150);
                this.addShape(this.connection);

            }
        }

        __createChildNodeShape(node, parent){
            //Calculate the scale we want the node shape to have:
            var scale = parent.scale * node.getSubtreeNodeCount()/node.getParent().getSubtreeNodeCount();

            return new (this.__getClass())(this.getGraphics(), node, scale);
        }

        select(){
			this.text.setLoc(0,-40/(this.getGraphics().getCamera().scale*this.getWorldScale()),0);
            this.addShape(this.lit);
            this.lit.setZ(-100);
            this.addShape(this.text);
        }

        unselect(){
            this.removeShape(this.lit);
            this.removeShape(this.text);
        }
    }
    class Jesterhat extends VIZ2D.Visualisation{
        constructor(container, tree, options){
            super(container, tree, options);
            this.focussed = this.getShapesRoot()[0];
            this.selected = this.getShapesRoot()[0];

            this.onKeyPress(function(down, key, event){
                if(down){
                    console.log(key);
                    if(key=="arrowleft"){
                        if(this.selected.getParent()){
                            var i = this.selected.getNode().getParent().getChildren().indexOf(this.selected.getNode()) - 1;
                            if(i < 0) i = i + this.selected.getNode().getParent().getChildren().length;
                            this.select(this.selected.getNode().getParent().getChildren()[i].getShape(this.getUID()));
                        }
                    } else if(key=="arrowright"){
                        if(this.selected.getParent()){
                            var i = this.selected.getNode().getParent().getChildren().indexOf(this.selected.getNode()) + 1;
                            if(i >= this.selected.getNode().getParent().getChildren().length) i = 0;
                            this.select(this.selected.getNode().getParent().getChildren()[i].getShape(this.getUID()));
                            }
                    } else if(key=="arrowup"){
                        this.setFocussed(this.selected);
                        if(this.focussed.getChildren().length > 0)
                        this.select(this.focussed.getChildren()[0]);
                    } else if (key=="arrowdown"){
                        this.select(this.focussed);
                        if(this.focussed.getParent())
                        this.setFocussed(this.focussed.getParent());

                    }
                }
            });

			var focused = VisualisationHandler.getSynchronisationData().focused||this.getShapesRoot()[0].getNode();
            this.synchronizeNode("focused", focused);
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

			options.add(new Options.Number("Maximum node count", 1, 50, 10000).setDescription("The number of nodes showing on the screen").onChange(function(val){
				This.maxNodeCount = val;
				refocus();
			}).setValue(1000));

			options.add(new Options.Number("Number of layers").setDescription("The number of layers shown").onChange(function(val){
				This.layers = val;
				refocus();
			}).setValue(3));

			// options.add(new Options.);
			}


        __getNodeShapeClass(VIZ){
            return NodeShape;
        }

        setFocussed(a){
            this.focussed = a;
            a.focus();
        }

        select(b){
			if(this.selected)
            	this.selected.unselect();
            this.selected = b;
            if(this.selected)
                this.selected.select();
        }

    }

    //attach some data to be displayed on the webpage
    Jesterhat.description = {
        name: "Jester Hat",
        description: "Jester Hat is a simple visualization. Every node is displayed as a circle, the size of which is linearly dependent on the size of the sub tree, with triangular polygons pointing towards it's children. If a node is red, it means not all of it's children are visible. Clicking a node will make the visualization focus on it, showing up to a configurable amount of layers of descendants (three by default). Each node also has a green circle, which when clicked will focus the visualization on the parent. Besides mouse controls, keyboard inputs can also be used to control the visualization. The node highlighted in yellow is the one that is currently selected. Pressing left or right on the arrow keys cycles this highlight through the children of the currently centered node. Pressing up will focus on the highlighted node, and move the highlight to one of its children if available, and pressing down will focus on the parent, moving the highlight to the previously focused node.",
        image: "Resources/Images/Visualizations/Jester Hat.png"
    };

    //register the class
    VisualisationHandler.registerVisualisation(Jesterhat);
})();   //all encased in a function in order to keep variables hidden/local
