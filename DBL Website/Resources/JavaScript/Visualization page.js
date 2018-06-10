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

  //Collapsing and appearing the options
  //top-left visualization area
  $(".top-left .lower-arrow").click(function(){
    $(".top-left .option-pane").attr("id", "options");
  });
  $(".top-left .upper-arrow").click(function(){
    $(".top-left .option-pane").attr("id", "notch");
  });

  //top-right visualization area
  $(".top-right .lower-arrow").click(function(){
    $(".top-right .option-pane").attr("id", "options");
  });
  $(".top-right .upper-arrow").click(function(){
    $(".top-right .option-pane").attr("id", "notch");
  });

  //bottom-left visualization area
  $(".bottom-left .upper-arrow").click(function(){
    $(".bottom-left .option-pane").attr("id", "options");
  });
  $(".bottom-left .lower-arrow").click(function(){
    $(".bottom-left .option-pane").attr("id", "notch");
  });

  //bottom-right visualization area
  $(".bottom-right .upper-arrow").click(function(){
    $(".bottom-right .option-pane").attr("id", "options");
  });
  $(".bottom-right .lower-arrow").click(function(){
    $(".bottom-right .option-pane").attr("id", "notch");
  });

});
