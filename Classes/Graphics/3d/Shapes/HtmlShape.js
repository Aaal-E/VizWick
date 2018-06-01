/*
    3d text class
    Author: Tar van Krieken
    Starting Date: 01/06/2018
*/
class HtmlShape3d extends TextureShape3d{
    constructor(gfx, html, preInit){
        super(gfx, null, 0, 0.2, function(){
            this.element = $(
                "<div class=HTMLshape style=display:inline-block;position:absolute;z-index:1000>"+
                    "<span class=HTMLshapeContent style=color:white>"+
                    "</span>"+
                "</div>"
            );
            this.visCont = gfx.getCanvas();
            if(preInit) preInit.call(this);
        });

        this.setHtml(html);
        this.setContainer(gfx.getContainer());
        this.setInteractive(false);

        var This = this;
        this.getLoc().onChange(function(){
            This.__markDirty();
        });

        //generate image (mainly for VR)
        this.refresh();
    }

    refresh(){ //generate a image containing the text
        var This = this;

        var el = $("<span></span>").append(this.getElement().children().first().clone())[0];
        $("body").append(el);

        html2canvas(el, {
            scale: 10,
            onrendered: function(canvas){
                var dataUrl = canvas.toDataURL();
                This.ratio = canvas.width/canvas.height;

                This.setSource(dataUrl);
                This.setHeight(This.getHeight());
                el.remove();
            },
        });

        return this;
    }

    setHeight(height){
        this.size.set(this.ratio*height, height, 1);
        return this;
    }
    getHeight(){
        return this.size.getY();
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
        this.element.children().first().html(html);
        return this;
    }
    getHtml(){
        return this.element.children().first().contents();
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
    __setMeshLoc(per){
        super.__setMeshLoc(per);
        this.__updateLoc();
        return this;
    }
    __updateLoc(){
        var loc = this.getGraphics().getCamera().translateWorldToScreenLoc(this.getWorldLoc());

        var o = this.visCont.offset();
        // var c = this.getContainer().offset();
        o.left += loc.getX()-this.element.width()*this.transform.scale/2; //-c.left;
        o.top += loc.getY()-this.element.height()*this.transform.scale/2; //-c.top;
        this.element.offset(o);

        return this;
    }
}
