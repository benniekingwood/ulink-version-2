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
  }.property("imageURL")
});

// override the find method for the Event model
App.Event.reopenClass({
  find: function(schoolId, callback) {
    var events = [];
    var Event = Parse.Object.extend("Event");
    var query = new Parse.Query(Event);
    query.descending('createdAt');
    if(schoolId !== undefined) {
      query.equalTo("schoolId", schoolId);
    } 
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
            event.imageURL = result.attributes.imageURL;
            event.createdAt = result.attributes.createdAt;
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