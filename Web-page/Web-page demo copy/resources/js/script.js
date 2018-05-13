var slideIndex = 1;

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("dot");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
}

$(document).ready(function () {
    var small={width: "50%",  height: "50%"};
    var large={width: "100%", height: "100%"};
    var count=1;

    $("#button").on('click', function(){
        $(imgtab).animate((count==1)?large:small);
        count = 1-count;
    });
    
    showSlides(slideIndex);
    
    
    $(".nav").children("a").click(function () {
        $(".active").removeClass("active");
        $(this).addClass("active");
        $(".pactive").fadeOut(200, function () {
            $(this).removeClass("pactive");
        });
        $("#p" + this.id).fadeIn(200, function () {
            $(this).addClass("pactive");
            
            //init visualisation
            if($(this).is("#p2"))
                setupVisualisations();
        });
    });
    
    //setup resize
    $(".resizeDiv").resizeContainer();
    $(".column1").resizeContainer({vertical:true});
    $(".column2").resizeContainer({vertical:true});
});


//visualisation
var createTree = function(name, height){
    var children = [];
    if(height>0){
        var childCount = 3-Math.floor(Math.pow(Math.random()*7, 1/1.8));
        for(var i=0; i<childCount; i++){
            children.push(createTree(name+"-"+i, height-1));
        }
    }
    return {
        name: name,
        children: children
    };
}
var tree = new Tree(createTree("Stuff", 11));

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

//the visualisation classes
class VisualisationPhysics extends Visualisation2d{
    constructor(container, tree, options){
        super(container, tree, options);
    }
    __getNodeShapeClass(VIZ){
        var camera = this.getCamera();
        var initWidth = 400;
        var gfx = this;
        return class NodeShape extends VIZ.NodeShape{
            constructor(gfx, node, size){
                super(gfx, node, function(){
                    this.size = size||30;
                });
                
                //create primary circle shape
                this.color = HSVtoInt(this.getDepth()/12, 1, 1);
                this.circle = new VIZ.Circle(gfx, this.size, this.color);
                this.addShape(this.circle);
                this.speedFactor = 2;
                
                this.__registerUpdateListener();
                
                //update aabb
                this.storeInSpatialTree = true;
                this.__updateAABB();
                
                //dragging
                this.onMouseEvent(function(type){
                    if(type=="down"){
                        gfx.dragShape(this);
                    }
                });
            }
            __onDrag(loc){
                this.getVelo().setLength(0);
                this.setLoc(loc);
            }
            __onUpdate(time){
                if(!this.state.dragged){
                    var force = new VIZ.Vec();
                
                    //compute force from parent
                    var parent = this.getParent();
                    if(parent){
                        var connectedNodeCount = parent.__getChildNodes().length+(parent.__getParentNode()!=null?1:0);
                        var angle = Math.PI*2*(this.getIndex()+1)/connectedNodeCount+(parent.getAngle());
                        var radius = parent.__getRadius()+this.__getRadius()*2;
                        var target = new VIZ.Vec(radius, 0).setAngle(angle).add(parent.getLoc());
                        var delta = this.getVecTo(target);
                        force.add(delta.mul(0.9));
                    }
                    
                    
                    // compute force from collisions
                    var closeCircles = this.search(this.size);
                    for(var i=0; i<closeCircles.length; i++){
                        var cc = closeCircles[i];
                        var delta = this.getVecTo(cc);
                        var radius = cc.__getRadius()+this.__getRadius();
                        var strength = radius-delta.getLength();
                        if(strength>0){
                            force.sub(delta.setLength(strength*20).div(Math.pow(1.5, cc.getDepth?cc.getDepth():1)));
                        }
                    }
                    
                    if(this.__getParentNode()!=null){ //don't do for root
                        this.getVelo().mul(0.7).add(force);
                        
                        //set the correct angle
                        var p = this.getParent();
                        this.setAngle(this.getVecTo(p).getAngle());
                    }
                }
                
                // if(this.__getParentNode()!=null){ //don't do for root
                //     var p = this.getParent();
                //     this.setAngle(this.getVecTo(p).getAngle());
                // }
                
                return super.__onUpdate(time);
            }
            
            
            __stateChanged(field, val, oldState){
                if(field=="dragged"){
                    this.circle.setColor(this.state.dragged?0xff0000:this.color);
                }
            }
            
            __setupConnection(first){
                if(first){
                    // this.setLoc((Math.random()-0.5)*gfx.getWidth(), (Math.random()-0.5)*gfx.getHeight());
                    
                    this.setLoc(new VIZ.Vec(0, this.getDepth()*500).setAngle(Math.random()*Math.PI*2));
                }
            }
            
            __createNodeShape(node){
                //Calculate the scale we want the node shape to have:
                var size = 1;  //just as a placeholder
                
                //First retrieve the scale of the parent
                var ID = this.graphics.getUID();
                var parent = node.getParent();  //this will be a node
                if(parent){                     //check if it isn't the root
                    var parentSize = 1;        //default scale
                    
                    var parentShape = parent.getShape(ID); //get the nodeShape attached to parent
                    if(parentShape)             //if such a shape exists
                        parentSize = parentShape.size; //copy its scale
                    
                    //Sets the scale n times as small as its parent, with n being the childcount
                    size = parentSize/Math.pow(parent.getChildren().length, 1/2.4);    
                }
                
                //Create a new instance of your NodeShape and pass the scale
                return new (this.__getClass())(this.getGraphics(), node, size);
            }
        }
    }
}

