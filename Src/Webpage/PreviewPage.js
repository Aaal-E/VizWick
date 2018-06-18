var visualisations;
var selectedIndex = 0;
function selectIndex(index){
  selectedIndex = index;
  visDescription = VisualisationHandler.getVisualisationClass(visualisations[index]).description;
  $(".vis-name").text(visDescription.name);
  $(".vis-description").text(visDescription.description);
  $(".photo-area").css("background-image", "url('"+visDescription.image+"')");
  // $('.photo-area').css('background-color', color[index]);

  console.log(index);
  //select proper dot
  $(".dot.selected").removeClass("selected");
  $('.dot#'+index).addClass("selected");
}
$(function(){

  //load Visualisations
  visualisations = VisualisationHandler.getVisualisationTypes();
  for(var i=0; i<visualisations.length; i++){
    var dot = $("<div class='dot' id='"+i+"'></div>");
    $(".dot-navigation").append(dot);
    if(i==0) dot.addClass("selected");
  }

  //setup interaction buttons
  $(".right-arrow").click(function(){
    selectIndex((selectedIndex+1)%visualisations.length);
  });

  $(".left-arrow").click(function(){
    selectIndex((selectedIndex-1+visualisations.length)%visualisations.length);
  });

  $(".dot").click(function(){
    selectIndex($(this).attr('id'));
  });
});
