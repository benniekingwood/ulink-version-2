App.ApplicationController = Ember.Controller.extend({
	currentUser: {},
	isLoggedIn: false,
	init: function() {
			// first check for the logged in user
			var hasCurrrentUser = (Parse.User.current() != null);
      this.set('isLoggedIn', hasCurrrentUser);
      if(hasCurrrentUser) { 
      	this.send('setCurrentUser', Parse.User.current());
      }
  },
	actions: {
		deactivateNavLinks: function() {
			$("li[id$='-link']").removeClass("active");
		},
		setCurrentUser: function(user) {
			if(user && user.attributes) {
				this.set('currentUser', App.User.create(user.attributes));
				this.set('isLoggedIn', true);
			}
		},
	 	navigateTo: function(route) {
	 		this.transitionToRoute(route);
	 		this.send('deactivateNavLinks');
	 		$("#" + route + "-link").addClass("active");
	 	},
		logout: function() {
			Parse.User.logOut();
			window.location = "/";
		}
	}
});