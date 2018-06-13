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
  const decrease = 0.9;

  class NodeShape extends VIZ2D.NodeShape {

    constructor(gfx, node){
      super(gfx, node, function(){
        this.circle = new VIZ2D.Circle(gfx, defaultRadius, new VIZ2D.Color(255, 0, 0).setHue(Math.random()).getInt());
      });
      this.addShape(this.circle);

      this.onClick(function(data){
          this.focus();
      });
    }

    __connectParent(parent){
        if(parent){
          this.scale = Math.pow(decrease, this.getNode().getDepth());
          this.radiusA = parent.radiusA + gap*this.scale;
          this.angle = 2 * parent.angle;
          this.setLoc(Math.cos(this.angle)*this.radiusA, Math.sin(this.angle)*this.radiusA);
          this.circle.setRadius(gap*this.scale);
          // console.log(this.radiusA, parent.radiusA, this.scale);
        } else {
          this.radiusA = defaultRadius;
          this.angle = 2 * Math.PI / this.getNode().getChildren().length;
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
