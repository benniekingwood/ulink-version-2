App.Router.map(function () {
  this.route('login');
  this.resource('ulist');
	this.resource('me');
  this.resource('users', function() {
    this.route('user', {path: ':user_id'});
  });
  this.resource('events', {path: '/ucampus/events' }, function() {
    this.route('event', {path: '/ucampus/events/:event_id'});
  });
  this.resource('snapshots', {path: '/ucampus/snapshots'}, function() {
    this.route('snapshot', {path: '/ucampus/snapshots/:snapshot_id'});
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
		return App.Event.find(school, function(results, error) {
        if (!error) { 
          _this.controllerFor('events').set('content', results);
        }
      }
    );
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
    return App.Snapshot.find(school, function(results, error) {
        if (!error) {
          _this.controllerFor('snapshots').set('content', results);
        }
      }
    );
  }
});

// Snapshot Route [doesn't require authentication]
// Event Route [doesn't require authentication]