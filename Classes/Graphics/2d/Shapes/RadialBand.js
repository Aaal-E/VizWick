/*
    A 2d radial-band shape (a closed shape composed of an inner and outer arcs)
    Authors:
        Mehrdad Farsadyar
        Mara Miulescu

    Starting Date: 3/06/2018
*/
class RadialBand2d extends Shape2d{
    constructor(graphics, inRadius, thickness, startAngle, size, color){
        super(graphics, color);
        this.setSize(size);
        this.setInRadius(inRadius);
        this.setStartAngle(startAngle);
        this.setThickness(thickness);
    }


    //the draw method
    __redraw(){
        if (this.thickness != null) {
          //draw the shape
          this.gfx.clear();
          this.gfx.beginFill(this.color);
          // draw the inner arc:
          this.gfx.arc(0, 0, this.inRadius, this.startAngle,
              this.endAngle, false);
          // draw the outer arc along with one of the side edges
          this.gfx.arc(0, 0, this.getOutRadius(), this.endAngle,
              this.startAngle, true); // reverse the order of angles to create one edge
          // draw the other edge:
          this.gfx.lineTo(0 + this.inRadius * Math.cos(this.startAngle), 0 +  this.inRadius * Math.sin(this.startAngle))
          this.gfx.endFill();
        }
    }


    setStartAngle(angle){
        this.startAngle = angle;
        this.endAngle = this.startAngle + this.size;//
        this.__redraw();
        return this;
    }

    //the radius of the radial band; defined as the radius of the inner arc
    setInRadius(radius){
        this.inRadius = radius;
        this.__redraw();
        return this;
    }

    setThickness(thickness){
        this.thickness = thickness;
        this.__redraw();
        return this;
    }

    setSize(size){
        this.size = size;
        this.__redraw();
        return this;
    }


    //the inner radius
    getInRadius(){
        return this.inRadius;
    }

    //the outer radius
    getOutRadius(){
        return this.thickness+this.getInRadius();
    }

    getEndAngle(){
        return this.endAngle;
    }
}
