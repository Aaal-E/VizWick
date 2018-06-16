$(function(){
  $(".fa-chevron-right").click(function(){
    selectIndex((selectedIndex+1)%color.length);
  });

  $(".fa-chevron-left").click(function(){
  selectIndex((selectedIndex-1+color.length)%color.length);
  });

  $(".dot").click(function(){
    $(".dot").css('background-color','#100130');
    counter=$(this).attr('id');
    selectIndex($(this).attr('id'));
    $('#'+$(this).attr('id')).css('background-color','white');
  });

});
var color=["red", "black","gray", "yellow", "blue"];
var selectedIndex = 0;
function selectIndex(index){
  selectedIndex = index;
  $('.photo-area').css('background-color', color[index]);
  $(".dot").css('background-color','#100130');
  $('#'+index).css('background-color','white');
}
