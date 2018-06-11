/*
    3d text class
    Author: Tar van Krieken
    Starting Date: 01/06/2018
*/
class HtmlShape3d extends ImageShape3d{
    constructor(gfx, html, preInit){
        super(gfx, null, 0, 0.2, function(){
            this.element = $(
                "<div class=HTMLshape style=display:inline-block;position:absolute;z-index:1000>"+
                    "<span class=HTMLshapeContent style=display:inline-block;color:white>"+
                    "</span>"+
                "</div>"
            ).offset({left:-1000, top:-1000});
            this.visCont = gfx.getCanvas();
            var This = this;
            this.vrOffset = new XYZ(0, 0, 0).onChange(function(){
                This.__markDirty();
            });

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

        var el = this.getElement().children().first().clone();
        $(".HtmlShapeTextureCreator").append(el);
        // el.hide();

        html2canvas(el[0], {
            scale: 6,
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

    //offset to apply to shape in VR
    getVRoffset(){
        return this.vrOffset;
    }

    // __interpolate(delta){
    //     console.log("detect");
    // }
    __setMeshLoc(per){
        this.__updateLoc();
        var prevLoc = this.prevTransform.loc;
        var loc = this.transform.loc;
        this.mesh.position.set(
            prevLoc.x*(1-per) + loc.x*per + this.vrOffset.x,
            prevLoc.y*(1-per) + loc.y*per + this.vrOffset.y,
            prevLoc.z*(1-per) + loc.z*per + this.vrOffset.z
        );
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
    __updateLoc(){
        var loc = this.getGraphics().getCamera().translateWorldToScreenLoc(
            this.getWorldLoc().sub(
                new Vec(this.vrOffset)
                    .mul((this.parentShape?this.parentShape.getWorldScale():1)*this.getScale())
            )
        );

        var o = this.visCont.offset();
        // var c = this.getContainer().offset();
        o.left += loc.getX()-this.element.width()*this.transform.scale/2; //-c.left;
        o.top += loc.getY()-this.element.height()*this.transform.scale/2; //-c.top;
        this.element.offset(o);

        return this;
    }
}
$("html").append("<div class=HtmlShapeTextureCreator style=height:0;overflow:hidden;></div>");
