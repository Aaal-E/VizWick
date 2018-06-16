/*
  Diamond Treemap
    Authors:
      Adrian Vramulet
      Alina Vorobiova
      Denis Shehu

    Starting date: 13/06/2018
*/

(function(){

  const defaultRadius = 100;
  const gap = 100;
  const decrease = 0.7;
  var colors = [0x1717D8, 0xFF0000, 0x62A200, 0xFED28A, 0x892E32, 0x08B09F, 0xD600FF];

  class NodeShape extends VIZ2D.NodeShape {

    constructor(gfx, node){
      super(gfx, node, function(){
        // this.polygon = new VIZ2D.Circle(gfx, defaultRadius, new VIZ2D.Color(255, 0, 0).setHue(Math.random()).getInt());
      });
      this.polygon = new VIZ2D.Polygon(gfx, this.points, colors[(this.getDepth()-1)%colors.length]);
      // this.polygon = new VIZ2D.Polygon(gfx, [0, 0, 0, 100, 100, 100, 100, 0], 0xff0000);
      this.addShape(this.polygon);

      this.onClick(function(data){
        this.focus();
      });

      this.label = new VIZ2D.HtmlShape(gfx, node.getName());

      this.onHover(function(over){
        // console.log("A");
        if (over) {
          this.highlight();
        } else {
          this.dehighlight();
        }
      })
    }

    __stateChanged(field, val, oldState){
      if (field == "highlighted") {
        if (val) {
          this.addShape(this.label);
        } else {
          this.removeShape(this.label);
        }
      }

      if (field == "focused") {
        if (val) {
          var camera = this.getVisualisation().getCamera();
          camera.setTargetLoc(this);
          camera.setTargetRot(0, 0, this.angle + Math.PI/2);
          camera.setTargetScale(2/this.scale);
          this.showFamily(Infinity, this.getVisualisation().layers);

          if (!this.getParent()) {
            var children = this.getNode().getChildren();
            if (children.length == 2) {
              camera.setTargetRot(0, 0, this.angle + Math.PI / 6);
            } else if (children.length == 1) {
              camera.setTargetRot(0, 0, this.angle + 11 * Math.PI / 6);
            }
          }
        }
      }
    }

    __connectParent(parent){
        if(parent){
          this.scale = Math.pow(decrease, this.getNode().getDepth());
          this.radiusA = parent.radiusA + gap*this.scale;
          this.sector = parent.childSector;
          var children = this.getNode().getChildren();
          this.childSector = this.sector / children.length;
          this.angle = parent.angle + this.sector*(this.getIndex()+0.5) - 0.5*parent.sector;
          this.setLoc(Math.cos(this.angle)*this.radiusA, Math.sin(this.angle)*this.radiusA);
          // this.circle.setRadius(gap*this.scale);

          var scale = Math.pow(decrease, this.getDepth() + 1);
          var radiusA = this.radiusA + gap*scale;

          var lower = this.angle - this.sector/2;
          var upper = this.angle + this.sector/2;
          var xUpper = Math.cos(upper) * radiusA - this.getX();
          var yUpper = Math.sin(upper) * radiusA - this.getY();
          var xLower = Math.cos(lower) * radiusA - this.getX();
          var yLower = Math.sin(lower) * radiusA - this.getY();

          this.points = [0, 0, xLower, yLower];
          for (var i = 0; i < children.length; i++) {
            // var child = children[i];
            var sector = this.childSector;
            // var childSector = sector / child.getChildren().length;
            var angle = this.angle + sector*(i+0.5) - 0.5*this.sector;
            var x = Math.cos(angle)*radiusA - this.getX();
            var y = Math.sin(angle)*radiusA - this.getY();
            this.points.push(x, y);
          }
          this.points.push(xUpper, yUpper);
          // console.log(this.radiusA, parent.radiusA, this.scale);
        } else {
          var children = this.getNode().getChildren();
          this.scale = 1;
          this.radiusA = defaultRadius;
          this.sector = 2 * Math.PI;
          this.childSector = 2 * Math.PI / Math.max(3, children.length);
          if (children.length > 2) {
            this.angle = 0;
          } else if (children.length == 2) {
              this.angle = 11 * Math.PI / 6;
              // this.angle = Math.PI;
          } else {
              this.angle = Math.PI / 6;
              // this.angle = Math.PI;
          }

          this.points = [];
          for (var i = 0; i < Math.max(3, children.length); i++) {
            // var child = children[i];
            var scale = Math.pow(decrease, this.getDepth() + 1);
            var radiusA = this.radiusA + gap*scale;
            var sector = this.childSector;
            // var childSector = sector / child.getChildren().length;
            var angle = this.angle + sector*(i+0.5) - 0.5*this.sector;
            var x = Math.cos(angle)*radiusA - this.getX();
            var y = Math.sin(angle)*radiusA - this.getY();
            this.points.push(x, y);
            // console.log(x, y);
          }
          // console.log("detect");
        }
      }
  }

  class Diamond extends VIZ2D.Visualisation {

    constructor(container, tree, options){
        super(container, tree, options);
        // this.maxNodeCount = 5000;
        // this.getShapesNode()[0].createDescendants(6);
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

      options.add(new Options.Button("whole").setIcon("dot-circle").setDescription("View the whole visualization").onClick(function(){
        This.getTree().getRoot().getShape(This.getUID()).focus();
      }));

      options.add(new Options.Number("Maximum node count", 1, 50, 10000).setDescription("The number of nodes showing on the screen").onChange(function(val){
        This.maxNodeCount = val;
        refocus();
      }).setValue(1000));

      options.add(new Options.Number("Number of layers").setDescription("The number of layers shown").onChange(function(val){
        This.layers = val;
        refocus();
      }).setValue(5));

      // options.add(new Options.);
    }

  }

  Diamond.description = {
      name: "Diamond",
      description: "",
      image: ""
  };

  VisualisationHandler.registerVisualisation(Diamond);

})();
