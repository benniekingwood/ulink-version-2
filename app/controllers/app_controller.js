App.ApplicationController = Ember.Controller.extend({
	currentUser: {},
	isLoggedIn: false,
	schools: [],
	init: function() { 
		this._super();
		// first check for the logged in user
		var hasCurrrentUser = (Parse.User.current() != null);
    this.set('isLoggedIn', hasCurrrentUser);
    if(hasCurrrentUser) { 
    	this.send('setCurrentUser', Parse.User.current());
    }
		// retreive any necessary init data
		this.send("getSchools");
  },
	actions: {
		deactivateNavLinks: function() {
			$("li[id$='-link']").removeClass("active");
		},
		setCurrentUser: function(user) {
			if(user && user.attributes) {
				// TODO: SET SCHOOL 
				// var school = user.get("school") || {};
				this.set('currentUser', App.User.create(user.attributes));
				this.set('isLoggedIn', true);
				// now set the user's events, snapshots
				this.send('getCurrentUserEvents', user);
				this.send('getCurrentUserSnaps', user);
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
		}, 
		// This function will retreive the events for the user
		getCurrentUserEvents: function(user) {
			var _self = this;
			App.Event.find(undefined, user, function(results, error) {
	        if (!error) { 
						if(results && results.length > 0) {
							_self.get('currentUser').set('events', results);
						}
	        }
	      }
			);
		}, 
		// This function will retreive the snapshots for the user
		getCurrentUserSnaps: function(user) {
			var _self = this;
			App.Snapshot.find(undefined, user, function(results, error) {
	        if (!error) { 
						if(results && results.length > 0) {
							_self.get('currentUser').set('snaps', results);
						}
	        }
	      }
			);
		}, 
		// retrieve all schools 
		getSchools: function() {
			var _self = this;
			App.School.find(undefined, function(results, error) {
	        if (!error) { 
						if(results && results.length > 0) {
							_self.set('schools', results);
						}
	        }
	      }
			);
		}
	} 
});