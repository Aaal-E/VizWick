// Author: Denis Shehu
// Student number: 1232758

$(function(){

  //Resizing of the visualization areas
  $(".layout").resizeContainer({vertical:true});
  $(".top-layout-part, .bottom-layout-part").resizeContainer({vertical:false});
  //skip transition
  var quadrants = $(".top-layout-part, .bottom-layout-part").find(".quadrant");
  quadrants.css("transition","none");
  setTimeout(function(){
    quadrants.css("transition","");
  });

  //Collapsing and appearing the information section
  $(".collapse").click(function(){
    $(".visualization-page").attr("id", "information-collapse");
    $(".left-section").animate({width:10}, 500);
    $(".right-section").animate({width:$(window).width()-25}, {duration:500, complete:function(){
      $(this).width("calc(100% - 25px)");
    }});
  });
  $(".appear").click(function(){
    $(".visualization-page").attr("id", "information-appear");
    $(".left-section").animate({width:300}, 500);
    $(".right-section").animate({width:$(window).width()-315}, {duration:500, complete:function(){
      $(this).width("calc(100% - 315px)");
    }});
  });

  //Going from two to four visualization areas and vice versa
  $(".two-button").click(function(){
    $("body").attr("id", "two");
  });
  $(".four-button").click(function(){
    $("body").attr("id", "four");
  });

  //Collapsing and appearing of the option panes
  $(".notch").click(function(){
    var optionPane = $(this).closest(".option-pane");
    var innerOptionPane = optionPane.find(".inner-option-pane");
    if(optionPane.is("#notch")){
      optionPane.animate({height:Math.floor(innerOptionPane.outerHeight(true))-1},
        {duration:500, complete:function(){
        $(this).height("auto");
      }});
      optionPane.attr("id", "options");
    }else{
      optionPane.animate({height:$(this).outerHeight(true)}, 500);
      optionPane.attr("id", "notch");
    }
  });

  //fullscreen buttons
  $(".full-screen-button").click(function(){
    var body = $("body");
    if(body.is(".fullscreen")){
      body.attr("class", body.attr("class").replace(/fullscreen.*/g, ""));
    }else{
      body.addClass("fullscreen")
          .addClass("fullscreen-"+$(this).closest(".quadrant").attr("class").split(" ")[0]);
    }
  });

  //reset grid code
  $(".reset-button").click(function(){
    $(".top-layout-part, .bottom-layout-part").height("50%");
    $(".top-left, .top-right, .bottom-left, .bottom-right").width("50%");
    //set the associated data
    $(".layout, .top-layout-part, .bottom-layout-part").each(function(){
      this.sizes = [0.5, 0.5];
    });
  });

  //Drag and drop
  {
    var dragging = null;
    $(".visualizations").children().each(function(){
      $(this).mousedown(function(event){
        event.preventDefault();
        var This = $(this);

        var offset = This.offset();
        var elementCopy = This.clone().css({position:"absolute", zIndex:2000}).offset(offset);
        $("body").append(elementCopy);

        dragging = {
          element: elementCopy,
          original: This,
          baseOffset: {
            left: offset.left-event.clientX,
            top: offset.top-event.clientY,
          }
        };

        //hide the default visualization text
        This.css("opacity", 0);

        //indicate that we are now selecting a visualization
        $("body").addClass("dragging");
        $(".quadrant").each(function(){ //make sure teh dropzone sizes are correct
          $(this).find(".drop-indicator").height("calc(100% - "+$(this).find(".option-pane").height()+"px)")
        });
      });
    });
    $(window).mousemove(function(event){
      if(dragging){
        var offset = {
          left: event.clientX+dragging.baseOffset.left,
          top: event.clientY+dragging.baseOffset.top
        };
        dragging.element.offset(offset);
        if(dragging.overArea) dragging.overArea.removeClass("dropHover");
        dragging.overArea = null;

        //go trhough possible areas that we could be hovering over
        var visualisationAreas = $(".visualization-area");
        var size = {width:dragging.element.width(), height:dragging.element.height()};
        for(var i=0; i<visualisationAreas.length; i++){
          var visualisationArea = $(visualisationAreas[i]);
          var vPos = visualisationArea.offset();
          var vSize = {width:visualisationArea.width(), height:visualisationArea.height()};

          //check if boundary boxes overlap
          if(vPos.left<offset.left+size.width &&
            vPos.top<offset.top+size.height &&
            vPos.left+vSize.width>offset.left &&
            vPos.top+vSize.height>offset.top){
            var a = dragging.overArea = visualisationArea.closest(".quadrant").addClass("dropHover");
            break;
          }
        }
      }
    }).mouseup(function(){
      if(dragging){
        $("body").removeClass("dragging");
        var duration = 1000; //transition duration
        var element = dragging.element;

        if(dragging.overArea){
          dragging.overArea.removeClass("dropHover");

          //retrieve properties for animation
          var visAreaName = dragging.overArea.find(".show-visualization");
          var data = visAreaName.offset();
          var properties = ["color", "background-color", "border-radius", "border-color", "border-width", "height", "font-size", "font"];
          for(var i=0; i<properties.length; i++){
            var prop = properties[i];
            var val = visAreaName.css(prop);
            if(val)
              data[prop] = val;
          }
          console.log(data);

          //perform the animations
          element.css({borderStyle:"solid"}).animate(data, {duration:duration, complete:function(){
            visAreaName.stop().find(".center").text(element.text())
            visAreaName.css({opacity:1});
            element.remove();
          }});
          visAreaName.animate({opacity:0}, duration);
          dragging.original.animate({opacity:1}, duration);
        }else{
          var original = dragging.original;
          var orPos = original.offset();
          element.animate(orPos, {duration:duration, complete:function(){
            element.remove();
            original.css("opacity", 1);
          }});
        }

        dragging = null;
      }
    });
  }

  //create some options for testing purposes
  var options = new Options();
  var container = $(".top-left");
  attachOptions(options, container);

  var button = new Options.Button("center").onClick(function(){
    console.log("detect");
  });
  var buttonIcon = new Options.Button("parent").setIcon("arrow-circle-up").onClick(function(){
    console.log("detect icon");
  }).setDescription("Go to the parent of the current node");
  var boolean = new Options.Boolean("rotate tree").onChange(function(value){
    console.log(value);
  });
  options.add(button).add(buttonIcon).add(boolean);
});

