
var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
showSlides(slideIndex += n);
}

function currentSlide(n) {
showSlides(slideIndex = n);
}

function showSlides(n) {
var i;
var slides = document.getElementsByClassName("mySlides");
var dots = document.getElementsByClassName("dot");
if (n > slides.length) {slideIndex = 1}
if (n < 1) {slideIndex = slides.length}
for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
}
for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
}
slides[slideIndex-1].style.display = "block";
dots[slideIndex-1].className += " active";
}

$(".nav").children("a").click(function () {
  $(".active").removeClass("active");
  $(this).addClass("active");
  $(".pactive").fadeOut(200, function () {
      $(this).removeClass("pactive");
  });
  $("#p" + this.id).fadeIn(200, function () {
      $(this).addClass("pactive");
  });
});

$(document).ready(function () {
      var small={width: "50%",height: "50%"};
      var large={width: "100%",height: "100%"};
      var count=1;

      $("#button").on('click',function () {
          $(imgtab).animate((count==1)?large:small);
          count = 1-count;
      });
  });
