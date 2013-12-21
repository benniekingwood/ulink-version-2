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

$(document).ready(function() {
    $.backstretch([
            "assets/images/hero-bg-3.jpg",
            "assets/images/hero-bg-2.jpg",
            "assets/images/hero-bg-1.jpg"
        ], {
        fade: 1000,
        duration: 20000
    });
});

// TODO: use environment variables here
// Parse initializations
Parse.initialize("wGDnthYU67Qkn0WuA0wzXk0y8E8o3qiy8VKdNkJA", "rUim04U1VmLCsRxxTQFjlCpqpIks7EDKJL4l1okL");

// if the user is logged in, send them to the app page
if(Parse.User.current() != null) window.location = '/app';

// initialize the account Ember App
window.App = Ember.Application.create({
	year: new Date().getFullYear()
});

// Application Controller
App.ApplicationController = Ember.Controller.extend({
	username: '', 
	password: '',
	loggingIn: false,
	schools: [],
	init: function() {
    // _self = this;
    // App.School.find(null, function(results, error) {
    //     if (!error) {
    //       _self.set('schools', results);
    //     }
    //   }
    // );
  },
	actions: {
		showLoginModal: function() {
  			$("#login-modal").modal("show");
		},
		login: function() {
	 		var _self = this;
	 		_self.set('loggingIn', true);
			Parse.User.logIn(this.get('username'), this.get('password'), {
			  success: function(user) {
			    $('.login-error-alert').hide();
			    $('#login-error-message').html('');
			    // navigate to the ulink app
			    window.location = '/app'
			  },
			  error: function(user, error) {
			    // show the error message
			    $('.login-error-alert').show();
			    var message = (error.code === 101) ? "Wrong Username and password combination." : error.message;
			    $('#login-error-message').html(message);
			    _self.set('loggingIn', false);
			  }
			});
	 	}
	}
});

// SplashController
App.SplashController = Ember.ObjectController.extend({
	needs: ['application'],
	suggestion: '',
	schools: [],
	init: function() {
    var schools = this.get('controllers.application').get('schools');
    this.set('schools', schools);
  },
	actions: {
		saveSuggestion: function() {
			_self = this;

			// TODO: save suggestion to Parse

			_self.set('suggestion', '');
		}
	}
});

App.Router.map(function () {
  this.resource('splash', { path: '/' });
  this.resource('terms');
  this.resource('signup');
});



