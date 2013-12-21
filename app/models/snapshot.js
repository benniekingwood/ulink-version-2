/**
 * Snapshot Model.  
 */
App.Snapshot = Ember.Object.extend({
  originalImageURL: function() {
    return Config.image.urls.base + Config.image.urls.snapshot.original + this.get("imageURL");
  }.property("imageURL"),
  mediumImageURL: function() {
    return Config.image.urls.base + Config.image.urls.snapshot.medium + this.get("imageURL");
  }.property("imageURL"),
  thumbImageURL: function() {
    return Config.image.urls.base + Config.image.urls.snapshot.thumb + this.get("imageURL");
  }.property("imageURL")
});

// override the find method for the Snapshot model
App.Snapshot.reopenClass({
  find: function(schoolId, callback) {
    var snapshots = [];
    var Snapshot = Parse.Object.extend("Snapshot");
    var query = new Parse.Query(Snapshot);
    query.descending('createdAt');
    if(schoolId !== undefined) {
      query.equalTo("schoolId", schoolId);
    } 
    query.find({
        success: function(results) {         
          // Convert parse models to Ember JS Models
          for (var i = 0; i < results.length; i++) { 
            var result = results[i];
            var snapshot = {};
            snapshot.id = result.id;
            snapshot.caption = result.attributes.caption;
            snapshot.imageURL = result.attributes.imageURL;
            snapshot.createdAt = result.attributes.createdAt;
            snapshots.pushObject(App.Snapshot.create(snapshot));
          } 
          return callback(snapshots, null);
        },
        error: function(error) {
          console.log("Error: " + error.code + " " + error.message);
          return callback(null, error);
        }
    });
  }
});