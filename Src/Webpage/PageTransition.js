$(function(){
  var body = $("body");
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
    body.scrollTop(body.scrollTop()+curPage.offset().top); //offset is relative to the top of the screen

    //animate the scrollTop such that we start seeing the new page
    body.animate({scrollTop:body.scrollTop()+nextPage.offset().top}, 1000);
  });

  $(window).resize(function(){
    body.scrollTop(body.scrollTop()+$(".active").offset().top);
  });
});