class VisualisationAnimated extends Visualisation2d{
    constructor(container, tree, options){
        super(container, tree, options);
        this.mouseSelected = null;
    }
    __onUpdate(deltaTime){
        super.__onUpdate(deltaTime);
        var range = 15;
        
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
        var initWidth = 200;
        return class NodeShape extends VIZ.NodeShape{
            constructor(gfx, node, scale){
                super(gfx, node, function(){
                    this.scale = scale||1;
                    this.targetLoc = new VIZ.XYZ(0); //default value for the root
                });
                this.setScale(this.scale);
                
                //create primary circle shape
                this.circle = new VIZ.Circle(gfx, 20, 0xff0000);
                this.addShape(this.circle);
                
                this.setAngle(Math.random()-0.5);
                
                //mouse events
                this.onClick(function(){
                    this.focus();
                });
                this.onMouseEvent(function(type, data){
                    var button = data.data.button;
                    if(button==1){
                        this.createParent();
                        var p = this.getParent();
                        if(p) p.focus();
                        return true;
                    }
                });
                
                //hover event
                // this.text = new VIZ.HtmlShape(gfx, "Test");
                // this.text.setScale(2);
                // this.onHover(function(over){
                //     if(over)
                //         this.addShape(this.text);
                // });
                
                
                //update aabb
                this.storeInSpatialTree = true;
                this.__updateAABB();
            }
            __stateChanged(field, val, oldState){
                if(field=="focused" && val==true){
                    camera.setTarget(this.targetLoc, this, this);
                
                    this.createDescendants(4);      //creates 2 layers of descendants
                    this.destroyDescendants(4);     //destroys any descendants above those 2 layers
                    
                    this.createAncestors(2);        //creates 2 layers of ancestors
                    this.destroyAncestors(2, true); //destroys any ancestors below those 2 layers
                }
                
                if(this.circle)
                    this.circle.setColor(this.state.expanded?0x0000ff:0xff0000);
            }
            
            __setupConnection(parent, child, first){
                if(parent){
                    this.getLoc().set(parent.getLoc()).sub(0, 0, 1e-9); //initialy copy parent loc
                }else if(child){
                    this.getLoc().set(child.getLoc()).sub(0, 0, 1e-9); //initialy copy parent loc
                }
                if(parent && first){
                    var w = (-parent.scale/2 + (this.getIndex()+0.5)*this.scale)*initWidth;
                    this.targetLoc = new VIZ.Vec(parent.targetLoc).add(w, -60*parent.scale, this.getZ());
                }
                if(parent||child){
                    var c = 2;
                    var complete = function(){
                        if(--c==0)
                            this.__deregisterUpdateListener();
                    }
                    this.setTargetLoc(this.targetLoc, 0.6, 10, complete)
                        .setTargetScale(this.scale, 0.6, 7, complete)
                        .__registerUpdateListener();
                }
            }
            remove(){
                var connectedShape = this.getConnectedNodeShape();
                var target;
                var targetScale = this.getScale();
                if(connectedShape){
                    target = connectedShape.getLoc();
                    targetScale = function(){
                        return connectedShape.getScale()
                    };
                    this.setZ(connectedShape.getZ()-1);
                }else{
                    target = new VIZ.Vec(0, 500*camera.getScale()).addAngle(Math.random()-0.5).add(camera.getLoc());
                }
                
                var c = 2;
                var complete = function(){
                    if(--c==0)
                        this.__deregisterUpdateListener().__delete();
                }
                this.setTargetLoc(target, 0, 12, complete)
                    .setTargetScale(targetScale, 0, 8, complete)
                    .__registerUpdateListener();
                    
                super.remove(true);
            }
            
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
        }
    }
}

