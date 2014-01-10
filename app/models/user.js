/**
 * User Model.  
 */
App.User = Ember.Object.extend({
	originalImageURL: function() {
		return Config.image.urls.base + Config.image.urls.user.original + this.get("imageURL");
	}.property("imageURL"),
	mediumImageURL: function() {
		return Config.image.urls.base + Config.image.urls.user.medium + this.get("imageURL");
	}.property("imageURL"),
	thumbImageURL: function() {
		return Config.image.urls.base + Config.image.urls.user.thumb  + this.get("imageURL");
	}.property("imageURL"),
	defaultImageURL: function() {
	  return Config.image.urls.base + Config.image.urls.defaults.user;
	}.property("imageURL"), 
	numberOfEvents: function() {
		var events = this.get('events');
  	return events != undefined ? events.length : 0;
	}.property("events"), 
	numberOfSnaps: function() {
		var snaps = this.get('snaps');
  	return snaps != undefined ? snaps.length : 0;
	}.property("snaps"),
	numberOfListings: function() {
		var listings = this.get('listings');
  	return listings != undefined ? listings.length : 0;
	}.property("listings")
});

// override the find method for the User model
App.User.reopenClass({
  find: function(userId, callback) {
    var users = [];
    var User = Parse.Object.extend("User");
    var query = new Parse.Query(user);
    query.descending('createdAt');
    if(userId !== undefined) {
      query.equalTo("objectId", userId);
    } 
		// include the user for the event
		query.include("school");
		
    query.find({
        success: function(results) {  
          // Convert parse models to Ember JS Models
          for (var i = 0; i < results.length; i++) { 
            var result = results[i];
            var user = {};
            user.id = result.id;
            user.username = result.attributes.username;
            user.bio = result.attributes.bio;
            user.email = result.attributes.email;
            user.name = result.attributes.name;
            user.schoolStatus = result.attributes.schoolStatus;
						user.year = result.attributes.year;
						var imageURL = result.attributes.imageURL;
            user.imageURL = (imageURL == undefined || imageURL == 'NULL') ? undefined : imageURL;
            user.createdAt = result.attributes.createdAt;
						var school = result.get("school") || {};
						user.school = App.School.create(school.attributes);
            users.pushObject(App.User.create(user));
          } 
          return callback(users, null);
        },
        error: function(error) {
          console.log("Error: " + error.code + " " + error.message);
          return callback(null, error);
        }
    });
  }
});