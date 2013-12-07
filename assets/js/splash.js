// Browser check [NEED TO HAVE BOWSER.JS ALREADY INCLUDED BEFORE THIS FILE IS INCLUDED]
/*
 if the browser fails of the following conditions,
 forward to the browser download page:
 1. Opera browser
 2. Chrome < 11
 3. Firefox < 6
 4. IE < 9
*/
if ((bowser.msie && bowser.version < 9)||
    (bowser.opera)||
    (bowser.mozilla && bowser.version < 6)||
    (bowser.chrome && bowser.version < 11)) {
    window.location = '/browser.html';
}
// make sure console is available
if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function () {};

//Height Define
$(document).ready(function(){
var a = $(window).height();
	$("#home").height(a - 0)
});

//Scroll To
$(".scroll").click(function(event){
	event.preventDefault();
	$("html,body").animate({scrollTop:$(this.hash).offset().top}, 400)
});

//Scroll Spy Refresh
$('#navbar').scrollspy()

//Scroll To Top
$(document).ready(function(){
	//Check to see if the window is top if not then display button
	$(window).scroll(function(){
		if ($(this).scrollTop() > 160) {
			$('.scrollToTop').fadeIn();
		} else {
			$('.scrollToTop').fadeOut();
		}
	});
	//Click event to scroll to top
	$('.scrollToTop').click(function(){
		$('html, body').animate({scrollTop : 0},800);
		return false;
	});
});

//Onload FadeIn
$(document).ready(function(){
	$(".fadeOnLoad").delay(1000).fadeIn(700);
});

//Div FadeOut On Scroll
$(window).scroll(function() {
    if ($(this).scrollTop() < 150) {
        $(".hero-text:hidden").fadeIn(400);
    }
    else {
        $(".hero-text:visible").fadeOut(400);
    }
});

//Onload FadeIn
$(document).ready(function(){
	$(".fadeOnLoad").delay(1000).fadeIn(700);
});

// Login Modal Click
$("a.login").on("click", function() {
    $("#login-modal").modal("show");
});
