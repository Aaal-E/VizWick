/*
    A simple 2d rectangle shape
    Author: Tar van Krieken
    Starting Date: 12/05/2018
*/
class HtmlShape2d extends Shape2d{
    constructor(graphics, html, preInit){
        super(graphics, null, preInit);
        this.element = $(
            "<div style=display:inline-block;position:absolute;color:white;z-index:1000>"+
            "</div>"
        );
        this.setHtml(html);
        this.setContainer($("body"));
        this.visCont = graphics.getCanvas();
        
        var This = this;
        this.getLoc().onChange(function(){
            This.__updateLoc();
        });
    }
    
    //container methods
    setContainer(container){
        this.container = $(container);
        return this;
    }
    getContainer(){
        return this.container;
    }
    
    //html methods
    setHtml(html){
        this.element.html(html);
        return this;
    }
    getHtml(){
        return this.element.content();
    }
    getElement(){
        return this.element;
    }
    
    //add/remove element from page
    __addToPage(){
        this.getContainer().append(this.element);
        this.__updateLoc();
        
        var shapes = this.graphics.getShapesHtml();
        if(shapes.indexOf(this)==-1) shapes.push(this);
        
        return this;
    }
    __removeFromPage(){
        this.element.remove();
        
        var shapes = this.graphics.getShapesHtml();
        var index = shapes.indexOf(this);
        if(index!=-1) shapes.splice(index, 1);
        
        return this;
    }
    add(){
        super.add();
        this.__addToPage();
        return this;
    }
    remove(){
        this.__removeFromPage();
        return super.remove();
    }
    __setParentShape(shape){
        if(shape)
            this.__addToPage();
        else
            this.__removeFromPage();
        super.__setParentShape(shape);
    }
    
    //scale handeling
    setScale(scale){
        super.setScale(scale);
        this.element.css("transform", "scale("+(Math.floor(scale*100)/100)+")");
        return this;
    }
    
    //method to keep the html element in the correct location
    __updateLoc(){
        var loc = this.getGraphics().getCamera().translateWorldToScreenLoc(this.getWorldLoc());
        
        var o = this.visCont.offset();
        // var c = this.getContainer().offset();
        o.left += loc.getX()-this.element.width()*this.transform.scale/2; //-c.left;
        o.top += loc.getY()-this.element.height()*this.transform.scale/2; //-c.top;
        this.element.offset(o);
        
        return this;
    }
    
    //the radius to be used for the AABB
    __getRadius(){  
        return 0;
    }
}