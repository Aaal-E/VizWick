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
    var duration = 500;
    $(".visualization-page").attr("id", "information-collapse");
    $(".left-section").animate({width:10}, duration);
    $(".right-section").animate({width:$(window).width()-25}, {duration:duration, complete:function(){
      $(this).width("calc(100% - 25px)");
    }});
    updateVisualizationAreaSizes(duration);
  });
  $(".appear").click(function(){
    var duration = 500;
    $(".visualization-page").attr("id", "information-appear");
    $(".left-section").animate({width:300}, duration);
    $(".right-section").animate({width:$(window).width()-315}, {duration:duration, complete:function(){
      $(this).width("calc(100% - 315px)");
    }});
    updateVisualizationAreaSizes(duration);
  });

  //Going from two to four visualization areas and vice versa
  $(".two-button").click(function(){
    $("body").attr("id", "two");

    updateVisualizationAreaSizes(500);
    //pause the hidden visualizations
    var bottomLeft = VisualisationHandler.getVisArea("bottom-left").getVisualisation();
    if(bottomLeft) bottomLeft.pause(true);
    var bottomRight = VisualisationHandler.getVisArea("bottom-right").getVisualisation();
    if(bottomRight) bottomLeft.pause(true);
  });
  $(".four-button").click(function(){
    $("body").attr("id", "four");

    updateVisualizationAreaSizes(500);
    //unpause all the visualizations
    VisualisationHandler.getExistingVisualisations().forEach(function(vis){
      vis.start();
    });
  });

  //Collapsing and appearing of the option panes
  $(".notch").click(function(){
    var optionPane = $(this).closest(".option-pane");
    var innerOptionPane = optionPane.find(".inner-option-pane");
    var duration = 500;
    if(optionPane.is("#notch")){
      optionPane.animate({height:Math.floor(innerOptionPane.outerHeight(true))-1},
        {duration:duration, complete:function(){
        $(this).height("auto");
      }});
      optionPane.attr("id", "options");
    }else{
      optionPane.animate({height:$(this).outerHeight(true)}, duration);
      optionPane.attr("id", "notch");
    }
  });

  //fullscreen buttons
  $(".full-screen-button").click(function(){
    var body = $("body");
    if(body.is(".fullscreen")){
      body.attr("class", body.attr("class").replace(/fullscreen.*/g, ""));
      VisualisationHandler.getExistingVisualisations().forEach(function(vis){
        vis.start();
      });
    }else{
      var quadrant = $(this).closest(".quadrant").attr("class").split(" ")[0];
      body.addClass("fullscreen")
          .addClass("fullscreen-"+quadrant);
      VisualisationHandler.getExistingVisualisations().forEach(function(viz){
        viz.pause(true);
      });
      var viz = VisualisationHandler.getVisArea(quadrant).getVisualisation();
      if(viz) viz.start();
    }

    updateVisualizationAreaSizes(500);
  });

  //reset grid code
  $(".reset-button").click(function(){
    $(".top-layout-part, .bottom-layout-part").height("50%");
    $(".top-left, .top-right, .bottom-left, .bottom-right").width("50%");
    //set the associated data
    $(".layout, .top-layout-part, .bottom-layout-part").each(function(){
      this.sizes = [0.5, 0.5];
    });

    updateVisualizationAreaSizes(500);
  });


  //setup visualization areas
  var areaNames = ["top-left", "top-right", "bottom-left", "bottom-right"];
  for(var i=0; i<areaNames.length; i++){
    let areaName = areaNames[i];
    VisualisationHandler.createVisArea(areaName, $("."+areaName+" .visualization-area"), function(options, visualisation){
      var quadrant = $("."+areaName);
      attachOptions(options, quadrant);
      if(visualisation instanceof VIZ3D.Visualisation){
        quadrant.find(".VR-button").show();
      }else{
        quadrant.find(".VR-button").hide();
      }
    });
  }

  //setup available visualizations
  var types = VisualisationHandler.getVisualisationTypes();
  for(var i=0; i<types.length; i++){
    var type = types[i].replace(/(^|\s)(.)/g, function(m, g1, g2){
      return g1+g2.toUpperCase();
    });
    $(".visualizations-inner").append(
      "<div class='visualization-button noselect' vizID='"+type+"'>"+
        "<div class='center'>"+type+"</div>"+
      "</div>"
    );
  }

  //setup VR buttons
  $(".VR-button").click(function(){
    if(VRCamera.hasVRSupport()){
      var quadrant = $(this).closest(".quadrant").attr("class").split(" ")[0];
      var viz = VisualisationHandler.getVisArea(quadrant).getVisualisation();
      if(viz==VRCamera.getVisualisation() && VRCamera.isInVR()){
        VRCamera.leaveVR();
      }else{
        VRCamera.setVisualisation(viz);
        VRCamera.enterVR();
      }
    }else{
      alert("This browser doesn't have WebVR support yet, please try using Firefox instead.");
    }
  });


  //Drag and drop
  {
    var dragging = null;
    $(".visualizations-inner").children().each(function(){
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

          //perform the animations
          element.css({borderStyle:"solid"}).animate(data, {duration:duration, complete:function(){
            visAreaName.stop().find(".center").text(element.text())
            visAreaName.css({opacity:1});
            element.remove();
          }});
          visAreaName.animate({opacity:0}, duration);
          dragging.original.animate({opacity:1}, duration);

          //show the actual vizualisation
          var areaID = dragging.overArea.closest(".quadrant").attr("class").split(" ")[0];
          setTimeout(function(){
            VisualisationHandler.setVisualisationForArea(areaID, element.attr("vizID"));
          }, duration);
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


  //Statistics
  VisualisationHandler.addSelectedNodeListener(function(node){
    var path = [];
    var n = node;
    while(n){
      path.unshift(escHtml(n.getName()));
      n = n.getParent();
    }

    var children = [];
    var childList = node.getChildren();
    for(var i=0; i<childList.length; i++){
      children.push(escHtml(childList[i].getName()));
    }

    $(".stat.name .stat-value").text(node.getName());
    $(".stat.path .stat-value").html(path.join("<br>&gt;"));
    $(".stat.parent .stat-value").text(node.getParent()?node.getParent().getName():"");
    $(".stat.children .stat-value").html(children.join("<br>"));
    $(".stat.child-count .stat-value").text(children.length);
    $(".stat.depth .stat-value").text(node.getDepth());
    $(".stat.height .stat-value").text(node.getHeight());
    $(".stat.descendant-count .stat-value").text(node.getSubtreeNodeCount());
  });
  VisualisationHandler.addTreeListener(function(tree){
    $(".stat.general-height .stat-value").text(tree.getRoot().getHeight());
    $(".stat.general-node-count .stat-value").text(tree.getRoot().getSubtreeNodeCount()+1);
  });

  //upload button
  $(".upload-button input").change(function(){
    var blob = this.files[0];
    VisualisationHandler.readBlob(blob);
    $(this).replaceWith("<input type=file>");
  });
});
function updateVisualizationAreaSizes(duration){
  var intervalID = setInterval(function(){
    $(".visualization-area").each(function(){
      var newSize = {width:$(this).width(), height:$(this).height()};
      $(this).trigger("resize", newSize);
    });
  });
  setTimeout(function(){
    clearInterval(intervalID);
  }, duration);
}
function escHtml(text){
  return $('<div/>').text(text).html();
}

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
    '</div>',
  number:
    '<div class="option-outer noselect">'+
      '<div class="option number-type">'+
        '<div class="option-name">'+
          'Branch length'+
        '</div>'+
        '<div class="option-value">'+
          '<input type=number>'+
        '</div>'+
      '</div>'+
    '</div>',
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

        case "number":
          el = $(optionTemplates.number);
          var updateValue = function(){
            var value = $(this).val();
            option.setValue(value);
            $(this).val(option.getValue()); //considers rounding and such
          };
          el.find("input")
            .change(updateValue)
            .blur(updateValue)
            .val(option.getValue());
          break;

        default:
          return;
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
    if(container.find(".option-columns .option").length==0)
      container.find(".no-options").show();
    else
      container.find(".no-options").hide();
  });
}
