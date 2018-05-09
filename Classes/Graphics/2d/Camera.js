/*
    2d camera class
    Author: Tar van Krieken
    Starting Date: 28/04/2018
*/
class Camera2d extends AbstractCamera{
    constructor(graphics){
        super(graphics);
        
        this.stage = graphics.__getStage();
        
        //update camera on pos/rot change
        var This = this;
        this.loc.onChange(this.__updateLoc.bind(this));
        this.rot.onChange(this.__updateLoc.bind(this));
        
        //update camera pos
        this.loc.set(0, 0, 0);
        
        this.stretchScale = 1;  //used when the window is resized in order to maintain proper scaling
    }
    __setStretchScale(stretchScale){
        this.stretchScale = stretchScale;
        this.setScale(this.getScale()); //update the scale
        return this;
    }
    __updateLoc(){
        var angle = -this.getZRot();
        var vec = new Vec(this.loc).mul(-this.scale*this.stretchScale).addAngle(angle).add(this.graphics.getWidth()/2, this.graphics.getHeight()/2);
        this.stage.rotation = angle;
        this.stage.x = vec.getX();
        this.stage.y = vec.getY();
        // this.stage.x = -this.loc.getX()*this.scale;
        // this.stage.y = this.graphics.getHeight()/2-this.loc.getY()*this.scale;
    }
    setScale(scale){
        this.stage.scale.set(scale*this.stretchScale);
        super.setScale(scale);
        this.__updateLoc();
        return this;
    }
}