$(function(){
  $(".two-button").click(function(){
    $("body").attr("id", "two");
  });
  $(".four-button").click(function(){
    $("body").attr("id", "four");
  });

  //Resizing
  $(".layout").resizeContainer({vertical:true});
  $(".top-layout-part, .bottom-layout-part").resizeContainer({vertical:false});
})