var initWidth = 60;
class NodeShapeAngle extends VIZ2D.NodeShape{
    constructor(gfx, node, scale){
        super(gfx, node, function(){
            this.scale = scale||1;
            this.angle = 0.5;
        });
        this.setScale(this.scale);  //update the actual shape scale
        
		
        //create primary circle shape
        this.circle = new VIZ2D.Circle(gfx, 20, 0xff0000);
        this.addShape(this.circle);
		this.label = new VIZ2D.Circle(gfx, 8, 0x70ff00ff);
        this.label.setLoc(12, 12,0);
		
		this.onHover(
			function(enter){
				if(enter)
				    this.addShape(this.label);
				else
				    this.removeShape(this.label);
			}
		);
		
        //create return button cicle shape
        this.ret = new VIZ2D.Circle(gfx, 8, 0x00ff00);
        this.ret.setLoc(-12, 0);
        this.addShape(this.ret);
        var This = this;
        this.ret.onClick(function(){ //select parent when this is clicked
            This.createParent();
            var p = This.getParent();
            if(p) p.focus();
            return true;
        });
        
    //    this.onUpdate(function(){
    //        this.getLoc().add((Math.random()-0.5)*this.scale, (Math.random()-0.5)*this.scale);
    //    });
        this.onClick(function(){
            this.focus();
        });
        
        //update expanded (if there are no children to start with)
        this.__stateChanged("expanded");
    }
    
    __stateChanged(field, val, oldState){
        if(field=="focused" && val==true){
            this.getGraphics().getCamera().setTarget(this, this, this);
            
            this.createDescendants(4);      //creates 2 layers of descendants
            this.destroyDescendants(4);     //destroys any descendants above those 2 layers
            
            this.createAncestors(2);        //creates 2 layers of ancestors
            this.destroyAncestors(2, true); //destroys any ancestors below those 2 layers
        }
        
        if(field=="expanded")
            this.circle.setColor(this.state.expanded?0x0000ff:0xff0000)
    }
    __setupConnection(parent, children, first){
        if(parent && first){
			var offset = 0;
			for (var i=0;i<this.getIndex(); i++){
				offset = offset + parent.getChildren()[i].scale;
			}
			this.angle = 0
			this.angle = parent.angle - (0.3) + 0.6*((offset + 0.5*this.scale)/parent.scale)
			this.setAngle((-this.angle*2+1)*Math.PI)
			var w = initWidth * parent.scale
            this.setLoc(new VIZ2D.Vec(parent.getLoc()).add(w*Math.sin(this.angle*2*Math.PI), w*Math.cos(this.angle*2*Math.PI), 0));
            
            //could have been: (though your sin and cos are swapped...)
            // this.setLoc(new VIZ.Vec(w, 0).setAngle(this.angle*2*Math.PI).add(parent.getLoc()));
            //so:
            // this.setLoc(new VIZ.Vec(w, 0).setAngle((-this.angle*2+0.5)*Math.PI).add(parent.getLoc()));
        }
    }
    
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
                
            scale = parentScale * node.getSubtreeNodeCount()/node.getParent().getSubtreeNodeCount();
        }
        
        return new (this.__getClass())(this.getGraphics(), node, scale);
    }
}
class VisualisationAngle extends Visualisation2d{
    constructor(container, tree, options){
        super(container, tree, options);
    }
    __getNodeShapeClass(VIZ){
        return NodeShapeAngle;
    }
}

function setupVisualisations(){
    if(!window.isSetUp){
        var optionsPhysics = new Options();
        var visualisationPhysics = new VisualisationPhysics($(".resizeDiv #top_left .visContent"), tree, optionsPhysics);
        visualisationPhysics.getCamera().setScale(0.5);
        visualisationPhysics.getShapes()[0].createDescendants(10);
        
        var optionsAnimated = new Options();
        var visualisationAnimated = new VisualisationAnimated($(".resizeDiv #down_left .visContent"), tree, optionsAnimated);
        
        
        var optionsAngle = new Options();
        var visualisationAngle = new VisualisationAngle($(".resizeDiv #down_right .visContent"), tree, optionsAngle);
        
        
        window.isSetUp = true;
    }
}