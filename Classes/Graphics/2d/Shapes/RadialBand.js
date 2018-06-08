/*
    A 2d radial-band shape (a closed shape composed of an inner and outer arcs)
    Authors:
        Mehrdad Farsadyar
        Mara Miulescu

    Starting Date: 3/06/2018
*/

class RadialBand2d extends Shape2d{
    //
    constructor(graphics, inRadius, thickness, startAngle, size, color){
        super(graphics, color);
        this.setSize(size);
        this.setInRadius(inRadius);
        this.setStartAngle(startAngle);
        this.setThickness(thickness);
        }

    //checks if all properties are set and only then calls the redraw method
    masterRedraw(){
        if(this.inRadius != null && this.thickness != null && this.startAngle != null
            && this.size != null && this.color != null){
            this.__redraw();
        }
        return this;
    }

    //the draw method
    __redraw(){
        if (this.thickness != null) {
          //draw the shape
          this.gfx.clear();
          this.gfx.beginFill(this.color);
          // draw the inner arc:
          this.gfx.arc(0, 0, this.inRadius, this.startAngle,
              this.getEndAngle(), false);
          // draw the outer arc along with one of the side edges
          this.gfx.arc(0, 0, this.getOutRadius(), this.getEndAngle(),
              this.startAngle, true); // reverse the order of angles to create one edge
          // draw the other edge:
          this.gfx.lineTo(0 + this.inRadius * Math.cos(this.startAngle), 0 +  this.inRadius * Math.sin(this.startAngle))
          this.gfx.endFill();
        }
    }

    //sets the starting angle
    setStartAngle(angle){
        this.startAngle = angle;
        this.masterRedraw();
    }

    //reruns the start angle
    getStartAngle(){
        return this.startAngle;
    }

    //set the inner radius
    setInRadius(inRadius){
        this.inRadius = inRadius;
        this.masterRedraw();
    }

    //returns the inner radius
    getInRadius(){
        return this.inRadius;
    }

    // set the thickness of the radial band
    setThickness(thickness){
        this.thickness = thickness;
        this.masterRedraw();
    }

    //returns the thickness of the band
    getThickness(){
        return this.thickness;
    }

    // set size in radian, aka "delta theta"
    setSize(size){
        this.size = size;
        this.masterRedraw();
    }

    //returns size in radian
    getSize(){
        return this.size;
    }

    //returns the outer radius
    getOutRadius(){
        return this.thickness+this.inRadius;
    }

    //returns the end angle
    getEndAngle(){
        return this.startAngle + this.size;
    }
}
