$(function(){
  var body = $(".body-inner");
  $(".page").hide();
  $(".active").show();

  $("[gotoPage]").click(function () {
    //retrieve the data of what page to go to
    var pageClass = $(this).attr("gotoPage");
    var nextPage = $("."+pageClass);

    //manage what page is active
    var curPage = $(".active").removeClass("active");
    nextPage.addClass("active");

    $(".page").hide(); //hide all pages
    curPage.show(); //show the pages that we transition between
    nextPage.show();

    //set the scrollTop such that we see the curPage
    body.css("top", body.offset().top-curPage.offset().top); //offset is relative to the top of the screen

    //animate the scrollTop such that we start seeing the new page
    body.animate({top:body.offset().top-nextPage.offset().top}, 1000);
  });

  $(window).resize(function(){
    body.css("top", body.offset().top-$(".active").offset().top);
  });
});
