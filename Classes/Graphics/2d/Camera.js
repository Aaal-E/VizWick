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
        this.loc.listen(function(){
            This.stage.x = This.graphics.width()/2-this.x();
            This.stage.y = This.graphics.height()/2-this.y();
        });
        this.rot.listen(function(){
            This.stage.rotation = -this.z();
        });
        
        //update camera pos
        this.loc.set(0, 0, 0);
    }
}