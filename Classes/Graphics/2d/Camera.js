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
        this.rot.onChange(function(){
            This.stage.rotation = -this.getZ();
        });
        
        //update camera pos
        this.loc.set(0, 0, 0);
    }
    __updateLoc(){
        this.stage.x = this.graphics.getWidth()/2-this.loc.getX()*this.scale;
        this.stage.y = this.graphics.getHeight()/2-this.loc.getY()*this.scale;
    }
    setScale(scale){
        this.stage.scale.set(scale);
        super.setScale(scale);
        this.__updateLoc();
        return this;
    }
}