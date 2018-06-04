(function(){
    //from: https://stackoverflow.com/a/17243070
    function HSVtoInt(h, s, v){
        var r, g, b, i, f, p, q, t;
        if (arguments.length === 1) {
            s = h.s, v = h.v, h = h.h;
        }
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return (Math.round(r * 255)<<16) + (Math.round(g * 255)<<8) + Math.round(b * 255);
    }

    var initWidth = 30;
    class NodeShape extends VIZ2D.NodeShape{
        constructor(gfx, node, scale){
            super(gfx, node, function(){
                this.scale = scale||1;
                this.angle = 0.5;
            });
            this.setScale(this.scale); //update the actual shape scale

            //create primary circle shape
            this.color = HSVtoInt(this.getDepth()/6, 1, 1);
            this.circle = new VIZ2D.Circle(gfx, 30, this.color);
            this.addShape(this.circle);
            this.text = new VIZ2D.HtmlShape(gfx, '<p style="background-color:orange">' + node.getName() + "</p>", 0x000000);
            this.text.setScale(2);

            //this.onClick(function(){
            //    this.focus();
            //});
			
			
			this.onHover(
                function(enter){
                    if(enter)
                        this.addShape(this.text);
                    else{
                        this.removeShape(this.text);
                    }
            });

        }

        __stateChanged(field, val, oldState){
            if(field=="focused" && val==true){
                this.getGraphics().getCamera().setTarget(this, this, this);

                this.createDescendants(2);      //creates 2 layers of descendants
                this.destroyDescendants(2);     //destroys any descendants above those 2 layers

                this.createAncestors(2);        //creates 2 layers of ancestors
                this.destroyAncestors(2, true); //destroys any ancestors below those 2 layers
            }

        }
        __connectParent(parent){
            if(parent){
                var offset = 0;
                for (var i=0;i<this.getIndex(); i++){
                    offset = offset + parent.getChildren()[i].scale;
                }
                this.angle = 0
                this.angle =((offset + 0.5*this.scale)/parent.scale)
                this.setAngle((this.angle*2+0.5)*Math.PI)
                var w = initWidth * (parent.scale*0.9 - this.scale)
                this.setLoc(new VIZ2D.Vec(parent.getLoc()).add(w*Math.cos(this.angle*2*Math.PI), w*Math.sin(this.angle*2*Math.PI), 0));

                //could have been: (though your sin and cos are swapped...)
                // this.setLoc(new VIZ.Vec(w, 0).setAngle(this.angle*2*Math.PI).add(parent.getLoc()));
                //so:
                // this.setLoc(new VIZ.Vec(w, 0).setAngle((-this.angle*2+0.5)*Math.PI).add(parent.getLoc()));
            }
        }
        __createChildNodeShape(node, parent){
            //Calculate the scale we want the node shape to have:
            var scale = parent.scale*0.9 /parent.getNode().getChildren().length;

            return new (this.__getClass())(this.getGraphics(), node, scale);
        }
    }
    class Froth extends VIZ2D.Visualisation{
        constructor(container, tree, options){
            super(container, tree, options);
            this.renderdepth = 2
            this.mouseloc = null
            this.onMouseScroll(function(amount, event) {
                var camera = this.getCamera();

                var oldScale = camera.getScale();
                var newScale = Math.max(this.camera.getScale()*Math.pow(1.1,amount/100), 1);
                this.camera.setScale(newScale);

                var offset = new VIZ2D.Vec(this.getMouseLoc()).sub(camera.getLoc());
                camera.getLoc().add(new VIZ2D.Vec(offset).mul(newScale/oldScale).sub(offset));

                this.updateScreen();
                this.renderdepth = 1/this.camera.getScale();

            });
            this.onMouseMove(function(loc, event){
                if(this.pressed){
                    if(this.mouseloc){
                        var delta = this.camera.translateScreenToWorldLoc(loc).sub(this.mouseloc);
                        this.camera.setLoc(this.camera.getLoc().add(new VIZ2D.Vec(delta).mul(-1)));;
                    }
                }
                this.mouseloc = this.camera.translateScreenToWorldLoc(loc);
            });
            this.onMousePress(function(down,event){
                if(down){
                    this.pressed = true;
                } else {
                    this.pressed = false;
                    this.updateScreen();
                }
            });

            this.updateScreen();
        }
        __getNodeShapeClass(VIZ){
            return NodeShape;
        }

        //update the current state of the screen
        updateScreen(){
            this.shapes.root[0].destroyDescendants(1);
            this.loadShape(this.shapes.root[0])
        }

        loadShape(shape){
            if(shape.getScale() > this.renderdepth && shape.isVisible()){
                shape.createDescendants(1);
                for(var i=0;i<shape.getChildren().length;i++){
                    this.loadShape(shape.getChildren()[i]);
                }
            }
        }
    }

    //attach some data to be displayed on the webpage
    Froth.description = {
        name: "froth",
        description: "",
        image: ""   //should contain some image path relative to the page
    };

    //register the class
    VisualisationHandler.registerVisualisation(Froth);
})();   //all encased in a function in order to keep variables hidden/local
