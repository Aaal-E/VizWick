/*
    2d graphics class
    Author: Tar van Krieken
    Starting Date: 28/04/2018
*/
class Graphics2d extends AbstractGraphics{
    constructor(width, height, container){
        super(width, height, container);
        
        //create the graphics environment
        this.app = new PIXI.Application(this.getWidth(), this.getHeight(), {backgroundColor:this.background, antialias:true});
        
        //add graphics to the screen
        this.container.append(this.app.view);
        
        //register update listener
        var This = this;
        this.app.ticker.add(function(delta){
            This.__triggerUpdate(1/60/delta);
        });
        
        //connect a camera
        this.camera = new Camera2d(this);
    }
    __getStage(){
        return this.app.stage;
    }
    __getRenderer(){
        return this.app.renderer;
    }
}