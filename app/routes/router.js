App.Router.map(function () {
  this.route('login');
	this.route('forgot');
	this.route('signup');
	this.route('settings');
  this.resource('ulist');
	this.resource('me', function() {
		this.route('profile');
		this.route('password');
		this.route('events');
		this.route('snaps');
		this.route('listings');
		this.route('sidenav');
	});
  this.resource('users', function() {
    this.route('user', {path: ':user_id'});
  });
  this.resource('events', function() {
		this.route('new');
    this.route('event', {path: ':event_id'});
  });
  this.resource('snapshots', function() {
		this.route('new');
    this.route('snapshot', {path: ':snapshot_id'});
  });
});

// Index Route
App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('events');
    $(document).ready(function(){
        $("#events-link").addClass("active");
    });
  }
});

// Login Route
App.LoginRoute = Ember.Route.extend({
  beforeModel: function(transition) {
    if (this.controllerFor('application').get('isLoggedIn')) {
      this.transitionTo('events');
    }
  }
});

// Me Route
App.MeRoute = Ember.Route.extend({
  beforeModel: function(transition) {
    if (!this.controllerFor('application').get('isLoggedIn')) {
      var loginController = this.controllerFor('login');
      loginController.set('previousTransition', transition);
      this.transitionTo('login');
    }
  },
  model: function() {
    return this.controllerFor('application').get('currentUser');
  }, 
	renderTemplate: function() {
		this.render('me',{ controller: this.controllerFor('profile') });
	  this.render('me/profile', {
      into: 'me',
			controller: this.controllerFor('profile')
	  });
	  this.render('me/sidenav', {
      outlet: 'sidenav',
      into: 'me',
			controller: this.controllerFor('profile')
	  });
	}, 
	setupController: function(controller, model) {
	    this.controllerFor('profile').set('model', model);
	},
	actions: {
		deactivateSidNavLinks: function() {
			$("li[id$='-sidenav-link']").removeClass("active");
		},
    goTo: function(route) {
	 		this.send('deactivateSidNavLinks');
	 		$("#" + route + "-sidenav-link").addClass("active");
		  this.render('me/'+route, {
	      into: 'me',
				controller: this.controllerFor("profile")
		  });
    }
	}
});

// Me Sidenav Route
App.MeSidenavRoute = Ember.Route.extend({
  beforeModel: function(transition) {
    if (!this.controllerFor('application').get('isLoggedIn')) {
      var loginController = this.controllerFor('login');
      loginController.set('previousTransition', transition);
      this.transitionTo('login');
    }
  },
  model: function() {
		return this.modelFor('me');
  }
});

// Me Profile Route
App.MeProfileRoute = Ember.Route.extend({
  beforeModel: function(transition) {
    if (!this.controllerFor('application').get('isLoggedIn')) {
      var loginController = this.controllerFor('login');
      loginController.set('previousTransition', transition);
      this.transitionTo('login');
    }
  },
  model: function() {
 		return this.modelFor('me');
  }
});

// Me Events Route
App.MeEventsRoute = Ember.Route.extend({
  beforeModel: function(transition) {
    if (!this.controllerFor('application').get('isLoggedIn')) {
      var loginController = this.controllerFor('login');
      loginController.set('previousTransition', transition);
      this.transitionTo('login');
    }
  },
  model: function() {
		return this.modelFor('me');
  }
});

// Me Snaps Route
App.MeSnapsRoute = Ember.Route.extend({
  beforeModel: function(transition) {
    if (!this.controllerFor('application').get('isLoggedIn')) {
      var loginController = this.controllerFor('login');
      loginController.set('previousTransition', transition);
      this.transitionTo('login');
    }
  },
  model: function() {
		return this.modelFor('me');
  }
});

// Me Listings Route
App.MeListingsRoute = Ember.Route.extend({
  beforeModel: function(transition) {
    if (!this.controllerFor('application').get('isLoggedIn')) {
      var loginController = this.controllerFor('login');
      loginController.set('previousTransition', transition);
      this.transitionTo('login');
    }
  },
  model: function() {
		return this.modelFor('me');
  }
});

// Events Route
App.EventsRoute = Ember.Route.extend({
  beforeModel: function(transition) {
    if (!this.controllerFor('application').get('isLoggedIn')) {
      var loginController = this.controllerFor('login');
      loginController.set('previousTransition', transition);
      this.transitionTo('login');
    } 
  },
  model: function() {
    var _this = this;
    var school = null;
    var currentUser = this.controllerFor('application').get('currentUser');
    if(currentUser) {
      school = currentUser.school;
    } 
		return App.Event.find(school, undefined, function(results, error) {
        if (!error) { 
          _this.controllerFor('events').set('content', results);
        }
      }
    );
	}
});

// Events Index Route
App.EventsIndexRoute = Ember.Route.extend({
  beforeModel: function(transition) {
    if (!this.controllerFor('application').get('isLoggedIn')) {
      var loginController = this.controllerFor('login');
      loginController.set('previousTransition', transition);
      this.transitionTo('login');
    }
  },
  model: function() {
		return this.modelFor('events');
  }, 
	renderTemplate: function() {
		this.render('events/index',{ controller: this.controllerFor('events') });
	}
});

// Events New Route
App.EventsNewRoute = Ember.Route.extend({
  beforeModel: function(transition) {
    if (!this.controllerFor('application').get('isLoggedIn')) {
      var loginController = this.controllerFor('login');
      loginController.set('previousTransition', transition);
      this.transitionTo('login');
    }
  },
	renderTemplate: function() {
		this.render('events/new',{ controller: this.controllerFor('events') });
	}
});

// Snapshots Route
App.SnapshotsRoute = Ember.Route.extend({
  beforeModel: function(transition) {
    if (!this.controllerFor('application').get('isLoggedIn')) {
      var loginController = this.controllerFor('login');
      loginController.set('previousTransition', transition);
      this.transitionTo('login');
    }
  },
  model: function() {
    var _this = this;
    var school = null;
    var currentUser = this.controllerFor('application').get('currentUser');
    if(currentUser) {
      school = currentUser.school;
    } 
    return App.Snapshot.find(school, undefined, function(results, error) {
        if (!error) {
          _this.controllerFor('snapshots').set('content', results);
        }
      }
    );
  }
});

// Snapshots Index Route
App.SnapshotsIndexRoute = Ember.Route.extend({
  beforeModel: function(transition) {
    if (!this.controllerFor('application').get('isLoggedIn')) {
      var loginController = this.controllerFor('login');
      loginController.set('previousTransition', transition);
      this.transitionTo('login');
    }
  },
  model: function() {
		return this.modelFor('snapshots');
  }, 
	renderTemplate: function() {
		this.render('snapshots/index',{ controller: this.controllerFor('snapshots') });
	}
});

// Snapshots New Route
App.SnapshotsNewRoute = Ember.Route.extend({
  beforeModel: function(transition) {
    if (!this.controllerFor('application').get('isLoggedIn')) {
      var loginController = this.controllerFor('login');
      loginController.set('previousTransition', transition);
      this.transitionTo('login');
    }
  },
	renderTemplate: function() {
		this.render('snapshots/new',{ controller: this.controllerFor('snapshots') });
	}
});

// Snapshot Route [doesn't require authentication]
// Event Route [doesn't require authentication]