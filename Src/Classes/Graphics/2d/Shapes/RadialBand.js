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

            //check if shape is a circle
            if (this.size == 2*Math.PI && this.inRadius == 0) {
                // if circle, then hitArea in shape of a circle
                this.gfx.hitArea = new PIXI.Circle(0, 0, this.getOutRadius());
            } else {
                // if not, then radial band-shaped polygon
                var points = this.getPoints();
                this.gfx.hitArea = new PIXI.Polygon(points);
                // this.gfx.beginFill(0x00ff00);
                // this.gfx.drawPolygon(points);
                // this.gfx.endFill();
            }
        }
    }

    //pixi draws clock-wise where as in mathematics it is counter-clockwise; thus
    //swap the start and end angle.  This is like assuming the arc starts from endAngle and
    //goes toward the startangel.
    getPoints() {
        //centerX = ;if center of viusalization is not 0,0 then add this to the X coordinates bellow
        //centerY = ;if center of viusalization is not 0,0 then add this to the Y coordinates bellow
        var startAngle = this.getEndAngle();
        var endAngle = this.startAngle;
        var outRadius = this.getOutRadius();
        var pixelPrecision = 30;
        var coordinatesArr = [];
        var i = 0; //indexing the array

        //the inner starting point
        coordinatesArr[i++] = this.inRadius * Math.cos(startAngle); // x-coordinate
        coordinatesArr[i++] = this.inRadius * Math.sin(startAngle); // y-coordinate

        // the outer starting point
        coordinatesArr[i++] = outRadius * Math.cos(startAngle);
        coordinatesArr[i++] = outRadius * Math.sin(startAngle);

        //points on the outer arc from start to end
        var delta = Math.abs(startAngle - endAngle);
        var numOfPieces = Math.floor(delta * this.getOutRadius() / pixelPrecision);
        delta =  delta  / numOfPieces;
        var workingAngle = startAngle - delta;
        while(workingAngle > endAngle){
            coordinatesArr[i++] = outRadius * Math.cos(workingAngle);
            coordinatesArr[i++] = outRadius * Math.sin(workingAngle);
            workingAngle  -= delta;
        }

        //the outer end angle
        coordinatesArr[i++] = outRadius * Math.cos(endAngle);
        coordinatesArr[i++] = outRadius * Math.sin(endAngle);

        //the inner end-angle
        coordinatesArr[i++] = this.inRadius * Math.cos(endAngle);
        coordinatesArr[i++] = this.inRadius * Math.sin(endAngle);

        //setting the points in the inner arc from end to start
        delta = Math.abs(startAngle - endAngle);
        numOfPieces = Math.floor(delta * this.inRadius / pixelPrecision);
        delta =  delta  / numOfPieces;
        workingAngle = endAngle + delta;
        while(workingAngle < startAngle){
            coordinatesArr[i++] = this.inRadius * Math.cos(workingAngle);
            coordinatesArr[i++] = this.inRadius * Math.sin(workingAngle);
            workingAngle += delta;
        }

        coordinatesArr.length = i;
        return coordinatesArr;
    }

    //sets the starting angle
    setStartAngle(angle){
        this.startAngle = angle;
        this.masterRedraw();
        return this;
    }

    //reruns the start angle
    getStartAngle(){
        return this.startAngle;
    }

    //set the inner radius
    setInRadius(inRadius){
        this.inRadius = inRadius;
        this.masterRedraw();
        return this;
    }

    //returns the inner radius
    getInRadius(){
        return this.inRadius;
    }

    // set the thickness of the radial band
    setThickness(thickness){
        this.thickness = thickness;
        this.masterRedraw();
        return this;
    }

    //returns the thickness of the band
    getThickness(){
        return this.thickness;
    }

    // set size in radian, aka "delta theta"
    setSize(size){
        this.size = size;
        this.masterRedraw();
        return this;
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

    //resets the properties of the radial band
    resetProperties(){
        this.setInRadius(null);
        this.setSize(null);
        this.setStartAngle(null);
        this.setThickness(null);
        // return this
        return this;
    }
}
