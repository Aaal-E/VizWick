/*
    A 2d radial-band shape (a closed shape composed of an inner and outer arcs)
    Authors:
        Mehrdad Farsadyar
        Mara Miulescu

    Starting Date: 3/06/2018
*/
class radialBand2d extends Shape2d{
    constructor(graphics, inRadius, startAngle, thickness, size,  color, preInit){
        super(graphics, color, preInit);
        this.setSize(size);
        this.setInRadius(inRadius);
        this.setStartAngle(startAngle);
        this.setThickness(thickness);
    }


    //the draw method
    __redraw(){
        //draw the shape
        this.gfx.clear();
        this.gfx.beginFill(this.color);
        // draw the inner arc:
        this.gfx.arc(this.centerX, this.centerY, this.inRadius, this.startAngle,
            this.endAngle, false);
        // draw the outer arc along with one of the side edges
        this.gfx.arc(this.centerX, this.centerY, this.getOutRadius(), this.endAngle,
            this.startAngle, true); // reverse the order of angles to create one edge
        // draw the other edge:
        this.gfx.lineTo(this.centerX + this.radius * Math.cos(this.startAngle), this.centerX +  this.radius * Math.sin(this.endAngle))
        this.gfx.endFill();
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
        this.setEndAngle(this.startAngle+this.size);
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
        return this.startAngle + this.size;
    }
}
