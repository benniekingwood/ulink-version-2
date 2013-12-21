/**
 * School Model.  
 */
App.School = Ember.Object.extend({
  originalImageURL: function() {
    return Config.image.urls.base + Config.image.urls.school.original + this.get("imageURL");
  }.property("imageURL"),
  mediumImageURL: function() {
    return Config.image.urls.base + Config.image.urls.school.medium + this.get("imageURL");
  }.property("imageURL"),
  thumbImageURL: function() {
    return Config.image.urls.base + Config.image.urls.school.thumb + this.get("imageURL");
  }.property("imageURL")
});

// override the find method for the School model
App.School.reopenClass({
  find: function(schoolId, callback) {
    var schools = [];
    var School = Parse.Object.extend("School");
    var query = new Parse.Query(School);
    query.descending('createdAt');
    if(schoolId !== undefined) {
      query.equalTo("schoolId", schoolId);
    } 
    query.find({
        success: function(results) {  // does it go into here too late???       
          // Convert parse models to Ember JS Models
          for (var i = 0; i < results.length; i++) { 
            var result = results[i];
            var school = {};
            school.id = result.id;
            school.name = result.attributes.name;
            school.shortName = result.attributes.shortName;
            school.domains = result.attributes.domains;
            school.description = result.attributes.description;
            school.imageURL = result.attributes.imageURL;
            school.attendance = result.attributes.attendance;
            school.address = result.attributes.address;
            school.type = result.attributes.type;
            school.year = result.attributes.year;
            school.longitude = result.attributes.longitude;
            school.latitude = result.attributes.latitude;
            schools.pushObject(App.School.create(school));
          } 
          return callback(schools, null);
        },
        error: function(error) {
          console.log("Error: " + error.code + " " + error.message);
          return callback(null, error);
        }
    });
  }
});