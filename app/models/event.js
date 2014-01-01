/**
 * Event Model.  
 */
App.Event = Ember.Object.extend({
  originalImageURL: function() {
    return Config.image.urls.base + Config.image.urls.event.original + this.get("imageURL");
  }.property("imageURL"),
  mediumImageURL: function() {
    return Config.image.urls.base + Config.image.urls.event.medium + this.get("imageURL");
  }.property("imageURL"),
  thumbImageURL: function() {
    return Config.image.urls.base + Config.image.urls.event.thumb + this.get("imageURL");
  }.property("imageURL"), 
	defaultImageURL: function() {
    return Config.image.urls.base + Config.image.urls.defaults.event;
  }.property("imageURL"), 
	defaultFeaturedImageURL: function() {
	  return Config.image.urls.base + Config.image.urls.defaults.featuredEvent;
	}.property("imageURL"), 
	eventDateFormatted: function() {
 			var eventDate = new Date(this.get('date'));
 			var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	    return months[eventDate.getMonth()] + ' ' + eventDate.getDate() + ', ' + eventDate.getFullYear();
	}.property('date')
});

// override the find method for the Event model
App.Event.reopenClass({
  find: function(school, callback) {
    var events = [];
    var Event = Parse.Object.extend("Event");
    var query = new Parse.Query(Event);
    query.descending('createdAt');
    if(school !== undefined) {
      query.equalTo("school", school);
    } 
		// include the user for the event
		query.include("user");
    query.find({
        success: function(results) {  // does it go into here too late??? 
          // Convert parse models to Ember JS Models
          for (var i = 0; i < results.length; i++) { 
            var result = results[i];
            var event = {};
            event.id = result.id;
            event.date = result.attributes.date;
            event.description = result.attributes.description;
            event.location = result.attributes.location;
            event.time = result.attributes.time;
            event.title = result.attributes.title;
						var imageURL = result.attributes.imageURL;
            event.imageURL = (imageURL == undefined || imageURL == 'NULL') ? undefined : imageURL;
            event.createdAt = result.attributes.createdAt;
						var user = result.get("user") || {};
						event.user = App.User.create(user.attributes);
            events.pushObject(App.Event.create(event));
          } 
          return callback(events, null);
        },
        error: function(error) {
          console.log("Error: " + error.code + " " + error.message);
          return callback(null, error);
        }
    });
  }
});