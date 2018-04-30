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
        this.loc.onChange(function(){
            This.stage.x = This.graphics.getWidth()/2-this.getX();
            This.stage.y = This.graphics.getHeight()/2-this.getY();
        });
        this.rot.onChange(function(){
            This.stage.rotation = -this.getZ();
        });
        
        //update camera pos
        this.loc.set(0, 0, 0);
    }
}