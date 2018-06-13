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
  const decrease = 1;

  class NodeShape extends VIZ2D.NodeShape {

    constructor(gfx, node){
      super(gfx, node, function(){
        // this.circle = new VIZ2D.Circle(gfx, defaultRadius, new VIZ2D.Color(255, 0, 0).setHue(Math.random()).getInt());
      });
      this.polygon = new VIZ2D.Polygon(gfx, this.points, new VIZ2D.Color(255, 0, 0).setHue(Math.random()).getInt());
      // this.polygon = new VIZ2D.Polygon(gfx, [0, 0, 0, 100, 100, 100, 100, 0], 0xff0000);
      this.addShape(this.polygon);

      this.onClick(function(data){
          this.focus();
      });

      this.label = new VIZ2D.HtmlShape(gfx, node.getName());
      this.addShape(this.label);
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

          this.points = [0, 0];
          for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var scale = Math.pow(decrease, child.getDepth());
            var radiusA = this.radiusA + gap*scale;
            var sector = this.childSector;
            var childSector = sector / child.getChildren().length;
            var angle = this.angle + sector*(i+0.5) - 0.5*this.sector;
            var x = Math.cos(angle)*radiusA - this.getX();
            var y = Math.sin(angle)*radiusA - this.getY();
            this.points.push(x, y);
          }
          // console.log(this.radiusA, parent.radiusA, this.scale);
        } else {
          this.radiusA = defaultRadius;
          this.sector = 2 * Math.PI;
          this.childSector = 2 * Math.PI / this.getNode().getChildren().length;
          this.angle = 0;
          this.points = [0, 0, 0, 100, 100, 100, 100, 0];
          // console.log("detect");
        }
      }
  }

  class Diamond extends VIZ2D.Visualisation {

    constructor(container, tree, options){
        super(container, tree, options);
        this.getShapesNode()[0].createDescendants(5);
    }

    __getNodeShapeClass(){
        return NodeShape;
    }

  }

  Diamond.description = {
      name: "Diamond",
      description: "",
      image: ""
  };

  VisualisationHandler.registerVisualisation(Diamond);

})();
