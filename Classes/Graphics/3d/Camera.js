/*
    3d camera class
    Author: Tar van Krieken
    Starting Date: 16/05/2018
*/
class Camera3d extends AbstractCamera{
    constructor(graphics, threeCamera){
        super(graphics, threeCamera);
        
        this.camera = threeCamera;
        
        // //update camera on pos/rot change
        // var This = this;
        // this.loc.onChange(this.__updateLoc.bind(this));
        // this.rot.onChange(this.__updateLoc.bind(this));
        
        // //update camera pos
        // this.loc.set(0, 0, 0);
    }
    // __updateLoc(){
    //     var angle = -this.getZRot();
    //     var vec = new Vec(this.loc).mul(-this.getScale()).addAngle(angle).add(this.graphics.getWidth()/2, this.graphics.getHeight()/2);
    //     this.stage.rotation = angle;
    //     this.stage.x = vec.getX();
    //     this.stage.y = vec.getY();
    //     // this.stage.x = -this.loc.getX()*this.scale;
    //     // this.stage.y = this.graphics.getHeight()/2-this.loc.getY()*this.scale;
    // }
    // setScale(scale){
    //     this.stage.scale.set(scale);
    //     super.setScale(scale);
    //     this.__updateLoc();
    //     return this;
    // }
    
    
    // translateScreenToWorldLoc(x, y, z){
    //     var vec = new Vec(x, y, z);
    //     var size = new XYZ(this.graphics.getWidth(), this.graphics.getHeight());
        
    //     return vec.sub(size.mul(0.5)).div(this.getScale()).addAngle(this.getZRot()).add(this.getLoc());
    // }
    // translateWorldToScreenLoc(x, y, z){
    //     var vec = new Vec(x, y, z);
    //     var size = new XYZ(this.graphics.getWidth(), this.graphics.getHeight());
        
    //     return vec.sub(this.getLoc()).addAngle(-this.getZRot()).mul(this.getScale()).add(size.mul(0.5));
    // }
}