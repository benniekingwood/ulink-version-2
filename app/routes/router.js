App.Router.map(function () {
  this.resource('login');
  this.resource('ulist');
  this.resource('users', function() {
    this.route('user', {path: ':user_id'});
    this.route('me');
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

// UsersMe Route
App.UsersMeRoute = Ember.Route.extend({
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
    var schoolId = null;
    var currentUser = Parse.User.current();
    if(currentUser) {
      schoolId = currentUser.attributes.schoolId;
    } 
		return App.Event.find(schoolId, function(results, error) {
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
    var schoolId = null;
    var currentUser = Parse.User.current();
    if(currentUser) {
      schoolId = currentUser.attributes.schoolId;
    } 
    return App.Snapshot.find(schoolId, function(results, error) {
        if (!error) {
          _this.controllerFor('snapshots').set('content', results);
        }
      }
    );
  }
});

// Snapshot Route [doesn't require authentication]
// Event Route [doesn't require authentication]