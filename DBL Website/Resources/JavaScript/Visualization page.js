// Author: Denis Shehu
// Student number: 1232758

$(function(){

  //Resizing of the visualization areas
  $(".layout").resizeContainer({vertical:true});
  $(".top-layout-part, .bottom-layout-part").resizeContainer({vertical:false});

  //Collapsing and appearing the information section
  $(".collapse").click(function(){
    $(".visualization-page").attr("id", "information-collapse");
  });
  $(".appear").click(function(){
    $(".visualization-page").attr("id", "information-appear");
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
      optionPane.animate({height:Math.floor(innerOptionPane.outerHeight(true))-1}, 500);
      optionPane.attr("id", "options");
    }else{
      optionPane.animate({height:$(this).outerHeight(true)}, 500);
      optionPane.attr("id", "notch");
    }
  });

  //Drag and drop
  $(".visualizations").children().each(function(){
    $(this).attr("draggable", true);
    this.ondragstart = function(ev){
      ev.dataTransfer.setData("text", ev.target.id);
    };
  });

  //create some options for testing purposes
  var options = new Options();
  var container = $(".top-left .options");
  attachOptions(options, container);

  var button = new Options.Button("center").onClick(function(){
    console.log("detect");
  });
  options.add(button);
});

//options handling
function attachOptions(options, container){
  options.onOptionsChange(function(type, option){
    var name = option.getName();

    if(type=="create"){
      container.find(".no-options").hide();
    }else if(type=="delete"){

    }
  });
}
