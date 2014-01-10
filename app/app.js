/*
 * This is the uLink Ember application. It's built using a 
 * neuter task.
 *
 * `require`s in this file will be stripped and replaced with
 * the string contents of the file they refer to wrapped in
 * a closure.
 *
*/
/*
 * These are the dependencies for an Ember application
 * and they have to be loaded before any application code.
*/
require('dependencies/jquery/jquery');

/*
 * Since we're precompiling our templates, we only need the
 * handlebars-runtime microlib instead of the
 * entire handlebars library and its string parsing functions.
*/
require('dependencies/handlebars/handlebars-runtime');

/* This is Ember framework*/
require('dependencies/ember/ember');

/*
  this file is generated as part of the build process.
  If you haven't run that yet, you won't see it.

  It is excluded from git commits since it's a 
  generated file.
*/
require('dependencies/compiled/templates');

// This file is for bootstrap 
require('dependencies/bootstrap/bootstrap');

// This file is for the browser version verifications
require('dependencies/bowser/bowser');

// This file is for the parse library
require('dependencies/parse-1.2.13');


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

// initialize the Ember App for ulink
window.App = Ember.Application.create({ 
	LOG_TRANSITIONS: true,  
	LOG_TRANSITIONS_INTERNAL: true,
  year: new Date().getFullYear(), 
  rootElement: '#ulink-app', 
	env: "PRODUCTION"
});

/* 
 * Configuration for the application.  Contains all necessary global constants
 * as well.
 */
require('app/config/config');

// Parse initializations [TODO: use environment vars i.e. process.env.SANDBOX_PARSE_KEY]
Parse.initialize("wGDnthYU67Qkn0WuA0wzXk0y8E8o3qiy8VKdNkJA", "rUim04U1VmLCsRxxTQFjlCpqpIks7EDKJL4l1okL");

/* 
 * Model layer. 
 * Ember.Object itself provides most of what
 * model layers elsewhere provide. Since TodoMVC
 * doesn't communicate with a server, plain
 * Ember.Objects will do.
*/
require('app/models/event');
require('app/models/school');
require('app/models/snapshot');
require('app/models/user');

/*
 * Views layer.
 * You'll notice that there are only a few views.
 * Ember accomplishes a lot in its templates and 
 * Views are only necessary if you have view-specific
 * programming to do. 
*/
require('app/views/snapshot_thumbnail_view');
require('app/views/event_list_item_view');
require('app/views/alerts_view');

/*
 * Controller layer.
 * Controllers wrap objects and provide a place
 * to implement properties for display
 * whose value is computed from the content of the
 * controllers wrapped objects.
*/
require('app/controllers/app_controller');
require('app/controllers/events_controller');
require('app/controllers/login_controller');
require('app/controllers/signup_controller');
require('app/controllers/snapshots_controller');
require('app/controllers/user_controller');
require('app/controllers/profile_controller');

/* 
 * States (i.e. Routes)
 * Handles serialization of the application's current state
 * which results in view hierarchy updates. Responds to
 * actions.
*/
require('app/routes/router');