//options handling
var optionTemplates = {
  boolean:
    '<div class="option-outer">'+
      '<div class="option toggle-type">'+
        '<div class="option-name">'+
          'test'+
        '</div>'+
        '<div class="option-value">'+
          '<div class="toggle" id="off">'+
            '<div class="center">'+
              '<div class="circle">'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>',
  button:
    '<div class="option-outer noselect">'+
      '<div class="option button-type">'+
        '<div class="option-name">'+
          'test'+
        '</div>'+
      '</div>'+
    '</div>',
  buttonIcon:
    '<div class=option-button-icon-type>'+
      '<div class=center>'+
        '<div class=fa></div>'+
      '</div>'+
    '</div>'
};
function attachOptions(options, container){
  options.onOptionsChange(function(type, option){
    var name = option.getName();
    var camelCaseName = name.replace(/\s(.?)/g, function(all, g1){
                                                  return g1.toUpperCase();
                                                });
    var description = option.getDescription()||name;

    var el;
    if(type=="create"){
      container.find(".no-options").hide();
      var optionType = option.getType();

      //create the specific option dependent on its type
      switch(optionType){
        case "boolean":
          el = $(optionTemplates.boolean);
          el.find(".toggle").click(function(){
            var on = $(this).is("#on");
            $(this).attr("id", on?"off":"on");
            option.setValue(!on);
          }).attr("id", option.getValue()?"on":"off");
          break;

        case "button":
          var icon = option.getIcon();
          if(icon){
            el = $(optionTemplates.buttonIcon);

            el.find(".fa").attr("class", "fa fa-"+icon);
            option.onIconChange(function(icon){
              el.find(".fa").attr("class", "fa-"+icon).addClass("fa");
            });

            el.click(function(){
              option.triggerClick();
            });

            el.addClass("option-for-"+camelCaseName);
            el.attr("title", description);
            container.find(".frequent-buttons").append(el);
            return;

          }else{
            el = $(optionTemplates.button);
            option.onTextChange(function(text){
              el.find(".option-name").text(text);
            });
            el.click(function(){
              option.triggerClick();
            });
          }
          break;
      }

      //add option to container
      el.addClass("option-for-"+camelCaseName);
      el.find(".option-name").text(name);
      el.attr("title", description);
      container.find(".option-columns").append(el);
    }else if(type=="delete"){
      container.find(".option-for-"+camelCaseName).remove();
    }

    //hide or show no options message dependent on available options
    if(container.find(".option").length==0)
      container.find(".no-options").show();
    else
      container.find(".no-options").hide();
  });
}
