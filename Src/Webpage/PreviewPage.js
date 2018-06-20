var previewData;
var selectedIndex = 0;
function selectIndex(index){
  selectedIndex = index;
  var data = previewData[index];
  $(".vis-name").text(data.name);
  $(".vis-description").text(data.description);
  $(".photo-area").css("background-image", "url('"+data.image+"')");
  // $('.photo-area').css('background-color', color[index]);

  //select proper dot
  $(".dot.selected").removeClass("selected");
  $('.dot#'+index).addClass("selected");
}
$(function(){

  //load Visualisations
  previewData = [{
    name: "VizWick",
    description: "VizWick is a web-page that aims to vsiaulize data in a simple way. This web-page was created as a first year Computer Science project at Eindhoven's University of Technology. VizWick uses it's own framework, rather than making use of an existing framework. The framework was created with large data sets in mind. In order to handle these large data sets, it makes sure to not show all data at once. Instead it offers simple methods to allow visualizations to move through the data dynamically. The user can specify how many nodes he/she wants to display at once, making sure that the user's computer keeps running smoothly. This approach works very well in general, but one detail was overlooked while making the framework. The number of child nodes might be higher than the maximum number of nodes that your computer can handle. In this case the last nodes will never be displayed, and thus the user won't be able to interact with them. The framework would require some major changes in order to solve this issue. VizWick is entirely open source however, so feel free to tackle this issue if you happen to be a programmer. The last major benefit that Vizwick offers is that it is able to show its 3d visualizations in VR making use of WebVR. VR is a very interesting and intuitive platform to display data, and visualizations in VR are becoming increasingly popular, so we are very proud of supporting this feature in VizWick.",
    image: "Resources/Images/Visualization page.png"
  }];
  var visualisations = VisualisationHandler.getVisualisationTypes();
  for(var i=0; i<visualisations.length; i++){
    var visName = visualisations[i];
    previewData.push(VisualisationHandler.getVisualisationClass(visName).description);
  }

  for(var i=0; i<previewData.length; i++){
    var dot = $("<div class='dot' id='"+i+"'></div>");
    $(".dot-navigation").append(dot);
    if(i==0) dot.addClass("selected");
  }

  //setup interaction buttons
  $(".right-arrow").click(function(){
    selectIndex((selectedIndex+1)%previewData.length);
  });

  $(".left-arrow").click(function(){
    selectIndex((selectedIndex-1+previewData.length)%previewData.length);
  });

  $(".dot").click(function(){
    selectIndex($(this).attr('id'));
  });

  selectIndex(0);
});
