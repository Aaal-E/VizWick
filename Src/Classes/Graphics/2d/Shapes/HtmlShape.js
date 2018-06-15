/*
    A simple 2d rectangle shape
    Author: Tar van Krieken
    Starting Date: 12/05/2018
*/
class HtmlShape2d extends Shape2d{
    constructor(graphics, html, preInit){
        super(graphics, null, preInit);
        this.element = $(
            "<div class='HTMLshape noselect' style=display:inline-block;position:absolute;color:white;z-index:1000>"+
            "</div>"
        );
        this.setHtml(html);
        this.setContainer(graphics.getContainer());
        this.setInteractive(false);
        this.visCont = graphics.getCanvas();

        var This = this;
        this.getLoc().onChange(function(){
            This.__updateLoc();
        });
    }

    //interactive means that it catches mouse events
    setInteractive(interactive){
        this.interactive = interactive;
        if(interactive)
            this.element.addClass("interactive").css("pointer-events", "all");
        else
            this.element.removeClass("interactive").css("pointer-events", "none");
        return this;
    }
    getInteractive(){
        return this.interactive;
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
        return this.element.contents();
    }
    getElement(){
        return this.element;
    }

    //add/remove element from page
    __addToPage(){
        this.getContainer().append(this.element);

        var shapes = this.graphics.getShapesHtml();
        if(shapes.indexOf(this)==-1) shapes.push(this);

        this.__updateLoc();
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
        var ret = super.__setParentShape(shape);
        if(shape)
            this.__addToPage();
        else
            this.__removeFromPage();
        return ret;
    }
    __triggerRenderChange(){
        super.__triggerRenderChange();
        if(this.isRendered)
            this.__addToPage();
        else
            this.__removeFromPage();
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
        var dx = this.element.width()/2;
        var dy = this.element.height()/2;
        return Math.sqrt(dx*dx + dy*dy);
    }
}
